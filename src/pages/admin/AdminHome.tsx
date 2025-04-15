
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UtensilsCrossed, 
  Users, 
  ShoppingBag, 
  Clock,
  Check,
  ChefHat
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "@/components/OrderCard";
import { OrderStatus } from "@/types";
import { useOrdersSync } from "@/hooks/useOrdersSync";
import { Separator } from "@/components/ui/separator";

const AdminHome = () => {
  const navigate = useNavigate();
  const { menuItems, customers, currentUser, updateOrderStatus } = useApp();
  const orders = useOrdersSync(); // Using the real-time sync hook
  
  // Redirect if not logged in as admin
  if (!currentUser || currentUser.role !== "admin") {
    navigate("/login");
    return null;
  }

  // Orders by status
  const pendingOrders = orders.filter(order => order.status === "pending");
  const confirmedOrders = orders.filter(order => order.status === "confirmed");
  const preparingOrders = orders.filter(order => order.status === "preparing");
  const readyOrders = orders.filter(order => order.status === "ready");
  const servedOrders = orders.filter(order => order.status === "served");
  const completedOrders = orders.filter(order => order.status === "completed");
  
  const activeOrders = [...pendingOrders, ...confirmedOrders, ...preparingOrders, ...readyOrders, ...servedOrders];
  
  const totalRevenue = orders
    .filter(order => order.status === "completed")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-pink-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {currentUser.name}! Here's an overview of your restaurant operations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <UtensilsCrossed className="h-5 w-5 mr-2 text-pink-600" />
                Menu Items
              </CardTitle>
              <CardDescription>Total menu items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{menuItems.length}</div>
              <Button 
                variant="link" 
                className="p-0 h-auto text-pink-700"
                onClick={() => navigate("/admin/menu")}
              >
                Manage Menu
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2 text-pink-600" />
                Customers
              </CardTitle>
              <CardDescription>Registered today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{customers.length}</div>
              <Button 
                variant="link" 
                className="p-0 h-auto text-pink-700"
                onClick={() => navigate("/admin/customers")}
              >
                Manage Customers
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-pink-600" />
                Active Orders
              </CardTitle>
              <CardDescription>Orders in process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeOrders.length}</div>
              <Button 
                variant="link" 
                className="p-0 h-auto text-pink-700"
                onClick={() => navigate("/admin/orders")}
              >
                View All Orders
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <svg 
                  className="h-5 w-5 mr-2 text-pink-600"
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                >
                  <path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
                  <path d="M1 10h22"/>
                </svg>
                Today's Revenue
              </CardTitle>
              <CardDescription>From completed orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 0,
                }).format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-playfair">Orders Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span>Pending</span>
                  </div>
                  <Badge count={pendingOrders.length} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>Confirmed</span>
                  </div>
                  <Badge count={confirmedOrders.length} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <ChefHat className="h-4 w-4 text-orange-600" />
                    </div>
                    <span>Preparing</span>
                  </div>
                  <Badge count={preparingOrders.length} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-green-600"
                      >
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18-3v3a2 2 0 0 0 2 2h3M3 16v3a2 2 0 0 0 2 2h3m8-2h3a2 2 0 0 0 2-2v-3"/>
                      </svg>
                    </div>
                    <span>Ready</span>
                  </div>
                  <Badge count={readyOrders.length} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-purple-600"
                      >
                        <path d="M10 2v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4h2v-2h-8v8h-1V9h7V7h-3V5h3V3h-5V2h-4z"/>
                      </svg>
                    </div>
                    <span>Served</span>
                  </div>
                  <Badge count={servedOrders.length} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <Check className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>Completed</span>
                  </div>
                  <Badge count={completedOrders.length} />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                    <ShoppingBag className="h-4 w-4 text-pink-700" />
                  </div>
                  <span className="font-medium">Total Orders</span>
                </div>
                <Badge count={orders.length} highlight />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-playfair">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {activeOrders.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {activeOrders.slice(0, 3).map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      userRole="admin"
                      updateStatus={handleUpdateStatus}
                    />
                  ))}
                  
                  {activeOrders.length > 3 && (
                    <div className="text-center pt-4">
                      <Button 
                        variant="link"
                        className="text-pink-700" 
                        onClick={() => navigate("/admin/orders")}
                      >
                        View All Orders
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No active orders at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

// Badge component for order counts
const Badge = ({ count, highlight = false }: { count: number; highlight?: boolean }) => {
  return (
    <div 
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        highlight 
          ? "bg-pink-100 text-pink-800" 
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {count}
    </div>
  );
};

export default AdminHome;
