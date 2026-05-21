'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { ArrowLeft, MessageSquare, Users, Activity, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { formatRelativeDate } from '@/lib/utils';

export default function ChatbotAnalyticsPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get(`/analytics/chatbot/${params.id}`)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const metrics = [
    { label: 'Total Conversations', value: data.metrics.totalConversations, icon: MessageSquare, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Active Conversations', value: data.metrics.activeConversations, icon: Activity, gradient: 'from-emerald-500 to-green-500' },
    { label: 'Total Leads', value: data.metrics.totalLeads, icon: Users, gradient: 'from-purple-500 to-pink-500' },
    { label: 'Total Messages', value: data.metrics.totalMessages, icon: MessageCircle, gradient: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/chatbots/${params.id}`} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span>Analytics: {data.chatbotName}</span>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{m.label}</p>
                  <p className="text-3xl font-bold mt-1">{m.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center`}>
                  <m.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentConversations.length > 0 ? (
            <div className="space-y-3">
              {data.recentConversations.map((conv: any) => (
                <div key={conv.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">
                      {conv.lead?.name || conv.lead?.email || 'Anonymous'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conv._count.messages} messages · {formatRelativeDate(conv.updatedAt)}
                    </p>
                  </div>
                  <Badge variant={conv.status === 'active' ? 'success' : 'secondary'}>
                    {conv.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No conversations yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
