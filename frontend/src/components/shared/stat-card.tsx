'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  gradient?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, gradient }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.positive ? 'text-emerald-500' : 'text-red-500',
                )}
              >
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl',
          gradient || 'bg-primary/10',
        )}>
          <Icon className={cn('h-6 w-6', gradient ? 'text-white' : 'text-primary')} />
        </div>
      </div>
    </motion.div>
  );
}
