import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CreditContextType {
  credits: number;
  updateCredits: () => Promise<void>;
  deductCredits: (amount: number) => Promise<boolean>;
  setCredits: (credits: number) => void;
  loading: boolean;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
};

export const CreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      updateCredits();
    } else {
      setCredits(0);
      setLoading(false);
    }
  }, [user]);

  const updateCredits = async () => {
    if (!user) return;

    // Wait for email confirmation before creating profile to avoid foreign key constraint
    if (!user.email_confirmed_at) {
      setCredits(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get or create user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const now = new Date();
      
      if (!profile) {
        // Create new user profile with 300 credits
        const { data: newProfile, error } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email!,
            credits: 300,
            last_credit_reset: now.toISOString(),
          })
          .select()
          .single();
          
        if (!error && newProfile) {
          setCredits(300);
        }
      } else {
        // Check if credits need monthly reset via server-side function
        const lastReset = new Date(profile.last_credit_reset);
        const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                          (now.getMonth() - lastReset.getMonth());

        if (monthsDiff >= 1) {
          // Call server-side credit reset function
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              const resetResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reset-credits`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${session.access_token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (resetResponse.ok) {
                const resetData = await resetResponse.json();
                if (resetData.success) {
                  setCredits(resetData.credits);
                } else {
                  console.error('Credit reset failed:', resetData.error);
                  setCredits(profile.credits);
                }
              } else {
                console.error('Credit reset API error:', resetResponse.status);
                setCredits(profile.credits);
              }
            } else {
              setCredits(profile.credits);
            }
          } catch (resetError) {
            console.error('Error calling credit reset function:', resetError);
            setCredits(profile.credits);
          }
        } else {
          setCredits(profile.credits);
        }
      }
    } catch (error) {
      console.error('Error updating credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const deductCredits = async (amount: number): Promise<boolean> => {
    if (!user || credits < amount) return false;

    try {
      const newCredits = credits - amount;
      const { error } = await supabase
        .from('user_profiles')
        .update({
          credits: newCredits,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (!error) {
        setCredits(newCredits);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deducting credits:', error);
      return false;
    }
  };

  const value = {
    credits,
    updateCredits,
    deductCredits,
    setCredits,
    loading,
  };

  return (
    <CreditContext.Provider value={value}>
      {children}
    </CreditContext.Provider>
  );
};