import React, { useState } from 'react';
import { 
  FileText, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  Hash
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface NoteCardProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
  onDelete: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [showFullContent, setShowFullContent] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSave = () => {
    const updatedNote: Note = {
      ...note,
      title: editTitle,
      content: editContent,
      updated_at: new Date().toISOString(),
    };
    onUpdate(updatedNote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const extractTags = (content: string) => {
    const tagRegex = /#[\w]+/g;
    return content.match(tagRegex) || [];
  };

  const highlightTags = (content: string) => {
    return content.replace(/#([\w]+)/g, '<span class="text-blue-600 font-medium">#$1</span>');
  };

  const getPreviewContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const tags = extractTags(note.content);

  return (
    <div className="group bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Note title..."
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your note... Use #tags to organize"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-sm"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Note Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 truncate">{note.title}</h3>
            </div>
            
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          {/* Note Content */}
          <div className="mb-4">
            <div 
              className="text-gray-700 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: highlightTags(
                  showFullContent ? note.content : getPreviewContent(note.content)
                )
              }}
            />
            {note.content.length > 150 && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-blue-600 hover:text-blue-700 text-xs mt-2 font-medium transition-colors"
              >
                {showFullContent ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200 flex items-center space-x-1"
                >
                  <Hash className="w-3 h-3" />
                  <span>{tag.substring(1)}</span>
                </span>
              ))}
            </div>
          )}

          {/* Note Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Created: {formatDate(note.created_at)}</span>
            </div>
            {note.updated_at !== note.created_at && (
              <span>Updated: {formatDate(note.updated_at)}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NoteCard;


















