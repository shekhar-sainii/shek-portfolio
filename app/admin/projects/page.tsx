'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, Plus, Loader, Eye } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { ProjectCard } from '@/components/project-card';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveLink?: string;
  githubLink?: string;
  featured: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    liveLink: '',
    githubLink: '',
    featured: false,
  });
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const checkAuth = () => {
      if (!localStorage.getItem('adminSecret')) {
        router.push('/admin');
        return;
      }
      fetchProjects();
    };
    checkAuth();
  }, [router]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const secret = localStorage.getItem('adminSecret');
      const res = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${secret}` },
      });
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const secret = localStorage.getItem('adminSecret');
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    try {
      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secret}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        fetchProjects();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const secret = localStorage.getItem('adminSecret');
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${secret}` },
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: project.tags.join(', '),
      liveLink: project.liveLink || '',
      githubLink: project.githubLink || '',
      featured: project.featured,
    });
    setEditingId(project._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      tags: '',
      liveLink: '',
      githubLink: '',
      featured: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className={`animate-spin ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${
            theme === 'dark' ? 'from-blue-400 via-purple-400 to-pink-400' : 'from-blue-600 via-purple-600 to-pink-600'
          } bg-clip-text text-transparent mb-2`}>
            Projects
          </h1>
          <p className={theme === 'dark' ? "text-slate-400" : "text-slate-600"}>Showcase your best work and achievements</p>
        </div>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 hover:scale-105"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {/* Form & Preview */}
      {showForm && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slideDown">
          {/* Form Column */}
          <div className={`rounded-xl border ${
            theme === 'dark' 
              ? 'border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl shadow-blue-500/5' 
              : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'
          } p-8 backdrop-blur-xl`}>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-8`}>
              {editingId ? '✏️ Edit Project' : '✨ New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} mb-2`}>Project Title</label>
                  <input
                    type="text"
                    placeholder="My Awesome Project"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className={`w-full px-4 py-3 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} mb-2`}>Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                    className={`w-full px-4 py-3 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} mb-2`}>Description</label>
                <textarea
                  placeholder="Describe your project..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} mb-2`}>Tags</label>
                  <input
                    type="text"
                    placeholder="React, Next.js, Tailwind"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} mb-2`}>Live Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.liveLink}
                    onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} mb-2`}>GitHub Link</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                  />
                </div>
                <label className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                } border transition cursor-pointer group`}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                  />
                  <span className={`font-semibold ${theme === 'dark' ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'} transition`}>Featured Project ⭐</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-green-500/20 hover:shadow-xl"
                >
                  {saving ? '💾 Saving...' : editingId ? '✅ Update' : '➕ Create'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`px-6 py-3 rounded-lg ${
                      theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                    } transition`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Preview Column */}
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
              <Eye className="text-blue-500" /> Live Preview
            </h2>
            <div className="sticky top-8">
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                How your project will appear in the portfolio:
              </p>
              <div className="max-w-md mx-auto">
                <ProjectCard 
                  index={0}
                  project={{
                    _id: 'preview',
                    title: formData.title || 'Project Title',
                    description: formData.description || 'Project description will appear here...',
                    image: formData.image || 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800',
                    tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : ['React', 'Next.js'],
                    liveLink: formData.liveLink,
                    githubLink: formData.githubLink,
                    featured: formData.featured
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div>
        {projects.length === 0 ? (
          <div className={`rounded-xl border ${
            theme === 'dark' ? 'border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-950' : 'border-slate-200 bg-white'
          } p-12 text-center`}>
            <div className="text-6xl mb-4">📭</div>
            <p className={theme === 'dark' ? "text-slate-400 mb-6 text-lg" : "text-slate-600 mb-6 text-lg"}>No projects yet. Create your first one!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className={`group rounded-xl border ${
                  theme === 'dark' 
                    ? 'border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-950 hover:border-slate-700/50' 
                    : 'border-slate-200 bg-white hover:border-blue-200 shadow-lg shadow-slate-200/50'
                } overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1`}
              >
                <div className="relative h-40 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Project';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} group-hover:text-blue-400 transition text-lg`}>{project.title}</h3>
                    {project.featured && (
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-semibold">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} line-clamp-2`}>{project.description}</p>

                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs text-slate-400">+{project.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 text-sm font-semibold border border-blue-500/30 transition"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="flex items-center justify-center px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-semibold border border-red-500/30 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
