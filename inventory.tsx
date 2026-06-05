import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useInventory, daysUntil } from "@/lib/inventory-store";
import { CATEGORIES, SUPPLIERS, UNITS, type Product } from "@/lib/mock-data";
import { toast } from "sonner";

const emptyProduct = (): Product => ({
  id: "",
  name: "",
  barcode: "",
  category: CATEGORIES[0],
  brand: "",
  purchasePrice: 0,
  sellingPrice: 0,
  gst: 5,
  quantity: 0,
  unit: "Pcs",
  expiryDate: new Date().toISOString().slice(0, 10),
  supplier: SUPPLIERS[0],
  minStock: 5,
});

export function InventoryPage() {
  const { products, upsert, remove } = useInventory();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);
      const matchC = category === "all" || p.category === category;
      return matchQ && matchC;
    });
  }, [products, query, category]);

  const openNew = () => {
    setEditing({ ...emptyProduct(), id: `P${String(Date.now()).slice(-4)}` });
    setOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing({ ...p });
    setOpen(true);
  };
  const save = () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    upsert(editing);
    toast.success("Product saved");
    setOpen(false);
    setEditing(null);
  };
  const onDelete = (p: Product) => {
    remove(p.id);
    toast.success(`${p.name} deleted`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} products · {filtered.length} shown
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-1 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, brand or barcode…"
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="md:w-56">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Buy</TableHead>
                  <TableHead className="text-right">Sell</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      <Package className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      No products match your search.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((p) => {
                  const low = p.quantity <= p.minStock;
                  const days = daysUntil(p.expiryDate);
                  const exp =
                    days < 0
                      ? { variant: "destructive" as const, text: "Expired" }
                      : days <= 15
                        ? { variant: "destructive" as const, text: `${days}d` }
                        : days <= 30
                          ? { variant: "default" as const, text: `${days}d` }
                          : { variant: "secondary" as const, text: `${days}d` };
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.brand} · {p.barcode}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{p.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">₹{p.purchasePrice}</TableCell>
                      <TableCell className="text-right font-medium">₹{p.sellingPrice}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={low ? "destructive" : "secondary"}>
                          {p.quantity} {p.unit}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{p.expiryDate}</span>
                          <Badge variant={exp.variant}>{exp.text}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => onDelete(p)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing && products.find((p) => p.id === editing.id) ? "Edit product" : "Add product"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Name">
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <Field label="Barcode">
                <Input value={editing.barcode} onChange={(e) => setEditing({ ...editing, barcode: e.target.value })} />
              </Field>
              <Field label="Category">
                <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Brand">
                <Input value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} />
              </Field>
              <Field label="Purchase Price (₹)">
                <Input type="number" value={editing.purchasePrice} onChange={(e) => setEditing({ ...editing, purchasePrice: +e.target.value })} />
              </Field>
              <Field label="Selling Price (₹)">
                <Input type="number" value={editing.sellingPrice} onChange={(e) => setEditing({ ...editing, sellingPrice: +e.target.value })} />
              </Field>
              <Field label="GST %">
                <Input type="number" value={editing.gst} onChange={(e) => setEditing({ ...editing, gst: +e.target.value })} />
              </Field>
              <Field label="Quantity">
                <Input type="number" value={editing.quantity} onChange={(e) => setEditing({ ...editing, quantity: +e.target.value })} />
              </Field>
              <Field label="Unit">
                <Select value={editing.unit} onValueChange={(v) => setEditing({ ...editing, unit: v as Product["unit"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Min Stock Alert">
                <Input type="number" value={editing.minStock} onChange={(e) => setEditing({ ...editing, minStock: +e.target.value })} />
              </Field>
              <Field label="Expiry Date">
                <Input type="date" value={editing.expiryDate} onChange={(e) => setEditing({ ...editing, expiryDate: e.target.value })} />
              </Field>
              <Field label="Supplier">
                <Select value={editing.supplier} onValueChange={(v) => setEditing({ ...editing, supplier: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SUPPLIERS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save Product</Button>
          </DialogFooter>
        </DialogContent>
        {/* hidden trigger so DialogTrigger import isn't unused */}
        <DialogTrigger className="hidden" />
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
