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
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">
              {goal ? `${goal.title} - Learning Journey` : 'Your Learning Journey'}
            </h1>
          </div>
          
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
            >
              <option value="all">All Activities</option>
              <option value="learning_plan">Learning Plans</option>
              <option value="quiz">Quizzes</option>
              <option value="goal">Goals</option>
              <option value="note">Notes</option>
            </select>
          </div>
        </div>
        
        <p className="text-gray-300">
          {filteredItems.length} activities in your learning timeline
        </p>
      </div>

      {/* Timeline */}
      <div className="p-6">
        {filteredItems.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-cyan-400 to-pink-400"></div>
            
            <div className="space-y-8">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="relative flex items-start space-x-6">
                  {/* Timeline Marker */}
                  <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getItemColor(item.type, item)} shadow-lg`}>
                    <div className="text-white">
                      {getItemIcon(item.type)}
                    </div>
                    
                    {/* Pulse Animation for Recent Items */}
                    {index < 3 && (
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getItemColor(item.type, item)} animate-ping opacity-20`}></div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 min-w-0">
                    <div 
                      className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 hover:border-gray-600 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/10 hover:scale-[1.02]"
                      onClick={() => handleItemClick(item)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Type Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getItemColor(item.type, item)} text-white`}>
                            {item.type.replace('_', ' ').toUpperCase()}
                          </span>
                          
                          {/* Additional Info */}
                          {item.credits_used && (
                            <span className="text-xs text-yellow-400 flex items-center space-x-1">
                              <Zap className="w-3 h-3" />
                              <span>{item.credits_used} credits</span>
                            </span>
                          )}
                          
                          {item.score !== undefined && item.total_questions && (
                            <span className="text-xs text-green-400 flex items-center space-x-1">
                              <Trophy className="w-3 h-3" />
                              <span>{Math.round(item.score / item.total_questions * 100)}%</span>
                            </span>
                          )}
                          
                          {item.status && (
                            <span className={`text-xs flex items-center space-x-1 ${
                              item.status === 'done' ? 'text-green-400' : 'text-blue-400'
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
                            className="text-gray-400 hover:text-white transition-colors"
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
                        <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                          <p className="text-gray-300 text-sm line-clamp-3">
                            {item.type === 'note' ? item.content : 
                             item.content.length > 200 ? item.content.substring(0, 200) + '...' : item.content}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemClick(item);
                            }}
                            className="mt-2 text-purple-400 hover:text-purple-300 text-xs font-medium flex items-center space-x-1"
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
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No activities yet</h3>
            <p className="text-gray-400 mb-6">
              Start creating learning plans or taking quizzes to build your timeline
            </p>
          </div>
        )}
      </div>

      {/* Modal for detailed view */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getItemColor(selectedItem.type, selectedItem)}`}>
                    {getItemIcon(selectedItem.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedItem.title}</h2>
                    <p className="text-gray-400">{formatDate(selectedItem.date)}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
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
                              <h3 className="text-xl font-bold text-white mb-4">Learning Plan Overview</h3>
                              <p className="text-gray-300 mb-4">
                                {planData.overview?.description || planData.description || 'Comprehensive learning plan'}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-700/30 rounded-lg p-3">
                                  <p className="text-sm text-gray-400">Tier</p>
                                  <p className="text-white font-semibold capitalize">{selectedItem.tier}</p>
                                </div>
                                <div className="bg-gray-700/30 rounded-lg p-3">
                                  <p className="text-sm text-gray-400">Credits Used</p>
                                  <p className="text-white font-semibold">{selectedItem.credits_used}</p>
                                </div>
                                <div className="bg-gray-700/30 rounded-lg p-3">
                                  <p className="text-sm text-gray-400">Duration</p>
                                  <p className="text-white font-semibold">{planData.overview?.duration || 'Self-paced'}</p>
                                </div>
                                <div className="bg-gray-700/30 rounded-lg p-3">
                                  <p className="text-sm text-gray-400">Phases</p>
                                  <p className="text-white font-semibold">{planData.phases?.length || 0}</p>
                                </div>
                              </div>
                            </div>
                            
                            {planData.phases && (
                              <div>
                                <h4 className="text-lg font-semibold text-white mb-3">Learning Phases</h4>
                                <div className="space-y-3">
                                  {planData.phases.slice(0, 3).map((phase: any, index: number) => (
                                    <div key={index} className="bg-gray-700/20 rounded-lg p-4">
                                      <h5 className="font-semibold text-white mb-2">{phase.title}</h5>
                                      <p className="text-gray-300 text-sm">{phase.description}</p>
                                    </div>
                                  ))}
                                  {planData.phases.length > 3 && (
                                    <p className="text-gray-400 text-sm">
                                      ... and {planData.phases.length - 3} more phases
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      } catch (error) {
                        return <p className="text-gray-400">Unable to display plan details.</p>;
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
                                <h4 className="text-lg font-semibold text-white mb-3">Sample Questions</h4>
                                <div className="space-y-4">
                                  {quizData.questions.slice(0, 2).map((question: any, index: number) => (
                                    <div key={index} className="bg-gray-700/20 rounded-lg p-4">
                                      <h5 className="font-semibold text-white mb-2">
                                        Q{index + 1}: {question.question}
                                      </h5>
                                      <div className="text-sm text-gray-300">
                                        Correct Answer: {question.options?.[question.correct]}
                                      </div>
                                    </div>
                                  ))}
                                  {quizData.questions.length > 2 && (
                                    <p className="text-gray-400 text-sm">
                                      ... and {quizData.questions.length - 2} more questions
                                    </p>
                                  )}
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
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Details</h3>
                    <p className="text-gray-300 mb-4">{selectedItem.description}</p>
                    {selectedItem.content && (
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <pre className="text-gray-300 text-sm whitespace-pre-wrap">
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
        </div>
      )}
    </div>
  );
};

export default LearningTimeline;