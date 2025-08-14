import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface QuizRequest {
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  language: 'english' | 'german' | 'french' | 'spanish'
}

interface QuizResponse {
  title: string
  topic: string
  difficulty: string
  knowledgeEvaluation: {
    description: string
    skillAreas: string[]
  }
  questions: Array<{
    question: string
    options: string[]
    correct: number
    explanation: string
  }>
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
    console.log('=== Quiz Generation Function Started ===')
    
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
    const requestType = 'generate_quiz'
    const rateLimit = 10 // 10 quiz generations per hour
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
          message: `You have exceeded the rate limit for quiz generation. You can generate up to ${rateLimit} quizzes per hour. Please try again later.`,
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
    const { topic, difficulty, language }: QuizRequest = await req.json()
    
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
    
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      throw new Error('Invalid difficulty level')
    }
    
    if (!['english', 'german', 'french', 'spanish'].includes(language)) {
      throw new Error('Invalid language')
    }

    // Sanitize topic (remove potentially harmful characters)
    const sanitizedTopic = topic.replace(/[<>\"'&]/g, '').trim()
    if (!sanitizedTopic) {
      throw new Error('Topic contains invalid characters')
    }

    console.log('Request validated:', { topic: sanitizedTopic, difficulty, language })

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables')
      throw new Error('OpenAI API key not configured')
    }

    // Define difficulty settings
    const difficulties = {
      easy: {
        name: 'Generally',
        credits: 50,
        description: 'Basic concepts and fundamental knowledge',
        questionCount: 5
      },
      medium: {
        name: 'Accurate',
        credits: 75,
        description: 'Applied knowledge and problem-solving',
        questionCount: 8
      },
      hard: {
        name: 'Precise',
        credits: 100,
        description: 'Expert-level analysis and synthesis',
        questionCount: 11
      }
    }

    const languages = {
      english: 'English',
      german: 'Deutsch',
      french: 'Français',
      spanish: 'Español'
    }

    // Definiere die benötigten Credits basierend auf der Schwierigkeit
    const requiredCredits = difficulties[difficulty].credits

    console.log(`Attempting to deduct ${requiredCredits} credits for ${difficulty} difficulty`)

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
      // Generate quiz using OpenAI
      const languageInstruction = language === 'english' ? '' : `
LANGUAGE REQUIREMENT: Generate the ENTIRE quiz in ${languages[language]}. All questions, options, explanations, and content must be in ${languages[language]}.`

      const prompt = `${languageInstruction}

Create a ${difficulty} difficulty quiz about: ${sanitizedTopic}

Number of questions: ${difficulties[difficulty].questionCount}

IMPORTANT: Create exactly ${difficulties[difficulty].questionCount} multiple-choice questions with 4 options each.
DIFFICULTY REQUIREMENTS:
${difficulty === 'easy' ? `
- Focus on basic concepts and fundamental knowledge
- Use simple, clear language
- Test recognition and basic understanding
- Provide brief explanations
` : difficulty === 'medium' ? `
- Focus on applied knowledge and problem-solving
- Include scenario-based questions
- Test analytical thinking and application
- Provide detailed explanations with context
` : `
- Focus on expert-level analysis and synthesis
- Include complex scenarios and edge cases
- Test critical thinking and deep understanding
- Provide comprehensive explanations with multiple perspectives
- Challenge advanced practitioners
`}

Respond with valid JSON only:
{
  "title": "Quiz title",
  "topic": "${sanitizedTopic}",
  "difficulty": "${difficulty}",
  "knowledgeEvaluation": {
    "description": "Brief evaluation of knowledge level based on quiz performance expectations",
    "skillAreas": ["area1", "area2", "area3"]
  },
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Detailed explanation of why this answer is correct"
    }
  ]
}`

      console.log('Calling OpenAI API...')

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert quiz creator. Your SOLE task is to generate a quiz in JSON format. Your response MUST be a single, complete JSON object, and contain absolutely no other text, explanations, or markdown outside the JSON. Ensure the JSON is perfectly valid and adheres to the requested structure. Create high-quality multiple-choice questions that match the specified difficulty level.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 1,
          max_tokens: 3000
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
      
      console.log('Raw OpenAI response content:', content)
      
      // Remove markdown code block fences if present
      let cleanContent = content
      if (content.startsWith('```json')) {
        cleanContent = content.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (content.startsWith('```')) {
        cleanContent = content.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      console.log('Cleaned content for parsing:', cleanContent)
      
      // Parse the JSON response
      let quizData: QuizResponse
      try {
        quizData = JSON.parse(cleanContent)
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', cleanContent)
        console.error('Original content was:', content)
        await refundCredits(user.id, requiredCredits, supabaseClient)
        throw new Error('Invalid response format from AI')
      }

      // Validate the response structure
      if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
        console.error('Invalid quiz structure:', quizData)
        await refundCredits(user.id, requiredCredits, supabaseClient)
        throw new Error('Invalid quiz format received')
      }

      // Save quiz results to database
      try {
        // Check if user has reached the 15-item limit and delete oldest if necessary
        const { data: existingQuizzes } = await supabaseClient
          .from('quiz_results')
          .select('id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (existingQuizzes && existingQuizzes.length >= 15) {
          // Delete the oldest quiz
          await supabaseClient
            .from('quiz_results')
            .delete()
            .eq('id', existingQuizzes[0].id)
        }

        // Save quiz metadata (without results since quiz hasn't been taken yet)
        const { error: insertError } = await supabaseClient
          .from('quiz_results')
          .insert({
            user_id: user.id,
            quiz_content: JSON.stringify({
              title: quizData.title,
              topic: quizData.topic,
              difficulty: quizData.difficulty,
              questions: quizData.questions,
            }),
            score: 0, // Will be updated when quiz is completed
            total_questions: quizData.questions.length,
            difficulty: difficulty,
            credits_used: requiredCredits,
          })

        if (insertError) {
          console.error('Database insert error:', insertError)
          await refundCredits(user.id, requiredCredits, supabaseClient)
          throw new Error('Failed to save quiz to database')
        }

      } catch (dbError) {
        console.error('Error saving to database:', dbError)
        await refundCredits(user.id, requiredCredits, supabaseClient)
        throw new Error('Database operation failed')
      }

      console.log('Quiz generated and saved successfully')

      return new Response(JSON.stringify({
        ...quizData,
        newCredits: deductionResult.new_credits
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } catch (generationError) {
      // Dieser Catch-Block behandelt Fehler, die NACH erfolgreicher Kreditabbuchung auftreten
      console.error('Quiz generation failed after credit deduction:', generationError)
      
      return new Response(
        JSON.stringify({
          error: generationError.message || 'Failed to generate quiz after credit deduction',
          message: 'Quiz generation failed',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

  } catch (error) {
    console.error('Quiz generation error:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate quiz',
        message: 'Quiz generation failed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})