'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Save,
  RotateCcw,
  Play,
  Variable,
  Eye,
  Code,
  History,
  Sparkles,
  Plus,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptVariable {
  name: string;
  value: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

interface PromptVersion {
  id: string;
  version: number;
  content: string;
  createdAt: string;
}

interface PromptEditorProps {
  chatbotId: string;
  initialContent?: string;
  initialVariables?: PromptVariable[];
  versions?: PromptVersion[];
}

export function PromptEditor({
  chatbotId,
  initialContent = 'You are a helpful assistant for {{company_name}}.\n\nContext:\n- Company: {{company_name}}\n- Industry: {{industry}}\n- User: {{user_name}}\n\nRespond professionally and helpfully.',
  initialVariables = [
    { name: 'company_name', value: 'Acme Corp', type: 'text' },
    { name: 'industry', value: 'Technology', type: 'text' },
    { name: 'user_name', value: 'Visitor', type: 'text' },
  ],
  versions = [],
}: PromptEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [variables, setVariables] = useState<PromptVariable[]>(initialVariables);
  const [isDirty, setIsDirty] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
    setIsDirty(true);
  }, []);

  const addVariable = useCallback(() => {
    setVariables([...variables, { name: '', value: '', type: 'text' }]);
  }, [variables]);

  const removeVariable = useCallback((index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  }, [variables]);

  const updateVariable = useCallback((index: number, field: keyof PromptVariable, value: string) => {
    const updated = [...variables];
    (updated[index] as any)[field] = value;
    setVariables(updated);
  }, [variables]);

  const replaceVariables = useCallback((template: string, vals: PromptVariable[]): string => {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const variable = vals.find((v) => v.name === key);
      return variable?.value || `{{${key}}}`;
    });
  }, []);

  const handleTest = useCallback(async () => {
    setIsTesting(true);
    const filled = replaceVariables(content, variables);
    const fullPrompt = `${filled}\n\nUser: ${testInput || 'Hello!'}`;

    setTimeout(() => {
      setTestOutput(`🤖 AI Response Simulation\n\nPrompt used:\n${fullPrompt}\n\n[This is a test preview. Connect AI provider to get real responses.]`);
      setIsTesting(false);
      setActiveTab('preview');
    }, 800);
  }, [content, variables, testInput, replaceVariables]);

  const handleSave = useCallback(() => {
    setIsDirty(false);
  }, []);

  const detectedVariables = content.match(/\{\{(\w+)\}\}/g)?.map((v) => v.slice(2, -2)) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Prompt Studio</h2>
            <p className="text-sm text-muted-foreground">
              Craft and test your AI assistant&apos;s system prompt
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <Badge variant="warning" className="gap-1">
              <AlertCircle className="h-3 w-3" /> Unsaved
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1">
            v{versions.length + 1}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="editor"><Code className="mr-2 h-4 w-4" /> Editor</TabsTrigger>
          <TabsTrigger value="variables"><Variable className="mr-2 h-4 w-4" /> Variables ({detectedVariables.length})</TabsTrigger>
          <TabsTrigger value="preview"><Eye className="mr-2 h-4 w-4" /> Preview</TabsTrigger>
          <TabsTrigger value="history"><History className="mr-2 h-4 w-4" /> History</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <div className="relative">
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={16}
              className="font-mono text-sm leading-relaxed resize-none"
              placeholder="Enter your system prompt..."
            />
            {detectedVariables.length > 0 && (
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                {detectedVariables.map((v) => (
                  <Badge
                    key={v}
                    variant="premium"
                    className="text-[10px] cursor-pointer"
                    onClick={() => {
                      const varIndex = variables.findIndex((x) => x.name === v);
                      if (varIndex >= 0) {
                        setActiveTab('variables');
                      } else {
                        addVariable();
                        // Will be added
                      }
                    }}
                  >
                    {'{{'}{v}{'}}'}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsDirty(false)}>
                <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleTest}>
                <Play className="mr-1.5 h-4 w-4" /> Test
              </Button>
              <Button variant="gradient" size="sm" onClick={handleSave} disabled={!isDirty}>
                <Save className="mr-1.5 h-4 w-4" /> Save Version
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="variables">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Template Variables</CardTitle>
                <Button variant="outline" size="sm" onClick={addVariable}>
                  <Plus className="mr-1 h-4 w-4" /> Add Variable
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {variables.map((variable, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                >
                  <Variable className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-[10px]">Name</Label>
                      <Input
                        size={1}
                        value={variable.name}
                        onChange={(e) => updateVariable(index, 'name', e.target.value)}
                        placeholder="variable_name"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px]">Test Value</Label>
                      <Input
                        size={1}
                        value={variable.value}
                        onChange={(e) => updateVariable(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px]">Type</Label>
                      <select
                        value={variable.type}
                        onChange={(e) => updateVariable(index, 'type', e.target.value)}
                        className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="select">Select</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => removeVariable(index)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
              {variables.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No variables yet. Use {'{{variable_name}}'} syntax in your prompt.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Prompt Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Test Message</Label>
                <div className="flex gap-2">
                  <Input
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Enter a test message..."
                  />
                  <Button variant="outline" onClick={handleTest} disabled={isTesting}>
                    {isTesting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Resolved Prompt</Label>
                <div className="rounded-xl bg-muted p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {replaceVariables(content, variables)}
                </div>
              </div>

              {testOutput && (
                <div className="space-y-2">
                  <Label>AI Response</Label>
                  <div className="rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 p-4 text-sm">
                    {testOutput}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Version History</CardTitle>
            </CardHeader>
            <CardContent>
              {versions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No versions saved yet. Click &quot;Save Version&quot; to create one.
                </p>
              ) : (
                <div className="space-y-2">
                  {versions.map((v) => (
                    <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">v{v.version}</Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(v.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">Restore</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
