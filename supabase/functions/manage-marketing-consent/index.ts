import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ConsentRequest {
  action: 'grant' | 'revoke'
  consentText: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('=== Marketing Consent Function Started ===')
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      throw new Error('Invalid authentication')
    }

    console.log('User authenticated:', user.email)

    // Parse request body
    const { action, consentText }: ConsentRequest = await req.json()
    console.log('Request action:', action)
    console.log('Consent text:', consentText)

    if (!action || !consentText) {
      throw new Error('Missing required fields: action and consentText')
    }

    if (!['grant', 'revoke'].includes(action)) {
      throw new Error('Invalid action. Must be "grant" or "revoke"')
    }

    const userEmail = user.email
    if (!userEmail) {
      throw new Error('User email not found')
    }

    // Resend API configuration
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const audienceId = Deno.env.get('RESEND_AUDIENCE_ID')
    
    console.log('=== Environment Variables Check ===')
    console.log('RESEND_API_KEY present:', !!resendApiKey)
    console.log('RESEND_API_KEY length:', resendApiKey?.length || 0)
    console.log('RESEND_AUDIENCE_ID present:', !!audienceId)
    console.log('RESEND_AUDIENCE_ID value:', audienceId)
    
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not found in environment variables')
      throw new Error('Resend API key not configured')
    }

    if (!audienceId) {
      console.error('❌ RESEND_AUDIENCE_ID not found in environment variables')
      throw new Error('Resend Audience ID not configured')
    }
    
    let resendSuccess = false
    let resendError = null

    try {
      console.log('=== Starting Resend API Operation ===')
      
      if (action === 'grant') {
        // Add contact to Resend audience
        console.log('📧 Adding contact to Resend audience...')
        console.log('Email:', userEmail)
        console.log('Audience ID:', audienceId)
        
        const requestBody = {
          email: userEmail,
          first_name: user.user_metadata?.first_name || userEmail.split('@')[0],
          last_name: user.user_metadata?.last_name || '',
          unsubscribed: false,
        }
        
        console.log('Request body:', JSON.stringify(requestBody, null, 2))
        
        const resendUrl = `https://api.resend.com/audiences/${audienceId}/contacts`
        console.log('Resend URL:', resendUrl)
        
        const resendResponse = await fetch(resendUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        console.log('✅ Resend API Response Status:', resendResponse.status)
        console.log('Response Headers:', Object.fromEntries(resendResponse.headers.entries()))
        
        const responseText = await resendResponse.text()
        console.log('📄 Resend API Response Body:', responseText)

        if (!resendResponse.ok) {
          console.error('❌ Resend API error details:')
          console.error('Status:', resendResponse.status)
          console.error('Status Text:', resendResponse.statusText)
          console.error('Response Body:', responseText)
          
          // Try to parse error response
          try {
            const errorData = JSON.parse(responseText)
            console.error('Parsed error:', errorData)
            resendError = `Resend API error: ${resendResponse.status} - ${errorData.message || responseText}`
          } catch {
            resendError = `Resend API error: ${resendResponse.status} - ${responseText}`
          }
        } else {
          resendSuccess = true
          console.log('🎉 Successfully added contact to Resend audience')
          
          // Try to parse success response
          try {
            const successData = JSON.parse(responseText)
            console.log('Success response data:', successData)
          } catch {
            console.log('Response is not JSON, but request was successful')
          }
        }
      } else {
        // Remove contact from Resend audience
        console.log('🗑️ Removing contact from Resend audience...')
        console.log('Email:', userEmail)
        
        const deleteUrl = `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(userEmail)}`
        console.log('Delete URL:', deleteUrl)
        
        const resendResponse = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
        })

        console.log('✅ Resend DELETE Response Status:', resendResponse.status)
        const responseText = await resendResponse.text()
        console.log('📄 Resend DELETE Response Body:', responseText)

        if (!resendResponse.ok) {
          console.error('❌ Resend DELETE API error:')
          console.error('Status:', resendResponse.status)
          console.error('Response Body:', responseText)
          resendError = `Resend API error: ${resendResponse.status} - ${responseText}`
        } else {
          resendSuccess = true
          console.log('🎉 Successfully removed contact from Resend audience')
        }
      }
    } catch (error) {
      console.error('💥 Resend API request failed with exception:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      resendError = `Failed to connect to Resend API: ${error.message}`
    }

    // Update consent in database regardless of Resend API result
    console.log('=== Database Operation ===')
    let dbSuccess = false
    let dbError = null

    try {
      if (action === 'grant') {
        console.log('💾 Inserting consent record to database...')
        const { error: insertError } = await supabaseClient
          .from('user_consents')
          .insert({
            user_id: user.id,
            consent_type: 'marketing_emails',
            status: 'granted',
            timestamp: new Date().toISOString(),
            consent_method: 'settings_toggle_button',
            consent_text: consentText,
          })

        if (insertError) {
          console.error('❌ Database insert error:', insertError)
          dbError = 'Failed to save consent to database'
        } else {
          dbSuccess = true
          console.log('✅ Successfully saved consent to database')
        }
      } else {
        console.log('🔄 Updating consent record in database...')
        const { error: updateError } = await supabaseClient
          .from('user_consents')
          .update({
            status: 'revoked',
            timestamp: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .eq('consent_type', 'marketing_emails')
          .eq('status', 'granted')

        if (updateError) {
          console.error('❌ Database update error:', updateError)
          dbError = 'Failed to update consent in database'
        } else {
          dbSuccess = true
          console.log('✅ Successfully updated consent in database')
        }
      }
    } catch (error) {
      console.error('💥 Database operation failed with exception:', error)
      dbError = 'Database operation failed'
    }

    // Determine overall success and prepare response
    const overallSuccess = dbSuccess && resendSuccess
    const errors = []
    
    if (dbError) errors.push(dbError)
    if (resendError) errors.push(resendError)

    console.log('=== Final Results ===')
    console.log('Database success:', dbSuccess)
    console.log('Resend success:', resendSuccess)
    console.log('Overall success:', overallSuccess)
    console.log('Errors:', errors)

    const response = {
      success: overallSuccess,
      action,
      email: userEmail,
      database: {
        success: dbSuccess,
        error: dbError,
      },
      resend: {
        success: resendSuccess,
        error: resendError,
      },
      errors: errors.length > 0 ? errors : null,
      message: overallSuccess 
        ? `Marketing email consent ${action === 'grant' ? 'granted' : 'revoked'} successfully`
        : `Partial failure: ${errors.join(', ')}`,
    }

    console.log('📤 Sending response:', JSON.stringify(response, null, 2))

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: overallSuccess ? 200 : 207, // 207 Multi-Status for partial success
    })

  } catch (error) {
    console.error('💥 Function error:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to process marketing consent request',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})