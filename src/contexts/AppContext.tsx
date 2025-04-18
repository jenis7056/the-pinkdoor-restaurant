
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Customer, MenuItem, Order, OrderItem, Category, UserRole, OrderStatus } from "@/types";
import { menuData } from "@/data/menuItems";
import { categoriesData } from "@/data/categories";

// Import helpers
import { AppContextType } from "./types";
import { handleLogin, handleLogout } from "./authHelpers";
import { handleAddMenuItem, handleUpdateMenuItem, handleDeleteMenuItem } from "./menuHelpers";
import { handleRegisterCustomer, handleRemoveCustomer } from "./customerHelpers";
import { handleCreateOrder, handleUpdateOrderStatus } from "./orderHelpers";
import { handleAddToCart, handleUpdateCartItem, handleRemoveFromCart, handleClearCart } from "./cartHelpers";
import { loadStateFromLocalStorage, saveToLocalStorage, forceSyncToLocalStorage } from "./localStorageHelpers";

const AppContext = createContext<AppContextType | undefined>(undefined);

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
    loadStateFromLocalStorage(
      setCurrentUser,
      setCurrentCustomer,
      setCustomers,
      setOrders,
      setCart
    );

    // Add storage event listener for cross-tab communication
    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key) return;

      console.log("Storage change detected:", event.key);
      
      switch (event.key) {
        case 'orders':
          if (event.newValue) {
            try {
              // Check if the value uses the timestamp format
              const parsed = JSON.parse(event.newValue);
              if (parsed._timestamp) {
                // This is the new format with timestamp
                console.log("Updating orders from storage event (with timestamp):", parsed.data);
                setOrders(parsed.data);
              } else {
                // Regular format
                console.log("Updating orders from storage event:", parsed);
                setOrders(parsed);
              }
            } catch (error) {
              console.error("Error parsing orders from storage event:", error);
            }
          }
          break;
        case 'customers':
          if (event.newValue) {
            try {
              const parsed = JSON.parse(event.newValue);
              if (parsed._timestamp) {
                setCustomers(parsed.data);
              } else {
                setCustomers(parsed);
              }
            } catch (error) {
              console.error("Error parsing customers from storage event:", error);
            }
          }
          break;
        case 'currentCustomer':
          if (event.newValue) {
            try {
              const parsed = JSON.parse(event.newValue);
              if (parsed._timestamp) {
                setCurrentCustomer(parsed.data);
              } else {
                setCurrentCustomer(parsed);
              }
            } catch (error) {
              console.error("Error parsing currentCustomer from storage event:", error);
              setCurrentCustomer(null);
            }
          } else {
            setCurrentCustomer(null);
          }
          break;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    saveToLocalStorage('currentUser', currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveToLocalStorage('currentCustomer', currentCustomer);
  }, [currentCustomer]);

  useEffect(() => {
    saveToLocalStorage('customers', customers);
  }, [customers]);

  useEffect(() => {
    // For orders, we use forceSyncToLocalStorage to ensure it triggers
    // the storage event even if the stringified value is the same
    // This is important for real-time updates in the waiter portal
    forceSyncToLocalStorage('orders', orders);
    console.log("Updated orders:", orders);
  }, [orders]);

  useEffect(() => {
    saveToLocalStorage('cart', cart);
  }, [cart]);

  // Authentication functions
  const login = (username: string, password: string): UserRole | false => {
    return handleLogin(username, password, setCurrentUser);
  };

  const logout = () => {
    handleLogout(setCurrentUser);
  };

  // Menu management functions
  const addMenuItem = (item: MenuItem) => {
    handleAddMenuItem(item, setMenuItems);
  };

  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    handleUpdateMenuItem(id, item, setMenuItems);
  };

  const deleteMenuItem = (id: string) => {
    handleDeleteMenuItem(id, menuItems, setMenuItems);
  };

  // Customer management functions
  const registerCustomer = (name: string, tableNumber: number) => {
    handleRegisterCustomer(name, tableNumber, setCustomers, setCurrentCustomer, customers, orders);
  };

  const removeCustomer = (id: string) => {
    handleRemoveCustomer(id, customers, currentCustomer, setCustomers, setCurrentCustomer);
  };

  // Order management functions
  const createOrder = (items: OrderItem[]) => {
    handleCreateOrder(items, currentCustomer, setOrders, setCart);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    handleUpdateOrderStatus(orderId, status, setOrders, setCurrentCustomer);
  };

  // Cart management functions
  const addToCart = (menuItem: MenuItem, quantity: number) => {
    handleAddToCart(menuItem, quantity, cart, setCart);
  };

  const updateCartItem = (id: string, quantity: number) => {
    handleUpdateCartItem(id, quantity, setCart, removeFromCart);
  };

  const removeFromCart = (id: string) => {
    handleRemoveFromCart(id, cart, setCart);
  };

  const clearCart = () => {
    handleClearCart(setCart);
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
    setOrders,
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
