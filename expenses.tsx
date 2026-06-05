import { useState } from "react";
import { Wallet, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { expenses as seed, type Expense } from "@/lib/erp-data";
import { toast } from "sonner";

const CATS = ["Rent", "Electricity", "Transport", "Salary", "Maintenance", "Misc"];

export function ExpensesPage() {
  const [data, setData] = useState<Expense[]>(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: CATS[0], description: "", amount: 0 });
  const total = data.reduce((s, e) => s + e.amount, 0);

  const save = () => {
    if (!form.description || form.amount <= 0) return toast.error("Fill description and amount");
    setData((p) => [
      { id: `E${String(p.length + 1).padStart(3, "0")}`, date: new Date().toISOString().slice(0, 10), ...form },
      ...p,
    ]);
    setForm({ category: CATS[0], description: "", amount: 0 });
    setOpen(false);
    toast.success("Expense added");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted-foreground">Record and categorize all shop expenses.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Add Expense</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Expense</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Amount (₹)</Label><Input type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: +e.target.value })} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Total (month)</div><div className="text-2xl font-semibold flex items-center gap-2 mt-1"><Wallet className="h-5 w-5 text-primary" />₹{total.toLocaleString("en-IN")}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Entries</div><div className="text-2xl font-semibold mt-1">{data.length}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Top Category</div><div className="text-2xl font-semibold mt-1">Rent</div></CardContent></Card>
      </div>

      <Card><CardContent className="pt-4">
        <Table>
          <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Category</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
          <TableBody>
            {data.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.date}</TableCell>
                <TableCell>{e.category}</TableCell>
                <TableCell className="text-muted-foreground">{e.description}</TableCell>
                <TableCell className="text-right font-medium">₹{e.amount.toLocaleString("en-IN")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
