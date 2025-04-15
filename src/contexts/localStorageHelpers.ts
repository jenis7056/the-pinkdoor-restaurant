
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
      setOrders(JSON.parse(orders));
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
      data: value,
      _timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(valueWithTimestamp));
    console.log(`Force synced to localStorage: ${key}`);
  } catch (error) {
    console.error('Error force syncing to localStorage:', error);
  }
};
