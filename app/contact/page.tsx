export const dynamic = 'force-dynamic';

// Contact Page - Server Component

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import connectDB from '@/lib/db/connection';
import { Contact as ContactModel } from '@/lib/db/models';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';

interface ContactData {
  _id: string;
  email: string;
  phone?: string;
  location?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

async function getContact() {
  try {
    await connectDB();
    const contact = await ContactModel.findOne({});
    return contact ? JSON.parse(JSON.stringify(contact)) : null;
  } catch (error) {
    console.error('Failed to fetch contact:', error);
    return null;
  }
}

export default async function ContactPage() {
  const contactData: ContactData | null = await getContact();

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: contactData?.email || 'your.email@example.com',
      href: `mailto:${contactData?.email || 'your.email@example.com'}`
    },
    {
      icon: Phone,
      title: 'Phone',
      value: contactData?.phone || '+1 (555) 123-4567',
      href: `tel:${contactData?.phone || ''}`
    },
    {
      icon: MapPin,
      title: 'Location',
      value: contactData?.location || 'Your City, Country',
      href: '#'
    }
  ];

  const socialLinks = [
    { icon: Github, href: contactData?.socialLinks?.github || '#', label: 'GitHub' },
    { icon: Linkedin, href: contactData?.socialLinks?.linkedin || '#', label: 'LinkedIn' },
    { icon: Twitter, href: contactData?.socialLinks?.twitter || '#', label: 'Twitter' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-slate-50 to-white dark:from-black dark:to-gray-900 border-b border-slate-200 dark:border-none">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:bg-neutral-800 dark:text-neutral-300">
              Get In Touch
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-gray-300 bg-clip-text text-transparent italic">
              Let&apos;s Connect
            </h1>
            <p className="text-xl text-slate-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Have a project in mind or just want to chat? I&apos;d love to hear from you.
              Let&apos;s create something amazing together.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="animate-slideInLeft">
              <Card className="bg-white dark:bg-gray-900/50 border-slate-200 dark:border-gray-800 backdrop-blur-sm shadow-xl shadow-indigo-500/5">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8 animate-slideInRight">
              <div>
                <h2 className="text-3xl font-black mb-6 text-slate-900 dark:text-white">Communication Nexus</h2>
                <p className="text-slate-500 dark:text-gray-400 text-lg mb-8 font-medium">
                  I&apos;m always open to discussing new opportunities, interesting projects,
                  or just having a chat about technology and development.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={info.title} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                    <a
                      href={info.href}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-gray-700 transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-sm">{info.title}</h3>
                        <p className="text-slate-500 dark:text-gray-400 font-bold">{info.value}</p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Follow Me</h3>
                <div className="flex gap-4">
                   {socialLinks.map((social, index) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-500 flex items-center justify-center hover:scale-110 transition-all animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}