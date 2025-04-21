
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import OrderCard from "@/components/OrderCard";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag } from "lucide-react";
import { OrderStatus } from "@/types";
import { optimizeFilter, throttle, computeCache } from "@/contexts/orderOptimizer";

const WaiterHome = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "ready" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { orders, updateOrderStatus, currentUser } = useApp();
  const prevOrdersRef = useRef(orders);
  
  // Redirect if not logged in as waiter
  useEffect(() => {
    if (!currentUser || currentUser.role !== "waiter") {
      navigate("/login");
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
    
    const cacheKey = `waiter_filtered_${query}_${ordersList.length}`;
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
    const cacheKey = `waiter_status_${status}_${filtered.length}`;
    const cached = computeCache.get<typeof orders>(cacheKey);
    if (cached) return cached;
    
    let result;
    if (status === "all") {
      result = optimizeFilter(filtered, order => order.status !== "completed");
    } else if (status === "pending") {
      result = optimizeFilter(filtered, order => order.status === "pending");
    } else if (status === "ready") {
      result = optimizeFilter(filtered, order => order.status === "ready");
    } else {
      result = filtered;
    }
    
    computeCache.set(cacheKey, result, 2000); // Cache for 2 seconds
    return result;
  }, []);

  // Memoize displayed orders to prevent unnecessary re-renders
  const ordersToDisplay = useMemo(() => 
    getOrdersByStatus(activeTab, filteredOrders), 
    [activeTab, filteredOrders, getOrdersByStatus]
  );

  // Throttle the handler to prevent UI freezes on rapid clicks
  const handleUpdateStatus = useCallback(throttle((orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  }, 1000), [updateOrderStatus]);

  const handleTabChange = useCallback((val: string) => {
    setActiveTab(val as "pending" | "ready" | "all");
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

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
              onChange={handleSearchChange}
              className="pl-10 border-pink-200"
            />
          </div>
        </div>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={handleTabChange}>
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
