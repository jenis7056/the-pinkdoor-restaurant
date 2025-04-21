import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import OrderCard from "@/components/OrderCard";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, ShoppingBag } from "lucide-react";
import { OrderStatus } from "@/types";
import { optimizeFilter, computeCache } from "@/contexts/orderOptimizer";

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus | "all" | "active">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { orders, updateOrderStatus, currentUser } = useApp();
  const prevOrdersRef = useRef(orders);
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set());
  
  // Redirect if not logged in as admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }
  }, [currentUser, navigate]);

  // Custom equality check for orders array to prevent unnecessary re-renders
  const stableOrders = useMemo(() => {
    // Only update reference if orders have actually changed in a meaningful way
    const hasChanged = orders.length !== prevOrdersRef.current.length || 
      orders.some((order, idx) => {
        const prevOrder = prevOrdersRef.current[idx];
        // If the order is new or status has changed
        return !prevOrder || order.status !== prevOrder.status || order.id !== prevOrder.id;
      });
    
    if (hasChanged) {
      prevOrdersRef.current = orders;
      return orders;
    }
    return prevOrdersRef.current;
  }, [orders]);

  // Cache filter results for better performance
  const getFilteredOrders = useCallback((query: string, ordersList: typeof orders) => {
    if (query.length === 0) return ordersList;
    
    const cacheKey = `admin_filtered_${query}_${ordersList.length}`;
    const cached = computeCache.get<typeof orders>(cacheKey);
    if (cached) return cached;
    
    const result = optimizeFilter(ordersList, order => 
      order.customerName.toLowerCase().includes(query.toLowerCase()) ||
      order.id.toLowerCase().includes(query.toLowerCase()) ||
      order.tableNumber.toString().includes(query)
    );
    
    computeCache.set(cacheKey, result, 3000); // Cache for 3 seconds
    return result;
  }, []);

  // Memoize filtered orders with cache
  const filteredOrders = useMemo(() => 
    getFilteredOrders(searchQuery, stableOrders),
    [searchQuery, stableOrders, getFilteredOrders]
  );

  // Memoize orders filtered by status using useCallback and cache results
  const getOrdersByStatus = useCallback((status: string, filtered: typeof orders) => {
    const cacheKey = `admin_status_${status}_${filtered.length}`;
    const cached = computeCache.get<typeof orders>(cacheKey);
    if (cached) return cached;
    
    let result;
    if (status === "all") {
      result = filtered;
    } else if (status === "active") {
      result = optimizeFilter(filtered, order => order.status !== "completed");
    } else {
      result = optimizeFilter(filtered, order => order.status === status);
    }
    
    computeCache.set(cacheKey, result, 2000); // Cache for 2 seconds
    return result;
  }, []);

  const ordersToDisplay = useMemo(() => 
    getOrdersByStatus(activeTab, filteredOrders), 
    [activeTab, filteredOrders, getOrdersByStatus]
  );

  // Improved update handler with debounce protection
  const handleUpdateStatus = useCallback((orderId: string, status: OrderStatus) => {
    // Prevent duplicate updates
    if (processingOrders.has(orderId)) {
      return;
    }
    
    // Set processing state to prevent duplicate clicks
    setProcessingOrders(prev => {
      const newSet = new Set(prev);
      newSet.add(orderId);
      return newSet;
    });
    
    // Call the update function
    updateOrderStatus(orderId, status);
    
    // Reset processing state after a timeout
    setTimeout(() => {
      setProcessingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }, 5000); // 5 second cooldown
  }, [updateOrderStatus, processingOrders]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as OrderStatus | "all" | "active");
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

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
              onChange={handleSearchChange}
              className="pl-10 border-pink-200"
            />
          </div>
        </div>

        <Tabs defaultValue="active" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-pink-50 mb-8 flex flex-wrap">
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
