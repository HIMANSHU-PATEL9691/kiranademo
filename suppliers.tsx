import { useState } from "react";
import { Truck, Plus, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { suppliers as seed } from "@/lib/erp-data";
import { toast } from "sonner";

export function SuppliersPage() {
  const [data, setData] = useState(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", phone: "", gstin: "" });

  const totalPayable = data.reduce((s, x) => s + x.payable, 0);

  const save = () => {
    if (!form.name) return toast.error("Supplier name is required");
    setData((prev) => [
      { id: `S${String(prev.length + 1).padStart(3, "0")}`, ...form, payable: 0 },
      ...prev,
    ]);
    setForm({ name: "", contact: "", phone: "", gstin: "" });
    setOpen(false);
    toast.success("Supplier added successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Suppliers</h1>
          <p className="text-sm text-muted-foreground">Vendor directory, GSTIN and outstanding payables.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Add Supplier</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Supplier</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Company Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Contact Person</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>GSTIN</Label><Input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Total Suppliers</div><div className="text-2xl font-semibold flex items-center gap-2 mt-1"><Truck className="h-5 w-5 text-primary" />{data.length}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Total Payable</div><div className="text-2xl font-semibold text-destructive mt-1">₹{totalPayable.toLocaleString("en-IN")}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">With Dues</div><div className="text-2xl font-semibold mt-1">{data.filter((s) => s.payable > 0).length}</div></CardContent></Card>
      </div>

      <Card><CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>GSTIN</TableHead>
              <TableHead className="text-right">Payable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.contact}</TableCell>
                <TableCell className="text-muted-foreground"><span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{s.phone}</span></TableCell>
                <TableCell className="font-mono text-xs">{s.gstin}</TableCell>
                <TableCell className="text-right">
                  {s.payable > 0 ? <Badge variant="destructive">₹{s.payable.toLocaleString("en-IN")}</Badge> : <Badge variant="secondary">Clear</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
