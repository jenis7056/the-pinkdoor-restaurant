
import { useApp } from "@/contexts/AppContext";
import { useEffect, useCallback } from "react";

export const useOrdersSync = (refreshInterval = 3000) => {
  const { orders, setOrders } = useApp();

  const refreshOrders = useCallback(async () => {
    // Get orders from localStorage to sync with other tabs/windows
    try {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        // Only update if there are actual changes
        if (JSON.stringify(parsedOrders) !== JSON.stringify(orders)) {
          console.log("Syncing orders:", parsedOrders);
          setOrders(parsedOrders);
        }
      }
    } catch (error) {
      console.error("Error syncing orders:", error);
    }
  }, [orders, setOrders]);

  useEffect(() => {
    // Initial sync
    refreshOrders();

    // Set up polling interval
    const intervalId = setInterval(refreshOrders, refreshInterval);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [refreshOrders, refreshInterval]);

  return orders;
};
