
/**
 * Performance optimization utilities for button click handling
 * and other high-frequency interactions
 */

// Track button clicks to prevent duplicates
const buttonClickTracker = new Map<string, number>();

/**
 * Prevents rapid button clicks by debouncing interactions
 * @param id Unique identifier for the button
 * @param cooldownMs Cooldown time in milliseconds
 * @returns Boolean indicating if the click should proceed
 */
export function preventRapidClicks(id: string, cooldownMs: number = 1000): boolean {
  const now = Date.now();
  const lastClick = buttonClickTracker.get(id) || 0;
  
  if (now - lastClick < cooldownMs) {
    console.log(`Rapid click prevented: ${id}`);
    return false;
  }
  
  // Update last click time
  buttonClickTracker.set(id, now);
  return true;
}

/**
 * Wraps event handlers to prevent rapid clicks and execute only once within cooldown period
 * @param handler Event handler function
 * @param id Unique identifier for the handler
 * @param cooldownMs Cooldown time in milliseconds
 */
export function createStableClickHandler<T extends (...args: any[]) => any>(
  handler: T, 
  id: string, 
  cooldownMs: number = 1000
): (...args: Parameters<T>) => void {
  return (...args: Parameters<T>) => {
    // Use a stable ID that doesn't change on each render
    if (preventRapidClicks(id, cooldownMs)) {
      handler(...args);
    }
  };
}

/**
 * Clear all stored click timings (use for cleanup)
 */
export function clearClickTracker(): void {
  buttonClickTracker.clear();
}

/**
 * Stable ID generator for components that need a consistent ID across renders
 * @param prefix Prefix for the ID
 * @param id Unique identifier for the component
 */
export function generateStableId(prefix: string, id: string): string {
  return `${prefix}-${id}`;
}

/**
 * Create a permanent click handler that persists across rerenders
 * @param handler The handler function
 * @param componentId Identifier for the component
 * @param actionName Name of the action
 * @param cooldownMs Cooldown time in milliseconds
 */
export const createPermanentClickHandler = <T extends (...args: any[]) => any>(
  handler: T,
  componentId: string,
  actionName: string,
  cooldownMs: number = 1000
): ((...args: Parameters<T>) => void) => {
  const handlerId = `${componentId}-${actionName}`;
  return createStableClickHandler(handler, handlerId, cooldownMs);
};
