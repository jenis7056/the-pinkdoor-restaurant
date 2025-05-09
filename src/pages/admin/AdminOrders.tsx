import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import OrderCard from "@/components/OrderCard";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, ShoppingBag, Receipt, Printer } from "lucide-react";
import { OrderStatus, Order } from "@/types";
import { optimizeFilter, computeCache, markOrderProcessing, isOrderProcessing } from "@/contexts/orderOptimizer";
import { preventRapidClicks, createPriorityClickHandler } from "@/lib/performance";
import { generateDigitalBill, printReceipt } from "@/utils/receiptGenerator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus | "all" | "active">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();
  const { orders, updateOrderStatus, currentUser } = useApp();
  const prevOrdersRef = useRef(orders);
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set());
  const lastUpdateTimeRef = useRef<Record<string, number>>({});
  const orderUpdateRequestsRef = useRef<Record<string, number>>({});
  
  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }
  }, [currentUser, navigate]);

  const stableOrders = useMemo(() => {
    const hasChanged = orders.length !== prevOrdersRef.current.length || 
      orders.some((order, idx) => {
        const prevOrder = prevOrdersRef.current[idx];
        return !prevOrder || order.status !== prevOrder.status || order.id !== prevOrder.id;
      });
    
    if (hasChanged) {
      prevOrdersRef.current = orders;
      return orders;
    }
    return prevOrdersRef.current;
  }, [orders]);

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
    
    computeCache.set(cacheKey, result, 3000);
    return result;
  }, []);

  const filteredOrders = useMemo(() => 
    getFilteredOrders(searchQuery, stableOrders),
    [searchQuery, stableOrders, getFilteredOrders]
  );

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
    
    computeCache.set(cacheKey, result, 2000);
    return result;
  }, []);

  const ordersToDisplay = useMemo(() => 
    getOrdersByStatus(activeTab, filteredOrders), 
    [activeTab, filteredOrders, getOrdersByStatus]
  );
  
  useEffect(() => {
    return () => {
      Object.keys(lastUpdateTimeRef.current).forEach((orderId) => {
        delete lastUpdateTimeRef.current[orderId];
      });
      
      Object.keys(orderUpdateRequestsRef.current).forEach((key) => {
        delete orderUpdateRequestsRef.current[key];
      });
    };
  }, []);

  const handleUpdateStatus = useCallback((orderId: string, status: OrderStatus) => {
    if (status === 'completed') {
      const priorityHandler = createPriorityClickHandler(
        () => performStatusUpdate(orderId, status),
        `priority-${orderId}-${status}`
      );
      return priorityHandler();
    }
    
    const requestKey = `${orderId}-${status}-${Date.now()}`;
    
    if (!preventRapidClicks(requestKey, 2000)) {
      console.log(`Blocking rapid click update for ${orderId} to ${status}`);
      return;
    }
    
    performStatusUpdate(orderId, status);
  }, [updateOrderStatus]);
  
  const performStatusUpdate = useCallback((orderId: string, status: OrderStatus) => {
    if (isOrderProcessing(orderId)) {
      console.log(`Order ${orderId} is already being processed globally`);
      return; 
    }
    
    if (processingOrders.has(orderId)) {
      console.log(`Order ${orderId} is already being processed locally`);
      return; 
    }
    
    const cooldownTime = status === 'completed' ? 5000 : 15000;
    
    const now = Date.now();
    const lastUpdateTime = lastUpdateTimeRef.current[orderId] || 0;
    if (now - lastUpdateTime < cooldownTime) {
      console.log(`Throttling update for ${orderId}: too soon after last update`);
      return;
    }
    
    const requestKey = `${orderId}-${status}-${now}`;
    orderUpdateRequestsRef.current[requestKey] = now;
    lastUpdateTimeRef.current[orderId] = now;
    
    console.log(`Processing order status update: ${orderId} to ${status}`);
    
    setProcessingOrders(prev => {
      const newSet = new Set(prev);
      newSet.add(orderId);
      return newSet;
    });
    
    markOrderProcessing(orderId, cooldownTime);
    
    updateOrderStatus(orderId, status);
    
    setTimeout(() => {
      setProcessingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
      
      delete orderUpdateRequestsRef.current[requestKey];
    }, cooldownTime);
  }, [updateOrderStatus, processingOrders]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as OrderStatus | "all" | "active");
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleGenerateBill = async (order: Order): Promise<void> => {
    setSelectedOrder(order);
    const billContent = generateDigitalBill(order);
    toast.success('Bill generated successfully');
    return Promise.resolve();
  };

  const handlePrintBill = async (order: Order) => {
    const success = await printReceipt(order);
    if (success) {
      toast.success("Bill printed successfully");
    } else {
      toast.error("Failed to print bill");
    }
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
                    onGenerateBill={handleGenerateBill}
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

        <Dialog open={Boolean(selectedOrder)} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Digital Bill</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <>
                <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-50 rounded-lg">
                  {generateDigitalBill(selectedOrder)}
                </pre>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => handlePrintBill(selectedOrder)}
                    className="mt-4"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Bill
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminOrders;
