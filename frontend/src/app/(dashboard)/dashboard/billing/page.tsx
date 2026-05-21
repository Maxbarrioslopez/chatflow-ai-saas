'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { cn } from '@/lib/utils';
import { PLANS } from '@chatmbl/shared';
import { Check, Zap, ArrowRight, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BillingPage() {
  const [interval, setInterval] = useState<'month' | 'year'>('month');

  return (
    <div>
      <PageHeader
        title="Billing"
        description="Manage your subscription and billing"
      />

      <div className="flex items-center justify-center gap-2 mb-10">
        <button
          onClick={() => setInterval('month')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            interval === 'month' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => setInterval('year')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            interval === 'year' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
          )}
        >
          Yearly
          <Badge variant="success" className="ml-2 text-[10px]">Save 20%</Badge>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              'relative rounded-2xl border-2 p-6 transition-all duration-300',
              plan.isPopular
                ? 'border-primary shadow-xl shadow-primary/10 bg-primary/5'
                : 'border-border/50 hover:border-primary/50',
            )}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="premium" className="px-4 py-1">Most Popular</Badge>
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold">${interval === 'year' ? plan.price * 10 : plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={plan.isPopular ? 'gradient' : plan.price === 0 ? 'outline' : 'default'}
            >
              {plan.price === 0 ? 'Get Started' : 'Subscribe'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      <Card className="mt-8 max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No payment method added yet.</p>
          <Button variant="outline" className="mt-4">Add Payment Method</Button>
        </CardContent>
      </Card>
    </div>
  );
}
