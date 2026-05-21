'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentUploader } from '@/components/knowledge-base/document-uploader';
import { useChatbotsQuery } from '@/hooks/use-chatbots-query';
import { Brain, Loader2 } from 'lucide-react';

export default function KnowledgePage() {
  const { data: chatbots, isLoading: chatbotsLoading } = useChatbotsQuery();
  const [selectedChatbot, setSelectedChatbot] = useState('');

  return (
    <div>
      <PageHeader
        title="Knowledge Base"
        description="Manage your chatbot's knowledge sources"
        actions={
          <Select value={selectedChatbot} onValueChange={setSelectedChatbot}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select chatbot" />
            </SelectTrigger>
            <SelectContent>
              {chatbotsLoading ? (
                <SelectItem value="" disabled>Loading...</SelectItem>
              ) : (chatbots || []).length === 0 ? (
                <SelectItem value="" disabled>No chatbots found</SelectItem>
              ) : (
                (chatbots || []).map((bot: any) => (
                  <SelectItem key={bot.id} value={bot.id}>{bot.name}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        }
      />

      {selectedChatbot ? (
        <Card>
          <CardContent className="p-6">
            <DocumentUploader chatbotId={selectedChatbot} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Select a Chatbot</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Choose a chatbot from the dropdown above to manage its knowledge base documents.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
