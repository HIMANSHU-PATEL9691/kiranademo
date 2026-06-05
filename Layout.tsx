import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard, ShoppingCart, Package, PackagePlus,
  Users, Truck, UserCog, Wallet, Percent, FileBarChart,
  Receipt, Settings, Store, Menu, X, ChevronLeft, ChevronRight,
  Bell, Sun, Moon,
} from 'lucide-react';

/* ── Navigation tree ──────────────────────────────── */
const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { title: 'Dashboard',   url: '/dashboard', icon: LayoutDashboard },
      { title: 'Billing / POS', url: '/billing', icon: ShoppingCart },
      { title: 'Inventory',   url: '/inventory', icon: Package },
      { title: 'Purchases',   url: '/purchases', icon: PackagePlus },
    ],
  },
  {
    label: 'People',
    items: [
      { title: 'Customers', url: '/customers', icon: Users },
      { title: 'Suppliers', url: '/suppliers', icon: Truck },
      { title: 'Employees', url: '/employees', icon: UserCog },
    ],
  },
  {
    label: 'Finance',
    items: [
      { title: 'Expenses', url: '/expenses', icon: Wallet },
      { title: 'GST',      url: '/gst',      icon: Percent },
      { title: 'Reports',  url: '/reports',  icon: FileBarChart },
      { title: 'Invoices', url: '/invoices', icon: Receipt },
    ],
  },
  {
    label: 'System',
    items: [
      { title: 'Settings', url: '/settings', icon: Settings },
    ],
  },
];

/* ── Dark-mode toggle ─────────────────────────────── */
function useDark() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark')
      || localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return [dark, setDark] as const;
}

/* ── Sidebar link ─────────────────────────────────── */
function NavLink({
  item,
  collapsed,
  active,
  onClick,
}: {
  item: { title: string; url: string; icon: React.ComponentType<{ className?: string }> };
  collapsed: boolean;
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.url}
      onClick={onClick}
      title={collapsed ? item.title : undefined}
      className={[
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150',
        'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        active ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' : '',
        collapsed ? 'justify-center px-2' : '',
      ].join(' ')}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.title}</span>}
    </Link>
  );
}

/* ── Sidebar content ──────────────────────────────── */
function SidebarContent({
  collapsed,
  pathname,
  onLinkClick,
}: {
  collapsed: boolean;
  pathname: string;
  onLinkClick?: () => void;
}) {
  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + '/');

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Brand */}
      <div
        className={[
          'flex items-center gap-3 px-4 py-4 border-b border-sidebar-border shrink-0',
          collapsed ? 'justify-center px-2' : '',
        ].join(' ')}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Store className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="leading-tight overflow-hidden">
            <div className="text-sm font-bold text-sidebar-foreground truncate">Smart Kirana</div>
            <div className="text-xs text-sidebar-foreground/60 truncate">Inventory & Billing</div>
          </div>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <div className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.url}
                  item={item}
                  collapsed={collapsed}
                  active={isActive(item.url)}
                  onClick={onLinkClick}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-sidebar-border shrink-0">
          <div className="text-[10px] text-sidebar-foreground/40">
            Smart Kirana v1.0 · © 2025
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main layout ──────────────────────────────────── */
export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useDark();
  const overlayRef = useRef<HTMLDivElement>(null);

  const pathname = useRouterState({ select: (r) => r.location.pathname });

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Trap focus / close on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    const body = document.body;
    if (mobileOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
    return () => { body.style.overflow = ''; };
  }, [mobileOpen]);

  const sidebarW = collapsed ? 'w-16' : 'w-64';

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* ── Desktop sidebar ── */}
      <aside
        className={[
          'hidden lg:flex flex-col shrink-0 transition-all duration-200 ease-in-out',
          sidebarW,
        ].join(' ')}
        aria-label="Main navigation"
      >
        <div className={['fixed top-0 bottom-0 flex flex-col transition-all duration-200', sidebarW].join(' ')}>
          <SidebarContent collapsed={collapsed} pathname={pathname} />
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm hover:bg-sidebar-accent transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <ChevronRight className="h-3 w-3" />
              : <ChevronLeft className="h-3 w-3" />}
          </button>
        </div>
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile sidebar drawer ── */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-72 flex flex-col shadow-xl lg:hidden transition-transform duration-250 ease-in-out',
          mobileOpen ? 'translate-x-0 animate-slide-in-from-left' : '-translate-x-full',
        ].join(' ')}
        aria-label="Mobile navigation"
        aria-modal="true"
        role="dialog"
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent
          collapsed={false}
          pathname={pathname}
          onLinkClick={() => setMobileOpen(false)}
        />
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          {/* Left: hamburger (mobile) + page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md border lg:hidden hover:bg-accent transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground lg:hidden">
                <Store className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold lg:hidden">Smart Kirana</span>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button
              className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-accent transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDark((d) => !d)}
              className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-accent transition-colors"
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold select-none">
              RK
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
