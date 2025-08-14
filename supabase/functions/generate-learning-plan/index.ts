import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface LearningPlanRequest {
  topic: string
  selectedTier: 'basic' | 'premium'
  language: 'english' | 'german' | 'french' | 'spanish'
  budget: 'free' | 'mixed' | 'premium'
  learningStyle: 'visual' | 'practical' | 'theoretical' | 'mixed'
}

// Hilfsfunktion für Kreditrückerstattung
async function refundCredits(userId: string, amount: number, supabase: any) {
  try {
    const { data: refundResult, error } = await supabase.rpc('refund_credits', {
      user_id_uuid: userId,
      amount_to_refund: amount
    });

    if (error || !refundResult?.success) {
      console.error('Fehler bei Kreditrückerstattung:', error || refundResult?.message);
    } else {
      console.log(`Credits erfolgreich zurückerstattet: ${amount} für Benutzer ${userId}. Neues Guthaben: ${refundResult.new_credits}`);
    }
  } catch (refundError) {
    console.error('Ausnahme bei Kreditrückerstattung:', refundError);
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('=== Learning Plan Generation Function Started ===')
    
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

    // Rate limiting check
    const userId = user.id
    const requestType = 'generate_learning_plan'
    const rateLimit = 5 // 5 learning plan generations per hour (more expensive operation)
    const timeWindowMinutes = 60 // 1 hour
    
    console.log('Checking rate limits for user:', userId)
    
    // Count requests in the time window
    const timeWindowStart = new Date(Date.now() - timeWindowMinutes * 60 * 1000).toISOString()
    
    const { count, error: countError } = await supabaseClient
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('request_type', requestType)
      .gte('created_at', timeWindowStart)

    if (countError) {
      console.error('Error counting rate limit requests:', countError)
      // Continue with request - don't block on rate limit errors
    } else if (count !== null && count >= rateLimit) {
      console.log(`Rate limit exceeded for user ${userId}: ${count}/${rateLimit} requests in ${timeWindowMinutes} minutes`)
      
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `You have exceeded the rate limit for learning plan generation. You can generate up to ${rateLimit} learning plans per hour. Please try again later.`,
          retryAfter: timeWindowMinutes * 60, // seconds until reset
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429,
        }
      )
    }

    // Log this request for rate limiting
    const { error: logError } = await supabaseClient
      .from('rate_limits')
      .insert({
        user_id: userId,
        request_type: requestType,
      })

    if (logError) {
      console.error('Error logging rate limit request:', logError)
      // Continue with request - don't block on logging errors
    }

    // Clean up old rate limit entries (optional, helps keep table small)
    try {
      await supabaseClient.rpc('cleanup_old_rate_limits')
    } catch (cleanupError) {
      console.log('Rate limit cleanup failed (non-critical):', cleanupError)
    }

    // Parse and validate request body
    const { topic, selectedTier, language, budget, learningStyle }: LearningPlanRequest = await req.json()
    
    // Input validation
    if (!topic || typeof topic !== 'string') {
      throw new Error('Topic is required and must be a string')
    }
    
    if (topic.length > 100) {
      throw new Error('Topic must be 100 characters or less')
    }
    
    if (topic.length > 75) {
      throw new Error('Topic must be 75 characters or less')
    }
    
    const topics = topic.split(',').map(t => t.trim()).filter(t => t.length > 0)
    if (topics.length > 3) {
      throw new Error('Maximum 3 topics allowed')
    }
    
    if (!['basic', 'premium'].includes(selectedTier)) {
      throw new Error('Invalid tier selection')
    }
    
    if (!['english', 'german', 'french', 'spanish'].includes(language)) {
      throw new Error('Invalid language')
    }
    
    if (!['free', 'mixed', 'premium'].includes(budget)) {
      throw new Error('Invalid budget preference')
    }
    
    if (!['visual', 'practical', 'theoretical', 'mixed'].includes(learningStyle)) {
      throw new Error('Invalid learning style')
    }

    // Sanitize topic (remove potentially harmful characters)
    const sanitizedTopic = topic.replace(/[<>\"'&]/g, '').trim()
    if (!sanitizedTopic) {
      throw new Error('Topic contains invalid characters')
    }

    console.log('Request validated:', { topic: sanitizedTopic, selectedTier, language, budget, learningStyle })

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables')
      throw new Error('OpenAI API key not configured')
    }

    // Define tier settings
    const tiers = {
      basic: {
        name: 'Basic',
        credits: 120,
        model: 'gpt-4o-mini',
        description: 'Comprehensive learning plan with practical application',
        phases: '5-7',
        resources: '2 quality per phase',
        detailLevel: 'Comprehensive'
      },
      premium: {
        name: 'Premium',
        credits: 160,
        model: 'gpt-4o',
        description: 'Expert-level mastery plan with cutting-edge content',
        phases: '7-9',
        resources: '3 premium per phase',
        detailLevel: 'Expert-level'
      }
    }

    const languages = {
      english: 'English',
      german: 'Deutsch',
      french: 'Français',
      spanish: 'Español'
    }

    const budgetOptions = {
      free: 'Use ONLY free resources (Free, $0)',
      mixed: 'Mix of free and paid resources, prioritize value',
      premium: 'Focus on premium, high-quality paid resources'
    }

    const learningStyles = {
      visual: 'Focus on video courses, visual tutorials, and interactive content',
      practical: 'Emphasize hands-on projects, coding exercises, and practical applications',
      theoretical: 'Include books, research papers, and comprehensive documentation',
      mixed: 'Balanced mix of videos, books, projects, and interactive content'
    }

    // Definiere die benötigten Credits basierend auf dem ausgewählten Tier
    const requiredCredits = tiers[selectedTier].credits

    console.log(`Attempting to deduct ${requiredCredits} credits for ${selectedTier} tier`)

    // --- ATOMARE KREDITABBUCHUNG ---
    const { data: deductionResult, error: rpcError } = await supabaseClient.rpc('deduct_credits', {
      user_id_uuid: user.id,
      amount_to_deduct: requiredCredits
    })

    if (rpcError) {
      console.error('RPC error during credit deduction:', rpcError)
      throw new Error(`Fehler beim Abzug der Credits: ${rpcError.message}`)
    }

    if (!deductionResult || !deductionResult.success) {
      console.log('Credit deduction failed:', deductionResult)
      return new Response(
        JSON.stringify({
          error: deductionResult?.message || 'Kreditabbuchung fehlgeschlagen',
          message: deductionResult?.message || 'Unzureichende Credits',
          available_credits: deductionResult?.available_credits,
          required_credits: deductionResult?.required_credits
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 402, // Payment Required
        }
      )
    }

    console.log(`Credits erfolgreich abgezogen: ${requiredCredits}. Neues Guthaben: ${deductionResult.new_credits}`)

    // --- GENERIERUNGSLOGIK (mit Rückerstattung bei Fehler) ---
    try {
      // Generate learning plan using OpenAI
      const languageInstruction = language === 'english' ? '' : `
LANGUAGE REQUIREMENT: Generate the ENTIRE learning plan in ${languages[language]}. All text, descriptions, titles, and content must be in ${languages[language]}.`

      const budgetInstruction = budgetOptions[budget]
      const styleInstruction = learningStyles[learningStyle]

      const baseRequirements = `${languageInstruction}

Create a comprehensive learning plan for: ${sanitizedTopic}

TIER: ${selectedTier.toUpperCase()} (${tiers[selectedTier].detailLevel})
BUDGET PREFERENCE: ${budgetInstruction}
LEARNING STYLE: ${styleInstruction}

CRITICAL REQUIREMENTS:
1. WORKING URLS: Every resource MUST have a real, functional URL that users can click and visit
2. RESOURCE COUNT: Exactly ${selectedTier === 'basic' ? '2' : '3'} resources per phase
3. QUALITY LEVEL: ${selectedTier === 'basic' ? 'Essential foundation' : 'Expert-level with cutting-edge content'}
4. BUDGET: ${budgetInstruction}
5. STYLE: ${styleInstruction}

URL REQUIREMENTS (MANDATORY):
- Use REAL, WORKING URLs only
- Examples: https://coursera.org/learn/..., https://youtube.com/watch?v=..., https://github.com/..., https://docs.python.org/...
- NO placeholder or fake URLs
- Every resource needs a "url" field with actual link

PHASE COUNT: ${tiers[selectedTier].phases} phases
RESOURCES PER PHASE: ${selectedTier === 'basic' ? '2' : '3'} resources (each with working URL)`

      const tierSpecifications = selectedTier === 'basic' ? `

BASIC TIER SPECIFICATIONS:
- Focus on fundamental concepts and essential skills
- Clear, beginner-friendly explanations
- Basic but solid project ideas
- Free or low-cost resources
- 2 resources per phase (courses, tutorials, documentation)
- Practical exercises that build foundation
- Simple assessment methods
- Basic tools and software recommendations

Each resource must include:
- title: Resource name
- description: What the resource covers
- provider: Platform/author name
- difficulty: beginner/intermediate
- duration: Estimated time
- price: Free/Paid amount
- url: REAL working URL (mandatory)
- type: course/tutorial/documentation/book/video` : `

PREMIUM TIER SPECIFICATIONS:
- Expert-level mastery with cutting-edge content
- Advanced technologies and industry trends
- Enterprise-grade projects and solutions
- Premium curated resources and certifications
- 3 premium resources per phase
- Complex scenarios and advanced problem-solving
- Career advancement and professional development
- Industry connections and networking guidance

Each resource must include:
- title: Resource name
- description: Focused coverage explanation (2-3 sentences max)
- provider: Platform/author name
- difficulty: advanced/expert
- duration: Time estimate
- price: Pricing information
- url: REAL working URL (mandatory)
- type: course/tutorial/documentation/book/video/tool/certification
- highlights: Key learning outcomes (1-2 sentences)
- careerValue: Professional impact (1 sentence)`

      const prompt = baseRequirements + tierSpecifications + `

MANDATORY JSON STRUCTURE:
{
  "title": "Learning plan title",
  "topic": "${sanitizedTopic}",
  "tier": "${selectedTier}",
  "overview": {
    "description": "Detailed overview",
    "duration": "Total time estimate",
    "level": "Skill level",
    "style": "Learning approach"
  },
  "phases": [
    {
      "title": "Phase name",
      "description": "Phase overview",
      "duration": "Time needed",
      "objectives": [
        {
          "title": "Learning objective",
          "description": "Clear learning outcome (1-2 sentences)",
          "timeRequired": "Estimated time"
        }
      ],
      "resources": [
        {
          "title": "Resource title",
          "description": "What this resource covers (2-3 sentences max)",
          "provider": "Platform name",
          "difficulty": "beginner/intermediate/advanced",
          "duration": "How long it takes", 
          "price": "Free/Paid amount",
          "url": "REAL WORKING URL - MANDATORY",
          "type": "course/tutorial/documentation/book/video"${selectedTier === 'premium' ? ',\n          "highlights": "Key outcomes (1-2 sentences)",\n          "careerValue": "Professional impact (1 sentence)"' : ''}
        }
      ],
      "exercises": [
        {
          "title": "Exercise name",
          "description": "What to build/practice (1-2 sentences)",
          "timeRequired": "Time estimate",
          "difficulty": "Level"
        }
      ]
    }
  ],
  "projects": [
    {
      "title": "Project name",
      "description": "Project overview and goals (2-3 sentences)",
      "timeRequired": "Duration",
      "difficulty": "Level",
      "outcomes": "What you'll achieve (1-2 sentences)"
    }
  ],
  "toolsAndSoftware": [
    {
      "name": "Tool name",
      "purpose": "Primary use case (1 sentence)",
      "cost": "Free/Paid",
      "url": "REAL WORKING URL"
    }
  ]
}

RESPOND WITH VALID JSON ONLY - NO OTHER TEXT`

      console.log('Calling OpenAI API for learning plan...')

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: tiers[selectedTier].model,
          messages: [
            {
              role: 'system',
              content: `You are an expert learning plan creator. Your SOLE task is to generate a learning plan in JSON format. Your response MUST be a single, complete JSON object, and contain absolutely no other text, explanations, or markdown outside the JSON. Ensure the JSON is perfectly valid and adheres to the requested structure. Focus on concise but comprehensive information. Keep descriptions focused and actionable. Ensure tier-appropriate depth and quality differences.`
            },
            {
              role: 'user', 
              content: prompt
            }
          ],
          temperature: 1,
          max_completion_tokens: selectedTier === 'basic' ? 4000 : 10000
        })
      })

      if (!response.ok) {
        console.error('OpenAI API error:', response.status, response.statusText)
        await refundCredits(user.id, requiredCredits, supabaseClient)
        
        if (response.status === 401) {
          throw new Error('OpenAI API authentication failed')
        } else if (response.status === 429) {
          throw new Error('OpenAI API rate limit exceeded')
        } else {
          throw new Error(`OpenAI API error: ${response.status}`)
        }
      }

      const data = await response.json()
      const content = data.choices[0].message.content.trim()

      // Remove markdown code block fences if present
      let cleanContent = content
      if (content.startsWith('```json')) {
        cleanContent = content.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (content.startsWith('```')) {
        cleanContent = content.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      // Parse the JSON response
      let planData
      try {
        planData = JSON.parse(cleanContent)
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', cleanContent)
        await refundCredits(user.id, requiredCredits, supabaseClient)
        throw new Error('Invalid response format from AI')
      }

      // Validate the response structure
      if (!planData.phases || !Array.isArray(planData.phases) || planData.phases.length === 0) {
        console.error('Invalid plan structure:', planData)
        await refundCredits(user.id, requiredCredits, supabaseClient)
        throw new Error('Invalid learning plan format received')
      }

      // Validate that resources have URLs
      let hasValidResources = true
      planData.phases.forEach((phase: any, phaseIndex: number) => {
        const expectedResources = selectedTier === 'basic' ? 2 : 3
        if (!phase.resources || phase.resources.length < expectedResources) {
          hasValidResources = false
          console.error(`Phase ${phaseIndex + 1} has insufficient resources: ${phase.resources?.length || 0}/${expectedResources}`)
        }
        phase.resources?.forEach((resource: any, resourceIndex: number) => {
          if (!resource.url || !resource.url.startsWith('http')) {
            hasValidResources = false
            console.error(`Phase ${phaseIndex + 1}, Resource ${resourceIndex + 1} has invalid URL:`, resource.url)
          }
        })
      })

      if (!hasValidResources) {
        console.error('Plan validation failed - missing or invalid URLs')
        await refundCredits(user.id, requiredCredits, supabaseClient)
        throw new Error('Generated plan has invalid resources')
      }

      // Save to database
      try {
        // Check if user has reached the 15-item limit and delete oldest if necessary
        const { data: existingPlans } = await supabaseClient
          .from('learning_plans')
          .select('id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (existingPlans && existingPlans.length >= 15) {
          // Delete the oldest plan
          await supabaseClient
            .from('learning_plans')
            .delete()
            .eq('id', existingPlans[0].id)
        }

        const { error: insertError } = await supabaseClient
          .from('learning_plans')
          .insert({
            user_id: user.id,
            title: planData.title,
            content: JSON.stringify(planData),
            tier: selectedTier,
            credits_used: requiredCredits,
          })

        if (insertError) {
          console.error('Database insert error:', insertError)
          await refundCredits(user.id, requiredCredits, supabaseClient)
          throw new Error('Failed to save learning plan to database')
        }

      } catch (dbError) {
        console.error('Error saving to database:', dbError)
        await refundCredits(user.id, requiredCredits, supabaseClient)
        throw new Error('Database operation failed')
      }

      console.log('Learning plan generated and saved successfully')

      return new Response(JSON.stringify({
        ...planData,
        newCredits: deductionResult.new_credits
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } catch (generationError) {
      // Dieser Catch-Block behandelt Fehler, die NACH erfolgreicher Kreditabbuchung auftreten
      console.error('Learning plan generation failed after credit deduction:', generationError)
      
      return new Response(
        JSON.stringify({
          error: generationError.message || 'Failed to generate learning plan after credit deduction',
          message: 'Learning plan generation failed',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

  } catch (error) {
    console.error('Learning plan generation error:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate learning plan',
        message: 'Learning plan generation failed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})