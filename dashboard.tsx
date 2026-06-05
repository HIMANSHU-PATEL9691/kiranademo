import { Link } from "@tanstack/react-router";
import {
  IndianRupee,
  Package,
  AlertTriangle,
  CalendarClock,
  Users,
  Truck,
  TrendingUp,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInventory, daysUntil } from "@/lib/inventory-store";
import {
  todaySales,
  monthSales,
  monthExpense,
  totalCustomers,
  totalSuppliers,
  pendingDues,
} from "@/lib/mock-data";
import { salesTrend } from "@/lib/erp-data";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "accent" | "success" | "warning" | "destructive";
}) {
  const toneClass: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {label}
            </div>
            <div className="text-2xl font-semibold mt-2">{value}</div>
            {hint && (
              <div className="text-xs text-muted-foreground mt-1">{hint}</div>
            )}
          </div>
          <div className={`h-10 w-10 rounded-md flex items-center justify-center ${toneClass[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { products } = useInventory();

  const stockValue = products.reduce(
    (s, p) => s + p.purchasePrice * p.quantity,
    0,
  );
  const lowStock = products.filter((p) => p.quantity <= p.minStock);
  const expiringSoon = products
    .map((p) => ({ ...p, days: daysUntil(p.expiryDate) }))
    .filter((p) => p.days <= 30)
    .sort((a, b) => a.days - b.days);
  const profit = monthSales - monthExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of today's activity and alerts.
          </p>
        </div>
        <Button asChild>
          <Link to="/inventory">
            Manage Inventory
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Kpi label="Today's Sales" value={`₹${inr(todaySales)}`} hint="+12% vs yesterday" icon={IndianRupee} tone="primary" />
        <Kpi label="Monthly Profit" value={`₹${inr(profit)}`} hint={`Revenue ₹${inr(monthSales)}`} icon={TrendingUp} tone="success" />
        <Kpi label="Pending Dues" value={`₹${inr(pendingDues)}`} hint="Udhar from customers" icon={Wallet} tone="accent" />
        <Kpi label="Stock Value" value={`₹${inr(stockValue)}`} hint={`${products.length} products`} icon={Package} tone="primary" />
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Kpi label="Total Products" value={`${products.length}`} icon={Package} />
        <Kpi label="Low Stock" value={`${lowStock.length}`} icon={AlertTriangle} tone="destructive" />
        <Kpi label="Total Customers" value={`${totalCustomers}`} icon={Users} />
        <Kpi label="Total Suppliers" value={`${totalSuppliers}`} icon={Truck} />
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Sales Trend (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="dashSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
              <Area type="monotone" dataKey="sales" stroke="var(--color-primary)" fillOpacity={1} fill="url(#dashSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Low Stock Alert
            </CardTitle>
            <Badge variant="secondary">{lowStock.length} items</Badge>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">All products are well stocked.</p>
            ) : (
              <ul className="divide-y">
                {lowStock.slice(0, 6).map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.category} · min {p.minStock}</div>
                    </div>
                    <Badge variant="destructive">{p.quantity} {p.unit}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-accent" />
              Expiry Alert (≤ 30 days)
            </CardTitle>
            <Badge variant="secondary">{expiringSoon.length} items</Badge>
          </CardHeader>
          <CardContent>
            {expiringSoon.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products expiring soon.</p>
            ) : (
              <ul className="divide-y">
                {expiringSoon.slice(0, 6).map((p) => {
                  const tone =
                    p.days < 0
                      ? "destructive"
                      : p.days <= 7
                        ? "destructive"
                        : p.days <= 15
                          ? "default"
                          : "secondary";
                  const label =
                    p.days < 0
                      ? `Expired ${Math.abs(p.days)}d ago`
                      : p.days === 0
                        ? "Expires today"
                        : `${p.days}d left`;
                  return (
                    <li key={p.id} className="flex items-center justify-between py-2.5">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.expiryDate}</div>
                      </div>
                      <Badge variant={tone as "destructive" | "default" | "secondary"}>{label}</Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
