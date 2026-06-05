export type Product = {
  id: string;
  name: string;
  barcode: string;
  category: string;
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  gst: number;
  quantity: number;
  unit: "Kg" | "Ltr" | "Pcs" | "Gm";
  expiryDate: string; // ISO
  supplier: string;
  minStock: number;
};

const today = new Date();
const daysFromNow = (d: number) => {
  const x = new Date(today);
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10);
};

export const CATEGORIES = [
  "Grocery",
  "Dairy",
  "Beverages",
  "Snacks",
  "Personal Care",
  "Household",
  "Spices",
  "Bakery",
];

export const UNITS: Product["unit"][] = ["Kg", "Ltr", "Pcs", "Gm"];

export const SUPPLIERS = [
  "Sharma Wholesale",
  "Patel Distributors",
  "Krishna Traders",
  "Annapurna Foods",
];

export const seedProducts: Product[] = [
  { id: "P001", name: "Aashirvaad Atta 5kg", barcode: "8901030875021", category: "Grocery", brand: "Aashirvaad", purchasePrice: 240, sellingPrice: 285, gst: 5, quantity: 24, unit: "Pcs", expiryDate: daysFromNow(180), supplier: "Sharma Wholesale", minStock: 10 },
  { id: "P002", name: "Tata Salt 1kg", barcode: "8901030301234", category: "Grocery", brand: "Tata", purchasePrice: 22, sellingPrice: 28, gst: 5, quantity: 5, unit: "Pcs", expiryDate: daysFromNow(365), supplier: "Sharma Wholesale", minStock: 15 },
  { id: "P003", name: "Amul Gold Milk 1L", barcode: "8901262100123", category: "Dairy", brand: "Amul", purchasePrice: 62, sellingPrice: 68, gst: 0, quantity: 40, unit: "Ltr", expiryDate: daysFromNow(3), supplier: "Annapurna Foods", minStock: 20 },
  { id: "P004", name: "Britannia Bread", barcode: "8901063142025", category: "Bakery", brand: "Britannia", purchasePrice: 35, sellingPrice: 45, gst: 5, quantity: 12, unit: "Pcs", expiryDate: daysFromNow(2), supplier: "Annapurna Foods", minStock: 8 },
  { id: "P005", name: "Maggi Noodles 70g", barcode: "8901058511123", category: "Snacks", brand: "Nestle", purchasePrice: 11, sellingPrice: 14, gst: 12, quantity: 80, unit: "Pcs", expiryDate: daysFromNow(120), supplier: "Patel Distributors", minStock: 30 },
  { id: "P006", name: "Coca Cola 750ml", barcode: "8901030456789", category: "Beverages", brand: "Coca-Cola", purchasePrice: 30, sellingPrice: 40, gst: 18, quantity: 60, unit: "Pcs", expiryDate: daysFromNow(90), supplier: "Patel Distributors", minStock: 24 },
  { id: "P007", name: "Surf Excel 1kg", barcode: "8901030789456", category: "Household", brand: "Surf Excel", purchasePrice: 195, sellingPrice: 230, gst: 18, quantity: 18, unit: "Pcs", expiryDate: daysFromNow(540), supplier: "Krishna Traders", minStock: 10 },
  { id: "P008", name: "Colgate MaxFresh 150g", barcode: "8901314012345", category: "Personal Care", brand: "Colgate", purchasePrice: 78, sellingPrice: 99, gst: 18, quantity: 3, unit: "Pcs", expiryDate: daysFromNow(720), supplier: "Krishna Traders", minStock: 8 },
  { id: "P009", name: "MDH Garam Masala 100g", barcode: "8901207012345", category: "Spices", brand: "MDH", purchasePrice: 55, sellingPrice: 75, gst: 5, quantity: 22, unit: "Pcs", expiryDate: daysFromNow(25), supplier: "Sharma Wholesale", minStock: 10 },
  { id: "P010", name: "Parle-G Biscuits", barcode: "8901719101234", category: "Snacks", brand: "Parle", purchasePrice: 8, sellingPrice: 10, gst: 12, quantity: 140, unit: "Pcs", expiryDate: daysFromNow(60), supplier: "Patel Distributors", minStock: 50 },
  { id: "P011", name: "Mother Dairy Curd 400g", barcode: "8901491004567", category: "Dairy", brand: "Mother Dairy", purchasePrice: 35, sellingPrice: 45, gst: 0, quantity: 14, unit: "Pcs", expiryDate: daysFromNow(5), supplier: "Annapurna Foods", minStock: 10 },
  { id: "P012", name: "Fortune Sunflower Oil 1L", barcode: "8904063201234", category: "Grocery", brand: "Fortune", purchasePrice: 135, sellingPrice: 165, gst: 5, quantity: 28, unit: "Ltr", expiryDate: daysFromNow(200), supplier: "Sharma Wholesale", minStock: 12 },
];

// Mock sales for dashboard
export const todaySales = 18450;
export const monthSales = 425600;
export const monthExpense = 86300;
export const totalCustomers = 312;
export const totalSuppliers = 14;
export const pendingDues = 24780;
