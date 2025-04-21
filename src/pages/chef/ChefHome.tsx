
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import OrderCard from "@/components/OrderCard";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag } from "lucide-react";
import { OrderStatus } from "@/types";
import { optimizeFilter } from "@/contexts/orderOptimizer";

const ChefHome = () => {
  const [activeTab, setActiveTab] = useState<"confirmed" | "preparing" | "all">("confirmed");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { orders, updateOrderStatus, currentUser } = useApp();
  
  // Redirect if not logged in as chef
  if (!currentUser || currentUser.role !== "chef") {
    navigate("/login");
    return null;
  }

  // Memoize filtered orders to prevent unnecessary recalculations
  const filteredOrders = useMemo(() => {
    if (searchQuery.length === 0) return orders;
    
    return optimizeFilter(orders, order =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.toString().includes(searchQuery)
    );
  }, [orders, searchQuery]);

  // Memoize orders filtered by status using useCallback
  const getOrdersByStatus = useCallback((status: string) => {
    if (status === "all") {
      return optimizeFilter(filteredOrders, order => ["confirmed", "preparing"].includes(order.status));
    }
    if (status === "confirmed") return optimizeFilter(filteredOrders, order => order.status === "confirmed");
    if (status === "preparing") return optimizeFilter(filteredOrders, order => order.status === "preparing");
    return filteredOrders;
  }, [filteredOrders]);

  // Memoize displayed orders to prevent unnecessary re-renders
  const ordersToDisplay = useMemo(() => 
    getOrdersByStatus(activeTab), 
    [activeTab, getOrdersByStatus]
  );

  // Memoize handler functions
  const handleUpdateStatus = useCallback((orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  }, [updateOrderStatus]);

  const handleTabChange = useCallback((val: string) => {
    setActiveTab(val as "confirmed" | "preparing" | "all");
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-pink-900 mb-2">Chef Dashboard</h1>
            <p className="text-gray-600">
              Manage food preparation and update order statuses.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 border-pink-200"
            />
          </div>
        </div>

        <Tabs defaultValue="confirmed" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-pink-50 mb-8">
            <TabsTrigger 
              value="confirmed" 
              className="data-[state=active]:bg-white"
            >
              New Orders
            </TabsTrigger>
            <TabsTrigger 
              value="preparing" 
              className="data-[state=active]:bg-white"
            >
              In Preparation
            </TabsTrigger>
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white"
            >
              All Active Orders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {ordersToDisplay.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ordersToDisplay.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    userRole="chef"
                    updateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? "No orders match your search" 
                    : activeTab === "confirmed" 
                      ? "There are no new orders to prepare" 
                      : activeTab === "preparing" 
                        ? "There are no orders currently in preparation"
                        : "There are no active orders to handle"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ChefHome;
