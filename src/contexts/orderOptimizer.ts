
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
 * Improved throttle implementation with better performance
 * @param callback Function to throttle
 * @param limit Time limit in milliseconds
 */
export const throttle = <T extends (...args: any[]) => any>(callback: T, limit = 300): ((...args: Parameters<T>) => void) => {
  let waiting = false;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  
  const timeoutFunction = function(this: any) {
    waiting = false;
    if (lastArgs) {
      callback.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
  };
  
  return function(this: any, ...args: Parameters<T>) {
    if (!waiting) {
      callback.apply(this, args);
      waiting = true;
      setTimeout(timeoutFunction, limit);
    } else {
      lastArgs = args;
      lastThis = this;
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
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// Create a global computation cache instance
export const computeCache = new ComputeCache();
