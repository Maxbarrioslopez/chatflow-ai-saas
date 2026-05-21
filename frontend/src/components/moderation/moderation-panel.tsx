'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Shield,
  Plus,
  Trash2,
  AlertTriangle,
  Ban,
  Eye,
  LogIn,
  FileText,
  Check,
  X,
  Loader2,
  RefreshCw,
  TestTube,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  listRules,
  createRule,
  updateRule,
  deleteRule,
  bulkCreateRules,
  testRules,
  listEvents,
  type ModerationRule,
  type ModerationEvent,
} from '@/services/moderation.service';

interface ModerationPanelProps {
  chatbotId: string;
}

const ruleTypeLabels: Record<string, string> = {
  FORBIDDEN_WORD: 'Forbidden Word',
  FORBIDDEN_PHRASE: 'Forbidden Phrase',
  REGEX_PATTERN: 'Regex Pattern',
  SENSITIVE_DATA: 'Sensitive Data',
  PROMPT_INJECTION: 'Prompt Injection',
  CUSTOM: 'Custom',
};

const actionLabels: Record<string, { label: string; icon: any; color: string }> = {
  BLOCK_MESSAGE: { label: 'Block', icon: Ban, color: 'text-red-500' },
  WARN_USER: { label: 'Warn', icon: AlertTriangle, color: 'text-amber-500' },
  HUMAN_HANDOFF: { label: 'Handoff', icon: LogIn, color: 'text-blue-500' },
  MASK_CONTENT: { label: 'Mask', icon: Eye, color: 'text-purple-500' },
  LOG_ONLY: { label: 'Log', icon: FileText, color: 'text-gray-500' },
};

const severityColors: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-red-100 text-red-700',
  CRITICAL: 'bg-red-200 text-red-900',
};

