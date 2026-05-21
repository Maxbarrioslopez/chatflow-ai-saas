import { Sparkles } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 animate-pulse-soft">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse-soft">Loading...</p>
      </div>
    </div>
  );
}
