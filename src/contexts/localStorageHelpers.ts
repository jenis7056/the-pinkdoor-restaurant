
import { User, Customer, MenuItem, Order, OrderItem, Category } from "@/types";

export const loadStateFromLocalStorage = (
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>,
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer | null>>,
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>,
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  setCart: React.Dispatch<React.SetStateAction<OrderItem[]>>
) => {
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
    // If there's an error, clear everything to prevent corrupted state
    clearEntireLocalStorage();
  }
};

export const saveToLocalStorage = (key: string, value: any) => {
  try {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const clearEntireLocalStorage = () => {
  try {
    // Clear all specific items we've stored
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentCustomer');
    localStorage.removeItem('customers');
    localStorage.removeItem('orders');
    localStorage.removeItem('cart');
    
    console.log('Entire session cleared from localStorage');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
