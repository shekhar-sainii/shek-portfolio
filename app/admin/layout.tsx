'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, BarChart3, FileText, Mail, Home, ChevronLeft, ChevronRight, Sun, Moon, Users } from 'lucide-react';
import { Zap } from 'lucide-react';
import { ThemeProvider, useTheme } from '../../lib/theme-context';

function AdminLayoutContentInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setRole(localStorage.getItem('adminRole'));
  }, []);

  useEffect(() => {
    const secret = localStorage.getItem('adminSecret');
    const savedRole = localStorage.getItem('adminRole');
    
    if (!secret && pathname !== '/admin') {
      router.push('/admin');
    } else if (secret && pathname === '/admin') {
      router.push('/admin/dashboard');
    } else if (secret) {
      setIsAuthenticated(true);
      setRole(savedRole);
    }
  }, [pathname, router]);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/appearance', label: 'Appearance', icon: Zap },
    { href: '/admin/projects', label: 'Projects', icon: BarChart3 },
    { href: '/admin/about', label: 'About', icon: FileText },
    { href: '/admin/contact', label: 'Contact', icon: Mail },
    ...(role === 'superadmin' ? [{ href: '/admin/users', label: 'Users', icon: Users }] : []),
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    localStorage.removeItem('adminSecret');
    localStorage.removeItem('adminRole');
    setIsAuthenticated(false);
    setRole(null);
    router.push('/admin');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Now we can safely use the theme hook
  const { theme, toggleTheme } = useTheme();

  // Show just children if not authenticated (login page)
  if (pathname === '/admin' || !isAuthenticated) {
    return <>{children}</>;
  }

  // Show loading state until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div className={`flex h-screen transition-colors duration-300 ${theme === 'dark'
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-black'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 border-r backdrop-blur-xl transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${sidebarCollapsed ? 'w-20' : 'w-64'
          } lg:translate-x-0 lg:static lg:shadow-2xl ${theme === 'dark'
            ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800/50'
            : 'bg-gradient-to-b from-white to-gray-50 border-gray-200/50'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center justify-between py-8 border-b transition-all duration-300 ${sidebarCollapsed ? 'px-4' : 'px-6'
            } ${theme === 'dark' ? 'border-slate-800/30' : 'border-gray-200/30'
            }`}>
            <div className={`flex items-center gap-3 transition-all duration-300 ${sidebarCollapsed ? 'justify-center' : ''
              }`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/20 group hover:rotate-12 transition-transform cursor-pointer">
                <Zap className="text-white h-5 w-5 fill-current" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <h1 className={`text-xl font-black tracking-tighter transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                    CORE CMS
                  </h1>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 dark:text-neutral-500">v2.4.0</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Collapse Toggle - Desktop Only */}
              <button
                onClick={toggleSidebarCollapse}
                className={`hidden lg:flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${theme === 'dark'
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                  }`}
              >
                {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
              {/* Mobile Close */}
              <button
                onClick={() => setSidebarOpen(false)}
                className={`lg:hidden transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 py-6 space-y-2 overflow-y-auto scrollbar-hide transition-all duration-300 ${sidebarCollapsed ? 'px-2' : 'px-3'
            }`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${active
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                      : theme === 'dark'
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''
                    }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon size={20} className={`${active ? '' : 'group-hover:scale-110'} transition-transform`} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-semibold">{item.label}</span>
                      {active && <div className="ml-auto w-1 h-6 rounded-full bg-white/20"></div>}
                    </>
                  )}
                  {/* Tooltip for collapsed sidebar */}
                  {sidebarCollapsed && (
                    <div className={`absolute left-full ml-2 px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-gray-800 text-white'
                      }`}>
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className={`border-t bg-gradient-to-t transition-all duration-300 ${sidebarCollapsed ? 'p-2' : 'p-4'
            } ${theme === 'dark'
              ? 'border-slate-800/30 from-slate-950'
              : 'border-gray-200/30 from-gray-50'
            }`}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${sidebarCollapsed ? 'justify-center px-2' : ''
                } ${theme === 'dark'
                  ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400'
                  : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
                }`}
              title={sidebarCollapsed ? 'Logout' : undefined}
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              {!sidebarCollapsed && <span className="font-semibold">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-0' : ''
        }`}>
        {/* Top Bar */}
        <div className={`sticky top-0 z-40 flex items-center justify-between py-4 border-b backdrop-blur-xl transition-all duration-300 ${theme === 'dark'
            ? 'bg-gradient-to-r from-slate-900/95 to-slate-950/95 border-slate-800/30 px-4 sm:px-6 lg:px-8'
            : 'bg-gradient-to-r from-white/95 to-gray-50/95 border-gray-200/30 px-4 sm:px-6 lg:px-8'
          }`}>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                }`}
            >
              <Menu size={20} />
            </button>
            <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
              {sidebarCollapsed ? 'Admin' : 'Manage Portfolio'}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                }`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>Portfolio Admin</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>Active</p>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className={`fixed inset-0 backdrop-blur-sm z-40 lg:hidden ${theme === 'dark' ? 'bg-black/50' : 'bg-black/30'
            }`}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AdminLayoutContentInner>{children}</AdminLayoutContentInner>
    </ThemeProvider>
  );
}
