'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { ChatbotPreview } from '@/components/chatbot-preview/chatbot-preview';
import { AppearanceEditor } from '@/components/config-editor/appearance-editor';
import { BehaviorEditor } from '@/components/config-editor/behavior-editor';
import { AIConfigEditor } from '@/components/config-editor/ai-config-editor';
import { ModerationPanel } from '@/components/moderation/moderation-panel';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  Settings,
  Palette,
  Brain,
  Code,
  Eye,
  Bot,
  Loader2,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

interface ChatbotData {
  id: string;
  name: string;
  description: string | null;
  businessPreset: string;
  isActive: boolean;
  widgetToken: string;
  appearance: any;
  behavior: any;
  aiConfig: any;
  _count: { conversations: number; leads: number };
}

export default function ChatbotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [chatbot, setChatbot] = useState<ChatbotData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('config');

  useEffect(() => {
    fetchChatbot();
  }, [params.id]);

  const fetchChatbot = async () => {
    try {
      const data = await api.get<ChatbotData>(`/chatbots/${params.id}`);
      setChatbot(data);
    } catch {
      router.push('/dashboard/chatbots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWidgetCode = () => {
    if (!chatbot) return '';
    return `<script>
  window.chatflowConfig = {
    token: "${chatbot.widgetToken}",
    position: "${chatbot.appearance?.position || 'right'}",
    theme: "${chatbot.appearance?.theme || 'light'}"
  };
</script>
<script src="https://cdn.chatflow.ai/widget.js" async></script>`;
  };

  const copyWidgetCode = () => {
    navigator.clipboard.writeText(handleWidgetCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!chatbot) return null;

  return (
    <div>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Link href="/dashboard/chatbots" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{chatbot.name}</h1>
                  <Badge variant={chatbot.isActive ? 'success' : 'secondary'}>
                    {chatbot.isActive ? 'Live' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground capitalize">{chatbot.businessPreset} chatbot</p>
              </div>
            </div>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/chatbots/${chatbot.id}/analytics`}>
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-1.5 h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Power className={`mr-1.5 h-4 w-4 ${chatbot.isActive ? 'text-emerald-500' : ''}`} />
              {chatbot.isActive ? 'Active' : 'Inactive'}
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="config"><Settings className="mr-2 h-4 w-4" /> Configuration</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4" /> Appearance</TabsTrigger>
          <TabsTrigger value="behavior"><Brain className="mr-2 h-4 w-4" /> Behavior</TabsTrigger>
          <TabsTrigger value="ai"><Code className="mr-2 h-4 w-4" /> AI Config</TabsTrigger>
          <TabsTrigger value="preview"><Eye className="mr-2 h-4 w-4" /> Preview</TabsTrigger>
          <TabsTrigger value="embed"><Code className="mr-2 h-4 w-4" /> Embed</TabsTrigger>
          <TabsTrigger value="moderation"><Shield className="mr-2 h-4 w-4" /> Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic configuration for your chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={chatbot.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" defaultValue={chatbot.description || ''} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable the chatbot widget</p>
                </div>
                <Switch defaultChecked={chatbot.isActive} />
              </div>
              <Button variant="gradient">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceEditor chatbotId={chatbot.id} appearance={chatbot.appearance} />
        </TabsContent>

        <TabsContent value="behavior">
          <BehaviorEditor chatbotId={chatbot.id} behavior={chatbot.behavior} />
        </TabsContent>

        <TabsContent value="ai">
          <AIConfigEditor chatbotId={chatbot.id} aiConfig={chatbot.aiConfig} />
        </TabsContent>

        <TabsContent value="preview">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how your chatbot looks to visitors</CardDescription>
              </CardHeader>
              <CardContent>
                <ChatbotPreview chatbot={chatbot} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Widget Preview</CardTitle>
                <CardDescription>How it appears on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 min-h-[400px] overflow-hidden">
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="mt-8">
                    <ChatbotPreview chatbot={chatbot} embedded />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="embed">
          <Card>
            <CardHeader>
              <CardTitle>Embed Code</CardTitle>
              <CardDescription>Add this code to your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="rounded-xl bg-muted p-4 text-sm overflow-x-auto">
                  <code>{handleWidgetCode()}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={copyWidgetCode}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={fetchChatbot}>
                  <RefreshCw className="mr-1.5 h-4 w-4" />
                  Regenerate Token
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation">
          <Card>
            <CardHeader>
              <CardTitle>Moderation & Safety</CardTitle>
              <CardDescription>Configure content filtering, forbidden words, and safety rules for this chatbot</CardDescription>
            </CardHeader>
            <CardContent>
              <ModerationPanel chatbotId={chatbot.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
