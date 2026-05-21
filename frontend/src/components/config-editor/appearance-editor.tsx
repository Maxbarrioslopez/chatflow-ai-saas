'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { api } from '@/lib/api';
import { Palette } from 'lucide-react';

interface AppearanceEditorProps {
  chatbotId: string;
  appearance: any;
}

export function AppearanceEditor({ chatbotId, appearance }: AppearanceEditorProps) {
  const [form, setForm] = useState({
    primaryColor: appearance?.primaryColor || '#6366f1',
    fontFamily: appearance?.fontFamily || 'Inter',
    position: appearance?.position || 'right',
    borderRadius: appearance?.borderRadius || 'md',
    theme: appearance?.theme || 'light',
    headerStyle: appearance?.headerStyle || 'default',
    bubbleStyle: appearance?.bubbleStyle || 'rounded',
    showBranding: appearance?.showBranding ?? true,
    welcomeMessage: appearance?.welcomeMessage || 'Hello! How can I help?',
    inputPlaceholder: appearance?.inputPlaceholder || 'Type your message...',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/chatbots/${chatbotId}/appearance`, form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your chatbot</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <div
                  className="h-10 w-10 rounded-lg border-2 border-border cursor-pointer"
                  style={{ backgroundColor: form.primaryColor }}
                />
                <Input
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select value={form.fontFamily} onValueChange={(v) => setForm({ ...form, fontFamily: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Position</Label>
              <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <Select value={form.borderRadius} onValueChange={(v) => setForm({ ...form, borderRadius: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={form.theme} onValueChange={(v) => setForm({ ...form, theme: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Header Style</Label>
              <Select value={form.headerStyle} onValueChange={(v) => setForm({ ...form, headerStyle: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bubble Style</Label>
              <Select value={form.bubbleStyle} onValueChange={(v) => setForm({ ...form, bubbleStyle: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="pill">Pill</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Branding</Label>
              <p className="text-sm text-muted-foreground">Display "Powered by ChatMBL"</p>
            </div>
            <Switch checked={form.showBranding} onCheckedChange={(v) => setForm({ ...form, showBranding: v })} />
          </div>

          <div className="space-y-2">
            <Label>Welcome Message</Label>
            <Input
              value={form.welcomeMessage}
              onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Input Placeholder</Label>
            <Input
              value={form.inputPlaceholder}
              onChange={(e) => setForm({ ...form, inputPlaceholder: e.target.value })}
            />
          </div>

          <Button variant="gradient" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Appearance'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
