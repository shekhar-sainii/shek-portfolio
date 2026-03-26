"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Mail, Zap, TrendingUp, ArrowRight, MousePointer2, Layout, Palette, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../../lib/theme-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stats {
  projects: number;
  about: boolean;
  contact: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ projects: 0, about: false, contact: false });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const secret = localStorage.getItem("adminSecret");
      if (!secret) {
        router.push("/admin");
        return;
      }
      fetchStats();
    };

    checkAuth();
  }, [router]);

  const fetchStats = async () => {
    try {
      const secret = localStorage.getItem("adminSecret");
      const [projectsRes, aboutRes, contactRes] = await Promise.all([
        fetch("/api/projects", {
          headers: { Authorization: `Bearer ${secret}` },
        }),
        fetch("/api/about", {
          headers: { Authorization: `Bearer ${secret}` },
        }),
        fetch("/api/contact", {
          headers: { Authorization: `Bearer ${secret}` },
        }),
      ]);

      const projects = await projectsRes.json();
      const about = await aboutRes.json();
      const contact = await contactRes.json();

      setStats({
        projects: (projects || []).length,
        about: !!about,
        contact: !!contact,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-t-2 border-indigo-500 border-r-2 border-r-transparent"
        />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Projects",
      value: stats.projects,
      icon: Layout,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/admin/projects",
      description: "Showcase your work",
    },
    {
      title: "About Active",
      value: stats.about ? "Yes" : "No",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      href: "/admin/about",
      description: "Your digital bio",
    },
    {
      title: "Contact Info",
      value: stats.contact ? "Yes" : "No",
      icon: Mail,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/admin/contact",
      description: "How to reach you",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Premium Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">System Overview</h1>
          <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] font-bold">Terminal Control Center</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800" asChild>
            <Link href="/" target="_blank" className="flex items-center gap-2">
              <MousePointer2 size={16} />
              View Site
            </Link>
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-lg shadow-indigo-500/20" asChild>
            <Link href="/admin/appearance" className="flex items-center gap-2 font-bold">
              <Palette size={16} />
              Customize UI
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="group border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 backdrop-blur-xl hover:bg-slate-50 dark:hover:bg-neutral-900/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                   <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black tracking-tighter mb-1 text-slate-900 dark:text-white">{card.value}</div>
                <p className="text-xs text-slate-500 dark:text-neutral-500 font-medium">{card.description}</p>
                <Button variant="ghost" size="sm" className="mt-4 p-0 h-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-transparent group-hover:translate-x-1 transition-transform" asChild>
                  <Link href={card.href} className="flex items-center gap-1 font-bold italic">
                    Manage <ArrowRight size={14} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Main Action Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur-xl overflow-hidden relative group shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={120} className="text-indigo-500" />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-black italic text-slate-900 dark:text-white">Dynamic Controls</CardTitle>
            <CardDescription className="font-medium text-slate-500 dark:text-neutral-500">Instant updates to your portfolio frontend.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 relative z-10">
            {[
              { label: "Change Hero Background", href: "/admin/appearance", icon: Palette },
              { label: "Update Projects Grid", href: "/admin/projects", icon: Layout },
              { label: "Modify Global Styles", href: "/admin/appearance", icon: Settings },
            ].map((action, i) => (
              <Button 
                key={i} 
                variant="outline" 
                className="justify-between h-14 border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-950/50 hover:bg-slate-100 dark:hover:bg-neutral-800/50 hover:border-slate-300 dark:hover:border-neutral-700 transition-all rounded-xl px-6"
                asChild
              >
                <Link href={action.href}>
                  <span className="flex items-center gap-3 font-bold text-slate-700 dark:text-neutral-300">
                    <action.icon size={18} className="text-indigo-600 dark:text-indigo-400" />
                    {action.label}
                  </span>
                  <ArrowRight size={16} className="opacity-50 text-slate-400 dark:text-neutral-500" />
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* System Tips */}
        <Card className="border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur-xl border-dashed shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-500" />
              Optimization Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-500/10 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400">01</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Visual Consistency</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-500 leading-relaxed">Use the new <b>Appearance</b> settings to match your portfolio&apos;s background effect with your latest project&apos;s aesthetic.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-purple-500/10 flex items-center justify-center font-black text-purple-600 dark:text-purple-400">02</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Featured Selection</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-500 leading-relaxed">Regularly update your <b>Featured Projects</b> to show the breadth of your architectural engineering capabilities.</p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
