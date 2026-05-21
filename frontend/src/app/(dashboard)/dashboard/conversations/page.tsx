'use client';

import { useState } from 'react';
import { useConversations } from '@/hooks/use-conversations';
import { useChatbots } from '@/hooks/use-chatbots';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { MessageSquare, Search, Filter } from 'lucide-react';
import { formatRelativeDate } from '@/lib/utils';

const statusColors: Record<string, 'success' | 'warning' | 'secondary' | 'info' | 'destructive'> = {
  active: 'success',
  waiting: 'warning',
  resolved: 'info',
  closed: 'secondary',
  spam: 'destructive',
};

export default function ConversationsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [chatbotFilter, setChatbotFilter] = useState('');
  const { conversations, total, isLoading } = useConversations({
    status: statusFilter || undefined,
    chatbotId: chatbotFilter || undefined,
  });
  const { chatbots } = useChatbots();

  return (
    <div>
      <PageHeader
        title="Conversations"
        description={`${total || 0} total conversations`}
      />

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chatbotFilter} onValueChange={setChatbotFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chatbot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chatbots</SelectItem>
                {chatbots.map((bot: any) => (
                  <SelectItem key={bot.id} value={bot.id}>{bot.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !conversations || conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No conversations found"
          description="When visitors interact with your chatbot, their conversations will appear here."
        />
      ) : (
        <div className="space-y-2">
          {conversations.map((conv: any) => (
            <div
              key={conv.id}
              className="flex items-center justify-between rounded-xl border border-border/50 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {conv.visitorName || conv.lead?.name || conv.visitorEmail || 'Anonymous'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {conv.messageCount} messages · {formatRelativeDate(conv.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {conv.lead && (
                  <Badge variant="premium" className="hidden sm:inline-flex">Lead</Badge>
                )}
                <Badge variant={statusColors[conv.status] || 'secondary'}>
                  {conv.status}
                </Badge>
                {conv.rating && (
                  <span className="text-sm text-amber-500 hidden md:inline">{'★'.repeat(conv.rating)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
