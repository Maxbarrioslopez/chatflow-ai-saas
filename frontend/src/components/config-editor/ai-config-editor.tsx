'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { Brain, Cpu } from 'lucide-react';

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
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/chatbots/${chatbotId}/ai-config`, form);
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
            <CardDescription>Configure the AI model and behavior</CardDescription>
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
                <SelectItem value="azure">Azure OpenAI</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Input
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="gpt-4o-mini"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>System Prompt</Label>
          <Textarea
            value={form.systemPrompt}
            onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
            rows={5}
            placeholder="You are a helpful assistant..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Temperature ({form.temperature})</Label>
            <Input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={form.temperature}
              onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Tokens</Label>
            <Input
              type="number"
              value={form.maxTokens}
              onChange={(e) => setForm({ ...form, maxTokens: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Top P ({form.topP})</Label>
            <Input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={form.topP}
              onChange={(e) => setForm({ ...form, topP: parseFloat(e.target.value) })}
            />
          </div>
        </div>

        <Button variant="gradient" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save AI Config'}
        </Button>
      </CardContent>
    </Card>
  );
}
