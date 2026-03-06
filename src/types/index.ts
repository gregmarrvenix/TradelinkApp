// Shared types for the Tradelink Trade App

export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  accountNumber: string;
  role: 'admin' | 'buyer' | 'viewer';
  branchId: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  subCategory: string;
  subcategory?: string;
  price: number;
  tradePrice?: number;
  rrp: number;
  unit: string;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock' | 'special-order';
  stockQty: number;
  stock?: Array<{ branchId: string; branchName: string; status: string; qty: number }>;
  images: string[];
  specifications: Record<string, string>;
  specs?: Record<string, string>;
  tags?: string[];
  relatedProductIds?: string[];
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  deliveryFee?: number;
  total: number;
  deliveryMethod: 'delivery' | 'pickup';
  deliveryAddress?: string;
  branch?: { id: string; name: string; address: string; phone: string };
  date: string;
  eta?: string;
  estimatedDelivery?: string;
  driverName?: string;
  driverPhone?: string;
  driverLat?: number;
  driverLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  invoiceNumber?: string;
  timeline?: TrackingEvent[];
  trackingEvents?: TrackingEvent[];
}

export type OrderStatus =
  | 'processing'
  | 'scheduled'
  | 'dispatched'
  | 'en-route'
  | 'enroute'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface TrackingEvent {
  timestamp: string;
  status: OrderStatus;
  description: string;
  location?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  hours: string;
  services: string[];
}

export interface SavedList {
  id: string;
  name: string;
  itemCount: number;
  updatedAt: string;
  items: CartItem[];
}

export interface Quote {
  id: string;
  quoteNumber: string;
  status: 'pending' | 'accepted' | 'expired';
  items: OrderItem[];
  total: number;
  validUntil: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: 'paid' | 'unpaid' | 'overdue';
  total: number;
  dueDate: string;
  issuedAt: string;
  pdfUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'buyer' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
}

export type ThemeMode = 'light' | 'dark' | 'system';
