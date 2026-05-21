'use client';
/* Página de inicio - Landing Page con marketing, precios y login */
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Bot, BarChart3, MessageSquare, Users, Zap, Sparkles, Shield, Globe, Check, Star, ChevronRight, BookOpen, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLANS } from '@chatmbl/shared';

const features = [
  { icon: Bot, title: 'Smart Chatbots', description: 'AI-powered chatbots that understand context and provide human-like responses' },
  { icon: BarChart3, title: 'Rich Analytics', description: 'Track conversations, leads, and satisfaction with beautiful dashboards' },
  { icon: Users, title: 'Lead Capture', description: 'Automatically capture and qualify leads from conversations' },
  { icon: BookOpen, title: 'Knowledge Base', description: 'Upload PDFs, DOCX, or text. AI answers only from your content.' },
  { icon: Shield, title: 'Enterprise Security', description: 'Role-based access, content moderation, and audit logging' },
  { icon: Globe, title: 'White-label', description: 'Custom domains, remove branding, full design control' },
];

const testimonials = [
  { name: 'María García', role: 'CEO, TechStart', content: 'ChatMBL transformó nuestro soporte al cliente. Respuestas instantáneas 24/7.' },
  { name: 'Carlos López', role: 'CMO, EcomStore', content: 'Integración simple, resultados inmediatos. Nuestras ventas aumentaron 40%.' },
  { name: 'Ana Martínez', role: 'IT Director, ClinicaSalud', content: 'La base de conocimiento permite que el AI solo responda con información verificada.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header / Navegación */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl">ChatMBL</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features">Features</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#testimonials">Testimonials</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login"><Button variant="ghost">Sign in</Button></Link>
            <Link href="/register"><Button variant="gradient">Get Started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
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
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/register">
                <Button size="xl" variant="gradient">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="xl" variant="outline">
                  Sign In <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Check className="h-4 w-4 text-emerald-500" /> No credit card</span>
              <span className="flex items-center gap-1"><Check className="h-4 w-4 text-emerald-500" /> 14-day free trial</span>
              <span className="flex items-center gap-1"><Check className="h-4 w-4 text-emerald-500" /> Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features / Características */}
      <section id="features" className="py-20 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Powerful features to create, deploy, and optimize your AI chatbots</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Planes */}
      <section id="pricing" className="py-20 bg-muted/30 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Choose the plan that fits your needs. Upgrade anytime.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-xl ${plan.isPopular ? 'border-primary/50 bg-primary/5 scale-105' : 'border-border bg-card'}`}>
                {plan.isPopular && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary mb-3">
                    <Star className="h-3 w-3" /> Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> {plan.limits.maxConversations.toLocaleString()} conversations/mo</li>
                  <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Up to {plan.limits.maxChatbots} chatbots</li>
                  <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> {plan.limits.maxTeamMembers === 999 ? 'Unlimited' : `Up to ${plan.limits.maxTeamMembers}`} users</li>
                  {plan.features.slice(0, 4).map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> {f}</li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button variant={plan.isPopular ? 'gradient' : 'outline'} className="w-full">
                    {plan.price === 0 ? 'Get Started Free' : `Start ${plan.name}`}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by teams</h2>
            <p className="text-muted-foreground">See what our customers say</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border p-6 bg-card">
                <div className="flex gap-1 mb-4">{Array(5).fill(0).map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-muted-foreground mb-4">&ldquo;{t.content}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-t border-border/40">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-8">Create your first AI chatbot in minutes. No credit card required.</p>
          <Link href="/register">
            <Button size="xl" variant="gradient">Start Free Trial <ArrowRight className="ml-2 h-5 w-5" /></Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">ChatMBL</span>
          </div>
          <p>© 2024 ChatMBL. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-foreground transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
