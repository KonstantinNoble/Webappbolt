import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditContext';
import { supabase } from '../lib/supabase';
import { 
  Brain, 
  Zap, 
  Target, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Loader,
  Trophy,
  BarChart3,
  Coins,
  BookOpen,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

const QuizPage = () => {
  const { user } = useAuth();
  const { credits, setCredits } = useCredits();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<'english' | 'german' | 'french' | 'spanish'>('english');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);

  const difficulties = {
    easy: {
      name: 'Generally',
      credits: 50,
      model: 'gpt-4.1-mini',
      color: 'blue',
      description: 'Basic concepts and fundamental knowledge',
      features: ['Simple questions', 'Basic concepts', '5 questions'],
      questionCount: 5
    },
    medium: {
      name: 'Accurate',
      credits: 75,
      model: 'gpt-4.1-mini',
      color: 'green',
      description: 'Applied knowledge and problem-solving',
      features: ['Moderate complexity', 'Applied concepts', '8 questions'],
      questionCount: 8
    },
    hard: {
      name: 'Precise',
      credits: 100,
      model: 'gpt-4.1-mini',
      color: 'purple',
      description: 'Expert-level analysis and synthesis',
      features: ['Complex scenarios', 'Critical thinking', '11 questions'],
      questionCount: 11
    }
  };

  const languages = {
    english: { name: 'English', flag: '🇺🇸' },
    german: { name: 'Deutsch', flag: '🇩🇪' },
    french: { name: 'Français', flag: '🇫🇷' },
    spanish: { name: 'Español', flag: '🇪🇸' }
  };

  const handleGenerateQuiz = async () => {
    if (!user) {
      setError('Please sign in to generate quizzes');
      return;
    }

    if (!topic.trim()) {
      setError('Please enter a topic for the quiz');
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

    const quizCredits = difficulties[selectedDifficulty].credits;
    if (credits < quizCredits) {
      setError(`Insufficient credits. You need ${quizCredits} credits for ${difficulties[selectedDifficulty].name} difficulty.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate quiz using OpenAI
      const languageInstruction = language === 'english' ? '' : `
LANGUAGE REQUIREMENT: Generate the ENTIRE quiz in ${languages[language].name}. All questions, options, explanations, and content must be in ${languages[language].name}.`;

      const prompt = `${languageInstruction}

Create a ${selectedDifficulty} difficulty quiz about: ${topic}

Number of questions: ${difficulties[selectedDifficulty].questionCount}

IMPORTANT: Create exactly ${difficulties[selectedDifficulty].questionCount} multiple-choice questions with 4 options each.
DIFFICULTY REQUIREMENTS:
${selectedDifficulty === 'easy' ? `
- Focus on basic concepts and fundamental knowledge
- Use simple, clear language
- Test recognition and basic understanding
- Provide brief explanations
` : selectedDifficulty === 'medium' ? `
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
  "topic": "${topic}",
  "difficulty": "${selectedDifficulty}",
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
}`;

      // Call OpenAI API
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-quiz`;
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
          difficulty: selectedDifficulty,
          language: language
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error) {
          if (response.status === 429) {
            // Rate limit exceeded
            const retryAfter = errorData.retryAfter ? Math.ceil(errorData.retryAfter / 60) : 60;
            throw new Error(`${errorData.message} Please wait ${retryAfter} minutes before trying again.`);
          } else if (response.status === 402) {
            // Insufficient credits
            throw new Error(`Insufficient credits. You need ${errorData.required_credits || difficulties[selectedDifficulty].credits} credits but only have ${errorData.available_credits || credits}.`);
          } else {
            throw new Error(errorData.error);
          }
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const quizData = await response.json();

      // Sofortige Kreditaktualisierung
      if (quizData.newCredits !== undefined) {
        setCredits(quizData.newCredits);
        console.log('Credits updated immediately to:', quizData.newCredits);
      }

      // Validate the response structure
      if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
        throw new Error('Invalid quiz format received. Please try again.');
      }

      setQuiz(quizData);
      setCurrentQuestion(0);
      setSelectedAnswers(new Array(quizData.questions.length).fill(''));
      setShowResults(false);

      // Reset form
      setTopic('');

    } catch (error) {
      console.error('Error generating quiz:', error);
      if (error.message.includes('authentication')) {
        setError('Authentication error. Please sign in again.');
      } else if (error.message.includes('Server error')) {
        setError('AI service temporarily unavailable. Please try again later.');
      } else if (error.message.includes('Invalid')) {
        setError(error.message);
      } else {
        setError('Failed to generate quiz. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex.toString();
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishQuiz = async () => {
    if (!quiz || !user) return;

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question: any, index: number) => {
      if (parseInt(selectedAnswers[index]) === question.correct) {
        correctAnswers++;
      }
    });

    const score = correctAnswers;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Calculate knowledge level (1-10 scale)
    const knowledgeLevel = Math.max(1, Math.min(10, Math.round((percentage / 100) * 10)));
    
    const getKnowledgeLevelDescription = (level: number) => {
      if (level >= 9) return "Expert level - Outstanding mastery of the subject";
      if (level >= 8) return "Advanced level - Strong understanding with minor gaps";
      if (level >= 7) return "Proficient level - Good grasp of most concepts";
      if (level >= 6) return "Competent level - Solid foundation with room for improvement";
      if (level >= 5) return "Intermediate level - Basic understanding established";
      if (level >= 4) return "Developing level - Learning in progress";
      if (level >= 3) return "Beginner level - Early stage of learning";
      if (level >= 2) return "Novice level - Just getting started";
      return "Starting level - Beginning the learning journey";
    };
    const results = {
      score,
      totalQuestions,
      percentage,
      knowledgeLevel,
      knowledgeLevelDescription: getKnowledgeLevelDescription(knowledgeLevel),
      questions: quiz.questions.map((question: any, index: number) => ({
        question: question.question,
        options: question.options,
        correct: question.correct,
        selected: parseInt(selectedAnswers[index]),
        explanation: question.explanation,
        isCorrect: parseInt(selectedAnswers[index]) === question.correct
      }))
    };

    setQuizResults(results);
    setShowResults(true);

    try {
      // Check if user has reached the 15-item limit and delete oldest if necessary
      const { data: existingQuizzes } = await supabase
        .from('quiz_results')
        .select('id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (existingQuizzes && existingQuizzes.length >= 15) {
        // Delete the oldest quiz
        await supabase
          .from('quiz_results')
          .delete()
          .eq('id', existingQuizzes[0].id);
      }

      // Save quiz results to database
      await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          quiz_content: JSON.stringify({
            title: quiz.title,
            topic: quiz.topic,
            difficulty: quiz.difficulty,
            questions: quiz.questions,
            results: results
          }),
          score: score,
          total_questions: totalQuestions,
          difficulty: selectedDifficulty,
          credits_used: difficulties[selectedDifficulty].credits,
        });

    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };

  const getDifficultyColorClasses = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return {
          bg: 'from-blue-500/10 to-cyan-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-400',
          button: 'from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400'
        };
      case 'medium':
        return {
          bg: 'from-green-500/10 to-emerald-500/10',
          border: 'border-green-500/20',
          text: 'text-green-400',
          button: 'from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400'
        };
      case 'hard':
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

  const resetQuiz = () => {
    setQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizResults(null);
  };

  if (showResults && quizResults) {
    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="relative text-center mb-12">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-yellow-500/5 to-red-500/5 rounded-3xl animate-pulse" />
            
            <div className="relative flex justify-center mb-8">
              <div className={`p-4 rounded-full ${
                quizResults.percentage >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-400 shadow-2xl shadow-green-400/50' :
                quizResults.percentage >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-2xl shadow-yellow-400/50' :
                'bg-gradient-to-r from-red-400 to-pink-400 shadow-2xl shadow-red-400/50'
              } animate-bounce`}>
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8 tracking-tight">
              🎯 Quiz Complete!
            </h1>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
              <div className="text-center group">
                <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-cyan-400/30 rounded-2xl hover:border-cyan-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/20">
                <div className={`text-6xl font-bold ${
                  quizResults.percentage >= 80 ? 'text-green-400' :
                  quizResults.percentage >= 60 ? 'text-yellow-400' :
                  'text-red-400'
                } group-hover:scale-110 transition-transform duration-300`}>
                  {quizResults.percentage}%
                </div>
                <p className="text-cyan-400 font-bold text-lg mt-2">Final Score</p>
                </div>
              </div>
              <div className="text-center group">
                <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-purple-400/30 rounded-2xl hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-400/20">
                <div className="text-4xl font-bold text-white">
                  {quizResults.score}/{quizResults.totalQuestions}
                </div>
                <p className="text-purple-400 font-bold text-lg mt-2">Correct Answers</p>
                </div>
              </div>
              <div className="text-center group">
                <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-yellow-400/30 rounded-2xl hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20">
                  <div className="text-4xl font-bold text-yellow-400">
                    {quizResults.knowledgeLevel}/10
                  </div>
                  <p className="text-yellow-400 font-bold text-lg mt-2">Knowledge Level</p>
                </div>
              </div>
            </div>
            
            {/* Knowledge Evaluation */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-6 mb-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">📊 Knowledge Assessment</h3>
                <div className="mb-4">
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${quizResults.knowledgeLevel * 10}%` }}
                    ></div>
                  </div>
                  <p className="text-yellow-300 font-semibold text-lg">{quizResults.knowledgeLevelDescription}</p>
                </div>
                <p className="text-gray-300 text-sm">
                  Based on your performance in "{quiz.topic}", your current knowledge level is rated {quizResults.knowledgeLevel} out of 10.
                </p>
              </div>
            </div>
            
            {/* Performance Badge */}
            <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full border-2 ${
              quizResults.percentage >= 80 ? 'bg-green-400/20 border-green-400/40 text-green-400' :
              quizResults.percentage >= 60 ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-400' :
              'bg-red-400/20 border-red-400/40 text-red-400'
            } font-bold text-lg shadow-lg`}>
              <Star className="w-5 h-5" />
              <span>
                {quizResults.percentage >= 80 ? '🏆 Excellent Performance!' :
                 quizResults.percentage >= 60 ? '👍 Good Job!' :
                 '💪 Keep Practicing!'}
              </span>
            </div>
          </div>

          {/* Question Results */}
          <div className="space-y-8 mb-12">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <span>Detailed Review</span>
            </h2>
            {quizResults.questions.map((question: any, index: number) => (
              <div key={index} className={`relative group bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-2 ${
                question.isCorrect ? 'border-green-400/30 hover:border-green-400/50' : 'border-red-400/30 hover:border-red-400/50'
              } rounded-2xl p-8 transition-all duration-300 hover:shadow-xl ${
                question.isCorrect ? 'hover:shadow-green-400/20' : 'hover:shadow-red-400/20'
              }`}>
                
                {/* Question Header */}
                <div className="flex items-start space-x-6 mb-6">
                  <div className={`p-2 rounded-full ${
                    question.isCorrect ? 'bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-400/30' : 'bg-gradient-to-r from-red-400 to-pink-400 shadow-lg shadow-red-400/30'
                  }`}>
                    {question.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        question.isCorrect ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
                      }`}>
                        Question {index + 1}
                      </span>
                      <span className={`text-xs font-semibold ${
                        question.isCorrect ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {question.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-6 leading-relaxed group-hover:text-cyan-100 transition-colors">
                      {question.question}
                    </h3>
                    
                    {/* Answer Options */}
                    <div className="space-y-3 mb-6">
                      {question.options.map((option: string, optionIndex: number) => (
                        <div
                          key={optionIndex}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            optionIndex === question.correct
                              ? 'bg-green-500/20 border-green-500/40 text-green-300 shadow-lg shadow-green-400/10'
                              : optionIndex === question.selected && !question.isCorrect
                              ? 'bg-red-500/20 border-red-500/40 text-red-300 shadow-lg shadow-red-400/10'
                              : 'bg-gray-700/30 border-gray-600/30 text-gray-300 hover:border-gray-500/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                optionIndex === question.correct ? 'bg-green-400 text-white' :
                                optionIndex === question.selected && !question.isCorrect ? 'bg-red-400 text-white' :
                                'bg-gray-600 text-gray-300'
                              }`}>
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                              <span className="font-medium">{option}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                            {optionIndex === question.correct && (
                                <div className="flex items-center space-x-1 px-2 py-1 bg-green-400/20 rounded-full">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  <span className="text-xs font-bold text-green-400">CORRECT</span>
                                </div>
                            )}
                            {optionIndex === question.selected && !question.isCorrect && (
                                <div className="flex items-center space-x-1 px-2 py-1 bg-red-400/20 rounded-full">
                                  <XCircle className="w-4 h-4 text-red-400" />
                                  <span className="text-xs font-bold text-red-400">YOUR CHOICE</span>
                                </div>
                            )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-400/20 rounded-lg">
                          <Brain className="w-5 h-5 text-blue-400" />
                        </div>
                        <h4 className="font-black text-blue-400 text-lg">💡 Explanation</h4>
                      </div>
                      <p className="text-gray-300 font-medium leading-relaxed">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="mb-6">
              <p className="text-xl text-gray-300 font-medium">
                {quizResults.percentage >= 80 ? '🎉 Outstanding work! You\'ve mastered this topic!' :
                 quizResults.percentage >= 60 ? '👏 Well done! Consider reviewing the missed questions.' :
                 '📚 Great effort! Review the explanations and try again to improve.'}
              </p>
            </div>
            <button
              onClick={resetQuiz}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-400/30"
            >
              🚀 Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quiz && !showResults) {
    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Header */}
          <div className="relative text-center mb-12">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5 rounded-3xl animate-pulse" />
            
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-2xl shadow-purple-400/50 animate-bounce">
                  <Brain className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4 tracking-tight">
                {quiz.title}
              </h1>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className="px-4 py-2 bg-purple-400/20 border border-purple-400/30 rounded-full text-purple-400 font-bold">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </span>
                <span className="px-4 py-2 bg-cyan-400/20 border border-cyan-400/30 rounded-full text-cyan-400 font-bold">
                  {Math.round(progress)}% Complete
                </span>
              </div>
            
            {/* Progress Bar */}
              <div className="w-full bg-gray-800 rounded-full h-4 shadow-inner">
              <div 
                  className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 h-4 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-2 border-purple-400/30 rounded-3xl p-10 mb-12 hover:border-purple-400/50 transition-all duration-300 shadow-2xl hover:shadow-purple-400/20">
            {/* Question Number Badge */}
            <div className="absolute -top-4 left-8">
              <div className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg shadow-purple-400/30">
                <span className="text-white font-bold text-sm">Q{currentQuestion + 1}</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl shadow-lg shadow-cyan-400/30">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed flex-1">{question.question}</h2>
            </div>
            
            <div className="space-y-4 ml-16">
              {question.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`group w-full p-6 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedAnswers[currentQuestion] === index.toString()
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 text-green-300 shadow-lg shadow-green-400/20'
                      : 'bg-gradient-to-r from-gray-700/30 to-gray-800/30 border-gray-600/30 text-gray-300 hover:from-purple-500/10 hover:to-pink-500/10 hover:border-purple-400/40 hover:text-purple-100 hover:shadow-lg hover:shadow-purple-400/10'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      selectedAnswers[currentQuestion] === index.toString()
                        ? 'bg-green-400 text-white shadow-lg shadow-green-400/30'
                        : 'bg-gray-600 text-gray-300 group-hover:bg-purple-400 group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-400/30'
                    }`}>
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="font-medium text-lg leading-relaxed">{option}</span>
                    {selectedAnswers[currentQuestion] === index.toString() && (
                      <div className="ml-auto">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              ← Previous
            </button>
            </div>
            
            <div className="text-center">
              <div className="px-4 py-2 bg-gray-800/50 border border-gray-600/30 rounded-xl">
                <span className="text-gray-300 font-medium">
                  {selectedAnswers.filter(answer => answer !== '').length} of {quiz.questions.length} answered
            </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswers[currentQuestion]}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl hover:shadow-purple-400/30"
            >
              {currentQuestion === quiz.questions.length - 1 ? '🏁 Finish Quiz' : 'Next →'}
            </button>
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
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg shadow-purple-400/50 animate-pulse">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-4 sm:mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent drop-shadow-2xl">
              AI Quiz Generator
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium px-4">
            Test your knowledge with AI-generated quizzes tailored to your chosen difficulty level.
            Get instant feedback and detailed explanations for every question.
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {Object.entries(difficulties).map(([key, difficulty]) => {
            const colors = getDifficultyColorClasses(key);
            const isSelected = selectedDifficulty === key;
            
            return (
              <div
                key={key}
                onClick={() => setSelectedDifficulty(key as any)}
                className={`cursor-pointer p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-2 ${
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
                    {key === 'easy' && <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                    {key === 'medium' && <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                    {key === 'hard' && <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                  </div>
                  
                  <h3 className={`text-2xl sm:text-3xl font-black ${colors.text} mb-2 sm:mb-3 tracking-wide`}>{difficulty.name}</h3>
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                    <Coins className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text}`} />
                    <span className={`text-3xl sm:text-4xl font-black ${colors.text}`}>{difficulty.credits}</span>
                    <span className="text-gray-400 text-sm sm:text-base">credits</span>
                  </div>
                  
                  <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 font-medium">{difficulty.description}</p>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 font-semibold">Powered by {difficulty.model}</p>
                  
                  <ul className="space-y-1 sm:space-y-2">
                    {difficulty.features.map((feature, index) => (
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

        {/* Quiz Form */}
        <div className="bg-gradient-to-br from-violet-900/95 to-fuchsia-900/95 backdrop-blur-lg border-2 border-violet-400/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-2xl shadow-violet-500/20">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8 tracking-wide">Quiz Settings</h2>
          
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/30 border-2 border-red-400/60 rounded-xl flex items-center space-x-3 backdrop-blur-sm shadow-lg shadow-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium text-sm sm:text-base">{error}</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quiz Topic *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={100}
                maxLength={75}
                placeholder="e.g., JavaScript, History, Biology, Mathematics"
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
          </div>

          {/* Generate Button */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 font-medium">
              <span>Selected: {difficulties[selectedDifficulty].name}</span>
              <span>Cost: {difficulties[selectedDifficulty].credits} credits</span>
              <span>Your credits: {credits}</span>
              <span>{languages[language].flag} {languages[language].name}</span>
              <span>{difficulties[selectedDifficulty].questionCount} Questions</span>
            </div>
            
            <button
              onClick={handleGenerateQuiz}
              disabled={loading || !user || credits < difficulties[selectedDifficulty].credits}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${getDifficultyColorClasses(selectedDifficulty).button} disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base`}
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Generate Quiz</span>
                </span>
              )}
            </button>
          </div>

          {!user && (
            <div className="mt-4 p-3 sm:p-4 bg-yellow-500/20 border border-yellow-500/40 rounded-xl backdrop-blur-sm">
              <p className="text-yellow-300 text-sm font-medium text-center sm:text-left">
                Please <a href="/login" className="underline hover:text-yellow-300">sign in</a> to generate quizzes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;