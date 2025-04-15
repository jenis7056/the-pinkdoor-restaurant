
export const loadStateFromLocalStorage = (
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>,
  setCurrentCustomer: React.Dispatch<React.SetStateAction<any>>,
  setCustomers: React.Dispatch<React.SetStateAction<any>>,
  setOrders: React.Dispatch<React.SetStateAction<any>>,
  setCart: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setCurrentUser(JSON.parse(currentUser));
    }

    const currentCustomer = localStorage.getItem('currentCustomer');
    if (currentCustomer) {
      setCurrentCustomer(JSON.parse(currentCustomer));
    }

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

    const cart = localStorage.getItem('cart');
      if (cart) {
        setCart(JSON.parse(cart));
      }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
};

export const saveToLocalStorage = (key: string, value: any) => {
  try {
    // Only save if value is different from current storage
    const currentValue = localStorage.getItem(key);
    const newValue = JSON.stringify(value);
    
    if (currentValue !== newValue) {
      localStorage.setItem(key, newValue);
      console.log(`Saved to localStorage: ${key}`);
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
