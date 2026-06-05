import { useMemo, useState } from "react";
import { Search, Plus, Minus, Trash2, ShoppingCart, Printer, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventory } from "@/lib/inventory-store";
import { toast } from "sonner";

type CartItem = { id: string; name: string; price: number; gst: number; qty: number };

export function BillingPage() {
  const { products } = useInventory();
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<"Cash" | "UPI" | "Card" | "Udhar">("UPI");
  const [customer, setCustomer] = useState("Walk-in");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products.slice(0, 12);
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.barcode.includes(q),
    ).slice(0, 20);
  }, [query, products]);

  const addToCart = (p: (typeof products)[number]) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.id === p.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
      }
      return [...prev, { id: p.id, name: p.name, price: p.sellingPrice, gst: p.gst, qty: 1 }];
    });
  };

  const updateQty = (id: string, d: number) =>
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: Math.max(0, x.qty + d) } : x))
        .filter((x) => x.qty > 0),
    );

  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const gstTotal = cart.reduce((s, x) => s + (x.price * x.qty * x.gst) / 100, 0);
  const total = Math.round(subtotal + gstTotal);

  const checkout = () => {
    if (!cart.length) return toast.error("Cart is empty");
    toast.success(`Invoice generated • ₹${total} • ${payment}`);
    setCart([]);
  };

  const printReceipt = () => {
    if (!cart.length) return toast.error("Cart is empty");

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const d = new Date();
    const dateStr = d.toLocaleDateString() + " " + d.toLocaleTimeString();

    const html = `
      <html>
      <head>
        <title>Receipt</title>
        <style>
          body { font-family: monospace; width: 300px; margin: 0 auto; padding: 20px; color: #000; }
          .text-center { text-align: center; }
          .flex { display: flex; justify-content: space-between; }
          .border-b { border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
          th, td { text-align: left; padding: 4px 0; }
          th.right, td.right { text-align: right; }
          .font-bold { font-weight: bold; }
          .text-lg { font-size: 1.2em; }
          small { color: #555; }
        </style>
      </head>
      <body>
        <div class="text-center border-b">
          <h2 style="margin:0 0 5px 0">Smart Kirana</h2>
          <p style="margin:0">Shop 12, Main Market<br>Sector 14, Noida</p>
          <p style="margin:5px 0 0 0">Ph: +91 98100 00000</p>
        </div>
        <div class="border-b" style="font-size: 0.9em">
          <div class="flex"><span>Date:</span><span>${dateStr}</span></div>
          <div class="flex"><span>Customer:</span><span>${customer || "Walk-in"}</span></div>
          <div class="flex"><span>Payment:</span><span>${payment}</span></div>
        </div>
        <table class="border-b">
          <thead>
            <tr>
              <th>Item</th>
              <th class="right">Qty</th>
              <th class="right">Amt</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map((x) => `
              <tr>
                <td>${x.name}<br><small>₹${x.price} + ${x.gst}% GST</small></td>
                <td class="right">${x.qty}</td>
                <td class="right">₹${(x.price * x.qty).toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <div class="border-b font-bold">
          <div class="flex"><span>Subtotal:</span><span>₹${subtotal.toFixed(2)}</span></div>
          <div class="flex"><span>GST:</span><span>₹${gstTotal.toFixed(2)}</span></div>
          <div class="flex text-lg" style="margin-top: 5px"><span>Total:</span><span>₹${total}</span></div>
        </div>
        <div class="text-center font-bold" style="margin-top: 10px;">
          <p>Thank you for shopping with us!</p>
        </div>
        <script>
          window.onload = () => { window.print(); setTimeout(() => { window.parent.document.body.removeChild(window.frameElement); }, 500); };
        </script>
      </body>
      </html>
    `;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4 h-[calc(100vh-7rem)]">
      <div className="flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Scan barcode or search product…"
              className="pl-9 h-11"
            />
          </div>
          <Badge variant="outline" className="hidden md:inline-flex">F2 New • F4 Pay</Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 overflow-auto pr-1">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              className="text-left rounded-md border bg-card p-3 hover:border-primary hover:shadow-sm transition"
            >
              <div className="text-xs text-muted-foreground">{p.category}</div>
              <div className="font-medium text-sm leading-tight line-clamp-2 mt-1">{p.name}</div>
              <div className="flex items-end justify-between mt-2">
                <div className="text-base font-semibold">₹{p.sellingPrice}</div>
                <Badge variant="secondary" className="text-[10px]">Stock {p.quantity}</Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Card className="flex flex-col min-h-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingCart className="h-4 w-4" /> Current Bill
          </CardTitle>
          <Input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Customer name (or Walk-in)"
            className="mt-2"
          />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 gap-3">
          <div className="flex-1 overflow-auto -mx-2 px-2">
            {cart.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-12">
                No items yet. Tap a product to add.
              </div>
            ) : (
              <ul className="space-y-2">
                {cart.map((x) => (
                  <li key={x.id} className="flex items-center gap-2 border rounded-md p-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{x.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ₹{x.price} × {x.qty} • GST {x.gst}%
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(x.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{x.qty}</span>
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(x.id, +1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => updateQty(x.id, -x.qty)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Separator />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span>₹{gstTotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg font-semibold pt-1">
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>
          <Tabs value={payment} onValueChange={(v) => setPayment(v as typeof payment)}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="Cash">Cash</TabsTrigger>
              <TabsTrigger value="UPI">UPI</TabsTrigger>
              <TabsTrigger value="Card">Card</TabsTrigger>
              <TabsTrigger value="Udhar">Udhar</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => toast.info("WhatsApp invoice sent")}>
              <Smartphone className="h-4 w-4 mr-1" /> WhatsApp
            </Button>
            <Button variant="outline" onClick={printReceipt}>
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
          </div>
          <Button size="lg" className="h-12 text-base" onClick={checkout}>
            Charge ₹{total}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
