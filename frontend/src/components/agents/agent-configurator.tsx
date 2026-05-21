'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bot,
  Brain,
  Puzzle,
  Database,
  Zap,
  Plus,
  X,
  Settings,
  Play,
  Cpu,
  MessageSquare,
  Search,
  Globe,
  FileText,
  Mail,
  Clock,
} from 'lucide-react';

interface AgentTool {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  config: Record<string, any>;
}

interface AgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  memory: boolean;
  maxMemoryItems: number;
  tools: AgentTool[];
  reasoning: 'none' | 'simple' | 'cot' | 'tree';
  orchestration: 'sequential' | 'parallel' | 'dynamic';
}

const defaultTools: AgentTool[] = [
  { id: 'web_search', name: 'Web Search', description: 'Search the web for information', icon: Search, enabled: false, config: { engine: 'google' } },
  { id: 'browse', name: 'Browse Page', description: 'Read content from a URL', icon: Globe, enabled: false, config: {} },
  { id: 'read_doc', name: 'Read Document', description: 'Read uploaded documents', icon: FileText, enabled: true, config: { maxPages: 10 } },
  { id: 'calc', name: 'Calculator', description: 'Perform calculations', icon: Cpu, enabled: false, config: {} },
  { id: 'send_email', name: 'Send Email', description: 'Send an email message', icon: Mail, enabled: false, config: {} },
  { id: 'knowledge', name: 'Knowledge Base', description: 'Search knowledge base', icon: Database, enabled: true, config: { maxResults: 5 } },
  { id: 'handoff', name: 'Human Handoff', description: 'Transfer to human agent', icon: MessageSquare, enabled: false, config: {} },
];

export function AgentConfigurator() {
  const [config, setConfig] = useState<AgentConfig>({
    name: 'AI Agent',
    description: 'Intelligent assistant with tool access',
    systemPrompt: 'You are a helpful AI agent. Use your tools to answer user questions accurately.',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 4096,
    memory: true,
    maxMemoryItems: 20,
    tools: defaultTools,
    reasoning: 'cot',
    orchestration: 'dynamic',
  });

  const toggleTool = (toolId: string) => {
    setConfig((prev) => ({
      ...prev,
      tools: prev.tools.map((t) =>
        t.id === toolId ? { ...t, enabled: !t.enabled } : t,
      ),
    }));
  };

  const enabledTools = config.tools.filter((t) => t.enabled);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Agent Configuration</h2>
            <p className="text-sm text-muted-foreground">Configure AI agent capabilities and tools</p>
          </div>
        </div>
        <Badge variant="premium" className="gap-1">
          <Zap className="h-3 w-3" /> AI Agent
        </Badge>
      </div>

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic"><Settings className="mr-2 h-4 w-4" /> Basic</TabsTrigger>
          <TabsTrigger value="tools"><Puzzle className="mr-2 h-4 w-4" /> Tools ({enabledTools.length})</TabsTrigger>
          <TabsTrigger value="memory"><Database className="mr-2 h-4 w-4" /> Memory</TabsTrigger>
          <TabsTrigger value="reasoning"><Brain className="mr-2 h-4 w-4" /> Reasoning</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Agent Name</Label>
              <Input value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>AI Model</Label>
              <select
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={config.description} onChange={(e) => setConfig({ ...config, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>System Prompt</Label>
            <textarea
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Temperature ({config.temperature})</Label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Tokens</Label>
              <Input
                type="number"
                value={config.maxTokens}
                onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Orchestration</Label>
              <select
                value={config.orchestration}
                onChange={(e) => setConfig({ ...config, orchestration: e.target.value as any })}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="sequential">Sequential</option>
                <option value="parallel">Parallel</option>
                <option value="dynamic">Dynamic</option>
              </select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Available Tools</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {config.tools.map((tool) => (
                <motion.div
                  key={tool.id}
                  layout
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl border transition-all',
                    tool.enabled ? 'border-primary/30 bg-primary/5' : 'border-border',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      tool.enabled ? 'bg-primary/10' : 'bg-muted',
                    )}>
                      <tool.icon className={cn('h-5 w-5', tool.enabled ? 'text-primary' : 'text-muted-foreground')} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                  <Switch checked={tool.enabled} onCheckedChange={() => toggleTool(tool.id)} />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Conversation Memory</Label>
                  <p className="text-sm text-muted-foreground">Remember past context in conversations</p>
                </div>
                <Switch checked={config.memory} onCheckedChange={(v) => setConfig({ ...config, memory: v })} />
              </div>
              {config.memory && (
                <div className="space-y-2">
                  <Label>Max Memory Items</Label>
                  <Input
                    type="number"
                    value={config.maxMemoryItems}
                    onChange={(e) => setConfig({ ...config, maxMemoryItems: parseInt(e.target.value) })}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reasoning" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Reasoning Strategy</Label>
                <select
                  value={config.reasoning}
                  onChange={(e) => setConfig({ ...config, reasoning: e.target.value as any })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="none">None (Direct Response)</option>
                  <option value="simple">Simple Reasoning</option>
                  <option value="cot">Chain of Thought</option>
                  <option value="tree">Tree of Thoughts</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  {config.reasoning === 'none' && 'Agent responds directly without explicit reasoning'}
                  {config.reasoning === 'simple' && 'Agent shows basic step-by-step reasoning'}
                  {config.reasoning === 'cot' && 'Advanced chain-of-thought reasoning for complex tasks'}
                  {config.reasoning === 'tree' && 'Explores multiple reasoning paths and selects the best'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button variant="gradient">
        <Play className="mr-2 h-4 w-4" /> Save Agent Configuration
      </Button>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
