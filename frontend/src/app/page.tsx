'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Bot, BarChart3, MessageSquare, Users, Zap, Sparkles, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Bot, title: 'Smart Chatbots', description: 'AI-powered chatbots that understand context and provide human-like responses' },
  { icon: BarChart3, title: 'Rich Analytics', description: 'Track conversations, leads, and satisfaction with beautiful dashboards' },
  { icon: Users, title: 'Lead Capture', description: 'Automatically capture and qualify leads from conversations' },
  { icon: MessageSquare, title: 'Multi-channel', description: 'Deploy on web, mobile, Slack, WhatsApp, and more' },
  { icon: Shield, title: 'Enterprise Security', description: 'SOC 2 compliant with end-to-end encryption and role-based access' },
  { icon: Globe, title: 'White-label', description: 'Custom domains, remove branding, full design control' },
];

const presets = [
  { emoji: '🛍️', name: 'E-commerce', gradient: 'from-purple-500 to-pink-500' },
  { emoji: '☁️', name: 'SaaS', gradient: 'from-blue-500 to-cyan-500' },
  { emoji: '🏥', name: 'Healthcare', gradient: 'from-green-500 to-emerald-500' },
  { emoji: '💰', name: 'Finance', gradient: 'from-emerald-500 to-teal-500' },
  { emoji: '🎧', name: 'Support', gradient: 'from-rose-500 to-pink-500' },
  { emoji: '📚', name: 'Education', gradient: 'from-violet-500 to-indigo-500' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl">ChatFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button variant="gradient">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Chatbot Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Build Smarter
              <span className="text-gradient block mt-2">Chatbots in Minutes</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Create intelligent chatbots with drag-and-drop simplicity. Capture leads, boost sales, and deliver exceptional customer support 24/7.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="xl" variant="gradient">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="xl" variant="outline">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Powerful features to create, deploy, and optimize your AI chatbots</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Industry Presets</h2>
            <p className="text-muted-foreground">Pre-configured for your business type</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {presets.map((preset) => (
              <motion.div
                key={preset.name}
                whileHover={{ scale: 1.05 }}
                className="preset-card cursor-pointer text-center"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${preset.gradient} flex items-center justify-center text-xl`}>
                  {preset.emoji}
                </div>
                <p className="text-sm font-medium">{preset.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 ChatFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
