import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ConsentStatus {
  hasConsent: boolean;
  loading: boolean;
  lastUpdated: string | null;
}

interface ConsentResponse {
  success: boolean;
  action: string;
  email: string;
  database: {
    success: boolean;
    error: string | null;
  };
  resend: {
    success: boolean;
    error: string | null;
  };
  errors: string[] | null;
  message: string;
}

export const useMarketingConsent = () => {
  const { user } = useAuth();
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>({
    hasConsent: false,
    loading: true,
    lastUpdated: null,
  });
  const [updating, setUpdating] = useState(false);

  // Fetch current consent status
  const fetchConsentStatus = async () => {
    if (!user) {
      setConsentStatus({ hasConsent: false, loading: false, lastUpdated: null });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', user.id)
        .eq('consent_type', 'marketing_emails')
        .eq('status', 'granted')
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching consent status:', error);
        setConsentStatus({ hasConsent: false, loading: false, lastUpdated: null });
        return;
      }

      setConsentStatus({
        hasConsent: !!data,
        loading: false,
        lastUpdated: data?.timestamp || null,
      });
    } catch (error) {
      console.error('Error fetching consent status:', error);
      setConsentStatus({ hasConsent: false, loading: false, lastUpdated: null });
    }
  };

  // Update consent status
  const updateConsent = async (grant: boolean): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    // Optimistically update the UI state immediately
    const previousState = consentStatus.hasConsent;
    setConsentStatus(prev => ({
      ...prev,
      hasConsent: grant,
      lastUpdated: new Date().toISOString(),
    }));

    setUpdating(true);

    try {
      const consentText = grant 
        ? 'Ich möchte Marketing-E-Mails und Informationen über neue Funktionen erhalten.'
        : 'Ich möchte keine Marketing-E-Mails mehr erhalten.';

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-marketing-consent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: grant ? 'grant' : 'revoke',
          consentText,
        }),
      });

      // Check if response is OK before parsing
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use the HTTP status message
        }
        return { 
          success: false, 
          message: `Server-Fehler: ${errorMessage}` 
        };
      }

      let result: ConsentResponse;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Error parsing response JSON:', parseError);
        return { 
          success: false, 
          message: 'Fehler beim Verarbeiten der Server-Antwort.' 
        };
      }

      // Check if result object is valid and has expected properties
      if (!result || typeof result.success === 'undefined') {
        console.error('Invalid response structure:', result);
        return { 
          success: false, 
          message: 'Ungültige Server-Antwort erhalten.' 
        };
      }

      if (result.success) {
        // State was already updated optimistically, just confirm it
        // No need to update again

        return { success: true, message: result.message };
      } else {
        // Partial success or failure
        const errorMessage = result.errors?.join(', ') || 'Unknown error occurred';
        
        // If database succeeded but Resend failed, still update local state
        if (result.database.success) {
          // Keep the optimistic update
          setConsentStatus(prev => ({
            ...prev,
            hasConsent: grant,
            lastUpdated: new Date().toISOString(),
          }));
        } else {
          // Revert the optimistic update on database failure
          setConsentStatus(prev => ({
            ...prev,
            hasConsent: previousState,
          }));
        }

        return { 
          success: false, 
          message: result.database.success 
            ? `Einstellungen gespeichert, aber E-Mail-Service-Fehler: ${errorMessage}`
            : `Fehler beim Speichern: ${errorMessage}`
        };
      }
    } catch (error) {
      console.error('Error updating consent:', error);
      
      // Revert the optimistic update on error
      setConsentStatus(prev => ({
        ...prev,
        hasConsent: previousState,
      }));
      
      return { 
        success: false, 
        message: 'Netzwerkfehler. Bitte versuchen Sie es später erneut.' 
      };
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchConsentStatus();
  }, [user]);

  return {
    ...consentStatus,
    updating,
    updateConsent,
    refreshStatus: fetchConsentStatus,
  };
};