import React, { useState } from 'react';
import { 
  Target, 
  Calendar, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Plus,
  X,
  Save,
  AlertTriangle
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

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface GoalCardProps {
  goal: Goal;
  onUpdate: (updatedGoal: Goal) => void;
  onDelete: (goalId: string) => void;
  onStatusChange: (goalId: string, newStatus: 'todo' | 'in_progress' | 'done') => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdate, onDelete, onStatusChange }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editDescription, setEditDescription] = useState(goal.description || '');
  const [editDueDate, setEditDueDate] = useState(goal.due_date || '');
  const [subTasks, setSubTasks] = useState<SubTask[]>([
    { id: '1', title: 'Define learning objectives', completed: false },
    { id: '2', title: 'Gather resources', completed: false },
    { id: '3', title: 'Create action plan', completed: false }
  ]);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'border-blue-400/30 bg-blue-400/5';
      case 'in_progress':
        return 'border-yellow-400/30 bg-yellow-400/5';
      case 'done':
        return 'border-green-400/30 bg-green-400/5';
      default:
        return 'border-gray-400/30 bg-gray-400/5';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Circle className="w-4 h-4 text-blue-400" />;
      case 'in_progress':
        return <Target className="w-4 h-4 text-yellow-400" />;
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleSaveEdit = () => {
    const updatedGoal: Goal = {
      ...goal,
      title: editTitle,
      description: editDescription,
      due_date: editDueDate || null,
    };
    onUpdate(updatedGoal);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(goal.title);
    setEditDescription(goal.description || '');
    setEditDueDate(goal.due_date || '');
    setIsEditing(false);
  };

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) return;
    
    const newSubTask: SubTask = {
      id: Date.now().toString(),
      title: newSubTaskTitle,
      completed: false
    };
    
    setSubTasks([...subTasks, newSubTask]);
    setNewSubTaskTitle('');
  };

  const handleToggleSubTask = (subTaskId: string) => {
    setSubTasks(subTasks.map(task => 
      task.id === subTaskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteSubTask = (subTaskId: string) => {
    setSubTasks(subTasks.filter(task => task.id !== subTaskId));
  };

  const completedSubTasks = subTasks.filter(task => task.completed).length;
  const progressPercentage = subTasks.length > 0 ? (completedSubTasks / subTasks.length) * 100 : 0;

  return (
    <>
      <div 
        className={`group bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 rounded-xl p-4 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg ${getStatusColor(goal.status)}`}
        onClick={() => setShowDetails(true)}
      >
        {/* Goal Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon(goal.status)}
            <h3 className={`font-bold text-white ${goal.status === 'done' ? 'line-through opacity-60' : ''}`}>
              {goal.title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setShowDetails(true);
              }}
              className="p-1 bg-gray-700 hover:bg-gray-600 rounded"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(goal.id);
              }}
              className="p-1 bg-red-600 hover:bg-red-500 rounded"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Goal Description */}
        {goal.description && (
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{goal.description}</p>
        )}

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Due Date */}
        {goal.due_date && (
          <div className={`flex items-center space-x-1 text-xs ${
            isOverdue(goal.due_date) && goal.status !== 'done' ? 'text-red-400' : 'text-gray-400'
          }`}>
            <Calendar className="w-3 h-3" />
            <span>Due: {formatDate(goal.due_date)}</span>
            {isOverdue(goal.due_date) && goal.status !== 'done' && (
              <AlertTriangle className="w-3 h-3" />
            )}
          </div>
        )}

        {/* Status Change Buttons */}
        <div className="flex space-x-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {goal.status !== 'todo' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(goal.id, 'todo');
              }}
              className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30"
            >
              To Do
            </button>
          )}
          {goal.status !== 'in_progress' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(goal.id, 'in_progress');
              }}
              className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded hover:bg-yellow-500/30"
            >
              In Progress
            </button>
          )}
          {goal.status !== 'done' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(goal.id, 'done');
              }}
              className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30"
            >
              Done
            </button>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Goal Details</h2>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setIsEditing(false);
                    handleCancelEdit();
                  }}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveEdit}
                      className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-all duration-300"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-gray-300 mb-4">{goal.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className={`px-3 py-1 rounded-full ${
                      goal.status === 'done' ? 'bg-green-500/20 text-green-400' :
                      goal.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {goal.status === 'todo' ? 'To Do' : 
                       goal.status === 'in_progress' ? 'In Progress' : 'Done'}
                    </span>
                    {goal.due_date && (
                      <span>Due: {formatDate(goal.due_date)}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Sub Tasks Section */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Next Steps & Tasks</h4>
                
                {/* Add New Sub Task */}
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={newSubTaskTitle}
                    onChange={(e) => setNewSubTaskTitle(e.target.value)}
                    placeholder="Add a new step..."
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubTask()}
                  />
                  <button
                    onClick={handleAddSubTask}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Sub Tasks List */}
                <div className="space-y-2">
                  {subTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                      <button
                        onClick={() => handleToggleSubTask(task.id)}
                        className={`flex-shrink-0 ${task.completed ? 'text-green-400' : 'text-gray-400'}`}
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                        {task.title}
                      </span>
                      <button
                        onClick={() => handleDeleteSubTask(task.id)}
                        className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Progress Summary */}
                <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-400 font-medium">
                      Progress: {completedSubTasks} of {subTasks.length} steps completed
                    </span>
                    <span className="text-purple-400 font-bold">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoalCard;