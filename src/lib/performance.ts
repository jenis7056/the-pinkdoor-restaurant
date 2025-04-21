
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
    if (preventRapidClicks(`${id}-${Date.now()}`, cooldownMs)) {
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
