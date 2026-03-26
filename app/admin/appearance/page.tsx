"use client";

import { useState, useEffect } from "react";
import { Zap, Save, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export default function AppearancePage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroEffect: "highlight",
    isStatsVisible: true,
    isProjectsVisible: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ui-settings");
      const data = await res.json();
      setSettings({
        heroTitle: data.heroTitle || "",
        heroSubtitle: data.heroSubtitle || "",
        heroEffect: data.heroEffect || "highlight",
        isStatsVisible: data.isStatsVisible ?? true,
        isProjectsVisible: data.isProjectsVisible ?? true,
      });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/ui-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        // Show success toast or similar
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Appearance</h1>
          <p className="text-muted-foreground mt-1 text-sm uppercase tracking-widest font-bold opacity-70">
            Control your portfolio&apos;s digital atmosphere
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={fetchSettings} 
            disabled={saving} 
            className="rounded-full px-6 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full px-8 shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* Hero Configuration */}
          <Card className="border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
                Hero Section
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-neutral-500">
                Main heading and background effect for the landing page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="heroTitle" className="text-slate-700 dark:text-neutral-300">Main Headline</Label>
                <Input
                  id="heroTitle"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  placeholder="Engineering Digital Excellence"
                  className="bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle" className="text-slate-700 dark:text-neutral-300">Introduction Bio</Label>
                <Textarea
                  id="heroSubtitle"
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  placeholder="I architect high-performance digital ecosystems..."
                  className="min-h-[120px] bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white leading-relaxed focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroEffect" className="text-slate-700 dark:text-neutral-300">Background Atmosphere</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                  {["highlight", "beams", "spotlight", "aurora", "wavy", "lamp"].map((effect) => (
                    <button
                      key={effect}
                      onClick={() => setSettings({ ...settings, heroEffect: effect })}
                      className={`p-4 rounded-xl border-2 transition-all text-center capitalize font-bold text-sm ${
                        settings.heroEffect === effect
                          ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          : "border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50 dark:bg-neutral-950 text-slate-500 dark:text-neutral-500"
                      }`}
                    >
                      {effect}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visibility Toggles */}
          <Card className="border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 backdrop-blur-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Section Controls</CardTitle>
              <CardDescription className="text-slate-500 dark:text-neutral-500">Toggle portfolio sections.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-neutral-800/50">
                <div className="space-y-0.5">
                  <Label className="text-base text-slate-900 dark:text-white">Stats Section</Label>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground">Show metrics and experience.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, isStatsVisible: !settings.isStatsVisible })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.isStatsVisible ? "bg-indigo-600" : "bg-slate-300 dark:bg-neutral-800"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                    settings.isStatsVisible ? "left-7" : "left-1"
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-neutral-800/50">
                <div className="space-y-0.5">
                  <Label className="text-base text-slate-900 dark:text-white">Projects Section</Label>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground">Show featured work cards.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, isProjectsVisible: !settings.isProjectsVisible })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.isProjectsVisible ? "bg-indigo-600" : "bg-slate-300 dark:bg-neutral-800"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                    settings.isProjectsVisible ? "left-7" : "left-1"
                  }`} />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6 ml-1">
            <RefreshCcw className="text-indigo-500 animate-spin-slow" size={20} /> Live Preview
          </h2>
          
          <div className="sticky top-8 space-y-6">
            <div className={`aspect-video rounded-3xl border ${
              theme === 'dark' ? 'border-neutral-800 bg-neutral-950 shadow-2xl' : 'border-slate-200 bg-white shadow-xl'
            } overflow-hidden relative group`}>
              {/* Effect Visualization */}
              <div className="absolute inset-0 z-0">
                {settings.heroEffect === 'aurora' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-pulse blur-3xl opacity-60" />
                )}
                {settings.heroEffect === 'wavy' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="w-full h-1/2 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent blur-xl animate-bounce" />
                  </div>
                )}
                {settings.heroEffect === 'lamp' && (
                  <div className="absolute inset-0 bg-slate-950">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-indigo-500/40 blur-[50px] rounded-full" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-slate-950/80" />
                  </div>
                )}
                {settings.heroEffect === 'spotlight' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] aspect-square bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl opacity-50" />
                )}
              </div>

              {/* Content Mockup */}
              <div className={cn(
                "relative z-10 h-full flex flex-col items-center justify-center p-8 text-center transition-all",
                settings.heroEffect === 'lamp' ? "justify-center pt-10" : "justify-center"
              )}>
                <div className={cn(
                  "text-[8px] font-black uppercase tracking-[0.3em] mb-2 px-3 py-1 rounded-full border border-indigo-500/30",
                  settings.heroEffect === 'lamp' ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                )}>
                  Full Stack Engineering
                </div>
                <h1 className={cn(
                  "font-black tracking-tight leading-none mb-3 transition-all",
                  settings.heroEffect === 'lamp' ? "text-xl md:text-2xl text-slate-100" : "text-xl md:text-2xl text-slate-900 dark:text-white"
                )}>
                  {settings.heroTitle || "Engineering Digital Excellence"}
                </h1>
                <p className={cn(
                  "text-[10px] max-w-[90%] leading-relaxed line-clamp-2 mb-4 transition-all",
                  settings.heroEffect === 'lamp' ? "text-slate-400" : "text-slate-500 dark:text-neutral-500"
                )}>
                  {settings.heroSubtitle || "I architect high-performance digital ecosystems with a focus on scalability..."}
                </p>
                <div className="flex gap-2">
                  <div className={cn(
                    "h-7 w-20 rounded-full transition-all flex items-center justify-center text-[8px] font-bold",
                    settings.heroEffect === 'lamp' ? "bg-indigo-600 text-white" : "bg-slate-900 text-white dark:bg-white dark:text-black"
                  )}>Explore</div>
                  <div className="h-7 w-7 rounded-full border border-indigo-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                  </div>
                </div>
              </div>

              {/* Interaction Indicators */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center px-2">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                </div>
                <div className="text-[10px] font-bold text-slate-300 dark:text-neutral-700 uppercase tracking-tighter italic">
                  Preview Mode
                </div>
              </div>
            </div>

            {/* Layout Toggles Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl border ${
                settings.isStatsVisible 
                  ? 'border-indigo-500/30 bg-indigo-500/5' 
                  : 'border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 opacity-50 grayscale'
              } flex flex-col items-center gap-2 transition-all`}>
                <div className="text-xs font-bold text-slate-500 uppercase">Stats Block</div>
                <div className="h-1.5 w-12 rounded-full bg-indigo-500/30" />
              </div>
              <div className={`p-4 rounded-2xl border ${
                settings.isProjectsVisible 
                  ? 'border-indigo-500/30 bg-indigo-500/5' 
                  : 'border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 opacity-50 grayscale'
              } flex flex-col items-center gap-2 transition-all`}>
                <div className="text-xs font-bold text-slate-500 uppercase">Projects Block</div>
                <div className="h-1.5 w-12 rounded-full bg-indigo-500/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
