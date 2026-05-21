'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatbots } from '@/hooks/use-chatbots';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bot,
  Plus,
  Settings,
  Trash2,
  ExternalLink,
  Power,
  PowerOff,
  MessageSquare,
  Users,
  Sparkles,
} from 'lucide-react';
import { formatRelativeDate } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CreateChatbotModal } from '@/components/chatbot-preview/create-chatbot-modal';

export default function ChatbotsPage() {
  const { chatbots, isLoading, createChatbot, deleteChatbot, toggleActive } = useChatbots();
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="Chatbots"
        description="Manage your AI chatbot assistants"
        actions={
          <Button variant="gradient" onClick={() => setShowCreate(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Chatbot
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : chatbots.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No chatbots yet"
          description="Create your first AI chatbot to start capturing leads and engaging visitors."
          action={{ label: 'Create your first chatbot', onClick: () => setShowCreate(true) }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chatbots.map((bot: any, i: number) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{bot.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{bot.businessPreset}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleActive(bot.id, !bot.isActive)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title={bot.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {bot.isActive ? (
                          <Power className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <PowerOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{bot.totalConversations}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{bot.totalLeads}</span>
                    </div>
                    <Badge variant={bot.isActive ? 'success' : 'secondary'} className="ml-auto">
                      {bot.isActive ? 'Live' : 'Paused'}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mb-4">
                    Updated {formatRelativeDate(bot.lastActivity)}
                  </p>

                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/chatbots/${bot.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">
                        <Settings className="mr-1.5 h-3.5 w-3.5" />
                        Configure
                      </Button>
                    </Link>
                    <Link href={`/dashboard/chatbots/${bot.id}/preview`}>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:text-destructive"
                      onClick={() => deleteChatbot(bot.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateChatbotModal
          onClose={() => setShowCreate(false)}
          onCreate={async (data) => {
            const result = await createChatbot(data);
            setShowCreate(false);
            if (result) router.push(`/dashboard/chatbots/${(result as any).id}`);
          }}
        />
      )}
    </div>
  );
}
