import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import OrderCard from "@/components/OrderCard";

const AdminOrders = () => {
  const navigate = useNavigate();
  const { currentUser, customers, orders, updateOrderStatus } = useApp();
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "preparing" | "ready" | "served" | "completed">("pending");

  // Redirect if not logged in as admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Get all upcoming reservations
  const upcomingReservations = customers.filter(customer => customer.reservationTime).sort((a, b) => {
    const timeA = new Date(a.reservationTime!).getTime();
    const timeB = new Date(b.reservationTime!).getTime();
    return timeA - timeB;
  });

  const handleUpdateStatus = (orderId: string, status: string) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-pink-900 mb-2">Admin Orders & Reservations</h1>
          <p className="text-gray-600">Manage orders and view upcoming reservations</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-playfair font-semibold text-pink-900 mb-4">Upcoming Reservations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingReservations.map((reservation) => (
              <Card key={reservation.id} className="border-pink-100">
                <CardHeader>
                  <CardTitle className="font-playfair text-pink-900">{reservation.name}</CardTitle>
                  <CardDescription>Table {reservation.tableNumber}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(reservation.reservationTime!).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(reservation.reservationTime!).toLocaleTimeString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-playfair font-semibold text-pink-900 mb-4">Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                userRole="admin"
                updateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
