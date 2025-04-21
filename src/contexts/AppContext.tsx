import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { User, Customer, MenuItem, Order, OrderItem, Category, UserRole, OrderStatus } from "@/types";
import { menuData } from "@/data/menuItems";
import { categoriesData } from "@/data/categories";

// Import helpers
import { AppContextType } from "./types";
import { handleLogin, handleLogout } from "./authHelpers";
import { handleAddMenuItem, handleUpdateMenuItem, handleDeleteMenuItem } from "./menuHelpers";
import { handleRegisterCustomer, handleRemoveCustomer } from "./customerHelpers";
import { handleCreateOrder, handleUpdateOrderStatus, recoverLostOrders } from "./orderHelpers";
import { handleAddToCart, handleUpdateCartItem, handleRemoveFromCart, handleClearCart } from "./cartHelpers";
import { loadStateFromLocalStorage, saveToLocalStorage, forceSyncToLocalStorage } from "./localStorageHelpers";
import { clearAllProcessingStates, persistentOrderStore } from "./orderOptimizer";

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
  
  // Flag to prevent initialization race conditions
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Store initialization timestamp to detect fresh sessions
  const initTimeRef = useRef<number>(Date.now());

  // Clear all processing flags on app initialization to prevent stuck state
  useEffect(() => {
    clearAllProcessingStates();
  }, []);

  // Load initial state from localStorage
  useEffect(() => {
    loadStateFromLocalStorage(
      setCurrentUser,
      setCurrentCustomer,
      setCustomers,
      setOrders,
      setCart
    );
    
    setIsInitialized(true);
    
    // Attempt to recover any lost orders
    setTimeout(() => {
      recoverLostOrders(setOrders);
    }, 1000); // Give a small delay to ensure everything else is loaded first

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
                setOrders(prev => {
                  // Keep track of existing orders
                  const existingIds = new Set(prev.map(order => order.id));
                  
                  // Merge with current orders, preferring newer versions
                  const mergedOrders = [...prev];
                  
                  // Add new orders or update existing ones
                  for (const newOrder of parsed.data) {
                    if (!existingIds.has(newOrder.id)) {
                      // This is a new order
                      mergedOrders.push(newOrder);
                    } else {
                      // Update existing order if the stored one is newer
                      const existingIndex = mergedOrders.findIndex(order => order.id === newOrder.id);
                      if (new Date(newOrder.updatedAt) > new Date(mergedOrders[existingIndex].updatedAt)) {
                        mergedOrders[existingIndex] = newOrder;
                      }
                    }
                  }
                  
                  // Sync with persistent store
                  return persistentOrderStore.syncWithState(mergedOrders);
                });
              } else {
                // Regular format
                console.log("Updating orders from storage event:", parsed);
                setOrders(prev => {
                  // Instead of replacing, merge with existing orders
                  const existingIds = new Set(prev.map(order => order.id));
                  const newOrders = parsed.filter((order: Order) => !existingIds.has(order.id));
                  
                  const mergedOrders = [...prev, ...newOrders];
                  return persistentOrderStore.syncWithState(mergedOrders);
                });
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

  // When orders change, update all orders in the persistent store
  useEffect(() => {
    if (isInitialized && orders.length > 0) {
      orders.forEach(order => {
        persistentOrderStore.setOrder(order);
      });
    }
  }, [orders, isInitialized]);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      saveToLocalStorage('currentUser', currentUser);
    }
  }, [currentUser, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveToLocalStorage('currentCustomer', currentCustomer);
    }
  }, [currentCustomer, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveToLocalStorage('customers', customers);
    }
  }, [customers, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      // For orders, we use forceSyncToLocalStorage to ensure it triggers
      // the storage event even if the stringified value is the same
      // This is important for real-time updates across different user dashboards
      forceSyncToLocalStorage('orders', orders);
      console.log("Updated orders:", orders);
    }
  }, [orders, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveToLocalStorage('cart', cart);
    }
  }, [cart, isInitialized]);

  // Authentication functions
  const login = useCallback((username: string, password: string): UserRole | false => {
    return handleLogin(username, password, setCurrentUser);
  }, []);

  const logout = useCallback(() => {
    handleLogout(setCurrentUser);
  }, []);

  // Menu management functions
  const addMenuItem = useCallback((item: MenuItem) => {
    handleAddMenuItem(item, setMenuItems);
  }, []);

  const updateMenuItem = useCallback((id: string, item: Partial<MenuItem>) => {
    handleUpdateMenuItem(id, item, setMenuItems);
  }, []);

  const deleteMenuItem = useCallback((id: string) => {
    handleDeleteMenuItem(id, menuItems, setMenuItems);
  }, [menuItems]);

  // Customer management functions
  const registerCustomer = useCallback((name: string, tableNumber: number) => {
    handleRegisterCustomer(name, tableNumber, setCustomers, setCurrentCustomer, customers, orders);
  }, [customers, orders]);

  const removeCustomer = useCallback((id: string) => {
    handleRemoveCustomer(id, customers, currentCustomer, setCustomers, setCurrentCustomer);
  }, [customers, currentCustomer]);

  // Order management functions
  const createOrder = useCallback((items: OrderItem[]) => {
    return handleCreateOrder(items, currentCustomer, setOrders, setCart);
  }, [currentCustomer]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    handleUpdateOrderStatus(orderId, status, setOrders, setCurrentCustomer);
  }, []);

  // Cart management functions
  const addToCart = useCallback((menuItem: MenuItem, quantity: number) => {
    handleAddToCart(menuItem, quantity, cart, setCart);
  }, [cart]);

  const updateCartItem = useCallback((id: string, quantity: number) => {
    handleUpdateCartItem(id, quantity, setCart, removeFromCart);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    handleRemoveFromCart(id, cart, setCart);
  }, [cart]);

  const clearCart = useCallback(() => {
    handleClearCart(setCart);
  }, []);

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
