'use client';

import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-gray-900/50 border-t border-slate-200 dark:border-gray-800/50 backdrop-blur-sm transition-colors">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white">Portfolio</h3>
            <p className="text-slate-500 dark:text-gray-400 mb-6 max-w-md font-medium">
              Crafting digital experiences with modern technologies.
              Passionate about creating beautiful, functional web applications.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="border-slate-200 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-500 bg-white dark:bg-transparent">
                <Github className="h-4 w-4 text-slate-600 dark:text-gray-400" />
              </Button>
              <Button variant="outline" size="sm" className="border-slate-200 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-500 bg-white dark:bg-transparent">
                <Linkedin className="h-4 w-4 text-slate-600 dark:text-gray-400" />
              </Button>
              <Button variant="outline" size="sm" className="border-slate-200 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-500 bg-white dark:bg-transparent">
                <Mail className="h-4 w-4 text-slate-600 dark:text-gray-400" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-slate-900 dark:text-white uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-2 text-slate-500 dark:text-gray-400 font-medium">
              <li>
                <a href="/" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="/projects" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Projects</a>
              </li>
              <li>
                <a href="/about" className="hover:text-indigo-600 dark:hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-slate-900 dark:text-white uppercase tracking-widest text-xs">Get In Touch</h4>
            <p className="text-slate-500 dark:text-gray-400 text-sm mb-4 font-medium">
              Interested in working together? Let&apos;s talk!
            </p>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6" asChild>
              <a href="/contact">Contact Me</a>
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-slate-200 dark:bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-gray-400 font-medium">
          <p>© {currentYear} Portfolio. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Built with <Heart className="h-4 w-4 text-red-500 fill-current" /> using Next.js & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}