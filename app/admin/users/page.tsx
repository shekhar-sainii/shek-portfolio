'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, Trash2, Mail, Shield, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminUser {
  _id: string;
  email: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'superadmin'>('admin');
  const [actionLoading, setActionLoading] = useState(false);
  
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminSecret');
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': token || '' }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('adminRole');
    if (role !== 'superadmin') {
      router.push('/admin/dashboard');
      return;
    }
    fetchUsers();
  }, [router]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminSecret');
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({ email: newEmail, password: newPassword, role: newRole })
      });
      if (res.ok) {
        setIsAdding(false);
        setNewEmail('');
        setNewPassword('');
        fetchUsers();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add user');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminSecret');
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token || '' }
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Users className="h-8 w-8 text-indigo-500" />
            User Management
          </h1>
          <p className="text-slate-400 mt-1">Manage administrative access and roles</p>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2 rounded-xl shadow-lg shadow-indigo-500/20"
        >
          {isAdding ? <Shield className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {isAdding ? 'Cancel' : 'Add New Admin'}
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">New Administrator</CardTitle>
                <CardDescription>Create a new account with specific permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Temp Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Access Role</label>
                    <select 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={actionLoading}
                    className="w-full h-[46px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group flex items-center justify-between p-5 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:bg-slate-900/50 hover:border-slate-700/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-lg ${
                user.role === 'superadmin' 
                ? 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white shadow-amber-500/10' 
                : 'bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white shadow-indigo-500/10'
              }`}>
                {user.role === 'superadmin' ? <ShieldCheck className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-lg">{user.email}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                    user.role === 'superadmin' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-500 border border-indigo-500/30'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Verified Email
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    Created {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => handleDeleteUser(user._id)}
                disabled={actionLoading || user.email === 'super@example.com'}
                className="h-10 w-10 p-0 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-30"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
