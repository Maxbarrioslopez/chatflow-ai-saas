'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - desktop fixed, mobile overlay */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-[260px] transition-transform duration-300
        lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <div className="lg:pl-[260px] transition-all duration-300">
        <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="p-4 md:p-6 max-w-[1440px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
