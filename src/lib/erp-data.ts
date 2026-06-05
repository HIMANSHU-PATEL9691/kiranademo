// Mock data for additional ERP modules
export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  dueAmount: number;
  totalPurchases: number;
};

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  gstin: string;
  payable: number;
};

export type Purchase = {
  id: string;
  date: string;
  supplier: string;
  items: number;
  amount: number;
  status: "Paid" | "Pending";
};

export type Expense = {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  phone: string;
  salary: number;
  joinDate: string;
  status: "Present" | "Absent" | "Leave";
};

export type SaleInvoice = {
  id: string;
  date: string;
  customer: string;
  items: number;
  amount: number;
  gst: number;
  payment: "Cash" | "UPI" | "Card" | "Udhar";
};

export const customers: Customer[] = [
  { id: "C001", name: "Anil Verma", phone: "+91 98201 11111", address: "Sector 12, Noida", dueAmount: 1240, totalPurchases: 18650 },
  { id: "C002", name: "Sunita Devi", phone: "+91 99100 22222", address: "Lajpat Nagar, Delhi", dueAmount: 0, totalPurchases: 9800 },
  { id: "C003", name: "Ramesh Gupta", phone: "+91 98765 33333", address: "Karol Bagh, Delhi", dueAmount: 3450, totalPurchases: 24200 },
  { id: "C004", name: "Pooja Sharma", phone: "+91 99887 44444", address: "Rohini, Delhi", dueAmount: 580, totalPurchases: 6700 },
  { id: "C005", name: "Mohit Singh", phone: "+91 97654 55555", address: "Dwarka, Delhi", dueAmount: 0, totalPurchases: 15400 },
  { id: "C006", name: "Kavita Joshi", phone: "+91 98123 66666", address: "Saket, Delhi", dueAmount: 19510, totalPurchases: 42800 },
];

export const suppliers: Supplier[] = [
  { id: "S001", name: "Sharma Wholesale", contact: "Rakesh Sharma", phone: "+91 98100 12345", gstin: "07AABCS1234A1Z5", payable: 24500 },
  { id: "S002", name: "Patel Distributors", contact: "Bharat Patel", phone: "+91 98200 23456", gstin: "27AABCP5678B2Z6", payable: 8900 },
  { id: "S003", name: "Krishna Traders", contact: "Vinod Krishna", phone: "+91 98300 34567", gstin: "07AABCK9012C3Z7", payable: 0 },
  { id: "S004", name: "Annapurna Foods", contact: "Mukesh Yadav", phone: "+91 98400 45678", gstin: "07AABCA3456D4Z8", payable: 12300 },
];

export const purchases: Purchase[] = [
  { id: "PO-2451", date: "2026-05-20", supplier: "Sharma Wholesale", items: 18, amount: 24500, status: "Pending" },
  { id: "PO-2450", date: "2026-05-18", supplier: "Patel Distributors", items: 12, amount: 8900, status: "Pending" },
  { id: "PO-2449", date: "2026-05-15", supplier: "Annapurna Foods", items: 22, amount: 18600, status: "Paid" },
  { id: "PO-2448", date: "2026-05-12", supplier: "Krishna Traders", items: 8, amount: 6400, status: "Paid" },
  { id: "PO-2447", date: "2026-05-09", supplier: "Sharma Wholesale", items: 30, amount: 32100, status: "Paid" },
];

export const expenses: Expense[] = [
  { id: "E001", date: "2026-05-21", category: "Rent", description: "Shop rent May", amount: 18000 },
  { id: "E002", date: "2026-05-20", category: "Electricity", description: "BSES bill", amount: 4200 },
  { id: "E003", date: "2026-05-19", category: "Transport", description: "Tempo charges", amount: 850 },
  { id: "E004", date: "2026-05-18", category: "Salary", description: "Advance to Suresh", amount: 5000 },
  { id: "E005", date: "2026-05-15", category: "Maintenance", description: "Fridge repair", amount: 1600 },
  { id: "E006", date: "2026-05-12", category: "Misc", description: "Stationery", amount: 320 },
];

export const employees: Employee[] = [
  { id: "EMP01", name: "Suresh Kumar", role: "Cashier", phone: "+91 98111 22233", salary: 18000, joinDate: "2024-08-10", status: "Present" },
  { id: "EMP02", name: "Manoj Yadav", role: "Helper", phone: "+91 98222 33344", salary: 12000, joinDate: "2025-01-15", status: "Present" },
  { id: "EMP03", name: "Geeta Devi", role: "Cleaner", phone: "+91 98333 44455", salary: 8000, joinDate: "2024-11-01", status: "Leave" },
  { id: "EMP04", name: "Arjun Singh", role: "Delivery", phone: "+91 98444 55566", salary: 15000, joinDate: "2025-03-20", status: "Absent" },
];

export const recentSales: SaleInvoice[] = [
  { id: "INV-10245", date: "2026-05-22", customer: "Walk-in", items: 6, amount: 1240, gst: 62, payment: "UPI" },
  { id: "INV-10244", date: "2026-05-22", customer: "Anil Verma", items: 12, amount: 3580, gst: 178, payment: "Udhar" },
  { id: "INV-10243", date: "2026-05-22", customer: "Walk-in", items: 3, amount: 420, gst: 21, payment: "Cash" },
  { id: "INV-10242", date: "2026-05-21", customer: "Kavita Joshi", items: 22, amount: 8650, gst: 432, payment: "Udhar" },
  { id: "INV-10241", date: "2026-05-21", customer: "Walk-in", items: 5, amount: 980, gst: 49, payment: "Cash" },
  { id: "INV-10240", date: "2026-05-21", customer: "Mohit Singh", items: 9, amount: 2150, gst: 107, payment: "Card" },
  { id: "INV-10239", date: "2026-05-20", customer: "Walk-in", items: 2, amount: 180, gst: 9, payment: "Cash" },
  { id: "INV-10238", date: "2026-05-20", customer: "Pooja Sharma", items: 14, amount: 4320, gst: 216, payment: "UPI" },
];

export const salesTrend = [
  { day: "Mon", sales: 14200 },
  { day: "Tue", sales: 16800 },
  { day: "Wed", sales: 12500 },
  { day: "Thu", sales: 19400 },
  { day: "Fri", sales: 22100 },
  { day: "Sat", sales: 28600 },
  { day: "Sun", sales: 18450 },
];
