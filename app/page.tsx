export const dynamic = 'force-dynamic';

import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Spotlight } from '@/components/ui/spotlight';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { HeroHighlight } from '@/components/ui/hero-highlight';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { WavyBackground } from '@/components/ui/wavy-background';
import { LampContainer } from '@/components/ui/lamp';
import connectDB from '@/lib/db/connection';
import { Project as ProjectModel, About as AboutModel, UISettings } from '@/lib/db/models';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveLink?: string;
  githubLink?: string;
  featured: boolean;
}

interface AboutData {
  _id: string;
  bio: string;
  skills: string[];
  experience: string;
  location: string;
}

interface UISettingsData {
  heroTitle: string;
  heroSubtitle: string;
  heroEffect: string;
  isStatsVisible: boolean;
  isProjectsVisible: boolean;
}

async function getProjects(): Promise<Project[]> {
  try {
    await connectDB();
    const projects = await ProjectModel.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

async function getAbout(): Promise<AboutData | null> {
  try {
    await connectDB();
    const about = await AboutModel.findOne({});
    return about ? JSON.parse(JSON.stringify(about)) : null;
  } catch (error) {
    console.error('Failed to fetch about:', error);
    return null;
  }
}

async function getUISettings(): Promise<UISettingsData> {
  const defaultSettings: UISettingsData = {
    heroTitle: "Engineering Digital Excellence",
    heroSubtitle: "I architect high-performance digital ecosystems with a focus on scalability, security, and immersive user experiences.",
    heroEffect: "highlight",
    isStatsVisible: true,
    isProjectsVisible: true,
  };

  try {
    await connectDB();
    const ui = await UISettings.findOne({});
    return ui ? JSON.parse(JSON.stringify(ui)) : defaultSettings;
  } catch (error) {
    console.error('Failed to fetch UI settings:', error);
    return defaultSettings;
  }
}

export default async function Home() {
  const [projects, about, ui] = await Promise.all([
    getProjects(),
    getAbout(),
    getUISettings()
  ]);
  
  const featuredProjects = projects.filter(p => p.featured);

  // Map projects for HoverEffect
  const hoverItems = projects.map(p => ({
    title: p.title,
    description: p.description,
    link: `/projects/${p._id}`,
  }));

  const renderHero = () => {
    const heroContent = (
      <HeroSection 
        title={ui.heroTitle}
        bio={ui.heroSubtitle || about?.bio} 
        skills={about?.skills} 
        template={ui.heroEffect}
      />
    );

    if (ui.heroEffect === 'highlight') {
      return <HeroHighlight>{heroContent}</HeroHighlight>;
    }

    if (ui.heroEffect === 'beams') {
      return (
        <div className="relative overflow-hidden">
          <BackgroundBeams />
          {heroContent}
        </div>
      );
    }

    if (ui.heroEffect === 'aurora') {
      return (
        <AuroraBackground>
          {heroContent}
        </AuroraBackground>
      );
    }

    if (ui.heroEffect === 'wavy') {
      return (
        <WavyBackground speed="slow" containerClassName="bg-white dark:bg-black">
          {heroContent}
        </WavyBackground>
      );
    }

    if (ui.heroEffect === 'lamp') {
      return (
        <div className="bg-slate-950 pt-32 min-h-screen">
          <LampContainer>
            {heroContent}
          </LampContainer>
        </div>
      );
    }

    return heroContent;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white selection:bg-indigo-500 selection:text-white transition-colors duration-300 pt-10">
      <Navigation />

      {/* Dynamic Hero Section */}
      {renderHero()}

      {/* Featured Projects Section with Hover Effect */}
      {ui.isProjectsVisible && featuredProjects.length > 0 && (
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                Expertise & Innovation
              </h2>
              <p className="text-xl text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto">
                A selection of architectural marvels and digital solutions crafted with precision.
              </p>
            </div>

            <HoverEffect items={hoverItems.slice(0, 6)} />

            {projects.length > 6 && (
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-full" asChild>
                  <Link href="/projects" className="flex items-center gap-2">
                    Explore All Ventures
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats Section with Glassmorphism */}
      {ui.isStatsVisible && (
        <section className="py-24 bg-slate-50/50 dark:bg-neutral-900/50 backdrop-blur-xl border-y border-slate-200 dark:border-neutral-800 transition-colors">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4 group">
                <div className="text-6xl font-bold text-indigo-500 group-hover:scale-110 transition-transform">{projects.length}</div>
                <div className="text-slate-500 dark:text-neutral-400 uppercase tracking-widest text-sm font-semibold">Projects Spearheaded</div>
              </div>
              <div className="space-y-4 group">
                <div className="text-6xl font-bold text-purple-500 group-hover:scale-110 transition-transform">{about?.skills?.length || 0}</div>
                <div className="text-slate-500 dark:text-neutral-400 uppercase tracking-widest text-sm font-semibold">Core Proficiencies</div>
              </div>
              <div className="space-y-4 group">
                <div className="text-6xl font-bold text-emerald-500 group-hover:scale-110 transition-transform">{about?.experience || '3+'}</div>
                <div className="text-slate-500 dark:text-neutral-400 uppercase tracking-widest text-sm font-semibold">Vertical Expertise</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modern Call to Action with Beams */}
      <section className="py-32 relative overflow-hidden bg-slate-50 dark:bg-transparent transition-colors">
        <BackgroundBeams />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Let&apos;s Engineer the Future
          </h2>
          <p className="text-xl text-slate-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Ready to transform your vision into a digital masterpiece? Let&apos;s discuss how my technical acumen can elevate your next project.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-slate-900 text-white dark:bg-white dark:text-black hover:opacity-90 px-10 py-6 text-lg rounded-full shadow-xl" asChild>
              <Link href="/contact">Initiate Contact</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-slate-300 dark:border-neutral-700 hover:border-slate-500 dark:hover:border-neutral-500 px-10 py-6 text-lg rounded-full" asChild>
              <Link href="/about">Scientific Pedigree</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
