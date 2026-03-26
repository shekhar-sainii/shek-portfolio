'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Orbit, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';

const navItems = [
  { href: '/', label: 'Origins' },
  { href: '/projects', label: 'Ventures' },
  { href: '/about', label: 'Pedigree' },
  { href: '/contact', label: 'Nexus' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4",
        scrolled ? "mt-4" : "mt-0"
      )}
    >
      <div className={cn(
        "container mx-auto px-8 py-3 rounded-full transition-all duration-500",
        scrolled 
          ? "bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl dark:shadow-indigo-500/10" 
          : "bg-transparent border border-transparent"
      )}>
        <div className="flex items-center justify-between">
          {/* Logo with Orbiting Icon */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 flex items-center justify-center">
              <Orbit className="h-6 w-6 text-indigo-500 group-hover:rotate-180 transition-transform duration-1000" />
            </div>
            <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-indigo-400 dark:group-hover:from-indigo-400 dark:group-hover:to-white transition-all">
              ANTIGRAVITY
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.2em] transition-all relative group",
                  pathname === item.href ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {item.label}
                <span className={cn(
                  "absolute -bottom-2 left-0 h-[2px] bg-indigo-500 transition-all duration-300",
                  pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            ))}
            
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-neutral-800">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.4 rounded-full text-slate-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 dark:border-neutral-800 hover:border-slate-400 dark:hover:border-neutral-600 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full px-6 transition-all h-9"
                asChild
              >
                <Link href="/admin" className="text-[10px] uppercase tracking-widest font-black text-slate-900 dark:text-white">Terminal</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-3 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-full bg-slate-100 dark:bg-white/5"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-full bg-slate-100 dark:bg-white/5"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-6 pt-8 pb-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-sm font-bold uppercase tracking-[0.2em] transition-all",
                      pathname === item.href ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-neutral-500"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-white/5 rounded-full w-full py-6"
                  asChild
                >
                  <Link href="/admin" className="text-xs uppercase tracking-widest font-black text-slate-900 dark:text-white">Admin Terminal</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}