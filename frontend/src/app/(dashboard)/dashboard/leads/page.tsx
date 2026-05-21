'use client';

import { useState } from 'react';
import { useLeads } from '@/hooks/use-leads';
import { useChatbots } from '@/hooks/use-chatbots';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Users, Search, Filter, Mail, Phone, Star } from 'lucide-react';
import { formatRelativeDate } from '@/lib/utils';

const statusVariants: Record<string, 'success' | 'warning' | 'info' | 'premium' | 'destructive' | 'secondary'> = {
  new: 'success',
  qualified: 'info',
  contacted: 'warning',
  converted: 'premium',
  lost: 'destructive',
  spam: 'secondary',
};

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [chatbotFilter, setChatbotFilter] = useState('');
  const { leads, total, isLoading } = useLeads({
    status: statusFilter || undefined,
    chatbotId: chatbotFilter || undefined,
    search: search || undefined,
  });
  const { chatbots } = useChatbots();

  return (
    <div>
      <PageHeader
        title="Leads"
        description={`${total || 0} total leads`}
      />

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
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
      ) : !leads || leads.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No leads captured yet"
          description="Leads will appear here when visitors interact with your chatbots."
        />
      ) : (
        <div className="space-y-2">
          {leads.map((lead: any) => (
            <div
              key={lead.id}
              className="flex items-center justify-between rounded-xl border border-border/50 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium text-sm">
                  {(lead.name || '?')[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{lead.name || 'Anonymous'}</p>
                    {lead.score > 0 && (
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs">{lead.score}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {lead.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {lead.email}
                      </span>
                    )}
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {lead.phone}
                      </span>
                    )}
                    <span>via {lead.chatbot.name}</span>
                    <span>{formatRelativeDate(lead.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {lead.tags?.length > 0 && (
                  <div className="hidden md:flex gap-1">
                    {lead.tags.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                )}
                <Badge variant={statusVariants[lead.status] || 'secondary'}>
                  {lead.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
