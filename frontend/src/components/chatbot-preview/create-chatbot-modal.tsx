'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PresetSelector } from '@/components/business-presets/preset-selector';
import { ArrowRight, Bot } from 'lucide-react';

interface CreateChatbotModalProps {
  onClose: () => void;
  onCreate: (data: { name: string; description?: string; businessPreset: string }) => Promise<void>;
}

export function CreateChatbotModal({ onClose, onCreate }: CreateChatbotModalProps) {
  const [step, setStep] = useState<'preset' | 'details'>('preset');
  const [preset, setPreset] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!preset || !name) return;
    setLoading(true);
    try {
      await onCreate({ name, description: description || undefined, businessPreset: preset });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Create New Chatbot
          </DialogTitle>
          <DialogDescription>
            {step === 'preset' ? 'Choose a template to get started quickly' : 'Give your chatbot a name'}
          </DialogDescription>
        </DialogHeader>

        {step === 'preset' ? (
          <div>
            <PresetSelector selected={preset} onSelect={setPreset} />
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button
                variant="gradient"
                disabled={!preset}
                onClick={() => setStep('details')}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Chatbot Name</Label>
              <Input
                id="name"
                placeholder="My AI Assistant"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="A brief description of your chatbot..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => setStep('preset')}>
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button
                  variant="gradient"
                  disabled={!name || loading}
                  onClick={handleCreate}
                >
                  {loading ? 'Creating...' : 'Create Chatbot'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
