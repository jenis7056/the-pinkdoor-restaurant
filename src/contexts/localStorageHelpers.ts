
import { Customer } from "@/types";

// Tab-specific identifier
const TAB_ID = crypto.randomUUID();

// Cache of the data loaded in this tab
const tabCustomerCache = new Map<string, any>();

export const loadStateFromLocalStorage = (
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>,
  setCurrentCustomer: React.Dispatch<React.SetStateAction<any>>,
  setCustomers: React.Dispatch<React.SetStateAction<any>>,
  setOrders: React.Dispatch<React.SetStateAction<any>>,
  setCart: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    // Load user data - this is shared across tabs for staff members
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setCurrentUser(JSON.parse(currentUser));
    }

    // For customers, ONLY use tab-specific storage
    const tabCustomer = sessionStorage.getItem(`currentCustomer_${TAB_ID}`);
    
    if (tabCustomer) {
      // Use customer data specific to this tab
      const parsedCustomer = JSON.parse(tabCustomer);
      setCurrentCustomer(parsedCustomer);
      tabCustomerCache.set('currentCustomer', parsedCustomer);
    } else {
      // No fallback to localStorage for customers
      // This ensures each tab maintains its own customer session
      setCurrentCustomer(null);
    }

    // For admin/staff, load all customers
    const customers = localStorage.getItem('customers');
    if (customers) {
      setCustomers(JSON.parse(customers));
    }

    const orders = localStorage.getItem('orders');
    if (orders) {
      try {
        // Check if the value uses the timestamp format
        const parsed = JSON.parse(orders);
        if (parsed && parsed._timestamp) {
          // If it has timestamp format, use the data property
          setOrders(Array.isArray(parsed.data) ? parsed.data : []);
        } else {
          // Regular format
          setOrders(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error parsing orders from localStorage:', error);
        setOrders([]); // Set to empty array on error
      }
    } else {
      setOrders([]); // Ensure we have an empty array, not undefined
    }

    // Always use tab-specific cart
    const cart = sessionStorage.getItem(`cart_${TAB_ID}`);
    if (cart) {
      setCart(JSON.parse(cart));
    } else {
      // No fallback to global cart - each tab has its own cart
      setCart([]);
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
};

export const saveToLocalStorage = (key: string, value: any) => {
  try {
    // For customer-specific data, use strict tab isolation
    if (key === 'currentCustomer') {
      if (value) {
        // Save customer data ONLY in tab-specific storage
        const newValue = JSON.stringify(value);
        sessionStorage.setItem(`currentCustomer_${TAB_ID}`, newValue);
        tabCustomerCache.set('currentCustomer', value);
        
        // Don't update the global localStorage for currentCustomer
        // This prevents customer data bleeding between tabs
      } else {
        // If value is null, clear the customer data
        sessionStorage.removeItem(`currentCustomer_${TAB_ID}`);
        tabCustomerCache.delete('currentCustomer');
      }
    } else if (key === 'cart') {
      // Save cart data to tab-specific storage only
      if (value) {
        const newValue = JSON.stringify(value);
        sessionStorage.setItem(`cart_${TAB_ID}`, newValue);
      } else {
        sessionStorage.removeItem(`cart_${TAB_ID}`);
      }
    } else {
      // For other data types (like customers array, orders, etc.), use standard localStorage
      // This ensures staff members see all data across tabs
      const currentValue = localStorage.getItem(key);
      const newValue = JSON.stringify(value);
      if (currentValue !== newValue) {
        localStorage.setItem(key, newValue);
        console.log(`Saved to localStorage: ${key}`);
      }
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Function to force update localStorage even if value hasn't changed
// This will trigger storage events in other tabs
export const forceSyncToLocalStorage = (key: string, value: any) => {
  try {
    // Add a timestamp to force the value to be different
    const valueWithTimestamp = {
      data: Array.isArray(value) ? value : [], // Ensure value is at least an empty array
      _timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(valueWithTimestamp));
    console.log(`Force synced to localStorage: ${key}`);
  } catch (error) {
    console.error('Error force syncing to localStorage:', error);
  }
};

// Function to get the current tab ID
export const getTabId = () => TAB_ID;

// Check if this is a storage event from the same tab
export const isEventFromCurrentTab = (event: StorageEvent): boolean => {
  // If the event doesn't have tab ID metadata, it's not from our app's tabs
  if (!event.newValue) return false;
  
  try {
    const parsed = JSON.parse(event.newValue);
    // If it has our tab ID structure, compare it
    if (parsed && parsed._tabId && parsed._tabId === TAB_ID) {
      return true;
    }
  } catch (e) {
    // If parsing fails, it's not our format
    return false;
  }
  return false;
};

// Function to get the current customer from cache for this tab
export const getTabCustomer = (): Customer | null => {
  return tabCustomerCache.get('currentCustomer') || null;
};

// Clear customer data for this tab only
export const clearTabCustomerData = () => {
  sessionStorage.removeItem(`currentCustomer_${TAB_ID}`);
  tabCustomerCache.delete('currentCustomer');
  sessionStorage.removeItem(`cart_${TAB_ID}`);
};
