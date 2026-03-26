'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
        <p className="text-gray-400">
          Thank you for reaching out. I'll get back to you soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700 dark:text-neutral-300 font-bold text-xs uppercase tracking-widest">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-slate-50 dark:bg-gray-800 border-slate-200 dark:border-gray-700 focus:border-indigo-500 text-slate-900 dark:text-white rounded-xl h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 dark:text-neutral-300 font-bold text-xs uppercase tracking-widest">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-slate-50 dark:bg-gray-800 border-slate-200 dark:border-gray-700 focus:border-indigo-500 text-slate-900 dark:text-white rounded-xl h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-slate-700 dark:text-neutral-300 font-bold text-xs uppercase tracking-widest">Subject</Label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="bg-slate-50 dark:bg-gray-800 border-slate-200 dark:border-gray-700 focus:border-indigo-500 text-slate-900 dark:text-white rounded-xl h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-slate-700 dark:text-neutral-300 font-bold text-xs uppercase tracking-widest">Message</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="bg-slate-50 dark:bg-gray-800 border-slate-200 dark:border-gray-700 focus:border-indigo-500 text-slate-900 dark:text-white leading-relaxed rounded-xl"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-14 font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02]"
      >
        {isSubmitting ? (
          'Processing...'
        ) : (
          <>
            <Send className="mr-3 h-4 w-4" />
            Initiate Contact
          </>
        )}
      </Button>
    </form>
  );
}
