// User and Authentication
export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'waiter' | 'chef' | 'customer';

// Customer
export interface Customer {
  id: string;
  name: string;
  tableNumber?: number;
  createdAt: string;
  tabId?: string;
  reservationTime?: string;
}

// Menu Items
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  subcategory: string;
  image: string;
  isSpecial?: boolean;
}

// Categories
export interface Category {
  name: string;
  subcategories: string[];
}

// Order
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  canCancel: boolean;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed';
