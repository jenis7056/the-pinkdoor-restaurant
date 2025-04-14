import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Customer, MenuItem, Order, Category, UserRole, OrderStatus, OrderItem } from "@/types";
import { menuData } from "@/data/menuItems";
import { categoriesData } from "@/data/categories";
import { toast } from "sonner";

interface AppContextType {
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
  createOrder: (items: OrderItem[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Cart Management
  cart: OrderItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Predefined users
const predefinedUsers: User[] = [
  { id: '1', username: 'jenis7056', role: 'admin', name: 'Admin User' },
  { id: '2', username: 'jyot', role: 'waiter', name: 'Jyot Waiter' },
  { id: '3', username: 'chef001', role: 'chef', name: 'Head Chef' },
];

// Predefined passwords
const passwords: Record<string, string> = {
  'jenis7056': 'Jenis@7056',
  'jyot': 'Jyot@7188',
  'chef001': 'chef@001',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuData);
  const [categories] = useState<Category[]>(categoriesData);
  
  // Customer state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  
  // Order state
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Cart state
  const [cart, setCart] = useState<OrderItem[]>([]);

  // Load initial state from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      const storedCustomer = localStorage.getItem('currentCustomer');
      if (storedCustomer) {
        setCurrentCustomer(JSON.parse(storedCustomer));
      }

      const storedCustomers = localStorage.getItem('customers');
      if (storedCustomers) {
        setCustomers(JSON.parse(storedCustomers));
      }

      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentCustomer) {
      localStorage.setItem('currentCustomer', JSON.stringify(currentCustomer));
    } else {
      localStorage.removeItem('currentCustomer');
    }
  }, [currentCustomer]);

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Authentication functions
  const login = (username: string, password: string): UserRole | false => {
    const user = predefinedUsers.find(u => u.username === username);
    if (user && passwords[username] === password) {
      setCurrentUser(user);
      toast.success(`Welcome, ${user.name}!`);
      return user.role; // Return the user role for redirection
    }
    toast.error('Invalid username or password');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    toast.success('Logged out successfully');
  };

  // Menu management functions
  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, { ...item, id: crypto.randomUUID() }]);
    toast.success(`${item.name} has been added to the menu`);
  };

  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    setMenuItems(prev => 
      prev.map(menuItem => 
        menuItem.id === id ? { ...menuItem, ...item } : menuItem
      )
    );
    toast.success(`Menu item updated successfully`);
  };

  const deleteMenuItem = (id: string) => {
    const itemName = menuItems.find(item => item.id === id)?.name;
    setMenuItems(prev => prev.filter(item => item.id !== id));
    toast.success(`${itemName} has been removed from the menu`);
  };

  // Customer management functions
  const registerCustomer = (name: string, tableNumber: number) => {
    const newCustomer = {
      id: crypto.randomUUID(),
      name,
      tableNumber,
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    setCurrentCustomer(newCustomer);
    toast.success(`Welcome, ${name}! You are now registered at table ${tableNumber}`);
  };

  const removeCustomer = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      
      // If removing the current customer, also clear their session
      if (currentCustomer?.id === id) {
        setCurrentCustomer(null);
      }
      
      toast.success(`Customer ${customer.name} has been removed`);
    }
  };

  // Order management functions
  const createOrder = (items: OrderItem[]) => {
    if (!currentCustomer) {
      toast.error('No customer is logged in');
      return;
    }
    
    const totalAmount = items.reduce(
      (sum, item) => sum + (item.menuItem.price * item.quantity), 
      0
    );
    
    const newOrder: Order = {
      id: crypto.randomUUID(),
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      tableNumber: currentCustomer.tableNumber!,
      items,
      status: 'pending',
      totalAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setOrders(prev => [...prev, newOrder]);
    setCart([]);  // Clear the cart after ordering
    toast.success('Your order has been placed successfully!');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status, 
              updatedAt: new Date().toISOString() 
            } 
          : order
      )
    );
    
    const statusMessages = {
      'confirmed': 'Order confirmed by waiter',
      'preparing': 'Chef has started preparing your order',
      'ready': 'Your order is ready to be served',
      'served': 'Your order has been served',
      'completed': 'Order completed',
    };
    
    toast.success(statusMessages[status] || `Order status updated to ${status}`);
  };

  // Cart management functions
  const addToCart = (menuItem: MenuItem, quantity: number) => {
    const existingItemIndex = cart.findIndex(
      item => item.menuItemId === menuItem.id
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      const newItem: OrderItem = {
        id: crypto.randomUUID(),
        menuItemId: menuItem.id,
        menuItem,
        quantity,
      };
      setCart(prev => [...prev, newItem]);
    }
    
    toast.success(`${menuItem.name} added to cart`);
  };

  const updateCartItem = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    const itemName = cart.find(item => item.id === id)?.menuItem.name;
    setCart(prev => prev.filter(item => item.id !== id));
    if (itemName) {
      toast.success(`${itemName} removed from cart`);
    }
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  const value: AppContextType = {
    // Authentication
    currentUser,
    login,
    logout,
    
    // Menu Management
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    categories,
    
    // Customer Management
    customers,
    currentCustomer,
    registerCustomer,
    removeCustomer,
    
    // Order Management
    orders,
    createOrder,
    updateOrderStatus,
    
    // Cart Management
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
