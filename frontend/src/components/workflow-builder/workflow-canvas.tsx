'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Zap,
  GitBranch,
  MessageSquare,
  Mail,
  Globe,
  Clock,
  Brain,
  UserPlus,
  Trash2,
  GripVertical,
  Settings,
  Save,
  Play,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  description: string;
  icon: any;
  color: string;
  config: Record<string, any>;
  expanded: boolean;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  isActive: boolean;
}

const nodeTypes = [
  { type: 'trigger', label: 'Trigger', icon: Zap, color: 'from-emerald-500 to-green-500', description: 'Starts the workflow when an event occurs (e.g., message received, new lead)' },
  { type: 'condition', label: 'Condition', icon: GitBranch, color: 'from-amber-500 to-orange-500', description: 'Branches the flow based on conditions (e.g., message contains keyword)' },
  { type: 'ai', label: 'AI Action', icon: Brain, color: 'from-purple-500 to-pink-500', description: 'Send a prompt to AI and store the result' },
  { type: 'message', label: 'Send Message', icon: MessageSquare, color: 'from-blue-500 to-cyan-500', description: 'Send a predefined message to the visitor' },
  { type: 'email', label: 'Send Email', icon: Mail, color: 'from-rose-500 to-pink-500', description: 'Send an email notification' },
  { type: 'webhook', label: 'Webhook', icon: Globe, color: 'from-violet-500 to-indigo-500', description: 'Call an external API URL' },
  { type: 'delay', label: 'Delay', icon: Clock, color: 'from-gray-500 to-slate-500', description: 'Wait for a specified time before continuing' },
  { type: 'handoff', label: 'Human Handoff', icon: UserPlus, color: 'from-teal-500 to-cyan-500', description: 'Transfer conversation to a human agent' },
];

