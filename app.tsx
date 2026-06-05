import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';

import { Dashboard } from './dashboard';
import { InventoryPage } from './inventory';
import { BillingPage } from './billing';
import { CustomersPage } from './customers';
import { EmployeesPage } from './employees';
import { ExpensesPage } from './expenses';
import { GstPage } from './gst';
import { InvoicesPage } from './invoices';
import { PurchasesPage } from './purchases';
import { ReportsPage } from './reports';
import { SettingsPage } from './settings';
import { SuppliersPage } from './suppliers';
import { Layout } from './Layout';
import { InventoryProvider } from '@/lib/inventory-store';

/* ── Root route ─────────────────────────────── */
const rootRoute = createRootRoute({
  component: () => (
    <InventoryProvider>
      <Outlet />
    </InventoryProvider>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-muted-foreground">404</h1>
        <p className="text-muted-foreground">Page not found.</p>
        <a href="/dashboard" className="text-primary underline text-sm">Go to Dashboard</a>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-lg w-full rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive font-mono whitespace-pre-wrap">
        Error: {error instanceof Error ? error.message : String(error)}
      </div>
    </div>
  ),
});

/* ── Redirect / → /dashboard ─────────────────── */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/dashboard' }); },
});

/* ── Layout wrapper (pathless) ───────────────── */
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_app',
  component: Layout,
});

/* ── Page routes ─────────────────────────────── */
const mk = <T extends string>(path: T, component: any) =>
  createRoute({ getParentRoute: () => appRoute, path, component });

const dashboardRoute  = mk('dashboard',  Dashboard);
const billingRoute    = mk('billing',    BillingPage);
const inventoryRoute  = mk('inventory',  InventoryPage);
const purchasesRoute  = mk('purchases',  PurchasesPage);
const customersRoute  = mk('customers',  CustomersPage);
const suppliersRoute  = mk('suppliers',  SuppliersPage);
const employeesRoute  = mk('employees',  EmployeesPage);
const expensesRoute   = mk('expenses',   ExpensesPage);
const gstRoute        = mk('gst',        GstPage);
const reportsRoute    = mk('reports',    ReportsPage);
const invoicesRoute   = mk('invoices',   InvoicesPage);
const settingsRoute   = mk('settings',   SettingsPage);

/* ── Route tree ──────────────────────────────── */
const routeTree = rootRoute.addChildren([
  indexRoute,
  appRoute.addChildren([
    dashboardRoute, billingRoute, inventoryRoute, purchasesRoute,
    customersRoute, suppliersRoute, employeesRoute, expensesRoute,
    gstRoute, reportsRoute, invoicesRoute, settingsRoute,
  ]),
]);

/* ── Router ──────────────────────────────────── */
export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router; }
}
