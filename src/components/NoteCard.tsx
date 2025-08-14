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
    return content.replace(/#([\w]+)/g, '<span class="text-blue-400 font-medium">#$1</span>');
  };

  const getPreviewContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const tags = extractTags(note.content);

  return (
    <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 hover:border-gray-600 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/10">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-semibold"
            placeholder="Note title..."
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
            placeholder="Write your note... Use #tags to organize"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Note Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2 flex-1">
              <FileText className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <h3 className="font-bold text-white truncate">{note.title}</h3>
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 bg-gray-700 hover:bg-gray-600 rounded"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="p-1 bg-red-600 hover:bg-red-500 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Note Content */}
          <div className="mb-3">
            <div 
              className="text-gray-300 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: highlightTags(
                  showFullContent ? note.content : getPreviewContent(note.content)
                )
              }}
            />
            {note.content.length > 150 && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-purple-400 hover:text-purple-300 text-xs mt-2 font-medium"
              >
                {showFullContent ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30 flex items-center space-x-1"
                >
                  <Hash className="w-2 h-2" />
                  <span>{tag.substring(1)}</span>
                </span>
              ))}
            </div>
          )}

          {/* Note Meta */}
          <div className="flex items-center justify-between text-xs text-gray-400">
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