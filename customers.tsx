import { useState } from "react";
import { Users, Phone, Search, IndianRupee, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { customers as seed, type Customer } from "@/lib/erp-data";
import { toast } from "sonner";

export function CustomersPage() {
  const [data, setData] = useState<Customer[]>(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [q, setQ] = useState("");
  const filtered = data.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q));
  const totalDue = data.reduce((s, c) => s + c.dueAmount, 0);

  const collect = (id: string) => {
    setData((prev) => prev.map((c) => (c.id === id ? { ...c, dueAmount: 0 } : c)));
    toast.success("Payment received • Udhar cleared");
  };

  const save = () => {
    if (!form.name || !form.phone) return toast.error("Name and phone are required");
    setData((prev) => [
      { id: `C${String(prev.length + 1).padStart(3, "0")}`, ...form, totalPurchases: 0, dueAmount: 0 },
      ...prev,
    ]);
    setForm({ name: "", phone: "", address: "" });
    setOpen(false);
    toast.success("Customer added successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">Manage customer profiles and pending udhar (credit) balances.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Add Customer</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Customer</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Total Customers</div><div className="text-2xl font-semibold flex items-center gap-2 mt-1"><Users className="h-5 w-5 text-primary" />{data.length}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Pending Udhar</div><div className="text-2xl font-semibold text-destructive flex items-center mt-1"><IndianRupee className="h-5 w-5" />{totalDue.toLocaleString("en-IN")}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">With Dues</div><div className="text-2xl font-semibold mt-1">{data.filter((c) => c.dueAmount > 0).length}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="relative mb-3 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or phone" className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="text-right">Udhar</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground"><span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span></TableCell>
                  <TableCell className="text-muted-foreground">{c.address}</TableCell>
                  <TableCell className="text-right">₹{c.totalPurchases.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right">
                    {c.dueAmount > 0 ? <Badge variant="destructive">₹{c.dueAmount.toLocaleString("en-IN")}</Badge> : <Badge variant="secondary">Clear</Badge>}
                  </TableCell>
                  <TableCell>
                    {c.dueAmount > 0 && <Button size="sm" variant="outline" onClick={() => collect(c.id)}>Collect</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
