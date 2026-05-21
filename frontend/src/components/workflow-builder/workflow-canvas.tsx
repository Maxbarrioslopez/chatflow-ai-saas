'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  icon: any;
  config: Record<string, any>;
}

const nodeTypes = [
  { type: 'trigger', label: 'Trigger', icon: Zap, color: 'from-emerald-500 to-green-500' },
  { type: 'condition', label: 'Condition', icon: GitBranch, color: 'from-amber-500 to-orange-500' },
  { type: 'ai', label: 'AI Action', icon: Brain, color: 'from-purple-500 to-pink-500' },
  { type: 'message', label: 'Send Message', icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
  { type: 'email', label: 'Send Email', icon: Mail, color: 'from-rose-500 to-pink-500' },
  { type: 'webhook', label: 'Webhook', icon: Globe, color: 'from-violet-500 to-indigo-500' },
  { type: 'delay', label: 'Delay', icon: Clock, color: 'from-gray-500 to-slate-500' },
  { type: 'handoff', label: 'Human Handoff', icon: UserPlus, color: 'from-teal-500 to-cyan-500' },
];

export function WorkflowCanvas() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);

  const addNode = (type: string) => {
    const nodeType = nodeTypes.find((n) => n.type === type);
    if (!nodeType) return;
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      label: nodeType.label,
      icon: nodeType.icon,
      config: {},
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      {/* Node Palette */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Nodes</h3>
        <div className="grid gap-2">
          {nodeTypes.map((nodeType) => (
            <motion.button
              key={nodeType.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addNode(nodeType.type)}
              className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all text-left"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${nodeType.color}`}>
                <nodeType.icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">{nodeType.label}</p>
                <p className="text-xs text-muted-foreground">Add to workflow</p>
              </div>
              <Plus className="h-4 w-4 text-muted-foreground ml-auto" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative min-h-[500px] rounded-2xl border-2 border-dashed border-border bg-muted/20 p-6">
        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
              <GitBranch className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">Empty Workflow</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Add nodes from the palette to build your automation workflow.
              Start with a trigger, then add conditions and actions.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-sm"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${nodeTypes.find(t => t.type === node.type)?.color || 'from-gray-500 to-slate-500'}`}>
                  <node.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{node.label}</p>
                    <Badge variant="secondary" className="text-[10px]">{index + 1}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Click to configure this node</p>
                </div>
                <button
                  onClick={() => removeNode(node.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
