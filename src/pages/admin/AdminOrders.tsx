
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import OrderCard from "@/components/OrderCard";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, ShoppingBag } from "lucide-react";
import { OrderStatus } from "@/types";
import { useOrdersSync } from "@/hooks/useOrdersSync";

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus | "all" | "active">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { updateOrderStatus, currentUser } = useApp();
  const orders = useOrdersSync(); // Using the real-time sync hook
  
  // Redirect if not logged in as admin
  if (!currentUser || currentUser.role !== "admin") {
    navigate("/login");
    return null;
  }

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.toString().includes(searchQuery)
  );

  // Filter orders based on status
  const getOrdersByStatus = (status: string) => {
    if (status === "all") return filteredOrders;
    if (status === "active") return filteredOrders.filter(order => order.status !== "completed");
    return filteredOrders.filter(order => order.status === status);
  };

  const ordersToDisplay = getOrdersByStatus(activeTab);

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0 text-pink-900 hover:bg-transparent hover:text-pink-700"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-pink-900 mb-2">Orders Management</h1>
            <p className="text-gray-600">
              View and manage all orders from your restaurant.
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

        <Tabs defaultValue="active" value={activeTab} onValueChange={(val) => setActiveTab(val as OrderStatus | "all" | "active")}>
          <TabsList className="bg-pink-50 mb-8">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-white"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-white"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger 
              value="confirmed" 
              className="data-[state=active]:bg-white"
            >
              Confirmed
            </TabsTrigger>
            <TabsTrigger 
              value="preparing" 
              className="data-[state=active]:bg-white"
            >
              Preparing
            </TabsTrigger>
            <TabsTrigger 
              value="ready" 
              className="data-[state=active]:bg-white"
            >
              Ready
            </TabsTrigger>
            <TabsTrigger 
              value="served" 
              className="data-[state=active]:bg-white"
            >
              Served
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-white"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white"
            >
              All
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {ordersToDisplay.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ordersToDisplay.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    userRole="admin"
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
                    : `There are no orders with ${activeTab === "all" ? "any" : activeTab} status`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminOrders;