const nodeConfigForms: Record<string, React.FC<{ config: any; onChange: (c: any) => void }>> = {
  trigger: ({ config, onChange }) => (
    <div className="space-y-2">
      <Label>Trigger Event</Label>
      <Select value={config.event || 'message_received'} onValueChange={(v) => onChange({ ...config, event: v })}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="message_received">Message Received</SelectItem>
          <SelectItem value="lead_captured">Lead Captured</SelectItem>
          <SelectItem value="conversation_started">Conversation Started</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  condition: ({ config, onChange }) => (
    <div className="space-y-2">
      <Label>Field</Label>
      <Input value={config.field || ''} onChange={(e) => onChange({ ...config, field: e.target.value })} placeholder="message.content" />
      <Label>Operator</Label>
      <Select value={config.operator || 'contains'} onValueChange={(v) => onChange({ ...config, operator: v })}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="equals">Equals</SelectItem>
          <SelectItem value="contains">Contains</SelectItem>
          <SelectItem value="regex">Regex</SelectItem>
        </SelectContent>
      </Select>
      <Label>Value</Label>
      <Input value={config.value || ''} onChange={(e) => onChange({ ...config, value: e.target.value })} placeholder="keyword" />
    </div>
  ),
  ai: ({ config, onChange }) => (
    <div className="space-y-2">
      <Label>Prompt</Label>
      <Textarea value={config.prompt || ''} onChange={(e) => onChange({ ...config, prompt: e.target.value })} rows={3} placeholder="Analyze this message: {{message}}" />
      <Label>Model (optional)</Label>
      <Input value={config.model || ''} onChange={(e) => onChange({ ...config, model: e.target.value })} placeholder="gpt-4o-mini" />
    </div>
  ),
  message: ({ config, onChange }) => (
    <div className="space-y-2">
      <Label>Message</Label>
      <Textarea value={config.text || ''} onChange={(e) => onChange({ ...config, text: e.target.value })} rows={3} placeholder="Hello! How can I help you?" />
    </div>
  ),
  email: ({ config, onChange }) => (
    <div className="space-y-2">
      <Label>To</Label>
      <Input value={config.email || ''} onChange={(e) => onChange({ ...config, email: e.target.value })} placeholder="agent@company.com" />
      <Label>Subject</Label>
      <Input value={config.subject || ''} onChange={(e) => onChange({ ...config, subject: e.target.value })} placeholder="New lead from {{visitorName}}" />
    </div>
  ),
  webhook: ({ config, onChange }) => (
    <div className="space-y-2">
      <Label>URL</Label>
      <Input value={config.url || ''} onChange={(e) => onChange({ ...config, url: e.target.value })} placeholder="https://api.example.com/webhook" />
      <Label>Method</Label>
      <Select value={config.method || 'POST'} onValueChange={(v) => onChange({ ...config, method: v })}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="POST">POST</SelectItem>
          <SelectItem value="GET">GET</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  delay: ({ config, onChange }) => (
    <div className="space-y-2">
      <Label>Duration (seconds)</Label>
      <Input type="number" value={config.seconds || 60} onChange={(e) => onChange({ ...config, seconds: parseInt(e.target.value) })} min={1} max={3600} />
    </div>
  ),
  handoff: ({ config, onChange }) => (
    <div className="space-y-2">
      <Label>Channel</Label>
      <Select value={config.channel || 'email'} onValueChange={(v) => onChange({ ...config, channel: v })}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="slack">Slack</SelectItem>
          <SelectItem value="ticket">Support Ticket</SelectItem>
        </SelectContent>
      </Select>
      <Label>Destination</Label>
      <Input value={config.destination || ''} onChange={(e) => onChange({ ...config, destination: e.target.value })} placeholder="support@company.com" />
    </div>
  ),
};

export function WorkflowCanvas() {
  const [workflow, setWorkflow] = useState<Workflow>({
    id: 'new',
    name: 'New Workflow',
    description: 'An automation workflow for your chatbot',
    nodes: [],
    isActive: true,
  });

  const addNode = (type: string) => {
    const nodeType = nodeTypes.find((n) => n.type === type);
    if (!nodeType) return;
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      label: nodeType.label,
      description: nodeType.description,
      icon: nodeType.icon,
      color: nodeType.color,
      config: {},
      expanded: true,
    };
    setWorkflow({ ...workflow, nodes: [...workflow.nodes, newNode] });
  };

  const removeNode = (id: string) => {
    setWorkflow({ ...workflow, nodes: workflow.nodes.filter((n) => n.id !== id) });
  };

  const updateNodeConfig = (id: string, config: any) => {
    setWorkflow({
      ...workflow,
      nodes: workflow.nodes.map((n) => (n.id === id ? { ...n, config } : n)),
    });
  };

  const toggleNode = (id: string) => {
    setWorkflow({
      ...workflow,
      nodes: workflow.nodes.map((n) => (n.id === id ? { ...n, expanded: !n.expanded } : n)),
    });
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      {/* Node Palette */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Available Nodes</h3>
        <p className="text-xs text-muted-foreground mb-3">Click a node to add it to the workflow</p>
        <div className="grid gap-2">
          {nodeTypes.map((nodeType) => (
            <motion.button
              key={nodeType.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addNode(nodeType.type)}
              className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all text-left"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${nodeType.color} shrink-0`}>
                <nodeType.icon className="h-4 w-4 text-white" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-medium">{nodeType.label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{nodeType.description.slice(0, 60)}...</p>
              </div>
              <Plus className="h-4 w-4 text-muted-foreground ml-auto shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="space-y-4">
        {/* Workflow name & controls */}
        <div className="flex items-center gap-3">
          <Input
            value={workflow.name}
            onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
            className="text-lg font-semibold border-0 bg-transparent px-0 max-w-xs"
          />
          <Badge variant={workflow.isActive ? 'success' : 'secondary'} className="ml-auto">
            {workflow.isActive ? 'Active' : 'Draft'}
          </Badge>
        </div>

        <div className="relative min-h-[400px] rounded-2xl border-2 border-dashed border-border bg-muted/20 p-4">
          {workflow.nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <GitBranch className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">Empty Workflow</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Add nodes from the palette on the left to build your automation. Each node performs a specific action in the workflow.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Connector line between nodes */}
              {workflow.nodes.map((node, index) => {
                const NodeConfigForm = nodeConfigForms[node.type];
                const Icon = node.icon;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-card border border-border shadow-sm overflow-hidden"
                  >
                    {/* Node header */}
                    <div
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => toggleNode(node.id)}
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground shrink-0 cursor-grab" />
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${node.color} shrink-0`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{node.label}</span>
                          <Badge variant="secondary" className="text-[10px]">Step {index + 1}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{node.description}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {node.expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>

                    {/* Node config */}
                    {node.expanded && NodeConfigForm && (
                      <div className="border-t border-border p-4 bg-muted/10">
                        <NodeConfigForm config={node.config} onChange={(c) => updateNodeConfig(node.id, c)} />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Add node button at end */}
              <div className="flex justify-center pt-2">
                <Button variant="outline" size="sm" onClick={() => document.querySelector('[data-palette]')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Plus className="h-4 w-4 mr-1" /> Add More Nodes
                </Button>
              </div>
            </div>
          )}
        </div>

        {workflow.nodes.length > 0 && (
          <div className="flex gap-2">
            <Button variant="gradient">
              <Save className="h-4 w-4 mr-1" /> Save Workflow
            </Button>
            <Button variant="outline">
              <Play className="h-4 w-4 mr-1" /> Test
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
