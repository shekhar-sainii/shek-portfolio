'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader, Save, ExternalLink, Mail, Eye, Phone, Github, Linkedin, Twitter } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

interface ContactData {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  twitter: string;
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
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const contactFields = [
  { key: 'email' as const, label: 'Email', icon: '📧', placeholder: 'your@email.com', type: 'email' },
  { key: 'phone' as const, label: 'Phone', icon: '📞', placeholder: '+1 (555) 000-0000', type: 'tel' },
  { key: 'linkedin' as const, label: 'LinkedIn Profile', icon: '💼', placeholder: 'https://linkedin.com/in/username', type: 'url' },
  { key: 'github' as const, label: 'GitHub Profile', icon: '🐙', placeholder: 'https://github.com/username', type: 'url' },
  { key: 'twitter' as const, label: 'Twitter/X Profile', icon: '𝕏', placeholder: 'https://twitter.com/username', type: 'url' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactData>({
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    twitter: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const checkAuth = () => {
      if (!localStorage.getItem('adminSecret')) {
        router.push('/admin');
        return;
      }
      fetchContact();
    };
    checkAuth();
  }, [router]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const secret = localStorage.getItem('adminSecret');
      const res = await fetch('/api/contact', {
        headers: { 'Authorization': `Bearer ${secret}` },
      });
      const data = await res.json();
      if (data.email) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const secret = localStorage.getItem('adminSecret');
      const res = await fetch('/api/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secret}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('✅ Contact info updated successfully!');
        fetchContact();
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('❌ Error saving contact info');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className={`w-12 h-12 rounded-full border-4 ${
            theme === 'dark' ? 'border-slate-700 border-t-green-500' : 'border-slate-200 border-t-green-600'
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
      className="space-y-8 max-w-4xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-2">
          <Mail size={32} className={theme === 'dark' ? "text-green-400" : "text-green-600"} />
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${
            theme === 'dark' ? "from-green-400 to-emerald-400" : "from-green-600 to-emerald-600"
          } bg-clip-text text-transparent`}>
            Contact Information
          </h1>
        </div>
        <p className={theme === 'dark' ? "text-slate-400 text-lg" : "text-slate-600 text-lg"}>Share your contact details and social profiles</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactFields.map((field) => (
              <motion.div
                key={field.key}
                variants={itemVariants}
                className={`rounded-xl border ${
                  theme === 'dark' 
                    ? 'border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl shadow-green-500/5' 
                    : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'
                } p-6 backdrop-blur-xl hover:border-slate-700/50 transition group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <label className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                    <span className="text-2xl">{field.icon}</span>
                    {field.label}
                  </label>
                  {formData[field.key] && field.type === 'url' && (
                    <motion.a
                      href={formData[field.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2 }}
                      className="text-slate-400 hover:text-green-400 transition"
                    >
                      <ExternalLink size={18} />
                    </motion.a>
                  )}
                </div>
                <input
                  type={field.type}
                  value={formData[field.key]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-3 rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  } border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition group-hover:border-slate-600/50`}
                />
              </motion.div>
            ))}
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

        {/* Preview Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2 mb-6 ml-1`}>
            <Eye className="text-green-500" /> Live Preview
          </h2>
          
          <div className="sticky top-8 grid grid-cols-1 gap-4 animate-fadeInUp">
            {[
              { label: 'Email', value: formData.email, icon: <Mail className="text-green-500" size={20} />, placeholder: 'your@email.com' },
              { label: 'Phone', value: formData.phone, icon: <Phone className="text-emerald-500" size={20} />, placeholder: '+1 (555) 000-0000' },
              { label: 'LinkedIn', value: formData.linkedin, icon: <Linkedin className="text-blue-500" size={20} />, placeholder: 'Not Set' },
              { label: 'GitHub', value: formData.github, icon: <Github className="text-slate-400" size={20} />, placeholder: 'Not Set' },
              { label: 'Twitter / X', value: formData.twitter, icon: <Twitter className="text-blue-400" size={20} />, placeholder: 'Not Set' },
            ].map((item) => (
              <div key={item.label} className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-gray-50 border-slate-200'
              } backdrop-blur-md flex items-center gap-4 transition-all hover:scale-[1.02]`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-sm'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">{item.label}</p>
                  <p className={`text-sm font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {item.value || item.placeholder}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
