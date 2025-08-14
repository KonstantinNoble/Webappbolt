import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditContext';
import { supabase } from '../lib/supabase';
import { 
  BookOpen, 
  HelpCircle, 
  TrendingUp, 
  Calendar, 
  Coins,
  Star,
  Target,
  Clock,
  BarChart3,
  ExternalLink,
  X,
  XCircle,
  CheckCircle,
  Trophy,
  Zap,
  Award,
  ArrowRight
} from 'lucide-react';

interface RecentActivity {
  id: string;
  type: 'learning_plan' | 'quiz';
  title: string;
  created_at: string;
  credits_used: number;
  tier?: string;
  score?: number;
  total_questions?: number;
  content?: string;
  difficulty?: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const { credits } = useCredits();
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [stats, setStats] = useState({
    totalLearningPlans: 0,
    totalQuizzes: 0,
    averageScore: 0,
    creditsUsedThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<RecentActivity | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent learning plans
      const { data: learningPlans } = await supabase
        .from('learning_plans')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(15);

      // Fetch recent quiz results
      const { data: quizResults } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(15);

      // Combine and sort recent activity
      const activity: RecentActivity[] = [];
      
      if (learningPlans) {
        activity.push(...learningPlans.map(plan => ({
          id: plan.id,
          type: 'learning_plan' as const,
          title: plan.title || 'Learning Plan',
          created_at: plan.created_at,
          credits_used: plan.credits_used,
          tier: plan.tier,
          content: plan.content,
        })));
      }

      if (quizResults) {
        activity.push(...quizResults.map(quiz => ({
          id: quiz.id,
          type: 'quiz' as const,
          title: `${quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)} Quiz` || 'Quiz',
          created_at: quiz.created_at,
          credits_used: quiz.credits_used,
          score: quiz.score,
          total_questions: quiz.total_questions,
          content: quiz.quiz_content,
          difficulty: quiz.difficulty,
        })));
      }

      activity.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentActivity(activity.slice(0, 5));

      // Calculate stats
      const totalLearningPlans = learningPlans?.length || 0;
      const totalQuizzes = quizResults?.length || 0;
      const averageScore = quizResults?.length 
        ? Math.round((quizResults.reduce((sum, quiz) => sum + (quiz.score / quiz.total_questions * 100), 0) / quizResults.length))
        : 0;
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const creditsUsedThisMonth = activity
        .filter(item => new Date(item.created_at) >= thisMonth)
        .reduce((sum, item) => sum + item.credits_used, 0);

      setStats({
        totalLearningPlans,
        totalQuizzes,
        averageScore,
        creditsUsedThisMonth,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewItem = (item: RecentActivity) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'basic': return 'text-blue-400';
      case 'advanced': return 'text-green-400';
      case 'premium': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-gray-400 text-lg">Continue your learning journey with AI-powered education</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Credits */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-yellow-400">{credits}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Available Credits</h3>
            <p className="text-gray-400 text-sm">Resets monthly</p>
          </div>

          {/* Learning Plans */}
          <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-400 to-cyan-400 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-400">{stats.totalLearningPlans}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Learning Plans</h3>
            <p className="text-gray-400 text-sm">Total created</p>
          </div>

          {/* Quizzes */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-purple-400">{stats.totalQuizzes}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Quizzes Taken</h3>
            <p className="text-gray-400 text-sm">All time</p>
          </div>

          {/* Average Score */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-cyan-400">{stats.averageScore}%</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Average Score</h3>
            <p className="text-gray-400 text-sm">Quiz performance</p>
          </div>
        </div>

        {/* Modal for viewing item details */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{selectedItem.title}</h2>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-300"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-400 mt-2">{formatDate(selectedItem.created_at)}</p>
              </div>
              
              <div className="p-6">
                {selectedItem.type === 'learning_plan' ? (
                  <div>
                    {selectedItem.content ? (
                      <div className="space-y-6">
                        {(() => {
                          try {
                            const planData = JSON.parse(selectedItem.content);
                            
                            return (
                              <div>
                                <div className="mb-6">
                                  <h3 className="text-xl font-bold text-white mb-4">Overview</h3>
                                  {planData.overview?.description ? (
                                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">{planData.overview.description}</p>
                                  ) : planData.description ? (
                                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">{planData.description}</p>
                                  ) : (
                                    <p className="text-gray-300 mb-6">Learning plan for: {planData.topic || planData.title || 'Unknown topic'}</p>
                                  )}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-700/30 rounded-lg p-3">
                                      <p className="text-sm text-gray-400">Duration</p>
                                      <p className="text-white font-semibold">{planData.overview?.duration || planData.duration || 'Not specified'}</p>
                                    </div>
                                    <div className="bg-gray-700/30 rounded-lg p-3">
                                      <p className="text-sm text-gray-400">Level</p>
                                      <p className="text-white font-semibold">{planData.overview?.level || planData.level || planData.tier || 'Not specified'}</p>
                                    </div>
                                    <div className="bg-gray-700/30 rounded-lg p-3">
                                      <p className="text-sm text-gray-400">Style</p>
                                      <p className="text-white font-semibold">{planData.overview?.style || planData.learningStyle || 'Not specified'}</p>
                                    </div>
                                    <div className="bg-gray-700/30 rounded-lg p-3">
                                      <p className="text-sm text-gray-400">Budget</p>
                                      <p className="text-white font-semibold">{planData.overview?.budget || planData.budget || 'Not specified'}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {planData.phases && (
                                  <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Learning Phases</h3>
                                    <div className="space-y-4">
                                      {planData.phases.map((phase: any, index: number) => (
                                        <div key={index} className="bg-gray-700/20 rounded-lg p-4">
                                          <h4 className="text-lg font-semibold text-white mb-2">{phase.title || `Phase ${index + 1}`}</h4>
                                          <p className="text-gray-300 mb-3">{phase.description || 'No description available'}</p>
                                          {phase.resources && (
                                            <div className="mb-3">
                                              <p className="text-sm font-medium text-gray-400 mb-2">Resources:</p>
                                              <div className="space-y-2">
                                                {phase.resources.map((resource: any, resIndex: number) => (
                                                  <div key={resIndex} className="bg-gray-800/50 rounded p-3">
                                                    <div className="text-sm font-medium text-white">
                                                      {resource.title || `Resource ${resIndex + 1}`}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                      {resource.provider || resource.type || 'Resource'} • {resource.price || resource.cost || 'Free'}
                                                    </div>
                                                    {resource.url && (
                                                      <a 
                                                        href={resource.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 mt-1 transition-colors duration-200"
                                                      >
                                                        <span>Visit Resource</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                      </a>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          } catch (error) {
                            console.error('Error parsing learning plan content:', error);
                            return (
                              <div className="space-y-4">
                                <p className="text-red-400">Error parsing learning plan data.</p>
                                <details className="bg-gray-800/50 rounded-lg p-4">
                                  <summary className="text-gray-300 cursor-pointer">Show raw data</summary>
                                  <pre className="text-gray-400 text-sm mt-2 whitespace-pre-wrap overflow-auto">
                                    {selectedItem.content}
                                  </pre>
                                </details>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    ) : (
                      <p className="text-gray-400">No content available for this learning plan.</p>
                    )}
                  </div>
                ) : (
                  <div>
                    {selectedItem.content ? (
                      <div className="space-y-6">
                        {(() => {
                          try {
                            const quizData = JSON.parse(selectedItem.content);
                            return (
                              <div>
                                <div className="mb-6">
                                  <h3 className="text-xl font-bold text-white mb-4">Quiz Results</h3>
                                  <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                                      <p className="text-sm text-gray-400">Score</p>
                                      <p className="text-2xl font-bold text-green-400">{selectedItem.score}/{selectedItem.total_questions}</p>
                                    </div>
                                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                                      <p className="text-sm text-gray-400">Percentage</p>
                                      <p className="text-2xl font-bold text-cyan-400">{Math.round((selectedItem.score || 0) / (selectedItem.total_questions || 1) * 100)}%</p>
                                    </div>
                                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                                      <p className="text-sm text-gray-400">Difficulty</p>
                                      <p className="text-lg font-bold text-purple-400 capitalize">{selectedItem.difficulty}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {quizData.questions && (
                                  <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Questions</h3>
                                    <div className="space-y-4">
                                      {quizData.questions.map((question: any, index: number) => (
                                        <div key={index} className="bg-gray-700/20 rounded-lg p-4">
                                          <h4 className="text-lg font-semibold text-white mb-3">
                                            Question {index + 1}: {question.question}
                                          </h4>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {question.options?.map((option: string, optIndex: number) => (
                                              <div
                                                key={optIndex}
                                                className={`p-2 rounded text-sm ${
                                                  optIndex === question.correct
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-gray-600/30 text-gray-300'
                                                }`}
                                              >
                                                {option}
                                                {optIndex === question.correct && (
                                                  <span className="ml-2">✓ Correct</span>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                          {question.explanation && (
                                            <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                                              <p className="text-blue-400 text-sm">
                                                <strong>Explanation:</strong> {question.explanation}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          } catch (error) {
                            return <p className="text-gray-400">Unable to display quiz details.</p>;
                          }
                        })()}
                      </div>
                    ) : (
                      <p className="text-gray-400">No content available for this quiz.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Create Learning Plan */}
          <Link 
            to="/learning-plans"
            className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-400/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-green-400/10"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-400 to-cyan-400 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Create Learning Plan</h3>
                <p className="text-gray-400">Generate AI-powered learning roadmaps</p>
              </div>
            </div>
          </Link>

          {/* Take Quiz */}
          <Link 
            to="/quiz"
            className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-400/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/10"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Take a Quiz</h3>
                <p className="text-gray-400">Test your knowledge with AI quizzes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-300">Adaptive difficulty</span>
              <span className="text-gray-300">Instant feedback</span>
              <span className="text-purple-400">Variable credits</span>
            </div>
          </Link>
        </div>

        {/* Learning Hub Quick Action */}
        <div className="mb-8">
          <Link 
            to="/learning-hub"
            className="group block p-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-pink-400/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-400/10"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">Learning Hub</h3>
                <p className="text-gray-400">Organize your notes and track your learning goals</p>
              </div>
              <div className="text-pink-400">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <Link 
              to="/history" 
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-300"
            >
              View All
            </Link>
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                  <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    item.type === 'learning_plan' 
                      ? 'bg-gradient-to-r from-green-400 to-cyan-400' 
                      : 'bg-gradient-to-r from-purple-400 to-pink-400'
                  }`}>
                    {item.type === 'learning_plan' ? (
                      <BookOpen className="w-5 h-5 text-white" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(item.created_at)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Coins className="w-3 h-3" />
                        <span>{item.credits_used} credits</span>
                      </span>
                      {item.tier && (
                        <span className={`capitalize ${getTierColor(item.tier)}`}>
                          {item.tier}
                        </span>
                      )}
                      {item.score !== undefined && item.total_questions && (
                        <span className="text-cyan-400">
                          Score: {item.score}/{item.total_questions} ({Math.round(item.score / item.total_questions * 100)}%)
                        </span>
                      )}
                    </div>
                  </div>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => handleViewItem(item)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">No activity yet</h3>
              <p className="text-gray-400 mb-6">Start creating learning plans or taking quizzes to see your progress here</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  to="/learning-plans"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 rounded-lg font-medium transition-all duration-300"
                >
                  Create Learning Plan
                </Link>
                <Link 
                  to="/quiz"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-lg font-medium transition-all duration-300"
                >
                  Take Quiz
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;