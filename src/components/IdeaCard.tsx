import React from 'react';
import { Idea } from '../types';
import { Pencil, Archive, Clock, Tag } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onArchive: (id: string) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onEdit, onArchive }) => {
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{idea.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(idea)}
            className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onArchive(idea.id)}
            className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"
          >
            <Archive size={18} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{idea.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {idea.categories.map((category) => (
          <span
            key={category}
            className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm"
          >
            {category}
          </span>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {idea.tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-sm"
          >
            <Tag size={14} />
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span className={`px-3 py-1 rounded-full ${statusColors[idea.status]}`}>
          {idea.status.replace('-', ' ')}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {new Date(idea.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};