import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Percent, Download } from "lucide-react";
import { useInventory } from "@/lib/inventory-store";
import { useMemo } from "react";
import { toast } from "sonner";

export function GstPage() {
  const { products } = useInventory();
  const summary = useMemo(() => {
    const slabs = [0, 5, 12, 18, 28];
    return slabs.map((s) => {
      const items = products.filter((p) => p.gst === s);
      const stockValue = items.reduce((sum, p) => sum + p.sellingPrice * p.quantity, 0);
      const taxable = stockValue / (1 + s / 100);
      const tax = stockValue - taxable;
      return { slab: s, items: items.length, stockValue, tax };
    });
  }, [products]);

  const totalTax = summary.reduce((s, r) => s + r.tax, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">GST Summary</h1>
          <p className="text-sm text-muted-foreground">Tax liability by slab based on current inventory value.</p>
        </div>
        <Button variant="outline" onClick={() => toast.success("GSTR-1 exported")}><Download className="h-4 w-4 mr-1" /> Export GSTR-1</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">GSTIN</div><div className="text-lg font-semibold font-mono mt-1">07AABCK1234D1Z9</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Tax in Stock</div><div className="text-2xl font-semibold flex items-center gap-2 mt-1"><Percent className="h-5 w-5 text-primary" />₹{Math.round(totalTax).toLocaleString("en-IN")}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-xs text-muted-foreground">Filing Period</div><div className="text-lg font-semibold mt-1">May 2026</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Slab-wise Breakup</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>GST Slab</TableHead><TableHead className="text-right">Products</TableHead><TableHead className="text-right">Stock Value</TableHead><TableHead className="text-right">Tax Component</TableHead></TableRow></TableHeader>
            <TableBody>
              {summary.map((r) => (
                <TableRow key={r.slab}>
                  <TableCell className="font-medium">{r.slab}%</TableCell>
                  <TableCell className="text-right">{r.items}</TableCell>
                  <TableCell className="text-right">₹{Math.round(r.stockValue).toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right">₹{Math.round(r.tax).toLocaleString("en-IN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
