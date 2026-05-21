'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileText,
  Link as LinkIcon,
  X,
  Check,
  Loader2,
  Brain,
  Trash2,
  Globe,
  Type,
  MessageSquare,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  listSources,
  uploadDocument,
  addTextSource,
  deleteSource,
  reprocessSource,
  getStats,
  type KnowledgeSource,
  type KnowledgeStats,
} from '@/services/knowledge.service';

interface DocumentUploaderProps {
  chatbotId: string;
}

const typeIcons: Record<string, any> = {
  document: FileText,
  website: Globe,
  text: Type,
  faq: MessageSquare,
  qapairs: MessageSquare,
};

const statusConfig: Record<string, { color: string; label: string; icon: any }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending', icon: Loader2 },
  processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Processing', icon: Loader2 },
  ready: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Ready', icon: Check },
  failed: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Failed', icon: AlertCircle },
  needs_ocr: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Needs OCR', icon: AlertCircle },
};

export function DocumentUploader({ chatbotId }: DocumentUploaderProps) {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqPairs, setFaqPairs] = useState<Array<{ q: string; a: string }>>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'text' | 'faq'>('upload');

  const fetchSources = useCallback(async () => {
    try {
      setIsLoading(true);
      const [fetchedSources, fetchedStats] = await Promise.all([
        listSources(chatbotId),
        getStats(chatbotId),
      ]);
      setSources(fetchedSources);
      setStats(fetchedStats);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [chatbotId]);

  useEffect(() => {
    if (chatbotId) fetchSources();
  }, [chatbotId, fetchSources]);

  // Poll for processing sources
  useEffect(() => {
    const hasProcessing = sources.some((s) => s.status === 'pending' || s.status === 'processing');
    if (!hasProcessing || !chatbotId) return;

    const interval = setInterval(fetchSources, 3000);
    return () => clearInterval(interval);
  }, [sources, chatbotId, fetchSources]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setError(null);
    try {
      for (const file of acceptedFiles) {
        await uploadDocument(chatbotId, file);
      }
      await fetchSources();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  }, [chatbotId, fetchSources]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'text/csv': ['.csv'],
    },
    maxSize: 10 * 1024 * 1024,
  });

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    setIsUploading(true);
    setError(null);
    try {
      await addTextSource(chatbotId, urlInput, urlInput);
      await fetchSources();
      setUrlInput('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcessText = async () => {
    if (!textInput.trim()) return;
    setIsUploading(true);
    setError(null);
    try {
      await addTextSource(chatbotId, `Text Input`, textInput);
      await fetchSources();
      setTextInput('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveFaqs = async () => {
    if (faqPairs.length === 0 && (!faqQuestion.trim() || !faqAnswer.trim())) return;

    setIsUploading(true);
    setError(null);
    try {
      const allPairs = [...faqPairs];
      if (faqQuestion.trim() && faqAnswer.trim()) {
        allPairs.push({ q: faqQuestion.trim(), a: faqAnswer.trim() });
      }

      const content = allPairs.map((pair, i) => `Q${i + 1}: ${pair.q}\nA${i + 1}: ${pair.a}`).join('\n\n');
      await addTextSource(chatbotId, `FAQ (${allPairs.length} pairs)`, content);
      await fetchSources();
      setFaqPairs([]);
      setFaqQuestion('');
      setFaqAnswer('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (sourceId: string) => {
    try {
      await deleteSource(chatbotId, sourceId);
      await fetchSources();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleReprocess = async (sourceId: string) => {
    try {
      await reprocessSource(chatbotId, sourceId);
      await fetchSources();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="space-y-6">
      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded">
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats bar */}
      {stats && stats.total > 0 && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{stats.total} sources</span>
          <span>·</span>
          <span>{stats.totalChunks} chunks</span>
          <span>·</span>
          {Object.entries(stats.byStatus).filter(([, count]) => count > 0).map(([status, count]) => (
            <Badge key={status} variant="secondary" className="text-[10px]">
              {status}: {count}
            </Badge>
          ))}
        </div>
      )}

      {/* Source Type Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'upload' as const, label: 'Upload', icon: Upload },
          { id: 'url' as const, label: 'URL', icon: Globe },
          { id: 'text' as const, label: 'Text', icon: Type },
          { id: 'faq' as const, label: 'FAQ', icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Upload Area */}
      {activeTab === 'upload' && (
        <div
          {...getRootProps()}
          className={cn(
            'relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300',
            isDragActive
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-border hover:border-primary/50 hover:bg-muted/30',
          )}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={{ scale: isDragActive ? 1.1 : 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className={cn(
              'flex h-16 w-16 items-center justify-center rounded-2xl transition-colors',
              isDragActive ? 'bg-primary/20' : 'bg-muted',
            )}>
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <Upload className={cn('h-8 w-8', isDragActive ? 'text-primary' : 'text-muted-foreground')} />
              )}
            </div>
            <div>
              <p className="font-semibold">
                {isDragActive ? 'Drop files here' : 'Drop files or click to browse'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                PDF, DOCX, TXT, MD, CSV (max 10MB)
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* URL Input */}
      {activeTab === 'url' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/page"
                onKeyDown={(e) => e.key === 'Enter' && handleFetchUrl()}
              />
              <Button variant="gradient" onClick={handleFetchUrl} disabled={isUploading || !urlInput.trim()}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Fetch
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Input */}
      {activeTab === 'text' && (
        <Card>
          <CardContent className="p-6">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={8}
              className="w-full rounded-xl border border-input bg-background p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Paste or type your content here..."
            />
            <Button
              variant="gradient"
              className="mt-4"
              onClick={handleProcessText}
              disabled={isUploading || !textInput.trim()}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="mr-2 h-4 w-4" />}
              Process Text
            </Button>
          </CardContent>
        </Card>
      )}

      {/* FAQ Input */}
      {activeTab === 'faq' && (
        <Card>
          <CardContent className="p-6 space-y-3">
            {faqPairs.map((pair, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-muted/30">
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium">Q: {pair.q}</p>
                  <p className="text-xs text-muted-foreground">A: {pair.a}</p>
                </div>
                <button
                  onClick={() => setFaqPairs(faqPairs.filter((_, j) => j !== i))}
                  className="p-1 rounded hover:bg-destructive/10 text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Question"
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
              />
              <Input
                placeholder="Answer"
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (faqQuestion.trim() && faqAnswer.trim()) {
                    setFaqPairs([...faqPairs, { q: faqQuestion.trim(), a: faqAnswer.trim() }]);
                    setFaqQuestion('');
                    setFaqAnswer('');
                  }
                }}
                disabled={!faqQuestion.trim() || !faqAnswer.trim()}
              >
                + Add Pair
              </Button>
              <Button
                variant="gradient"
                size="sm"
                onClick={handleSaveFaqs}
                disabled={isUploading || (faqPairs.length === 0 && (!faqQuestion.trim() || !faqAnswer.trim()))}
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Save FAQs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : sources.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Knowledge Sources ({sources.length})
          </h3>
          {sources.map((doc) => {
            const Icon = typeIcons[doc.type] || FileText;
            const status = statusConfig[doc.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{doc.originalName || doc.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{doc.type}</span>
                      {doc.fileSize && <span>· {formatFileSize(doc.fileSize)}</span>}
                      {doc.chunkCount != null && <span>· {doc.chunkCount} chunks</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={cn('gap-1 text-[10px]', status.color)}>
                    {doc.status === 'processing' || doc.status === 'pending' ? (
                      <StatusIcon className="h-3 w-3 animate-spin" />
                    ) : doc.status === 'ready' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {status.label}
                  </Badge>
                  {doc.status === 'failed' && (
                    <button
                      onClick={() => handleReprocess(doc.id)}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                      title="Retry"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mb-3">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No knowledge sources yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload a document or add text content to get started.
          </p>
        </div>
      )}
    </div>
  );
}
