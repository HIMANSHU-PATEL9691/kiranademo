import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { seedProducts, type Product } from "./mock-data";

type Ctx = {
  products: Product[];
  upsert: (p: Product) => void;
  remove: (id: string) => void;
};

const InventoryContext = createContext<Ctx | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);

  const value = useMemo<Ctx>(
    () => ({
      products,
      upsert: (p) =>
        setProducts((prev) => {
          const i = prev.findIndex((x) => x.id === p.id);
          if (i === -1) return [...prev, p];
          const copy = [...prev];
          copy[i] = p;
          return copy;
        }),
      remove: (id) => setProducts((prev) => prev.filter((x) => x.id !== id)),
    }),
    [products],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used inside InventoryProvider");
  return ctx;
}

export function daysUntil(iso: string): number {
  const d = new Date(iso).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((d - today.getTime()) / (1000 * 60 * 60 * 24));
}
