'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { PromptEditor } from '@/components/prompt-studio/prompt-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChatbots } from '@/hooks/use-chatbots';
import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PromptsPage() {
  const { chatbots } = useChatbots();
  const [selectedId, setSelectedId] = useState('');

  return (
    <div>
      <PageHeader
        title="Prompt Studio"
        description="Craft, test, and version your AI prompts"
        actions={
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select chatbot" />
            </SelectTrigger>
            <SelectContent>
              {chatbots.map((bot: any) => (
                <SelectItem key={bot.id} value={bot.id}>{bot.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {selectedId ? (
        <PromptEditor chatbotId={selectedId} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Select a Chatbot</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Choose a chatbot above to edit its system prompt and configure variables.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
