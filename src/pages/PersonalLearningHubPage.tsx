import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import LearningTimeline from '../components/LearningTimeline';
import GoalCard from '../components/GoalCard';
import NoteCard from '../components/NoteCard';
import { 
  Target, 
  Plus, 
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Trophy,
  Flag,
  Circle,
  CheckCircle2,
  Clock,
  BookOpen,
  Filter,
  Search,
  X,
  Sparkles
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  status: 'todo' | 'in_progress' | 'done';
  created_at: string;
  updated_at: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const PersonalLearningHubPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'board' | 'notes' | 'timeline'>('board');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewGoalInput, setShowNewGoalInput] = useState(false);
  const [showNewNoteInput, setShowNewNoteInput] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [creatingGoal, setCreatingGoal] = useState(false);
  const [creatingNote, setCreatingNote] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;
      setGoals(goalsData || []);

      // Fetch notes
      const { data: notesData, error: notesError } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false });

      if (notesError) throw notesError;
      setNotes(notesData || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Goal functions
  const handleCreateNewGoal = async () => {
    if (!newGoalTitle.trim()) return;

    try {
      setCreatingGoal(true);
      
      const { data: newGoal, error } = await supabase
        .from('user_goals')
        .insert({
          user_id: user!.id,
          title: newGoalTitle,
          description: '',
          status: 'todo',
        })
        .select()
        .single();

      if (error) throw error;

      setGoals([newGoal, ...goals]);
      setNewGoalTitle('');
      setShowNewGoalInput(false);
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setCreatingGoal(false);
    }
  };

  const handleUpdateGoal = async (updatedGoal: Goal) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .update({
          title: updatedGoal.title,
          description: updatedGoal.description,
          due_date: updatedGoal.due_date,
          status: updatedGoal.status,
        })
        .eq('id', updatedGoal.id);

      if (error) throw error;
      
      setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
      
      setGoals(goals.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleStatusChange = async (goalId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .update({ status: newStatus })
        .eq('id', goalId);

      if (error) throw error;
      
      setGoals(goals.map(goal => 
        goal.id === goalId ? { ...goal, status: newStatus } : goal
      ));
    } catch (error) {
      console.error('Error updating goal status:', error);
    }
  };

  // Note functions
  const handleCreateNewNote = async () => {
    if (!newNoteTitle.trim()) return;

    try {
      setCreatingNote(true);
      
      const { data: newNote, error } = await supabase
        .from('user_notes')
        .insert({
          user_id: user!.id,
          title: newNoteTitle,
          content: newNoteContent,
        })
        .select()
        .single();

      if (error) throw error;

      setNotes([newNote, ...notes]);
      setNewNoteTitle('');
      setNewNoteContent('');
      setShowNewNoteInput(false);
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setCreatingNote(false);
    }
  };

  const handleUpdateNote = async (updatedNote: Note) => {
    try {
      const { error } = await supabase
        .from('user_notes')
        .update({
          title: updatedNote.title,
          content: updatedNote.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedNote.id);

      if (error) throw error;
      
      setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Filter functions
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || goal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredNotes = notes.filter(note => {
    return note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           note.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Stats calculation
  const goalStats = {
    total: goals.length,
    todo: goals.filter(g => g.status === 'todo').length,
    in_progress: goals.filter(g => g.status === 'in_progress').length,
    done: goals.filter(g => g.status === 'done').length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse">
              <Target className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Personal Learning Hub
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Organize your learning goals, take notes, and track your progress in one dynamic workspace.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-1 flex space-x-1">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'board'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Target className="w-5 h-5" />
              <span>Goal Board</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'notes'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'timeline'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>Timeline</span>
            </button>
          </div>
        </div>

        {/* Goal Board Tab */}
        {activeTab === 'board' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Flag className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{goalStats.total}</p>
                    <p className="text-gray-400 text-sm">Total Goals</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Circle className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{goalStats.todo}</p>
                    <p className="text-gray-400 text-sm">To Do</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{goalStats.in_progress}</p>
                    <p className="text-gray-400 text-sm">In Progress</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{goalStats.done}</p>
                    <p className="text-gray-400 text-sm">Completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search goals..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="all">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            {/* New Goal Creation */}
            <div className="mb-8">
              {showNewGoalInput ? (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-400/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Create New Goal</h3>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="Enter your goal title..."
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateNewGoal()}
                      autoFocus
                    />
                    <button
                      onClick={handleCreateNewGoal}
                      disabled={!newGoalTitle.trim() || creatingGoal}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
                    >
                      {creatingGoal ? 'Creating...' : 'Create Goal'}
                    </button>
                    <button
                      onClick={() => {
                        setShowNewGoalInput(false);
                        setNewGoalTitle('');
                      }}
                      className="px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={() => setShowNewGoalInput(true)}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-400/30"
                  >
                    <span className="flex items-center space-x-3">
                      <Plus className="w-6 h-6" />
                      <span>Create New Goal</span>
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Goals Kanban Board */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* To Do Column */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Circle className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-blue-400">To Do</h3>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    {filteredGoals.filter(g => g.status === 'todo').length}
                  </span>
                </div>
                <div className="space-y-4">
                  {filteredGoals.filter(goal => goal.status === 'todo').map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onUpdate={handleUpdateGoal}
                      onDelete={handleDeleteGoal}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-bold text-yellow-400">In Progress</h3>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                    {filteredGoals.filter(g => g.status === 'in_progress').length}
                  </span>
                </div>
                <div className="space-y-4">
                  {filteredGoals.filter(goal => goal.status === 'in_progress').map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onUpdate={handleUpdateGoal}
                      onDelete={handleDeleteGoal}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>

              {/* Done Column */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-bold text-green-400">Done</h3>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    {filteredGoals.filter(g => g.status === 'done').length}
                  </span>
                </div>
                <div className="space-y-4">
                  {filteredGoals.filter(goal => goal.status === 'done').map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onUpdate={handleUpdateGoal}
                      onDelete={handleDeleteGoal}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Empty State */}
            {goals.length === 0 && (
              <div className="text-center py-16">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No goals yet</h3>
                <p className="text-gray-400 mb-6">
                  Create your first goal to start organizing your learning journey.
                </p>
                <button
                  onClick={() => setShowNewGoalInput(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-lg font-semibold transition-all duration-300"
                >
                  Create First Goal
                </button>
              </div>
            )}
          </>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <>
            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* New Note Creation */}
            <div className="mb-8">
              {showNewNoteInput ? (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-400/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Create New Note</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      placeholder="Note title..."
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      autoFocus
                    />
                    <textarea
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Write your note... Use #tags to organize"
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                    />
                    <div className="flex space-x-4">
                      <button
                        onClick={handleCreateNewNote}
                        disabled={!newNoteTitle.trim() || creatingNote}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
                      >
                        {creatingNote ? 'Creating...' : 'Create Note'}
                      </button>
                      <button
                        onClick={() => {
                          setShowNewNoteInput(false);
                          setNewNoteTitle('');
                          setNewNoteContent('');
                        }}
                        className="px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={() => setShowNewNoteInput(true)}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-400/30"
                  >
                    <span className="flex items-center space-x-3">
                      <Plus className="w-6 h-6" />
                      <span>Create New Note</span>
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Notes Grid */}
            {filteredNotes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onUpdate={handleUpdateNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No notes yet</h3>
                <p className="text-gray-400 mb-6">
                  Create your first note to start capturing your learning insights.
                </p>
                <button
                  onClick={() => setShowNewNoteInput(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-lg font-semibold transition-all duration-300"
                >
                  Create First Note
                </button>
              </div>
            )}
          </>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <LearningTimeline />
        )}
      </div>
    </div>
  );
};

export default PersonalLearningHubPage;