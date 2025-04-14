
export type UserRole = 'admin' | 'customer' | 'waiter' | 'chef';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface Customer {
  id: string;
  name: string;
  tableNumber: number | null;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  subcategory: string;
  image?: string;
  isSpecial?: boolean;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

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
}

export interface Category {
  name: string;
  subcategories: string[];
}
