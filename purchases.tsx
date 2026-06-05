import { useState } from "react";
import { PackagePlus, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { purchases as seed } from "@/lib/erp-data";
import { toast } from "sonner";

export function PurchasesPage() {
  const [data, setData] = useState(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ supplier: "", items: "", amount: "" });
  
  const total = data.reduce((s, p) => s + p.amount, 0);
  const pending = data.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);

  const save = () => {
    if (!form.supplier) return toast.error("Supplier name is required");
    setData((prev) => [
      { id: `PO${String(prev.length + 1).padStart(3, "0")}`, supplier: form.supplier, items: Number(form.items), amount: Number(form.amount), date: new Date().toISOString().slice(0, 10), status: "Pending" as const },
      ...prev,
    ]);
    setForm({ supplier: "", items: "", amount: "" });
    setOpen(false);
    toast.success("Purchase order recorded");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Purchases</h1>
          <p className="text-sm text-muted-foreground">Track purchase orders from your suppliers.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> New Purchase</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Purchase</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Supplier Name</Label><Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Total Items</Label><Input type="number" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Total Amount (₹)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Orders (30d)</div><div className="text-2xl font-semibold flex items-center gap-2 mt-1"><PackagePlus className="h-5 w-5 text-primary" />{data.length}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Total Value</div><div className="text-2xl font-semibold mt-1">₹{total.toLocaleString("en-IN")}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Unpaid</div><div className="text-2xl font-semibold text-destructive mt-1">₹{pending.toLocaleString("en-IN")}</div></CardContent></Card>
      </div>

      <Card><CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.id}</TableCell>
                <TableCell>{p.date}</TableCell>
                <TableCell className="font-medium">{p.supplier}</TableCell>
                <TableCell className="text-right">{p.items}</TableCell>
                <TableCell className="text-right">₹{p.amount.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <Badge variant={p.status === "Paid" ? "secondary" : "destructive"}>{p.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
