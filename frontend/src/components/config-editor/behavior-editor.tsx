'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { api } from '@/lib/api';
import { Brain, Plus, X } from 'lucide-react';

interface BehaviorEditorProps {
  chatbotId: string;
  behavior: any;
}

export function BehaviorEditor({ chatbotId, behavior }: BehaviorEditorProps) {
  const [form, setForm] = useState({
    initialMessage: behavior?.initialMessage || 'Hello! How can I help?',
    maxMessagesPerSession: behavior?.maxMessagesPerSession || 100,
    inactivityTimeout: behavior?.inactivityTimeout || 300,
    showTypingIndicator: behavior?.showTypingIndicator ?? true,
    enableFeedback: behavior?.enableFeedback ?? true,
    collectLeadInfo: behavior?.collectLeadInfo ?? true,
    fallbackMessage: behavior?.fallbackMessage || "I'm sorry, I didn't understand that.",
  });
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(
    behavior?.suggestedMessages || ['Help', 'Pricing', 'Contact', 'Support']
  );
  const [newMessage, setNewMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const addSuggestedMessage = () => {
    if (newMessage.trim() && suggestedMessages.length < 6) {
      setSuggestedMessages([...suggestedMessages, newMessage.trim()]);
      setNewMessage('');
    }
  };

  const removeSuggestedMessage = (index: number) => {
    setSuggestedMessages(suggestedMessages.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/chatbots/${chatbotId}/behavior`, { ...form, suggestedMessages });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Behavior</CardTitle>
            <CardDescription>Configure how your chatbot interacts with visitors</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Initial Message</Label>
          <Input
            value={form.initialMessage}
            onChange={(e) => setForm({ ...form, initialMessage: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Suggested Messages</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {suggestedMessages.map((msg, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-3 py-1">
                {msg}
                <button onClick={() => removeSuggestedMessage(i)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Add a suggestion..."
              onKeyDown={(e) => e.key === 'Enter' && addSuggestedMessage()}
            />
            <Button variant="outline" size="icon" onClick={addSuggestedMessage}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Max Messages per Session</Label>
            <Input
              type="number"
              value={form.maxMessagesPerSession}
              onChange={(e) => setForm({ ...form, maxMessagesPerSession: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Inactivity Timeout (seconds)</Label>
            <Input
              type="number"
              value={form.inactivityTimeout}
              onChange={(e) => setForm({ ...form, inactivityTimeout: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><Label>Show Typing Indicator</Label></div>
            <Switch checked={form.showTypingIndicator} onCheckedChange={(v) => setForm({ ...form, showTypingIndicator: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Enable Feedback</Label></div>
            <Switch checked={form.enableFeedback} onCheckedChange={(v) => setForm({ ...form, enableFeedback: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Collect Lead Info</Label></div>
            <Switch checked={form.collectLeadInfo} onCheckedChange={(v) => setForm({ ...form, collectLeadInfo: v })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Fallback Message</Label>
          <Input
            value={form.fallbackMessage}
            onChange={(e) => setForm({ ...form, fallbackMessage: e.target.value })}
          />
        </div>

        <Button variant="gradient" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Behavior'}
        </Button>
      </CardContent>
    </Card>
  );
}
