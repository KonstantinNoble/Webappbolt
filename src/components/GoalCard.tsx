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
        return 'border-blue-200 bg-blue-50';
      case 'in_progress':
        return 'border-yellow-200 bg-yellow-50';
      case 'done':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Circle className="w-4 h-4 text-blue-600" />;
      case 'in_progress':
        return <Target className="w-4 h-4 text-yellow-600" />;
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-600" />;
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
        className={`group bg-white border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] ${getStatusColor(goal.status)}`}
        onClick={() => setShowDetails(true)}
      >
        {/* Goal Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(goal.status)}
            <h3 className={`font-bold text-gray-900 ${goal.status === 'done' ? 'line-through opacity-60' : ''}`}>
              {goal.title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setShowDetails(true);
              }}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(goal.id);
              }}
              className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {/* Goal Description */}
        {goal.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{goal.description}</p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Due Date */}
        {goal.due_date && (
          <div className={`flex items-center space-x-2 text-xs mb-4 ${
            isOverdue(goal.due_date) && goal.status !== 'done' ? 'text-red-600' : 'text-gray-500'
          }`}>
            <Calendar className="w-4 h-4" />
            <span>Due: {formatDate(goal.due_date)}</span>
            {isOverdue(goal.due_date) && goal.status !== 'done' && (
              <AlertTriangle className="w-4 h-4" />
            )}
          </div>
        )}

        {/* Status Change Buttons */}
        <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {goal.status !== 'todo' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(goal.id, 'todo');
              }}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200 font-medium transition-colors"
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
              className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-lg hover:bg-yellow-200 font-medium transition-colors"
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
              className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200 font-medium transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Goal Details</h2>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setIsEditing(false);
                    handleCancelEdit();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveEdit}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-gray-600 mb-4">{goal.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className={`px-3 py-1 rounded-full font-medium ${
                      goal.status === 'done' ? 'bg-green-100 text-green-700' :
                      goal.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
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
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Next Steps & Tasks</h4>
                
                {/* Add New Sub Task */}
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={newSubTaskTitle}
                    onChange={(e) => setNewSubTaskTitle(e.target.value)}
                    placeholder="Add a new step..."
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubTask()}
                  />
                  <button
                    onClick={handleAddSubTask}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Sub Tasks List */}
                <div className="space-y-2">
                  {subTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <button
                        onClick={() => handleToggleSubTask(task.id)}
                        className={`flex-shrink-0 ${task.completed ? 'text-green-600' : 'text-gray-400'}`}
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </span>
                      <button
                        onClick={() => handleDeleteSubTask(task.id)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Progress Summary */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700 font-medium">
                      Progress: {completedSubTasks} of {subTasks.length} steps completed
                    </span>
                    <span className="text-blue-700 font-bold">
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










