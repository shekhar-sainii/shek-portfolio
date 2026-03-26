'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader, Save, Plus, X, Sparkles, Eye, MapPin, Calendar, Code, Coffee, Heart, Download } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

interface AboutData {
  bio: string;
  skills: string[];
  experience: string;
  location: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

export default function AboutPage() {
  const [formData, setFormData] = useState<AboutData>({
    bio: '',
    skills: [],
    experience: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const checkAuth = () => {
      if (!localStorage.getItem('adminSecret')) {
        router.push('/admin');
        return;
      }
      fetchAbout();
    };
    checkAuth();
  }, [router]);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const secret = localStorage.getItem('adminSecret');
      const res = await fetch('/api/about', {
        headers: { 'Authorization': `Bearer ${secret}` },
      });
      const data = await res.json();
      if (data.bio) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching about:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const secret = localStorage.getItem('adminSecret');
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secret}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('✅ About section updated successfully!');
        fetchAbout();
      }
    } catch (error) {
      console.error('Error saving about:', error);
      alert('❌ Error saving about section');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className={`w-12 h-12 rounded-full border-4 ${
            theme === 'dark' ? 'border-slate-700 border-t-purple-500' : 'border-slate-200 border-t-purple-600'
          }`}
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={32} className={theme === 'dark' ? "text-purple-400" : "text-purple-600"} />
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${
            theme === 'dark' ? "from-purple-400 to-pink-400" : "from-purple-600 to-pink-600"
          } bg-clip-text text-transparent`}>
            About You
          </h1>
        </div>
        <p className={theme === 'dark' ? "text-slate-400 text-lg" : "text-slate-600 text-lg"}>Tell your story and showcase your expertise</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          {/* Bio Section */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl border ${
              theme === 'dark' 
                ? 'border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl shadow-purple-500/5' 
                : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'
            } p-8 backdrop-blur-xl`}
          >
            <label className={`block text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-3 flex items-center gap-2`}>
              <span className="text-2xl">📝</span> Your Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself in 2-3 sentences..."
              rows={4}
              className={`w-full px-4 py-3 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              } border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none`}
            />
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} mt-2`}>{formData.bio.length} characters</p>
          </motion.div>

          {/* Experience Section */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl border ${
              theme === 'dark' 
                ? 'border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl shadow-purple-500/5' 
                : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'
            } p-8 backdrop-blur-xl`}
          >
            <label className={`block text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-3 flex items-center gap-2`}>
              <span className="text-2xl">💼</span> Experience
            </label>
            <textarea
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="Describe your professional experience..."
              rows={3}
              className={`w-full px-4 py-3 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              } border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none`}
            />
          </motion.div>

          {/* Location Section */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl border ${
              theme === 'dark' 
                ? 'border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl shadow-purple-500/5' 
                : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'
            } p-8 backdrop-blur-xl`}
          >
            <label className={`block text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-3 flex items-center gap-2`}>
              <span className="text-2xl">📍</span> Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., San Francisco, USA or Remote"
              className={`w-full px-4 py-3 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              } border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
            />
          </motion.div>

          {/* Skills Section */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl border ${
              theme === 'dark' 
                ? 'border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl shadow-purple-500/5' 
                : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'
            } p-8 backdrop-blur-xl`}
          >
            <label className={`block text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
              <span className="text-2xl">⭐</span> Skills & Technologies
            </label>

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="e.g., React, Node.js, Python"
                className={`flex-1 px-4 py-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                } border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
              />
              <motion.button
                type="button"
                onClick={addSkill}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition flex items-center gap-2"
              >
                <Plus size={18} />
                Add
              </motion.button>
            </div>

            {formData.skills.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2"
                layout
              >
                {formData.skills.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-600/30' 
                        : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                    } border hover:border-purple-600/60 transition`}
                  >
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{skill}</span>
                    <motion.button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={theme === 'dark' ? "text-purple-400 hover:text-pink-400 transition" : "text-purple-600 hover:text-pink-600 transition"}
                    >
                      <X size={16} />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2 mb-6`}>
            <Eye className="text-purple-500" /> Live Preview
          </h2>
          
          <div className="sticky top-8 space-y-8 animate-fadeInUp">
            {/* Bio Preview */}
            <div className={`rounded-2xl border ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-gray-50'} p-6 backdrop-blur-md`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {formData.bio ? formData.bio.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h3 className="text-xl font-bold">About Me</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin size={14} />
                    {formData.location || 'Location'}
                  </div>
                </div>
              </div>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                {formData.bio || 'Your bio will appear here...'}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formData.experience || 'Experience'}
                </div>
              </div>
            </div>

            {/* Skills Preview */}
            <div className={`rounded-2xl border ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-gray-50'} p-6 backdrop-blur-md`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Code size={18} className="text-purple-500" /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.skills.length > 0 ? (
                  formData.skills.map((skill) => (
                    <span key={skill} className={`px-3 py-1 text-xs rounded-full ${
                      theme === 'dark' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200'
                    } border`}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No skills added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
 </motion.div>
  );
}
