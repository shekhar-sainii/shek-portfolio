export const dynamic = 'force-dynamic';

// Project Page - Server Component

import { Navigation } from '@/components/navigation';
import { ProjectCard } from '@/components/project-card';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List } from 'lucide-react';
import connectDB from '@/lib/db/connection';
import { Project as ProjectModel } from '@/lib/db/models';

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

async function getProjects() {
  try {
    await connectDB();
    const projects = await ProjectModel.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects: Project[] = await getProjects();

  // Get all unique tags
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-slate-50 to-white dark:from-black dark:to-gray-900 border-b border-slate-200 dark:border-none">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:bg-neutral-800 dark:text-neutral-300">
              My Work
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-xl text-slate-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              A collection of projects I&apos;ve worked on, showcasing my skills and passion for development.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {projects.length > 0 ? (
            <>
              {/* Stats */}
              <div className="flex justify-center mb-12">
                <div className="text-center">
                  <div className="text-3xl font-black text-indigo-600 dark:text-blue-400 mb-2">{projects.length}</div>
                  <div className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Total Projects</div>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <ProjectCard key={project._id} project={project} index={index} />
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold mb-4">No Projects Yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                I'm currently working on some exciting projects. Check back soon or visit the admin panel to add new projects.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <a href="/admin">Go to Admin</a>
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}