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
  toast.success(`Welcome, ${name}! Your table ${tableNumber} has been reserved for ${new Date(reservationTime!).toLocaleString()}`);
  
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
