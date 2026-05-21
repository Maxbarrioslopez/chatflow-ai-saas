'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { Brain, Cpu, BookOpen, Save, Loader2 } from 'lucide-react';

interface AIConfigEditorProps {
  chatbotId: string;
  aiConfig: any;
}

export function AIConfigEditor({ chatbotId, aiConfig }: AIConfigEditorProps) {
  const [form, setForm] = useState({
    provider: aiConfig?.provider || 'openai',
    model: aiConfig?.model || 'gpt-4o-mini',
    temperature: aiConfig?.temperature || 0.7,
    maxTokens: aiConfig?.maxTokens || 2048,
    topP: aiConfig?.topP || 1,
    frequencyPenalty: aiConfig?.frequencyPenalty || 0,
    presencePenalty: aiConfig?.presencePenalty || 0,
    systemPrompt: aiConfig?.systemPrompt || 'You are a helpful assistant.',
    knowledgeOnly: aiConfig?.knowledgeOnly || false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/chatbots/${chatbotId}/ai-config`, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>AI Configuration</CardTitle>
            <CardDescription>Configure the AI model, behavior, and knowledge settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select value={form.provider} onValueChange={(v) => setForm({ ...form, provider: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="openrouter">OpenRouter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="gpt-4o-mini" />
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <Label className="text-sm font-medium">Knowledge-Only Mode</Label>
                <p className="text-xs text-muted-foreground">AI only responds using your knowledge base content. No general AI knowledge.</p>
              </div>
            </div>
            <Switch checked={form.knowledgeOnly} onCheckedChange={(v) => setForm({ ...form, knowledgeOnly: v })} />
          </div>
          {form.knowledgeOnly && (
            <div className="text-xs text-muted-foreground bg-background rounded-lg p-2 border">
              When enabled: the AI will ONLY use information from uploaded documents. If no relevant context is found, it will say so instead of guessing. Upload documents in the Knowledge Base tab.
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>System Prompt</Label>
          <Textarea value={form.systemPrompt} onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })} rows={5} placeholder="You are a helpful assistant..." />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Temperature ({form.temperature})</Label>
            <Input type="range" min="0" max="2" step="0.1" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>Max Tokens</Label>
            <Input type="number" value={form.maxTokens} onChange={(e) => setForm({ ...form, maxTokens: parseInt(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>Top P ({form.topP})</Label>
            <Input type="range" min="0" max="1" step="0.05" value={form.topP} onChange={(e) => setForm({ ...form, topP: parseFloat(e.target.value) })} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="gradient" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save AI Config'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
