export const dynamic = 'force-dynamic';

// About Page - Server Component

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Code, Coffee, Heart, Download } from 'lucide-react';
import connectDB from '@/lib/db/connection';
import { About as AboutModel } from '@/lib/db/models';

interface AboutData {
  _id: string;
  bio: string;
  skills: string[];
  experience: string;
  location: string;
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

export default async function AboutPage() {
  const about = await getAbout();

  const highlights = [
    {
      icon: Code,
      title: 'Full Stack Developer',
      description: 'Building end-to-end web applications with modern technologies'
    },
    {
      icon: Coffee,
      title: 'Problem Solver',
      description: 'Passionate about finding elegant solutions to complex challenges'
    },
    {
      icon: Heart,
      title: 'Team Player',
      description: 'Collaborative and always ready to help fellow developers'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-slate-50 to-white dark:from-black dark:to-gray-900 border-b border-slate-200 dark:border-none">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:bg-neutral-800 dark:text-neutral-300">
              About Me
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Get to Know Me
            </h1>
            <p className="text-xl text-slate-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              I&apos;m a passionate developer who loves creating digital experiences that make a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Profile Image & Info */}
            <div className="space-y-8 animate-slideInLeft">
              <div className="relative">
                <div className="w-80 h-80 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl shadow-indigo-500/20">
                  <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center">
                    <Avatar className="w-40 h-40">
                      <AvatarFallback className="text-6xl font-black bg-gradient-to-br from-indigo-400 to-purple-400 text-white">
                        YN
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-500 dark:text-gray-400 font-bold">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span>{about?.location || 'Your Location'}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 dark:text-gray-400 font-bold">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span>{about?.experience || 'Experience Level'}</span>
                </div>
              </div>

              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </div>

            {/* Bio & Skills */}
            <div className="space-y-8 animate-slideInRight">
              <div>
                <h2 className="text-3xl font-black mb-6 text-slate-900 dark:text-white italic">Hello, I&apos;m Your Name</h2>
                <div className="text-slate-600 dark:text-gray-400 text-lg leading-relaxed space-y-4 font-medium">
                  {about?.bio ? (
                    <p>{about.bio}</p>
                  ) : (
                    <>
                      <p>
                        I&apos;m a passionate full-stack developer with a love for creating beautiful,
                        functional web applications. With expertise in modern technologies and a
                        keen eye for design, I bring ideas to life through code.
                      </p>
                      <p>
                        When I&apos;m not coding, you can find me exploring new technologies,
                        contributing to open-source projects, or sharing knowledge with the developer community.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Skills */}
              {about?.skills && about.skills.length > 0 && (
                <div>
                  <h3 className="text-2xl font-black mb-6 text-slate-900 dark:text-white">Professional Arsenal</h3>
                  <div className="flex flex-wrap gap-3">
                    {about.skills.map((skill, index) => (
                      <div
                        key={skill}
                        className="animate-fadeIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Badge variant="outline" className="px-5 py-2.5 text-sm border-slate-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-gray-500 bg-white dark:bg-transparent text-slate-600 dark:text-neutral-300 font-bold transition-all">
                          {skill}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-slate-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent italic">
              Operational Focus
            </h2>
            <p className="text-xl text-slate-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              My approach to development and the core values I bring to every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <div
                key={highlight.title}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Card className="bg-white dark:bg-gray-800/50 border-slate-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-gray-600 transition-all shadow-sm hover:shadow-md">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <highlight.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-black mb-4 text-slate-900 dark:text-white uppercase tracking-tighter italic">{highlight.title}</h3>
                    <p className="text-slate-500 dark:text-gray-400 font-medium leading-relaxed">{highlight.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Let's Work Together
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            I'm always excited to take on new challenges and collaborate on amazing projects.
            Let's create something incredible together.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <a href="/contact">Get In Touch</a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}