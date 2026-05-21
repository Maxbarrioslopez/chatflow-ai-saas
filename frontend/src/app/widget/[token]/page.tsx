'use client';

import { useState, useEffect } from 'react';
import { PremiumWidget } from '@/components/chatbot-widget/premium-widget';
import { Loader2 } from 'lucide-react';

export default function WidgetPage({ params }: { params: { token: string } }) {
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';
    fetch(`${apiUrl}/chat/widget/${params.token}`)
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setError(true));
  }, [params.token]);

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#888', fontSize: 14 }}>
        Widget not available
      </div>
    );
  }

  if (!config) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <PremiumWidget config={config} mode="inline" />;
}
