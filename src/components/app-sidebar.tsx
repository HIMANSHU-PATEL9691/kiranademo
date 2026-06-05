import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  FileBarChart,
  UserCog,
  Settings,
  Store,
  Receipt,
  Wallet,
  PackagePlus,
  Percent,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const operations = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Billing / POS", url: "/billing", icon: ShoppingCart },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Purchases", url: "/purchases", icon: PackagePlus },
];

const people = [
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Suppliers", url: "/suppliers", icon: Truck },
  { title: "Employees", url: "/employees", icon: UserCog },
];

const finance = [
  { title: "Expenses", url: "/expenses", icon: Wallet },
  { title: "GST", url: "/gst", icon: Percent },
  { title: "Reports", url: "/reports", icon: FileBarChart },
  { title: "Invoices", url: "/invoices", icon: Receipt },
];

const system = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (p: string) => pathname === p || pathname.startsWith(p + "/");

  const renderGroup = (label: string, items: typeof operations) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Store className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">Smart Kirana</div>
              <div className="text-xs opacity-70">Inventory & Billing</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Operations", operations)}
        {renderGroup("People", people)}
        {renderGroup("Finance", finance)}
        {renderGroup("System", system)}
      </SidebarContent>
    </Sidebar>
  );
}
