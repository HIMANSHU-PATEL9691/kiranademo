import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Store } from "lucide-react";

export function SettingsPage() {
  const [store, setStore] = useState({
    name: "Smart Kirana General Store",
    owner: "Ramesh Kumar",
    address: "Shop 12, Main Market, Sector 14, Noida",
    phone: "+91 98100 00000",
    gstin: "07AABCK1234D1Z9",
    upi: "smartkirana@okhdfc",
  });
  const [prefs, setPrefs] = useState({
    printAfterBill: true,
    whatsAppInvoice: true,
    lowStockAlerts: true,
    expiryAlerts: true,
  });

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Store profile, billing and notification preferences.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Store className="h-4 w-4" /> Store Profile</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Store Name</Label><Input value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Owner</Label><Input value={store.owner} onChange={(e) => setStore({ ...store, owner: e.target.value })} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Address</Label><Input value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Phone</Label><Input value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>GSTIN</Label><Input value={store.gstin} onChange={(e) => setStore({ ...store, gstin: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>UPI ID</Label><Input value={store.upi} onChange={(e) => setStore({ ...store, upi: e.target.value })} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {([
            ["printAfterBill", "Auto-print receipt after billing"],
            ["whatsAppInvoice", "Send invoice on WhatsApp"],
            ["lowStockAlerts", "Low-stock alerts"],
            ["expiryAlerts", "Expiry alerts (30 days)"],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm">{label}</span>
                <Switch checked={prefs[key]} onCheckedChange={(v) => setPrefs({ ...prefs, [key]: v })} />
              </div>
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset</Button>
        <Button onClick={() => toast.success("Settings saved")}>Save Changes</Button>
      </div>
    </div>
  );
}
