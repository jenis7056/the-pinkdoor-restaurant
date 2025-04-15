
import { Customer } from "@/types";
import { toast } from "sonner";

export const handleRegisterCustomer = (
  name: string,
  tableNumber: number,
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>,
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer | null>>
) => {
  // Validate table number is within allowed range
  if (tableNumber < 1 || tableNumber > 15) {
    throw new Error("Table number must be between 1 and 15");
  }
  
  const newCustomer = {
    id: crypto.randomUUID(),
    name,
    tableNumber,
  };
  
  setCustomers(prev => [...prev, newCustomer]);
  setCurrentCustomer(newCustomer);
  toast.success(`Welcome, ${name}! You are now registered at table ${tableNumber}`);
  
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
    }
    
    toast.success(`Customer ${customer.name} has been removed`);
  }
};
