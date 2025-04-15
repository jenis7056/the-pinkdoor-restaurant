
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import OrderCard from "@/components/OrderCard";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag } from "lucide-react";
import { OrderStatus } from "@/types";

const WaiterHome = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "ready" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { orders, updateOrderStatus, currentUser } = useApp();
  
  // Redirect if not logged in as waiter
  useEffect(() => {
    if (!currentUser || currentUser.role !== "waiter") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // For debugging
  useEffect(() => {
    console.log("Current orders in WaiterHome:", orders);
  }, [orders]);

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.toString().includes(searchQuery)
  );

  // Filter orders based on status
  const getOrdersByStatus = (status: string) => {
    if (status === "all") return filteredOrders.filter(order => order.status !== "completed");
    if (status === "pending") return filteredOrders.filter(order => order.status === "pending");
    if (status === "ready") return filteredOrders.filter(order => order.status === "ready");
    return filteredOrders;
  };

  const ordersToDisplay = getOrdersByStatus(activeTab);

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-pink-900 mb-2">Waiter Dashboard</h1>
            <p className="text-gray-600">
              Confirm new orders and serve ready-to-serve orders to customers.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-pink-200"
            />
          </div>
        </div>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={(val) => setActiveTab(val as "pending" | "ready" | "all")}>
          <TabsList className="bg-pink-50 mb-8">
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-white"
            >
              Pending Orders
            </TabsTrigger>
            <TabsTrigger 
              value="ready" 
              className="data-[state=active]:bg-white"
            >
              Ready to Serve
            </TabsTrigger>
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white"
            >
              All Orders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {ordersToDisplay.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ordersToDisplay.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    userRole="waiter"
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
                    : activeTab === "pending" 
                      ? "There are no pending orders to confirm" 
                      : activeTab === "ready" 
                        ? "There are no ready orders to serve"
                        : "There are no active orders"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WaiterHome;
