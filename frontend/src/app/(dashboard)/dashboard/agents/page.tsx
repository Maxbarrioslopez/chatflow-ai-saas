'use client';

import { PageHeader } from '@/components/shared/page-header';
import { AgentConfigurator } from '@/components/agents/agent-configurator';
import { Bot } from 'lucide-react';

export default function AgentsPage() {
  return (
    <div>
      <PageHeader
        title="AI Agents"
        description="Configure intelligent agents with tools and reasoning"
      />
      <AgentConfigurator />
    </div>
  );
}
