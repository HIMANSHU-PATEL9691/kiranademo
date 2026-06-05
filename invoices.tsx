import { useState } from "react";
import { Receipt, Search, Smartphone, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { recentSales } from "@/lib/erp-data";
import { toast } from "sonner";

export function InvoicesPage() {
  const [q, setQ] = useState("");
  const filtered = recentSales.filter((s) => s.id.toLowerCase().includes(q.toLowerCase()) || s.customer.toLowerCase().includes(q.toLowerCase()));
  const totalToday = recentSales.filter((s) => s.date === recentSales[0].date).reduce((s, x) => s + x.amount, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
        <p className="text-sm text-muted-foreground">All sales bills issued from the POS.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Today's Sales</div><div className="text-2xl font-semibold flex items-center gap-2 mt-1"><Receipt className="h-5 w-5 text-primary" />₹{totalToday.toLocaleString("en-IN")}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Invoices Issued</div><div className="text-2xl font-semibold mt-1">{recentSales.length}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Udhar Bills</div><div className="text-2xl font-semibold mt-1">{recentSales.filter((s) => s.payment === "Udhar").length}</div></CardContent></Card>
      </div>

      <Card><CardContent className="pt-4">
        <div className="relative mb-3 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search invoice or customer" className="pl-9" />
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead><TableHead className="text-right">Items</TableHead><TableHead className="text-right">GST</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Payment</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.id}</TableCell>
                <TableCell>{s.date}</TableCell>
                <TableCell>{s.customer}</TableCell>
                <TableCell className="text-right">{s.items}</TableCell>
                <TableCell className="text-right">₹{s.gst}</TableCell>
                <TableCell className="text-right font-medium">₹{s.amount.toLocaleString("en-IN")}</TableCell>
                <TableCell><Badge variant={s.payment === "Udhar" ? "destructive" : "secondary"}>{s.payment}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.success("WhatsApp sent")}><Smartphone className="h-3 w-3" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.success("Print queued")}><Printer className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
