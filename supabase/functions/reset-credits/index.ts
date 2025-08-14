import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('=== Credit Reset Function Started ===')
    
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

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('User profile not found')
    }

    // Check if credits need monthly reset
    const now = new Date()
    const lastReset = new Date(profile.last_credit_reset)
    const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                      (now.getMonth() - lastReset.getMonth())

    console.log('Credit reset check:', {
      now: now.toISOString(),
      lastReset: lastReset.toISOString(),
      monthsDiff,
      currentCredits: profile.credits
    })

    if (monthsDiff >= 1) {
      // Reset credits to 300 for the new month
      const { data: updatedProfile, error: updateError } = await supabaseClient
        .from('user_profiles')
        .update({
          credits: 300,
          last_credit_reset: now.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) {
        throw new Error('Failed to reset credits')
      }

      console.log('Credits reset successfully:', {
        previousCredits: profile.credits,
        newCredits: 300,
        resetDate: now.toISOString()
      })

      return new Response(JSON.stringify({
        success: true,
        message: 'Credits reset successfully',
        credits: 300,
        resetDate: now.toISOString(),
        previousCredits: profile.credits
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } else {
      console.log('No credit reset needed')
      
      return new Response(JSON.stringify({
        success: true,
        message: 'No credit reset needed',
        credits: profile.credits,
        lastReset: profile.last_credit_reset,
        monthsUntilReset: 1 - monthsDiff
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

  } catch (error) {
    console.error('Credit reset error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to reset credits',
        message: 'Credit reset failed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})