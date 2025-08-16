import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  BookOpen, 
  HelpCircle, 
  Target, 
  FileText,
  Calendar,
  Clock,
  Star,
  Trophy,
  Zap,
  Award,
  CheckCircle,
  Circle,
  Filter,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface TimelineItem {
  id: string;
  type: 'learning_plan' | 'quiz' | 'goal' | 'note';
  title: string;
  description?: string;
  date: string;
  status?: string;
  score?: number;
  total_questions?: number;
  difficulty?: string;
  tier?: string;
  credits_used?: number;
  content?: string;
}

interface LearningTimelineProps {
  goal?: {
    id: string;
    title: string;
    description: string;
    due_date: string | null;
    status: 'todo' | 'in_progress' | 'done';
    created_at: string;
    updated_at: string;
  };
  onGoalUpdate?: (updatedGoal: any) => void;
}

const LearningTimeline: React.FC<LearningTimelineProps> = ({ goal, onGoalUpdate }) => {
  const { user } = useAuth();
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'learning_plan' | 'quiz' | 'goal' | 'note'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchTimelineData();
    }
  }, [user, goal]);

  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      const items: TimelineItem[] = [];

      // Fetch learning plans
      const { data: learningPlans } = await supabase
        .from('learning_plans')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (learningPlans) {
        items.push(...learningPlans.map(plan => ({
          id: plan.id,
          type: 'learning_plan' as const,
          title: plan.title || 'Learning Plan',
          description: `${plan.tier} tier learning plan`,
          date: plan.created_at,
          tier: plan.tier,
          credits_used: plan.credits_used,
          content: plan.content,
        })));
      }

      // Fetch quiz results
      const { data: quizResults } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (quizResults) {
        items.push(...quizResults.map(quiz => ({
          id: quiz.id,
          type: 'quiz' as const,
          title: `${quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)} Quiz`,
          description: `Score: ${quiz.score}/${quiz.total_questions} (${Math.round(quiz.score / quiz.total_questions * 100)}%)`,
          date: quiz.created_at,
          score: quiz.score,
          total_questions: quiz.total_questions,
          difficulty: quiz.difficulty,
          credits_used: quiz.credits_used,
          content: quiz.quiz_content,
        })));
      }

      // Fetch goals (if not in single goal mode)
      if (!goal) {
        const { data: goals } = await supabase
          .from('user_goals')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (goals) {
          items.push(...goals.map(g => ({
            id: g.id,
            type: 'goal' as const,
            title: g.title,
            description: g.description || 'Learning goal',
            date: g.created_at,
            status: g.status,
          })));
        }
      }

      // Fetch notes
      const { data: notes } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (notes) {
        items.push(...notes.map(note => ({
          id: note.id,
          type: 'note' as const,
          title: note.title,
          description: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : ''),
          date: note.created_at,
          content: note.content,
        })));
      }

      // Sort by date (newest first)
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTimelineItems(items);
    } catch (error) {
      console.error('Error fetching timeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = timelineItems.filter(item => 
    filter === 'all' || item.type === filter
  );

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'learning_plan':
        return <BookOpen className="w-5 h-5" />;
      case 'quiz':
        return <HelpCircle className="w-5 h-5" />;
      case 'goal':
        return <Target className="w-5 h-5" />;
      case 'note':
        return <FileText className="w-5 h-5" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  const getItemColor = (type: string, item?: TimelineItem) => {
    switch (type) {
      case 'learning_plan':
        return item?.tier === 'premium' ? 'from-purple-500 to-pink-500' :
               item?.tier === 'advanced' ? 'from-green-500 to-cyan-500' :
               'from-blue-500 to-cyan-500';
      case 'quiz':
        const percentage = item?.score && item?.total_questions ? 
          (item.score / item.total_questions) * 100 : 0;
        return percentage >= 80 ? 'from-green-500 to-emerald-500' :
               percentage >= 60 ? 'from-yellow-500 to-orange-500' :
               'from-red-500 to-pink-500';
      case 'goal':
        return item?.status === 'done' ? 'from-green-500 to-emerald-500' :
               'from-purple-500 to-indigo-500';
      case 'note':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleItemClick = (item: TimelineItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {goal ? `${goal.title}` : 'Your Learning Journey'}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Track your progress and achievements
                </p>
              </div>
            </div>
            
            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Activities</option>
                <option value="learning_plan">Learning Plans</option>
                <option value="quiz">Quizzes</option>
                <option value="goal">Goals</option>
                <option value="note">Notes</option>
              </select>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              {filteredItems.length} activities in your learning timeline
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredItems.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 hidden sm:block"></div>
            
            <div className="space-y-8">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="relative flex items-start space-x-0 sm:space-x-6">
                  {/* Timeline Marker */}
                  <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getItemColor(item.type, item)} shadow-lg hidden sm:flex`}>
                    <div className="text-white">
                      {getItemIcon(item.type)}
                    </div>
                    
                    {/* Pulse Animation for Recent Items */}
                    {index < 3 && (
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getItemColor(item.type, item)} animate-ping opacity-20`}></div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <div 
                      className="group bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:scale-[1.02] shadow-sm"
                      onClick={() => handleItemClick(item)}
                    >
                      {/* Mobile Icon (visible on small screens) */}
                      <div className={`flex sm:hidden items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${getItemColor(item.type, item)} mb-4`}>
                        <div className="text-white">
                          {getItemIcon(item.type)}
                        </div>
                      </div>

                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-gray-500 ml-4">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">{formatDate(item.date)}</span>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap gap-2">
                          {/* Type Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getItemColor(item.type, item)} text-white`}>
                            {item.type.replace('_', ' ').toUpperCase()}
                          </span>
                          
                          {/* Additional Info */}
                          {item.credits_used && (
                            <span className="text-xs text-yellow-600 flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                              <Zap className="w-3 h-3" />
                              <span>{item.credits_used} credits</span>
                            </span>
                          )}
                          
                          {item.score !== undefined && item.total_questions && (
                            <span className="text-xs text-green-600 flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full">
                              <Trophy className="w-3 h-3" />
                              <span>{Math.round(item.score / item.total_questions * 100)}%</span>
                            </span>
                          )}
                          
                          {item.status && (
                            <span className={`text-xs flex items-center space-x-1 px-2 py-1 rounded-full ${
                              item.status === 'done' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'
                            }`}>
                              {item.status === 'done' ? <CheckCircle className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                              <span>{item.status.replace('_', ' ')}</span>
                            </span>
                          )}
                        </div>
                        
                        {/* Expand/Collapse for content preview */}
                        {item.content && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpanded(item.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                          >
                            {expandedItems.has(item.id) ? 
                              <ChevronUp className="w-4 h-4" /> : 
                              <ChevronDown className="w-4 h-4" />
                            }
                          </button>
                        )}
                      </div>
                      
                      {/* Expanded Content Preview */}
                      {expandedItems.has(item.id) && item.content && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-700 text-sm line-clamp-3">
                            {item.type === 'note' ? item.content : 
                             item.content.length > 200 ? item.content.substring(0, 200) + '...' : item.content}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemClick(item);
                            }}
                            className="mt-2 text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center space-x-1"
                          >
                            <span>View Full Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No activities yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start creating learning plans or taking quizzes to build your timeline
            </p>
          </div>
        )}
      </div>

      {/* Modal for detailed view */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${getItemColor(selectedItem.type, selectedItem)}`}>
                    <div className="text-white">
                      {getItemIcon(selectedItem.type)}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
                    <p className="text-gray-600">{formatDate(selectedItem.date)}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {selectedItem.type === 'learning_plan' && selectedItem.content ? (
                <div>
                  {(() => {
                    try {
                      const planData = JSON.parse(selectedItem.content);
                      return (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Plan Overview</h3>
                            <p className="text-gray-700 mb-4">
                              {planData.overview?.description || planData.description || 'Comprehensive learning plan'}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-sm text-gray-600">Tier</p>
                                <p className="text-gray-900 font-semibold capitalize">{selectedItem.tier}</p>
                              </div>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-sm text-gray-600">Credits Used</p>
                                <p className="text-gray-900 font-semibold">{selectedItem.credits_used}</p>
                              </div>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-sm text-gray-600">Duration</p>
                                <p className="text-gray-900 font-semibold">{planData.overview?.duration || 'Self-paced'}</p>
                              </div>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-sm text-gray-600">Phases</p>
                                <p className="text-gray-900 font-semibold">{planData.phases?.length || 0}</p>
                              </div>
                            </div>
                          </div>
                          
                          {planData.phases && (
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-3">Learning Phases</h4>
                              <div className="space-y-3">
                                {planData.phases.slice(0, 3).map((phase: any, index: number) => (
                                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h5 className="font-semibold text-gray-900 mb-2">{phase.title}</h5>
                                    <p className="text-gray-700 text-sm">{phase.description}</p>
                                  </div>
                                ))}
                                {planData.phases.length > 3 && (
                                  <p className="text-gray-600 text-sm">
                                    ... and {planData.phases.length - 3} more phases
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    } catch (error) {
                      return <p className="text-gray-600">Unable to display plan details.</p>;
                    }
                  })()}
                </div>
              ) : selectedItem.type === 'quiz' && selectedItem.content ? (
                <div>
                  {(() => {
                    try {
                      const quizData = JSON.parse(selectedItem.content);
                      return (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Quiz Results</h3>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                                <p className="text-sm text-gray-600">Score</p>
                                <p className="text-2xl font-bold text-green-600">{selectedItem.score}/{selectedItem.total_questions}</p>
                              </div>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                                <p className="text-sm text-gray-600">Percentage</p>
                                <p className="text-2xl font-bold text-blue-600">{Math.round((selectedItem.score || 0) / (selectedItem.total_questions || 1) * 100)}%</p>
                              </div>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                                <p className="text-sm text-gray-600">Difficulty</p>
                                <p className="text-lg font-bold text-purple-600 capitalize">{selectedItem.difficulty}</p>
                              </div>
                            </div>
                          </div>
                          
                          {quizData.questions && (
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-3">Sample Questions</h4>
                              <div className="space-y-4">
                                {quizData.questions.slice(0, 2).map((question: any, index: number) => (
                                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h5 className="font-semibold text-gray-900 mb-2">
                                      Q{index + 1}: {question.question}
                                    </h5>
                                    <div className="text-sm text-gray-700">
                                      Correct Answer: {question.options?.[question.correct]}
                                    </div>
                                  </div>
                                ))}
                                {quizData.questions.length > 2 && (
                                  <p className="text-gray-600 text-sm">
                                    ... and {quizData.questions.length - 2} more questions
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    } catch (error) {
                      return <p className="text-gray-600">Unable to display quiz details.</p>;
                    }
                  })()}
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Details</h3>
                  <p className="text-gray-700 mb-4">{selectedItem.description}</p>
                  {selectedItem.content && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <pre className="text-gray-700 text-sm whitespace-pre-wrap">
                        {selectedItem.content.length > 500 ? 
                          selectedItem.content.substring(0, 500) + '...' : 
                          selectedItem.content
                        }
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningTimeline;























