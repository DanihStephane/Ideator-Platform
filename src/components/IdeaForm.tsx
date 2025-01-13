import React, { useState } from 'react';
import { Idea } from '../types';
import { X, Plus, Image } from 'lucide-react';

interface IdeaFormProps {
  idea?: Idea;
  onSave: (idea: Partial<Idea>) => void;
  onClose: () => void;
}

export const IdeaForm: React.FC<IdeaFormProps> = ({ idea, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Idea>>(
    idea || {
      title: '',
      description: '',
      categories: [],
      tags: [],
      status: 'new',
      files: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          files: [
            ...(prev.files || []),
            {
              id: crypto.randomUUID(),
              name: file.name,
              type: file.type,
              dataUrl: reader.result as string,
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {idea ? 'Edit Idea' : 'New Idea'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as Idea['status'],
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categories (comma-separated)
              </label>
              <input
                type="text"
                value={formData.categories?.join(', ')}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    categories: e.target.value
                      .split(',')
                      .map((cat) => cat.trim())
                      .filter(Boolean),
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags?.join(', ')}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">
                  <Image size={20} />
                  <span>Add Files</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept="image/*"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.files?.map((file) => (
                  <div
                    key={file.id}
                    className="relative group w-20 h-20 rounded-lg overflow-hidden"
                  >
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          files: prev.files?.filter((f) => f.id !== file.id),
                        }))
                      }
                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {idea ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};