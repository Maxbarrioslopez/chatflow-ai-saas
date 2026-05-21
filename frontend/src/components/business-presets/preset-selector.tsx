'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BUSINESS_PRESETS } from '@chatflow/shared';
import { Sparkles } from 'lucide-react';

interface PresetSelectorProps {
  selected: string | null;
  onSelect: (presetId: string) => void;
}

export function PresetSelector({ selected, onSelect }: PresetSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">Choose a business preset</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {BUSINESS_PRESETS.map((preset) => (
          <motion.button
            key={preset.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(preset.id)}
            className={cn(
              'relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200',
              selected === preset.id
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                : 'border-border/50 hover:border-primary/50 bg-card hover:shadow-md',
            )}
          >
            <div className={cn(
              'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-xl mb-3',
              preset.gradient,
            )}>
              {preset.icon}
            </div>
            <p className="font-medium text-sm mb-1">{preset.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{preset.description}</p>
            {selected === preset.id && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
