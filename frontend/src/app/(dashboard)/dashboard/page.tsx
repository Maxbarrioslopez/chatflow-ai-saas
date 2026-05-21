'use client';

import { motion } from 'framer-motion';
import { useDashboardMetrics } from '@/hooks/use-analytics';
import { useChatbots } from '@/hooks/use-chatbots';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MessageSquare,
  Users,
  Bot,
  Activity,
  TrendingUp,
  Star,
  Zap,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatRelativeDate } from '@/lib/utils';
import { useConversations } from '@/hooks/use-conversations';

export default function DashboardPage() {
  const { metrics, isLoading: metricsLoading } = useDashboardMetrics('7d');
  const { chatbots, isLoading: botsLoading } = useChatbots();
  const { conversations, isLoading: convsLoading } = useConversations();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your chatbot platform at a glance"
        actions={
          <Link href="/dashboard/chatbots/new">
            <Button variant="gradient">
              <Zap className="mr-2 h-4 w-4" />
              New Chatbot
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {metricsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-24" /></CardContent></Card>
          ))
        ) : (
          <>
            <StatCard
              title="Total Conversations"
              value={metrics?.totalConversations || 0}
              icon={MessageSquare}
              trend={{ value: 12, positive: true }}
              gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
            />
            <StatCard
              title="Active Now"
              value={metrics?.activeConversations || 0}
              icon={Activity}
              trend={{ value: 8, positive: true }}
              gradient="bg-gradient-to-br from-emerald-500 to-green-500"
            />
            <StatCard
              title="Total Leads"
              value={metrics?.totalLeads || 0}
              icon={Users}
              trend={{ value: 23, positive: true }}
              gradient="bg-gradient-to-br from-purple-500 to-pink-500"
            />
            <StatCard
              title="Satisfaction"
              value={metrics ? `${Math.round(metrics.satisfactionRate)}%` : '0%'}
              icon={Star}
              trend={{ value: 5, positive: true }}
              gradient="bg-gradient-to-br from-amber-500 to-orange-500"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Conversations</CardTitle>
            <Link href="/dashboard/conversations" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {convsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : conversations && conversations.length > 0 ? (
              <div className="space-y-3">
                {conversations.slice(0, 5).map((conv: any) => (
                  <Link
                    key={conv.id}
                    href={`/dashboard/conversations`}
                    className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {conv.visitorName || 'Anonymous'}
                        </p>
                        <p className="text-xs text-muted-foreground">{conv.messageCount} messages</p>
                      </div>
                    </div>
                    <Badge variant={conv.status === 'active' ? 'success' : 'secondary'}>
                      {conv.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No conversations yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Your Chatbots</CardTitle>
            <Link href="/dashboard/chatbots" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {botsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : chatbots.length > 0 ? (
              <div className="space-y-3">
                {chatbots.map((bot: any) => (
                  <Link
                    key={bot.id}
                    href={`/dashboard/chatbots/${bot.id}`}
                    className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{bot.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {bot.totalConversations} conversations · {bot.totalLeads} leads
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={bot.isActive ? 'success' : 'secondary'}>
                        {bot.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(bot.lastActivity)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">No chatbots created yet</p>
                <Link href="/dashboard/chatbots/new">
                  <Button size="sm">Create your first chatbot</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
