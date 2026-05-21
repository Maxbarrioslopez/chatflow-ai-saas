'use client';

import { type ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-[260px] transition-all duration-300">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
