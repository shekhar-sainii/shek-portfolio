'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title?: string;
  bio?: string;
  skills?: string[];
  template?: string;
}

export function HeroSection({ title, bio, skills, template }: HeroSectionProps) {
  const defaultTitle = "Engineering Digital Excellence";
  const defaultBio = "I architect high-performance digital ecosystems with a focus on scalability, security, and immersive user experiences. Transforming complex challenges into elegant, functional reality.";

  const isTemplate = template && template !== 'none' && template !== 'highlight';

  return (
    <section className={cn(
      "relative flex items-center justify-center overflow-hidden transition-all duration-700",
      isTemplate ? "min-h-0 pt-40 pb-20" : "min-h-screen pt-40 pb-40",
      "px-6"
    )}>
      <div className={cn(
        "container mx-auto relative z-20",
        template === 'lamp' ? "flex flex-col items-center" : ""
      )}>
        <div className={cn(
          "max-w-5xl mx-auto",
          template === 'lamp' ? "text-center" : "text-center" // Standard center for now
        )}>
          {/* Animated greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 md:mb-8"
          >
            <Badge variant="outline" className={cn(
               "mb-4 px-6 py-2 text-xs md:text-sm border-indigo-500/50 backdrop-blur-md rounded-full font-bold transition-colors",
               template === 'lamp' ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
            )}>
              ✨ Full Stack Engineering Specialist
            </Badge>
          </motion.div>

          {/* Main heading with dynamic gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={cn(
               "font-black mb-8 tracking-tighter leading-[1.1]",
               template === 'lamp' ? "text-4xl md:text-7xl lg:text-8xl" : "text-5xl md:text-8xl"
            )}
          >
            <span className={cn(
              "bg-gradient-to-r bg-clip-text text-transparent transition-all duration-1000",
              template === 'lamp' 
                ? "from-slate-200 via-slate-100 to-indigo-200" 
                : "from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400"
            )}>
              {title || defaultTitle}
            </span>
          </motion.h1>

          {/* Bio text - made more responsive and better contrast */}
          <div className="mb-10 md:mb-12 max-w-2xl mx-auto text-center">
            <TextGenerateEffect 
              words={bio || defaultBio} 
              className={cn(
                "text-lg md:text-xl lg:text-2xl font-medium leading-relaxed transition-colors",
                template === 'lamp' ? "text-slate-300" : "text-slate-600 dark:text-neutral-400"
              )}
            />
          </div>

          {/* Skills with adaptive styling */}
          {skills && skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-16"
            >
              {skills.map((skill) => (
                <motion.div
                  key={skill}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className={cn(
                    "px-4 md:px-5 py-2 text-xs md:text-sm font-semibold border transition-all rounded-full backdrop-blur-sm cursor-default",
                    template === 'lamp' 
                      ? "border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:border-indigo-500/50" 
                      : "border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-neutral-300"
                  )}
                >
                  {skill}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-12 md:mb-24"
          >
            <Button size="lg" className={cn(
              "px-8 md:px-10 py-6 md:py-7 transition-all text-base md:text-lg font-bold rounded-full group shadow-xl",
              template === 'lamp' 
                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20" 
                : "bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-neutral-200"
            )}>
              Explore Portfolio
              <ArrowDown className="ml-3 h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </Button>

            <div className="flex gap-3 md:gap-4">
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <Button key={i} variant="outline" size="icon" className={cn(
                  "h-12 w-12 md:h-14 md:w-14 rounded-full transition-all group",
                  template === 'lamp' 
                    ? "border-neutral-800 bg-neutral-900/50 hover:border-indigo-500/50" 
                    : "border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 hover:bg-slate-100 dark:hover:bg-neutral-800"
                )}>
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Conditional scroll indicator - only for full screen variants */}
      {!isTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold">Scroll Down</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-indigo-500 to-transparent animate-pulse" />
          </div>
        </motion.div>
      )}
    </section>
  );
}