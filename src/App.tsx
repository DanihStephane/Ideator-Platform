import React, { useState, useEffect } from 'react';
import { Idea } from './types';
import { IdeaCard } from './components/IdeaCard';
import { IdeaForm } from './components/IdeaForm';
import { loadFromLocalStorage, saveToLocalStorage } from './utils/storage';
import { PlusCircle, Search, Lightbulb, BarChart3 } from 'lucide-react';

function App() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    const savedIdeas = loadFromLocalStorage<Idea[]>('ideas');
    if (savedIdeas) {
      setIdeas(savedIdeas);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage('ideas', ideas);
  }, [ideas]);

  const handleSaveIdea = (ideaData: Partial<Idea>) => {
    if (editingIdea) {
      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === editingIdea.id
            ? {
                ...idea,
                ...ideaData,
                updatedAt: new Date().toISOString(),
              }
            : idea
        )
      );
    } else {
      const newIdea: Idea = {
        ...ideaData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archived: false,
      } as Idea;
      setIdeas((prev) => [...prev, newIdea]);
    }
    setShowForm(false);
    setEditingIdea(undefined);
  };

  const handleEditIdea = (idea: Idea) => {
    setEditingIdea(idea);
    setShowForm(true);
  };

  const handleArchiveIdea = (id: string) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, archived: !idea.archived } : idea
      )
    );
  };

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      searchTerm === '' ||
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === '' ||
      idea.categories.includes(selectedCategory);

    const matchesStatus =
      selectedStatus === '' || idea.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus && !idea.archived;
  });

  const categories = Array.from(
    new Set(ideas.flatMap((idea) => idea.categories))
  );

  const getStats = () => {
    const total = ideas.length;
    const completed = ideas.filter((idea) => idea.status === 'completed').length;
    const inProgress = ideas.filter(
      (idea) => idea.status === 'in-progress'
    ).length;
    const archived = ideas.filter((idea) => idea.archived).length;

    return { total, completed, inProgress, archived };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Lightbulb className="text-blue-600" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">Idéator Local</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusCircle size={20} />
              New Idea
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onEdit={handleEditIdea}
                  onArchive={handleArchiveIdea}
                />
              ))}
            </div>

            {filteredIdeas.length === 0 && (
              <div className="text-center py-12">
                <Lightbulb size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No ideas found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters, or create a new idea to get
                  started.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={20} className="text-blue-600" />
                <h2 className="text-lg font-semibold">Statistics</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Ideas</span>
                  <span className="font-semibold">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {stats.completed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-semibold text-yellow-600">
                    {stats.inProgress}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Archived</span>
                  <span className="font-semibold text-gray-600">
                    {stats.archived}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {(showForm || editingIdea) && (
        <IdeaForm
          idea={editingIdea}
          onSave={handleSaveIdea}
          onClose={() => {
            setShowForm(false);
            setEditingIdea(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;