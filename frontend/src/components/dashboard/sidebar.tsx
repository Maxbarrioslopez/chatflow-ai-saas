'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CreditCard,
  Zap,
  Brain,
  GitBranch,
  Paintbrush,
  FileText,
  Puzzle,
} from 'lucide-react';

interface SidebarProps {
  onNavigate?: () => void;
}

const navGroups = [
  {
    label: 'Main',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/chatbots', label: 'Chatbots', icon: Bot },
      { href: '/dashboard/conversations', label: 'Conversations', icon: MessageSquare },
      { href: '/dashboard/leads', label: 'Leads', icon: Users },
    ],
  },
  {
    label: 'AI & Content',
    items: [
      { href: '/dashboard/prompts', label: 'Prompt Studio', icon: Sparkles },
      { href: '/dashboard/knowledge', label: 'Knowledge Base', icon: FileText },
      { href: '/dashboard/agents', label: 'AI Agents', icon: Puzzle },
    ],
  },
  {
    label: 'Automation',
    items: [
      { href: '/dashboard/workflows', label: 'Workflows', icon: GitBranch },
    ],
  },
  {
    label: 'Appearance',
    items: [
      { href: '/dashboard/theme', label: 'Theme Editor', icon: Paintbrush },
    ],
  },
  {
    label: 'Data',
    items: [
      { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
      { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
    ],
  },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[260px]',
      )}
    >
      <div className={cn(
        'flex h-16 items-center border-b border-sidebar-border px-4',
        collapsed ? 'justify-center' : 'justify-between',
      )}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2" onClick={onNavigate}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-sidebar-foreground">ChatMBL</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600" onClick={onNavigate}>
            <Zap className="h-4 w-4 text-white" />
          </Link>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 text-xs font-medium text-sidebar-muted uppercase tracking-wider mb-1">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      collapsed && 'justify-center px-2',
                      isActive
                        ? 'bg-sidebar-accent/20 text-sidebar-accent'
                        : 'text-sidebar-muted hover:bg-sidebar-accent/10 hover:text-sidebar-foreground',
                    )}
                  >
                    <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-sidebar-accent')} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn('border-t border-sidebar-border p-3', collapsed && 'flex justify-center')}>
        {!collapsed && (
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/10 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground">Free Plan</p>
              <p className="text-xs text-sidebar-muted truncate">3/3 chatbots used</p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex h-10 items-center justify-center border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
