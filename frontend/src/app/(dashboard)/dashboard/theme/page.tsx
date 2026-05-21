'use client';

import { PageHeader } from '@/components/shared/page-header';
import { ThemeEditor } from '@/components/theme-editor/theme-editor';
import { Paintbrush } from 'lucide-react';

export default function ThemePage() {
  return (
    <div>
      <PageHeader
        title="Theme Editor"
        description="Customize your chatbot appearance with live preview"
      />
      <ThemeEditor />
    </div>
  );
}
