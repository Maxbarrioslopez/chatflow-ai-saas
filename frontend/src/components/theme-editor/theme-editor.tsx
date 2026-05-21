'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumWidget } from '@/components/chatbot-widget/premium-widget';
import {
  Palette,
  Eye,
  Type,
  Layout,
  Sparkles,
  Image,
  Paintbrush,
  RefreshCw,
} from 'lucide-react';

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  position: 'left' | 'right';
  theme: 'light' | 'dark' | 'auto';
  headerStyle: 'default' | 'minimal' | 'gradient' | 'glass';
  bubbleStyle: 'rounded' | 'square' | 'pill';
  animation: 'none' | 'subtle' | 'smooth' | 'bouncy';
  showBranding: boolean;
  welcomeMessage: string;
  inputPlaceholder: string;
  glassEffect: boolean;
  darkMode: boolean;
  headerGradient: string;
}

const fonts = [
  'Inter', 'System', 'Georgia', 'Arial', 'Helvetica', 'Times New Roman',
  'Courier New', 'Roboto', 'Poppins', 'Plus Jakarta Sans',
];

export function ThemeEditor() {
  const [config, setConfig] = useState<ThemeConfig>({
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    fontFamily: 'Inter',
    borderRadius: 'md',
    position: 'right',
    theme: 'light',
    headerStyle: 'gradient',
    bubbleStyle: 'rounded',
    animation: 'smooth',
    showBranding: true,
    welcomeMessage: 'Hello! How can I help you today?',
    inputPlaceholder: 'Type your message...',
    glassEffect: true,
    darkMode: false,
    headerGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  });

  const presetThemes = [
    { name: 'Default', primary: '#6366f1', secondary: '#8b5cf6' },
    { name: 'Ocean', primary: '#0ea5e9', secondary: '#06b6d4' },
    { name: 'Sunset', primary: '#f97316', secondary: '#ef4444' },
    { name: 'Emerald', primary: '#10b981', secondary: '#059669' },
    { name: 'Rose', primary: '#f43f5e', secondary: '#e11d48' },
    { name: 'Midnight', primary: '#1e293b', secondary: '#334155' },
    { name: 'Purple Haze', primary: '#a855f7', secondary: '#d946ef' },
    { name: 'Cyber', primary: '#06b6d4', secondary: '#8b5cf6' },
  ];

  const update = <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-primary" />
            Theme Editor
          </h2>
          <p className="text-sm text-muted-foreground">Customize every aspect of your chatbot appearance</p>
        </div>

        {/* Color Presets */}
        <div className="space-y-3">
          <Label>Quick Presets</Label>
          <div className="flex flex-wrap gap-2">
            {presetThemes.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  update('primaryColor', preset.primary);
                  update('secondaryColor', preset.secondary);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex gap-0.5">
                  <div className="h-5 w-5 rounded-full" style={{ background: preset.primary }} />
                  <div className="h-5 w-5 rounded-full" style={{ background: preset.secondary }} />
                </div>
                <span className="text-xs font-medium">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="colors">
          <TabsList>
            <TabsTrigger value="colors"><Palette className="mr-2 h-4 w-4" /> Colors</TabsTrigger>
            <TabsTrigger value="typography"><Type className="mr-2 h-4 w-4" /> Typography</TabsTrigger>
            <TabsTrigger value="layout"><Layout className="mr-2 h-4 w-4" /> Layout</TabsTrigger>
            <TabsTrigger value="effects"><Sparkles className="mr-2 h-4 w-4" /> Effects</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-xl border-2" style={{ backgroundColor: config.primaryColor }} />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => update('primaryColor', e.target.value)}
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-xl border-2" style={{ backgroundColor: config.secondaryColor }} />
                  <Input
                    value={config.secondaryColor}
                    onChange={(e) => update('secondaryColor', e.target.value)}
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Header Gradient</Label>
              <Select value={config.headerStyle} onValueChange={(v: any) => update('headerStyle', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Solid</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select value={config.fontFamily} onValueChange={(v) => update('fontFamily', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {fonts.map((f) => (
                    <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <Select value={config.borderRadius} onValueChange={(v: any) => update('borderRadius', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="sm">Small (8px)</SelectItem>
                  <SelectItem value="md">Medium (16px)</SelectItem>
                  <SelectItem value="lg">Large (24px)</SelectItem>
                  <SelectItem value="full">Full (rounded)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bubble Style</Label>
              <Select value={config.bubbleStyle} onValueChange={(v: any) => update('bubbleStyle', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="pill">Pill</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-2">
              <Label>Position</Label>
              <Select value={config.position} onValueChange={(v: any) => update('position', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Animation</Label>
              <Select value={config.animation} onValueChange={(v: any) => update('animation', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="subtle">Subtle</SelectItem>
                  <SelectItem value="smooth">Smooth</SelectItem>
                  <SelectItem value="bouncy">Bouncy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Welcome Message</Label>
              <Input
                value={config.welcomeMessage}
                onChange={(e) => update('welcomeMessage', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Input Placeholder</Label>
              <Input
                value={config.inputPlaceholder}
                onChange={(e) => update('inputPlaceholder', e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <div className="flex items-center justify-between">
              <div><Label>Glass Effect</Label><p className="text-xs text-muted-foreground">Frosted glass background</p></div>
              <Switch checked={config.glassEffect} onCheckedChange={(v) => update('glassEffect', v)} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Dark Mode</Label><p className="text-xs text-muted-foreground">Dark theme for widget</p></div>
              <Switch checked={config.darkMode} onCheckedChange={(v) => update('darkMode', v)} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Show Branding</Label><p className="text-xs text-muted-foreground">Powered by ChatFlow</p></div>
              <Switch checked={config.showBranding} onCheckedChange={(v) => update('showBranding', v)} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button variant="gradient" className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" /> Apply Theme
          </Button>
          <Button variant="outline">Reset</Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="relative min-h-[500px] rounded-2xl border border-border bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-muted-foreground">Live Preview</span>
        </div>
        <div className="flex items-end justify-end h-full p-6">
          <PremiumWidget
            config={{
              id: 'preview',
              name: 'Preview',
              appearance: config,
              behavior: {
                initialMessage: config.welcomeMessage,
                suggestedMessages: ['Help', 'Pricing', 'Contact'],
                showTypingIndicator: true,
              },
            }}
            mode="inline"
          />
        </div>
      </div>
    </div>
  );
}
