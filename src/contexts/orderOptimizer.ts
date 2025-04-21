
import { Order, OrderStatus } from "@/types";

/**
 * Optimizes order updates by batching them to reduce re-renders
 * @param orders Current orders array
 * @param orderId ID of the order to update
 * @param status New order status
 * @returns Updated orders array
 */
export const optimizeBatchOrderUpdate = (
  orders: Order[],
  orderId: string,
  status: OrderStatus
): Order[] => {
  // Find the order to update first to avoid unnecessary iterations
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  // If order doesn't exist or status is already the same, return original array
  if (orderIndex === -1 || orders[orderIndex].status === status) {
    return orders;
  }
  
  // Use slice instead of spread operator for better performance
  const newOrders = orders.slice();
  
  // Update only the needed order directly by index - more efficient than map
  newOrders[orderIndex] = { 
    ...orders[orderIndex], 
    status, 
    updatedAt: new Date().toISOString() 
  };
  
  return newOrders;
};

/**
 * Optimizes operations that involve filtering lists
 * @param items Array to filter
 * @param predicate Filter function
 * @returns Filtered array
 */
export const optimizeFilter = <T>(items: T[], predicate: (item: T) => boolean): T[] => {
  // Quick performance check - if empty array, skip processing
  if (items.length === 0) return [];
  
  return items.filter(predicate);
};

/**
 * Improved debounce implementation with better performance
 * @param callback Function to debounce
 * @param delay Delay in milliseconds
 */
export const debounce = <T extends (...args: any[]) => any>(callback: T, delay = 300): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

/**
 * Improved throttle implementation with better performance and immediate execution
 * @param callback Function to throttle
 * @param limit Time limit in milliseconds
 */
export const throttle = <T extends (...args: any[]) => any>(callback: T, limit = 300): ((...args: Parameters<T>) => void) => {
  let lastRan = 0;
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  
  return function(this: any, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;
    
    const now = Date.now();
    
    if (!inThrottle) {
      // First execution runs immediately
      callback.apply(this, args);
      lastRan = now;
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
        // Run with the most recent arguments if there were any during throttle
        if (lastArgs) {
          (throttle(callback, limit)).apply(lastThis, lastArgs);
          lastArgs = null;
          lastThis = null;
        }
      }, limit);
    }
  } as (...args: Parameters<T>) => void;
};

/**
 * Memoizes a function to avoid recalculating results for the same inputs
 * @param fn Function to memoize
 * @returns Memoized function
 */
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * Cache for storing computed values with timeout
 * Prevents excessive computation in rapid updates
 */
export class ComputeCache {
  private cache = new Map<string, { value: any, expires: number }>();
  private maxSize: number;
  
  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
    
    // Set up periodic cleanup to prevent memory leaks
    setInterval(() => this.cleanup(), 60000); // Run cleanup every minute
  }
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value as T;
  }
  
  set<T>(key: string, value: T, ttl = 5000): void {
    // Enforce max size - remove oldest entries if needed
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Remove expired entries to free up memory
  cleanup(): void {
    const now = Date.now();
    this.cache.forEach((item, key) => {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    });
  }
}

// Create a global computation cache instance
export const computeCache = new ComputeCache(200); // Allow up to 200 cached items

// Global indicator for in-progress updates to prevent duplicate status changes
const processingOrderIds = new Set<string>();
let lastProcessedTime = new Map<string, number>();
const MIN_PROCESSING_INTERVAL = 3000; // Reduced to 3 seconds to improve responsiveness

/**
 * Check if an order is currently being processed or was recently processed
 * @param orderId ID of the order to check
 * @returns Boolean indicating if the order is being processed
 */
export const isOrderProcessing = (orderId: string): boolean => {
  if (processingOrderIds.has(orderId)) {
    return true;
  }
  
  // Also check if the order was processed recently
  const lastTime = lastProcessedTime.get(orderId) || 0;
  const timeSinceLastUpdate = Date.now() - lastTime;
  return timeSinceLastUpdate < MIN_PROCESSING_INTERVAL;
};

/**
 * Mark an order as being processed
 * @param orderId ID of the order to mark
 * @param duration Duration in ms to consider the order in processing state
 */
export const markOrderProcessing = (orderId: string, duration = 3000): void => {
  processingOrderIds.add(orderId);
  lastProcessedTime.set(orderId, Date.now());
  
  setTimeout(() => {
    processingOrderIds.delete(orderId);
  }, duration);
};

/**
 * Force clear processing state for an order (used for debugging and recovery)
 * @param orderId ID of the order to clear
 */
export const clearProcessingState = (orderId: string): void => {
  processingOrderIds.delete(orderId);
  lastProcessedTime.delete(orderId);
};

/**
 * Clear all processing states (emergency reset)
 */
export const clearAllProcessingStates = (): void => {
  processingOrderIds.clear();
  lastProcessedTime.clear();
  
  console.log("All processing states have been cleared");
};

/**
 * Store order data persistently to prevent loss during UI refreshes
 */
export const persistentOrderStore = {
  // Store orders in memory to prevent loss during state resets
  orderCache: new Map<string, Order>(),
  
  // Add or update an order in the persistent store
  setOrder: (order: Order) => {
    persistentOrderStore.orderCache.set(order.id, order);
  },
  
  // Get an order from the persistent store
  getOrder: (id: string): Order | undefined => {
    return persistentOrderStore.orderCache.get(id);
  },
  
  // Remove an order from the persistent store
  removeOrder: (id: string) => {
    persistentOrderStore.orderCache.delete(id);
  },
  
  // Get all stored orders
  getAllOrders: (): Order[] => {
    return Array.from(persistentOrderStore.orderCache.values());
  },
  
  // Synchronize with current state - adds any orders not in the store
  syncWithState: (orders: Order[]) => {
    orders.forEach(order => {
      persistentOrderStore.setOrder(order);
    });
    return persistentOrderStore.getAllOrders();
  }
};

// Ensure orders aren't lost during page reloads or component unmounts
window.addEventListener('beforeunload', () => {
  const orders = persistentOrderStore.getAllOrders();
  if (orders.length > 0) {
    try {
      localStorage.setItem('pendingOrders', JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders to localStorage:", e);
    }
  }
});

// Try to load pending orders on initialization
try {
  const savedOrders = localStorage.getItem('pendingOrders');
  if (savedOrders) {
    const orders = JSON.parse(savedOrders);
    orders.forEach((order: Order) => {
      persistentOrderStore.setOrder(order);
    });
    // Clear after loading
    localStorage.removeItem('pendingOrders');
  }
} catch (e) {
  console.error("Failed to load pending orders:", e);
}

