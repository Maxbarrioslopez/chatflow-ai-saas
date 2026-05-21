'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { WorkflowCanvas } from '@/components/workflow-builder/workflow-canvas';
import { GitBranch, Plus, Save } from 'lucide-react';

export default function WorkflowsPage() {
  return (
    <div>
      <PageHeader
        title="Workflows"
        description="Automate conversations with visual workflows"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button variant="gradient">
              <Plus className="mr-2 h-4 w-4" /> New Workflow
            </Button>
          </div>
        }
      />

      <WorkflowCanvas />
    </div>
  );
}
