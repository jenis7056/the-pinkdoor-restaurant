
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import CustomerRegistration from "@/pages/CustomerRegistration";
import NotFound from "@/pages/NotFound";

// Customer Pages
import CustomerHome from "@/pages/customer/CustomerHome";
import CustomerCart from "@/pages/customer/CustomerCart";
import CustomerOrders from "@/pages/customer/CustomerOrders";

// Admin Pages
import AdminHome from "@/pages/admin/AdminHome";
import AdminMenu from "@/pages/admin/AdminMenu";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminOrders from "@/pages/admin/AdminOrders";

// Waiter Pages
import WaiterHome from "@/pages/waiter/WaiterHome";
import WaiterTables from "@/pages/waiter/WaiterTables";

// Chef Pages
import ChefHome from "@/pages/chef/ChefHome";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner richColors />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customer-registration" element={<CustomerRegistration />} />
            
            {/* Customer Routes */}
            <Route path="/customer" element={<CustomerHome />} />
            <Route path="/customer/cart" element={<CustomerCart />} />
            <Route path="/customer/orders" element={<CustomerOrders />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/menu" element={<AdminMenu />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            
            {/* Waiter Routes */}
            <Route path="/waiter" element={<WaiterHome />} />
            <Route path="/waiter/tables" element={<WaiterTables />} />
            
            {/* Chef Routes */}
            <Route path="/chef" element={<ChefHome />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
