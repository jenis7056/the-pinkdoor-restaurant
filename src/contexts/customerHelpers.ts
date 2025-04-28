
import { Customer, Order } from "@/types";
import { toast } from "sonner";
import { clearTabCustomerData, getTabId } from "./localStorageHelpers";

export const handleRegisterCustomer = (
  name: string,
  tableNumber: number,
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>,
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer | null>>,
  customers: Customer[],
  orders: Order[],
  reservationTime?: string
) => {
  // Clear any existing customer data in this tab first
  clearTabCustomerData();
  
  // Validate table number is within allowed range
  if (tableNumber < 1 || tableNumber > 15) {
    throw new Error("Table number must be between 1 and 15");
  }

  // For reservations, we need to check for time conflicts
  if (reservationTime) {
    const selectedTime = new Date(reservationTime);
    
    // Check if table is already reserved by another customer at the same time
    const isTableReserved = customers.some(customer => {
      // Only check if the customer has a reservation time and the same table number
      if (customer.reservationTime && customer.tableNumber === tableNumber) {
        const existingReservation = new Date(customer.reservationTime);
        // Check if reservations overlap (within 2 hours before or after)
        const timeDiff = Math.abs(selectedTime.getTime() - existingReservation.getTime());
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        return hoursDiff < 2; // Less than 2 hours difference means overlap
      }
      return false;
    });

    if (isTableReserved) {
      throw new Error("This table is already reserved for this time slot. Please choose another table or time.");
    }
    
    // For same-day reservations, check if table will be available by reservation time
    const ordersArray = Array.isArray(orders) ? orders : [];
    
    const hasIncompleteOrders = ordersArray.some(order => {
      // Only check orders for the same table
      if (order.tableNumber === tableNumber && order.status !== 'completed') {
        // Estimate when the table might be free based on order status
        let estimatedCompletionTime = new Date();
        
        // If the order is pending or confirmed, it might take around 1.5 hours to complete
        if (order.status === 'pending' || order.status === 'confirmed') {
          estimatedCompletionTime = new Date(new Date().getTime() + (90 * 60 * 1000)); // 90 minutes
        } 
        // If the order is preparing or ready, it might take around 1 hour to complete
        else if (order.status === 'preparing' || order.status === 'ready') {
          estimatedCompletionTime = new Date(new Date().getTime() + (60 * 60 * 1000)); // 60 minutes
        }
        // If the order is served, it might take around 30 minutes to complete
        else if (order.status === 'served') {
          estimatedCompletionTime = new Date(new Date().getTime() + (30 * 60 * 1000)); // 30 minutes
        }
        
        // Check if reservation time is after estimated completion time + buffer (1 hour)
        const reservationWithBuffer = new Date(selectedTime.getTime() - (60 * 60 * 1000)); // 1 hour before reservation
        
        return reservationWithBuffer <= estimatedCompletionTime;
      }
      return false;
    });
    
    if (hasIncompleteOrders) {
      throw new Error("This table currently has active orders and may not be available by your reservation time. Please choose another table or a later time.");
    }
  } else {
    // For immediate seating (no reservation time), table must be completely free
    const ordersArray = Array.isArray(orders) ? orders : [];
  
    const hasIncompleteOrders = ordersArray.some(
      order => order.tableNumber === tableNumber && order.status !== 'completed'
    );
  
    if (hasIncompleteOrders) {
      throw new Error("This table currently has active orders. Please choose another table.");
    }
  }
  
  const newCustomer: Customer = {
    id: crypto.randomUUID(),
    name,
    tableNumber,
    createdAt: new Date().toISOString(),
    tabId: getTabId(),
    reservationTime // Add the reservation time to the customer object
  };
  
  setCustomers(prev => [...prev, newCustomer]);
  setCurrentCustomer(newCustomer);
  
  if (reservationTime) {
    toast.success(`Welcome, ${name}! Your table ${tableNumber} has been reserved for ${new Date(reservationTime).toLocaleString()}`);
  } else {
    toast.success(`Welcome, ${name}! You are now registered at table ${tableNumber}`);
  }
  
  return newCustomer;
};

export const handleRemoveCustomer = (
  id: string,
  customers: Customer[],
  currentCustomer: Customer | null,
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>,
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer | null>>
) => {
  const customer = customers.find(c => c.id === id);
  if (customer) {
    setCustomers(prev => prev.filter(c => c.id !== id));
    
    // If removing the current customer, also clear their session
    if (currentCustomer?.id === id) {
      setCurrentCustomer(null);
      // Clear tab-specific data
      clearTabCustomerData();
    }
    
    toast.success(`Customer ${customer.name} has been removed`);
  }
};
