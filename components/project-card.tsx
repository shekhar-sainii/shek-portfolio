'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';

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

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-white dark:bg-gray-900/50 border-slate-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-gray-700 transition-all duration-500 overflow-hidden backdrop-blur-sm shadow-sm hover:shadow-xl group/card">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover/card:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/20 group-hover/card:bg-transparent transition-colors duration-500" />
            {project.featured && (
              <Badge className="absolute top-4 left-4 bg-amber-400 text-black font-black uppercase tracking-tighter text-[10px] px-3">
                Featured
              </Badge>
            )}
          </div>

          <CardContent className="p-6">
            <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white group-hover/card:text-indigo-600 dark:group-hover/card:text-blue-400 transition-colors uppercase tracking-tight italic">
              {project.title}
            </h3>

            <p className="text-slate-500 dark:text-gray-400 text-sm mb-6 line-clamp-3 font-medium leading-relaxed">
              {project.description}
            </p>

            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-all border-none"
                  >
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="secondary" className="text-[10px] font-bold bg-slate-100 dark:bg-gray-800 text-slate-500 border-none">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex gap-3">
              {project.liveLink && (
                <Button
                  size="sm"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                  asChild
                >
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Launch
                  </a>
                </Button>
              )}
              {project.githubLink && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-gray-500 rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all bg-white dark:bg-transparent"
                  asChild
                >
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 text-slate-600 dark:text-gray-400" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}