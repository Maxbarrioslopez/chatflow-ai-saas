'use client';

import { useState } from 'react';
import { useDashboardMetrics } from '@/hooks/use-analytics';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  MessageSquare,
  Users,
  Star,
  MessageCircle,
  TrendingUp,
  Activity,
  Funnel,
  DollarSign,
  Cpu,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7d');
  const { metrics, isLoading } = useDashboardMetrics(period);

  const funnelData = [
    { stage: 'Visitors', value: 1247, color: 'from-blue-500 to-cyan-500' },
    { stage: 'Conversations', value: 892, color: 'from-emerald-500 to-green-500' },
    { stage: 'Leads', value: 345, color: 'from-purple-500 to-pink-500' },
    { stage: 'Qualified', value: 189, color: 'from-amber-500 to-orange-500' },
    { stage: 'Converted', value: 78, color: 'from-rose-500 to-red-500' },
  ];

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Deep insights into your chatbot performance"
        actions={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview"><Activity className="mr-2 h-4 w-4" /> Overview</TabsTrigger>
          <TabsTrigger value="funnel"><TrendingUp className="mr-2 h-4 w-4" /> Funnel</TabsTrigger>
          <TabsTrigger value="tokens"><Cpu className="mr-2 h-4 w-4" /> Token Usage</TabsTrigger>
          <TabsTrigger value="satisfaction"><Star className="mr-2 h-4 w-4" /> Satisfaction</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}><CardContent className="p-6"><Skeleton className="h-24" /></CardContent></Card>
              ))
            ) : (
              <>
                <StatCard title="Conversations" value={metrics?.totalConversations || 0} icon={MessageSquare} gradient="bg-gradient-to-br from-blue-500 to-cyan-500" trend={{ value: 12, positive: true }} />
                <StatCard title="Active Now" value={metrics?.activeConversations || 0} icon={Activity} gradient="bg-gradient-to-br from-emerald-500 to-green-500" trend={{ value: 8, positive: true }} />
                <StatCard title="Leads" value={metrics?.totalLeads || 0} icon={Users} gradient="bg-gradient-to-br from-purple-500 to-pink-500" trend={{ value: 23, positive: true }} />
                <StatCard title="Messages" value={metrics?.totalMessages || 0} icon={MessageCircle} gradient="bg-gradient-to-br from-amber-500 to-orange-500" />
              </>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-primary">
                      {metrics ? `${metrics.conversionRate.toFixed(1)}%` : '0%'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Conversation to lead conversion</p>
                    <div className="flex items-center justify-center gap-1 mt-2 text-sm text-emerald-500">
                      <ArrowUp className="h-4 w-4" />
                      <span>+5.2% vs last period</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Satisfaction Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-amber-500">
                      {metrics ? `${Math.round(metrics.satisfactionRate)}%` : '0%'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Average user satisfaction</p>
                    <div className="flex items-center justify-center gap-1 mt-2 text-sm text-emerald-500">
                      <ArrowUp className="h-4 w-4" />
                      <span>+2.1% vs last period</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {funnelData.map((stage, i) => {
                const maxVal = funnelData[0].value;
                const width = (stage.value / maxVal) * 100;
                const dropOff = i > 0 ? ((funnelData[i - 1].value - stage.value) / funnelData[i - 1].value) * 100 : 0;

                return (
                  <div key={stage.stage} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{stage.value.toLocaleString()}</span>
                        {i > 0 && (
                          <span className={cn('text-xs', dropOff > 0 ? 'text-red-500' : 'text-emerald-500')}>
                            {dropOff > 0 ? '-' : '+'}{Math.abs(dropOff).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative h-4 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${stage.color} transition-all duration-1000`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                AI Token Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Cpu className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold">Token tracking coming soon</p>
              <p className="text-sm text-muted-foreground">
                Connect your AI provider to see detailed token usage and cost breakdown.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold">No ratings yet</p>
              <p className="text-sm text-muted-foreground">
                Ratings will appear once visitors start providing feedback.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
