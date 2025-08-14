import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditContext';
import { supabase } from '../lib/supabase';
import { 
  BookOpen, 
  Zap, 
  Target, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Loader,
  AlertCircle,
  ExternalLink,
  Clock,
  Award,
  Coins,
  Brain,
  TrendingUp,
  Users,
  Code,
  Globe
} from 'lucide-react';

const LearningPlansPage = () => {
  const { user } = useAuth();
  const { credits, setCredits } = useCredits();
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium'>('basic');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<'english' | 'german' | 'french' | 'spanish'>('english');
  const [budget, setBudget] = useState<'free' | 'mixed' | 'premium'>('mixed');
  const [learningStyle, setLearningStyle] = useState<'visual' | 'practical' | 'theoretical' | 'mixed'>('mixed');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<any>(null);
  const [showPlan, setShowPlan] = useState(false);

  const tiers = {
    basic: {
      name: 'Basic',
      credits: 120,
      model: 'gpt-4.1',
      color: 'blue', 
      description: 'Comprehensive learning plan with practical application',
      features: ['7-10 Learning phases', '2-3 Quality resources per phase', 'Practical projects', 'Industry insights'],
      phases: '5-7',
      resources: '2-3 quality per phase',
      detailLevel: 'Comprehensive'
    },
    premium: {
      name: 'Premium',
      credits: 160,
      model: 'o4-mini-deep-research',
      color: 'purple',
      description: 'Expert-level mastery plan with cutting-edge content',
      features: ['10-12 Learning phases', '3 Premium resources per phase', 'Advanced projects', 'Career guidance'],
      phases: '7-9',
      resources: '3 premium per phase',
      detailLevel: 'Expert-level'
    }
  };

  const languages = {
    english: { name: 'English', flag: '🇺🇸' },
    german: { name: 'Deutsch', flag: '🇩🇪' },
    french: { name: 'Français', flag: '🇫🇷' },
    spanish: { name: 'Español', flag: '🇪🇸' }
  };

  const budgetOptions = {
    free: { name: 'Free Only', icon: '💚', description: 'Only free resources' },
    mixed: { name: 'Mixed', icon: '⚖️', description: 'Free and paid resources' },
    premium: { name: 'Premium', icon: '💎', description: 'High-quality paid resources' }
  };

  const learningStyles = {
    visual: { name: 'Visual', icon: '👁️', description: 'Videos, diagrams, infographics' },
    practical: { name: 'Practical', icon: '🛠️', description: 'Hands-on projects and exercises' },
    theoretical: { name: 'Theoretical', icon: '📚', description: 'Books, articles, documentation' },
    mixed: { name: 'Mixed', icon: '🎯', description: 'Combination of all styles' }
  };

  const handleGeneratePlan = async () => {
    if (!user) {
      setError('Please sign in to generate learning plans');
      return;
    }

    if (!topic.trim()) {
      setError('Please enter a topic for the learning plan');
      return;
    }

    // Check topic limit (max 3 topics)
    const topics = topic.split(',').map(t => t.trim()).filter(t => t.length > 0);
    if (topics.length > 3) {
      setError('Maximum 3 topics allowed. Please separate topics with commas (e.g., "JavaScript, React, Node.js").');
      return;
    }
    
    if (topic.length > 75) {
      setError('Topic must be 75 characters or less');
      return;
    }

    const tierCredits = tiers[selectedTier].credits;
    if (credits < tierCredits) {
      setError(`Insufficient credits. You need ${tierCredits} credits for ${tiers[selectedTier].name} tier.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate comprehensive prompts based on tier
      const getPromptForTier = () => {
        const languageInstruction = language === 'english' ? '' : `
LANGUAGE REQUIREMENT: Generate the ENTIRE learning plan in ${languages[language].name}. All text, descriptions, titles, and content must be in ${languages[language].name}.`;

        const budgetInstruction = budget === 'free' ? 'Use ONLY free resources (Free, $0)' :
                                 budget === 'premium' ? 'Focus on premium, high-quality paid resources' :
                                 'Mix of free and paid resources, prioritize value';

        const styleInstruction = learningStyle === 'visual' ? 'Focus on video courses, visual tutorials, and interactive content' :
                                learningStyle === 'practical' ? 'Emphasize hands-on projects, coding exercises, and practical applications' :
                                learningStyle === 'theoretical' ? 'Include books, research papers, and comprehensive documentation' :
                                'Balanced mix of videos, books, projects, and interactive content';

        const baseRequirements = `${languageInstruction}

Create a comprehensive learning plan for: ${topic}

TIER: ${selectedTier.toUpperCase()} (${tiers[selectedTier].detailLevel})
BUDGET PREFERENCE: ${budgetInstruction}
LEARNING STYLE: ${styleInstruction}

CRITICAL REQUIREMENTS:
1. WORKING URLS: Every resource MUST have a real, functional URL that users can click and visit
2. RESOURCE COUNT: Exactly ${selectedTier === 'basic' ? '2' : selectedTier === 'advanced' ? '2-3' : '3'} resources per phase
3. QUALITY LEVEL: ${selectedTier === 'basic' ? 'Essential foundation' : selectedTier === 'advanced' ? 'Comprehensive with practical focus' : 'Expert-level with cutting-edge content'}
4. BUDGET: ${budgetInstruction}
5. STYLE: ${styleInstruction}

URL REQUIREMENTS (MANDATORY):
- Use REAL, WORKING URLs only
- Examples: https://coursera.org/learn/..., https://youtube.com/watch?v=..., https://github.com/..., https://docs.python.org/...
- NO placeholder or fake URLs
- Every resource needs a "url" field with actual link

PHASE COUNT: ${tiers[selectedTier].phases} phases
RESOURCES PER PHASE: ${selectedTier === 'basic' ? '2' : selectedTier === 'advanced' ? '2-3' : '3'} resources (each with working URL)`;

        if (selectedTier === 'basic') {
          return baseRequirements + `

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
- type: course/tutorial/documentation/book/video`;

        } else if (selectedTier === 'advanced') {
          return baseRequirements + `

ADVANCED TIER SPECIFICATIONS:
- Comprehensive coverage with practical focus
- Industry-relevant applications and best practices
- Real-world scenarios and case studies
- Quality curated resources (mix of free and premium)
- 2-3 high-quality resources per phase
- Practical exercises with real-world application
- Portfolio-worthy projects
- Professional development guidance

Each resource must include:
- title: Resource name
- description: Clear, focused coverage explanation (2-3 sentences max)
- provider: Platform/author name
- difficulty: intermediate/advanced
- duration: Time estimate
- price: Pricing information
- url: REAL working URL (mandatory)
- type: course/tutorial/documentation/book/video/tool
- highlights: Key learning outcomes (1-2 sentences)`;

        } else { // premium
          return baseRequirements + `

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
- careerValue: Professional impact (1 sentence)`;
        }
      };

      const prompt = getPromptForTier() + `

MANDATORY JSON STRUCTURE:
{
  "title": "Learning plan title",
  "topic": "${topic}",
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

RESPOND WITH VALID JSON ONLY - NO OTHER TEXT`;

      // Enhanced phase information guidelines
      const enhancedPrompt = prompt + `

PHASE ENHANCEMENT GUIDELINES:
- Each phase should have detailed, actionable objectives
- Include specific learning milestones and checkpoints
- Provide clear progression from basic to advanced concepts
- Add practical application examples for each phase
- Include assessment criteria and success metrics
- Ensure logical flow between phases
- Add time management and study tips per phase`;

      console.log('Generating plan with model:', tiers[selectedTier].model);
      
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-learning-plan`;
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          selectedTier: selectedTier,
          language: language,
          budget: budget,
          learningStyle: learningStyle
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server API Error:', response.status, errorData);
        
        if (errorData.error) {
          if (response.status === 429) {
            // Rate limit exceeded
            const retryAfter = errorData.retryAfter ? Math.ceil(errorData.retryAfter / 60) : 60;
            throw new Error(`${errorData.message} Please wait ${retryAfter} minutes before trying again.`);
          } else if (response.status === 402) {
            // Insufficient credits
            throw new Error(`Insufficient credits. You need ${errorData.required_credits || tiers[selectedTier].credits} credits but only have ${errorData.available_credits || credits}.`);
          } else {
            throw new Error(errorData.error);
          }
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const planData = await response.json();
      console.log('Server Response:', planData);

      // Sofortige Kreditaktualisierung
      if (planData.newCredits !== undefined) {
        setCredits(planData.newCredits);
        console.log('Credits updated immediately to:', planData.newCredits);
      }

      // Validate the response structure
      if (!planData.phases || !Array.isArray(planData.phases) || planData.phases.length === 0) {
        console.error('Invalid plan structure:', planData);
        throw new Error('Invalid learning plan format received. Please try again.');
      }

      setPlan(planData);
      setShowPlan(true);

      // Reset form
      setTopic('');

    } catch (error: any) {
      console.error('Error generating learning plan:', error);
      if (error.message.includes('authentication')) {
        setError('Authentication error. Please sign in again.');
      } else if (error.message.includes('rate limit')) {
        setError('AI service is busy. Please try again in a few minutes.');
      } else if (error.message.includes('Invalid') && error.message.includes('format')) {
        setError('AI response format error. Please try again with a different topic.');
      } else {
        setError('Failed to generate learning plan. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTierColorClasses = (tier: string) => {
    switch (tier) {
      case 'basic':
        return {
          bg: 'from-blue-500/10 to-cyan-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-400',
          button: 'from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400'
        };
      case 'advanced':
        return {
          bg: 'from-green-500/10 to-emerald-500/10',
          border: 'border-green-500/20',
          text: 'text-green-400',
          button: 'from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400'
        };
      case 'premium':
        return {
          bg: 'from-purple-500/10 to-pink-500/10',
          border: 'border-purple-500/20',
          text: 'text-purple-400',
          button: 'from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400'
        };
      default:
        return {
          bg: 'from-gray-500/10 to-gray-600/10',
          border: 'border-gray-500/20',
          text: 'text-gray-400',
          button: 'from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500'
        };
    }
  };

  const resetPlan = () => {
    setPlan(null);
    setShowPlan(false);
    // Scroll to top when resetting
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top when plan is generated and shown
  React.useEffect(() => {
    if (showPlan && plan) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showPlan, plan]);

  if (showPlan && plan) {
    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Plan Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-pulse">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 tracking-tight">
              {plan.title}
            </h1>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <span className={`px-4 py-2 rounded-full font-bold border-2 ${getTierColorClasses(selectedTier).text} ${getTierColorClasses(selectedTier).border} bg-black/20`}>
                {tiers[selectedTier].name} Tier
              </span>
              <span className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-full text-gray-300 font-semibold">
                {plan.overview?.duration || 'Self-paced'}
              </span>
            </div>

            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {plan.overview?.description}
            </p>

            <button
              onClick={resetPlan}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              ← Create New Plan
            </button>
          </div>

          {/* Learning Phases */}
          <div className="space-y-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span>Learning Phases</span>
            </h2>
            
            {plan.phases.map((phase: any, index: number) => (
              <div key={index} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-400 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{phase.title}</h3>
                    <p className="text-gray-300 mb-4">{phase.description}</p>
                    {phase.duration && (
                      <div className="flex items-center space-x-2 text-cyan-400 mb-4">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">{phase.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Learning Objectives */}
                {phase.objectives && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                      <Target className="w-5 h-5 text-green-400" />
                      <span>Learning Objectives</span>
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {phase.objectives.map((objective: any, objIndex: number) => (
                        <div key={objIndex} className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                          <h5 className="font-semibold text-green-400 mb-2">{objective.title || `Objective ${objIndex + 1}`}</h5>
                          <p className="text-gray-300 text-sm mb-2">{objective.description}</p>
                          {objective.timeRequired && (
                            <span className="text-xs text-cyan-400">⏱️ {objective.timeRequired}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {phase.resources && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      <span>Resources ({phase.resources.length})</span>
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {phase.resources.map((resource: any, resIndex: number) => (
                        <div key={resIndex} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 hover:border-blue-400/40 transition-all duration-300">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h5 className="font-semibold text-blue-400 mb-1">{resource.title}</h5>
                              <p className="text-xs text-gray-400 mb-2">{resource.provider} • {resource.type}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              resource.difficulty === 'beginner' ? 'bg-green-400/20 text-green-400' :
                              resource.difficulty === 'intermediate' ? 'bg-yellow-400/20 text-yellow-400' :
                              'bg-red-400/20 text-red-400'
                            }`}>
                              {resource.difficulty}
                            </span>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{resource.description}</p>
                          
                          <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                            <span>⏱️ {resource.duration}</span>
                            <span className={resource.price === 'Free' ? 'text-green-400' : 'text-yellow-400'}>
                              {resource.price}
                            </span>
                          </div>

                          {/* Highlights for Advanced/Premium */}
                          {resource.highlights && selectedTier === 'premium' && (
                            <p className="text-xs text-purple-400 mb-3">✨ {resource.highlights}</p>
                          )}
                          
                          {/* Career Value for Premium */}
                          {resource.careerValue && (
                            <p className="text-xs text-pink-400 mb-3">🚀 {resource.careerValue}</p>
                          )}

                          {/* Resource Link */}
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 w-full justify-center px-3 py-2 bg-blue-400/20 hover:bg-blue-400/30 border border-blue-400/30 hover:border-blue-400/50 rounded-lg text-blue-400 font-semibold text-sm transition-all duration-300 hover:scale-105"
                            >
                              <span>Visit Resource</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exercises */}
                {phase.exercises && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                      <Code className="w-5 h-5 text-purple-400" />
                      <span>Exercises</span>
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {phase.exercises.map((exercise: any, exIndex: number) => (
                        <div key={exIndex} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                          <h5 className="font-semibold text-purple-400 mb-2">{exercise.title}</h5>
                          <p className="text-gray-300 text-sm mb-2">{exercise.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-cyan-400">⏱️ {exercise.timeRequired}</span>
                            <span className={`px-2 py-1 rounded font-semibold ${
                              exercise.difficulty === 'easy' ? 'bg-green-400/20 text-green-400' :
                              exercise.difficulty === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                              'bg-red-400/20 text-red-400'
                            }`}>
                              {exercise.difficulty}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Projects Section */}
          {plan.projects && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span>Portfolio Projects</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {plan.projects.map((project: any, index: number) => (
                  <div key={index} className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-green-400 mb-3">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-cyan-400">⏱️ {project.timeRequired}</span>
                      <span className={`px-3 py-1 rounded font-semibold ${
                        project.difficulty === 'beginner' ? 'bg-green-400/20 text-green-400' :
                        project.difficulty === 'intermediate' ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-red-400/20 text-red-400'
                      }`}>
                        {project.difficulty}
                      </span>
                    </div>
                    {project.outcomes && (
                      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-blue-400 text-sm"><strong>Outcomes:</strong> {project.outcomes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools and Software */}
          {plan.toolsAndSoftware && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span>Tools & Software</span>
              </h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {plan.toolsAndSoftware.map((tool: any, index: number) => (
                  <div key={index} className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-400 mb-2">{tool.name}</h4>
                    <p className="text-gray-300 text-sm mb-3">{tool.purpose}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        tool.cost === 'Free' ? 'bg-green-400/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400'
                      }`}>
                        {tool.cost}
                      </span>
                    </div>
                    {tool.url && (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 w-full justify-center px-2 py-1 bg-orange-400/20 hover:bg-orange-400/30 border border-orange-400/30 hover:border-orange-400/50 rounded text-orange-400 font-semibold text-xs transition-all duration-300"
                      >
                        <span>Visit Tool</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Button */}
          <div className="text-center">
            <div className="p-8 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border border-green-500/20 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">🎉 Your Learning Plan is Ready!</h3>
              <p className="text-gray-300 mb-6">Start your journey and track your progress. Good luck!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetPlan}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Create Another Plan
                </button>
                <a
                  href="/dashboard"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  View Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 shadow-lg shadow-green-400/50 animate-pulse">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-4 sm:mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
              AI Learning Plans
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium px-4">
            Generate comprehensive, personalized learning roadmaps with real resources, working links,
            and expert guidance tailored to your chosen skill level.
          </p>
        </div>

        {/* Tier Selection */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {Object.entries(tiers).map(([key, tier]) => {
            const colors = getTierColorClasses(key);
            const isSelected = selectedTier === key;
            
            return (
              <div
                key={key}
                onClick={() => setSelectedTier(key as any)}
                className={`cursor-pointer p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-2 ${
                  isSelected 
                    ? `${colors.border} ${colors.bg} shadow-2xl shadow-${colors.text.replace('text-', '')}/50 ring-4 ring-${colors.text.replace('text-', '')}/30 ring-offset-4 ring-offset-black scale-105 border-4` 
                    : 'border-gray-700 hover:border-gray-600'
                } rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  isSelected ? 'animate-pulse' : ''
                }`}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r ${colors.button} mb-4 sm:mb-6 shadow-lg`}
                    style={{ boxShadow: `0 10px 25px ${colors.text.replace('text-', '')}40` }}
                  >
                    {key === 'basic' && <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                    {key === 'advanced' && <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                    {key === 'premium' && <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                  </div>
                  
                  <h3 className={`text-2xl sm:text-3xl font-black ${colors.text} mb-2 sm:mb-3 tracking-wide`}>{tier.name}</h3>
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                    <Coins className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text}`} />
                    <span className={`text-3xl sm:text-4xl font-black ${colors.text}`}>{tier.credits}</span>
                    <span className="text-gray-400 text-sm sm:text-base">credits</span>
                  </div>
                  
                  <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 font-medium">{tier.description}</p>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 font-semibold">Powered by {tier.model}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 sm:mb-6 text-xs">
                    <div className="bg-gray-700/30 rounded p-1.5 sm:p-2">
                      <span className="text-gray-400">Phases:</span>
                      <div className={`font-bold ${colors.text}`}>{tier.phases}</div>
                    </div>
                    <div className="bg-gray-700/30 rounded p-1.5 sm:p-2">
                      <span className="text-gray-400">Resources:</span>
                      <div className={`font-bold ${colors.text}`}>{tier.resources}</div>
                    </div>
                  </div>
                  
                  <ul className="space-y-1 sm:space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-300 font-medium">
                        <CheckCircle className={`w-3 h-3 sm:w-4 sm:h-4 ${colors.text} flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Learning Plan Form */}
        <div className="bg-gradient-to-br from-violet-900/95 to-fuchsia-900/95 backdrop-blur-lg border-2 border-violet-400/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-2xl shadow-violet-500/20">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8 tracking-wide">Create Your Learning Plan</h2>
          
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/30 border-2 border-red-400/60 rounded-xl flex items-center space-x-3 backdrop-blur-sm shadow-lg shadow-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium text-sm sm:text-base">{error}</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Topic Input */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What would you like to learn? *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={100}
                maxLength={75}
                placeholder="e.g., JavaScript Programming, Digital Marketing, Data Science, Guitar Playing..."
                className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-black/60 border-2 border-violet-300/40 rounded-xl text-white placeholder-violet-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 font-medium backdrop-blur-sm shadow-inner text-sm sm:text-base"
                required
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-cyan-400">💡 Enter up to 3 topics, separated by commas</p>
                <p className="text-xs text-gray-400">{topic.length}/75 characters</p>
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language / Sprache
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-black/60 border-2 border-violet-300/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 font-medium backdrop-blur-sm shadow-inner text-sm sm:text-base"
              >
                {Object.entries(languages).map(([key, lang]) => (
                  <option key={key} value={key} className="bg-gray-800">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget Preference
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value as any)}
                className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-black/60 border-2 border-violet-300/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 font-medium backdrop-blur-sm shadow-inner text-sm sm:text-base"
              >
                {Object.entries(budgetOptions).map(([key, option]) => (
                  <option key={key} value={key} className="bg-gray-800">
                    {option.icon} {option.name} - {option.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Learning Style */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Learning Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {Object.entries(learningStyles).map(([key, style]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setLearningStyle(key as any)}
                    className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-300 ${
                      learningStyle === key
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                        : 'border-violet-300/40 bg-black/20 text-gray-300 hover:border-cyan-400/50'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl mb-1">{style.icon}</div>
                    <div className="text-xs sm:text-sm font-semibold">{style.name}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {learningStyles[learningStyle].description}
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 font-medium">
              <span>Selected: {tiers[selectedTier].name}</span>
              <span>Cost: {tiers[selectedTier].credits} credits</span>
              <span>Your credits: {credits}</span>
              <span>{languages[language].flag} {languages[language].name}</span>
            </div>
            
            <button
              onClick={handleGeneratePlan}
              disabled={loading || !user || credits < tiers[selectedTier].credits}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${getTierColorClasses(selectedTier).button} disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base`}
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Generate Learning Plan</span>
                </span>
              )}
            </button>
          </div>

          {!user && (
            <div className="mt-4 p-3 sm:p-4 bg-yellow-500/20 border border-yellow-500/40 rounded-xl backdrop-blur-sm">
              <p className="text-yellow-300 text-sm font-medium text-center sm:text-left">
                Please <a href="/login" className="underline hover:text-yellow-300">sign in</a> to generate learning plans.
              </p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-center text-gray-400 text-sm px-4">
          <p>All plans include working resource links, practical exercises, and portfolio projects.</p>
        </div>
      </div>
    </div>
  );
};

export default LearningPlansPage;