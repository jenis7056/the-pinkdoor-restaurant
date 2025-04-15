
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { UtensilsCrossed, Users, ShoppingBag } from "lucide-react";
import DashboardCard from "@/components/admin/dashboard/DashboardCard";
import OrdersOverview from "@/components/admin/dashboard/OrdersOverview";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import { OrderStatus } from "@/types";

const AdminHome = () => {
  const navigate = useNavigate();
  const { menuItems, customers, orders, currentUser, updateOrderStatus } = useApp();
  
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
          <DashboardCard
            title="Menu Items"
            description="Total menu items"
            value={menuItems.length}
            icon={UtensilsCrossed}
            linkText="Manage Menu"
            onLinkClick={() => navigate("/admin/menu")}
          />
          
          <DashboardCard
            title="Customers"
            description="Registered today"
            value={customers.length}
            icon={Users}
            linkText="Manage Customers"
            onLinkClick={() => navigate("/admin/customers")}
          />
          
          <DashboardCard
            title="Active Orders"
            description="Orders in process"
            value={activeOrders.length}
            icon={ShoppingBag}
            linkText="View All Orders"
            onLinkClick={() => navigate("/admin/orders")}
          />
          
          <DashboardCard
            title="Today's Revenue"
            description="From completed orders"
            value={new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            }).format(totalRevenue)}
            icon={ShoppingBag}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <OrdersOverview
            pendingOrders={pendingOrders.length}
            confirmedOrders={confirmedOrders.length}
            preparingOrders={preparingOrders.length}
            readyOrders={readyOrders.length}
            servedOrders={servedOrders.length}
            completedOrders={completedOrders.length}
            totalOrders={orders.length}
          />
          
          <RecentOrders
            activeOrders={activeOrders}
            onViewAllClick={() => navigate("/admin/orders")}
            updateOrderStatus={handleUpdateStatus}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome;
