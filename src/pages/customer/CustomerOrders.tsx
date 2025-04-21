
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import OrderCard from "@/components/OrderCard";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order, UserRole } from "@/types";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { createPermanentClickHandler } from "@/lib/performance";
import { recoverLostOrders } from "@/contexts/orderHelpers";
import { persistentOrderStore } from "@/contexts/orderOptimizer";

const CustomerOrders = () => {
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();
  const { orders, currentCustomer, setOrders } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize and try to recover any lost orders
  useEffect(() => {
    if (currentCustomer) {
      // Try to recover any lost orders
      setTimeout(() => {
        recoverLostOrders(setOrders);
        setIsLoading(false);
      }, 300);
    } else {
      setIsLoading(false);
    }
    
    return () => {
      // When leaving the page, store the current orders
      if (orders.length > 0) {
        orders.forEach(order => {
          persistentOrderStore.setOrder(order);
        });
      }
    };
  }, [currentCustomer, setOrders, orders]);
  
  // Use useEffect for navigation instead of direct navigation
  useEffect(() => {
    if (!currentCustomer && !isLoading) {
      navigate("/customer-registration");
    }
  }, [currentCustomer, navigate, isLoading]);

  // If customer is not logged in or still loading, render nothing while redirect happens
  if (!currentCustomer || isLoading) {
    return null;
  }

  // Ensure orders is an array before filtering
  const orderArray = Array.isArray(orders) ? orders : [];

  // Filter orders for the current customer
  const customerOrders = orderArray.filter(
    order => order.customerId === currentCustomer.id
  );

  // Separate active and completed orders
  const activeOrders = customerOrders.filter(
    order => order.status !== "completed"
  );
  
  const completedOrders = customerOrders.filter(
    order => order.status === "completed"
  );

  const getOrdersToDisplay = () => {
    return activeTab === "active" ? activeOrders : completedOrders;
  };

  const ordersToDisplay = getOrdersToDisplay();
  
  // Use explicit UserRole type
  const userRole: UserRole = "customer";

  // Create stable navigation handlers
  const navigateToMenu = createPermanentClickHandler(
    () => navigate("/customer"),
    "customer-orders",
    "navigate-to-menu",
    800
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 pl-0 text-pink-900 hover:bg-transparent hover:text-pink-700"
            onClick={navigateToMenu}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
          
          <h1 className="text-3xl font-playfair font-bold text-pink-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">
            Track the status of your orders in real-time.
          </p>
        </div>

        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-pink-50 mb-6">
            <TabsTrigger value="active" className="flex-1 data-[state=active]:bg-white">
              Active Orders ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 data-[state=active]:bg-white">
              Completed Orders ({completedOrders.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0">
            {activeOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    userRole={userRole}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No active orders</h3>
                <p className="text-gray-500 mb-6">You don't have any active orders at the moment</p>
                <Button 
                  className="bg-pink-700 hover:bg-pink-800" 
                  onClick={navigateToMenu}
                >
                  Browse Menu
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {completedOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    userRole={userRole}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No completed orders</h3>
                <p className="text-gray-500 mb-6">You don't have any completed orders yet</p>
                <Button 
                  className="bg-pink-700 hover:bg-pink-800" 
                  onClick={navigateToMenu}
                >
                  Browse Menu
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomerOrders;
