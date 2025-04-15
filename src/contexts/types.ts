
import { User, Customer, MenuItem, Order, Category, UserRole, OrderStatus, OrderItem } from "@/types";

export interface AppContextType {
  // Authentication
  currentUser: User | null;
  login: (username: string, password: string) => UserRole | false;
  logout: () => void;
  
  // Menu Management
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  categories: Category[];
  
  // Customer Management
  customers: Customer[];
  currentCustomer: Customer | null;
  registerCustomer: (name: string, tableNumber: number) => void;
  removeCustomer: (id: string) => void;
  
  // Order Management
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  createOrder: (items: OrderItem[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Cart Management
  cart: OrderItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}