export function ModerationPanel({ chatbotId }: ModerationPanelProps) {
  const [rules, setRules] = useState<ModerationRule[]>([]);
  const [events, setEvents] = useState<ModerationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [testText, setTestText] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [activeView, setActiveView] = useState<'rules' | 'events'>('rules');

  const [newRule, setNewRule] = useState({
    type: 'FORBIDDEN_WORD',
    value: '',
    action: 'BLOCK_MESSAGE',
    severity: 'MEDIUM',
    matchMode: 'CONTAINS',
    caseSensitive: false,
    notes: '',
  });

  const fetchRules = useCallback(async () => {
    try {
      setIsLoading(true);
      const [fetchedRules, fetchedEvents] = await Promise.all([
        listRules(chatbotId),
        listEvents(chatbotId, 20),
      ]);
      setRules(fetchedRules);
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [chatbotId]);

  useEffect(() => { if (chatbotId) fetchRules(); }, [chatbotId, fetchRules]);

  const handleCreate = async () => {
    if (!newRule.value.trim()) return;
    try {
      await createRule(chatbotId, newRule as any);
      setNewRule({ type: 'FORBIDDEN_WORD', value: '', action: 'BLOCK_MESSAGE', severity: 'MEDIUM', matchMode: 'CONTAINS', caseSensitive: false, notes: '' });
      setShowAdd(false);
      await fetchRules();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleToggle = async (rule: ModerationRule) => {
    try {
      await updateRule(chatbotId, rule.id, { enabled: !rule.enabled } as any);
      await fetchRules();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async (ruleId: string) => {
    try {
      await deleteRule(chatbotId, ruleId);
      await fetchRules();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleBulkImport = async () => {
    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const rules = lines.map((line) => ({
      type: 'FORBIDDEN_WORD' as const,
      value: line,
      action: 'BLOCK_MESSAGE' as const,
      severity: 'MEDIUM' as const,
    }));

    try {
      const result = await bulkCreateRules(chatbotId, rules);
      setBulkText('');
      setShowBulk(false);
      await fetchRules();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleTest = async () => {
    if (!testText.trim()) return;
    setIsTesting(true);
    try {
      const result = await testRules(chatbotId, testText);
      setTestResult(result.result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">Moderation & Safety</h3>
            <p className="text-sm text-muted-foreground">Manage content filters, forbidden words, and safety rules</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTest(!showTest)}>
            <TestTube className="mr-1.5 h-4 w-4" /> Test
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setShowBulk(!showBulk); setShowAdd(false); }}>
            <FileText className="mr-1.5 h-4 w-4" /> Bulk Import
          </Button>
          <Button variant="gradient" size="sm" onClick={() => { setShowAdd(!showAdd); setShowBulk(false); }}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Rule
          </Button>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 text-red-700 text-sm"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded"><X className="h-3 w-3" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Panel */}
      <AnimatePresence>
        {showTest && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label>Test moderation against text</Label>
                <Textarea value={testText} onChange={(e) => setTestText(e.target.value)} rows={3} placeholder="Enter text to test..." />
                <div className="flex gap-2">
                  <Button variant="gradient" size="sm" onClick={handleTest} disabled={isTesting || !testText.trim()}>
                    {isTesting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <TestTube className="h-4 w-4 mr-1" />}
                    Test
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setTestText(''); setTestResult(null); }}>Clear</Button>
                </div>
                {testResult && (
                  <div className={cn('p-3 rounded-xl text-sm', testResult.blocked ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200')}>
                    <p className={cn('font-semibold mb-1', testResult.blocked ? 'text-red-700' : 'text-emerald-700')}>
                      {testResult.blocked ? '⚠️ Blocked' : '✅ Passed'}
                    </p>
                    {testResult.matchedRules?.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {testResult.matchedRules.map((r: any, i: number) => (
                          <div key={i} className="text-xs text-muted-foreground">
                            Matched: <strong>{r.type}</strong> → {actionLabels[r.action]?.label || r.action} (value: &quot;{r.matchedValue}&quot;)
                          </div>
                        ))}
                      </div>
                    )}
                    {testResult.matchedRules?.length === 0 && <p className="text-xs text-muted-foreground mt-1">No rules matched.</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Import */}
      <AnimatePresence>
        {showBulk && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label>Bulk Import — one term per line</Label>
                <Textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={6} placeholder="badword1&#10;badword2&#10;bad phrase&#10;another term" />
                <p className="text-xs text-muted-foreground">Each line becomes a FORBIDDEN_WORD rule with BLOCK_MESSAGE action. Duplicates are skipped.</p>
                <Button variant="gradient" size="sm" onClick={handleBulkImport} disabled={!bulkText.trim()}>
                  Import {bulkText.split('\n').filter(Boolean).length} terms
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Rule Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newRule.type} onValueChange={(v) => setNewRule({ ...newRule, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(ruleTypeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Action</Label>
                    <Select value={newRule.action} onValueChange={(v) => setNewRule({ ...newRule, action: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(actionLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <Select value={newRule.severity} onValueChange={(v) => setNewRule({ ...newRule, severity: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Match Mode</Label>
                    <Select value={newRule.matchMode} onValueChange={(v) => setNewRule({ ...newRule, matchMode: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXACT">Exact</SelectItem>
                        <SelectItem value="CONTAINS">Contains</SelectItem>
                        <SelectItem value="REGEX">Regex</SelectItem>
                        <SelectItem value="STARTS_WITH">Starts With</SelectItem>
                        <SelectItem value="ENDS_WITH">Ends With</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Value {newRule.type === 'REGEX_PATTERN' && <span className="text-xs text-muted-foreground">(regex pattern)</span>}</Label>
                  <Input value={newRule.value} onChange={(e) => setNewRule({ ...newRule, value: e.target.value })} placeholder={newRule.type === 'REGEX_PATTERN' ? '\\b(badword|offensive)\\b' : 'Enter value...'} />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={newRule.caseSensitive} onCheckedChange={(v) => setNewRule({ ...newRule, caseSensitive: v })} />
                    <span className="text-sm">Case sensitive</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="gradient" onClick={handleCreate} disabled={!newRule.value.trim()}>Create Rule</Button>
                  <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button onClick={() => setActiveView('rules')} className={cn('px-4 py-1.5 rounded-lg text-sm font-medium transition-all', activeView === 'rules' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
          Rules ({rules.length})
        </button>
        <button onClick={() => setActiveView('events')} className={cn('px-4 py-1.5 rounded-lg text-sm font-medium transition-all', activeView === 'events' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
          Recent Events ({events.length})
        </button>
      </div>

      {/* Rules List */}
      {activeView === 'rules' && (
        isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : rules.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Shield className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No moderation rules yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add rules to filter content, block words, or detect sensitive data.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {rules.map((rule) => {
              const act = actionLabels[rule.action] || actionLabels.LOG_ONLY;
              const ActionIcon = act.icon;
              return (
                <motion.div key={rule.id} layout className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <ActionIcon className={cn('h-4 w-4 shrink-0', act.color)} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{rule.value}</span>
                        <Badge variant="secondary" className="text-[10px]">{ruleTypeLabels[rule.type] || rule.type}</Badge>
                        <Badge className={cn('text-[10px]', severityColors[rule.severity] || '')}>{rule.severity}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>Action: {act.label}</span>
                        <span>·</span>
                        <span>Mode: {rule.matchMode}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch checked={rule.enabled} onCheckedChange={() => handleToggle(rule)} />
                    <button onClick={() => handleDelete(rule.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )
      )}

      {/* Events */}
      {activeView === 'events' && (
        events.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <FileText className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No moderation events</p>
            <p className="text-xs text-muted-foreground mt-1">Events appear when a rule is triggered during a conversation.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((ev) => {
              const act = actionLabels[ev.action] || actionLabels.LOG_ONLY;
              const ActionIcon = act.icon;
              return (
                <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <ActionIcon className={cn('h-4 w-4 shrink-0', act.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium">{ruleTypeLabels[ev.type] || ev.type}</span>
                      <Badge className={cn('text-[10px]', severityColors[ev.severity] || '')}>{ev.severity}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{act.label}</Badge>
                    </div>
                    {ev.matchedValue && <p className="text-xs text-muted-foreground truncate mt-0.5">Matched: {ev.maskedPreview || ev.matchedValue}</p>}
                    <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(ev.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
