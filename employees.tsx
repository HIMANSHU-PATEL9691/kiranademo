import { useState } from "react";
import { UserCog, Plus, Check, X, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { employees as seed, type Employee } from "@/lib/erp-data";
import { toast } from "sonner";

export function EmployeesPage() {
  const [data, setData] = useState<Employee[]>(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", phone: "", salary: "" });
  const totalSalary = data.reduce((s, e) => s + e.salary, 0);
  const present = data.filter((e) => e.status === "Present").length;

  const mark = (id: string, status: Employee["status"]) => {
    setData((p) => p.map((e) => (e.id === id ? { ...e, status } : e)));
    toast.success(`Marked ${status}`);
  };

  const payroll = (e: Employee) => toast.success(`Salary ₹${e.salary.toLocaleString("en-IN")} paid to ${e.name}`);

  const save = () => {
    if (!form.name || !form.role) return toast.error("Name and role are required");
    setData((prev) => [
      { id: `E${String(prev.length + 1).padStart(3, "0")}`, name: form.name, role: form.role, phone: form.phone, salary: Number(form.salary), joinDate: new Date().toISOString().slice(0, 10), status: "Present" },
      ...prev,
    ]);
    setForm({ name: "", role: "", phone: "", salary: "" });
    setOpen(false);
    toast.success("Employee added successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground">Manage staff, attendance and monthly salary.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Add Employee</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Employee</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Salary (₹)</Label><Input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Total Staff</div><div className="text-2xl font-semibold flex items-center gap-2 mt-1"><UserCog className="h-5 w-5 text-primary" />{data.length}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Present Today</div><div className="text-2xl font-semibold mt-1">{present}/{data.length}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Monthly Payroll</div><div className="text-2xl font-semibold mt-1">₹{totalSalary.toLocaleString("en-IN")}</div></CardContent></Card>
      </div>

      <Card><CardContent className="pt-4">
        <Table>
          <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Role</TableHead><TableHead>Phone</TableHead><TableHead>Joined</TableHead><TableHead className="text-right">Salary</TableHead><TableHead>Attendance</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {data.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell>{e.role}</TableCell>
                <TableCell className="text-muted-foreground">{e.phone}</TableCell>
                <TableCell className="text-muted-foreground">{e.joinDate}</TableCell>
                <TableCell className="text-right">₹{e.salary.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <Badge variant={e.status === "Present" ? "default" : e.status === "Leave" ? "secondary" : "destructive"}>{e.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button size="icon" variant="outline" className="h-7 w-7" title="Present" onClick={() => mark(e.id, "Present")}><Check className="h-3 w-3" /></Button>
                    <Button size="icon" variant="outline" className="h-7 w-7" title="Leave" onClick={() => mark(e.id, "Leave")}><Clock className="h-3 w-3" /></Button>
                    <Button size="icon" variant="outline" className="h-7 w-7" title="Absent" onClick={() => mark(e.id, "Absent")}><X className="h-3 w-3" /></Button>
                    <Button size="sm" variant="secondary" onClick={() => payroll(e)}>Pay</Button>
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
