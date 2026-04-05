'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function AdminLogin() {
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const savedSecret = localStorage.getItem('adminSecret');
    if (savedSecret && savedSecret !== 'your-secret-key-here-change-this') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2);
        // For development convenience, if OTP is returned (happens only if email fails in dev)
        if (data.otp) {
          console.log('OTP (Development only):', data.otp);
          setError('OTP generated! (Check console for code)');
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminSecret', data.token);
        localStorage.setItem('adminRole', data.role);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, 50, 0], x: [0, 25, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, -50, 0], x: [0, -25, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 shadow-2xl"
        >
          <motion.div variants={itemVariants} className="space-y-2 mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {step === 1 ? "Admin Portal" : "Verification"}
            </h1>
            <p className="text-slate-400 text-sm">
              {step === 1 ? "Manage your portfolio securely" : `Enter the 6-digit code sent to ${email}`}
            </p>
          </motion.div>

          <form onSubmit={step === 1 ? handleLogin : handleVerifyOtp} className="space-y-6">
            {step === 1 ? (
              <>
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Shield size={14} />
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Lock size={14} />
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                </motion.div>
              </>
            ) : (
              <motion.div variants={itemVariants}>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">One-Time Password</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-4 py-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-white text-center text-3xl font-black tracking-[10px] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
                  required
                />
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (step === 1 ? "Next Step" : "Verify & Enter")}
            </Button>

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors"
              >
                ← Back to Login
              </button>
            )}
          </form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="pt-6 border-t border-slate-800/30 mt-8">
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <Zap size={12} className="text-yellow-400" />
                <span>Secure</span>
              </div>
              <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
              <span>OTP Required</span>
              <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
              <span>Real-time Sync</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Info */}
        <motion.div variants={itemVariants} className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: '📝', text: 'Projects' },
            { icon: '👤', text: 'Profile' },
            { icon: '📞', text: 'Contact' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-slate-900/40 border border-slate-800/30 text-center"
            >
              <span className="text-lg">{feature.icon}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
