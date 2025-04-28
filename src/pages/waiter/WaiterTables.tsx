
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, ExternalLink, Search, Users } from "lucide-react";
import { format } from "date-fns";

const WaiterTables = () => {
  const navigate = useNavigate();
  const { customers, orders, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Redirect if not logged in as waiter
  if (!currentUser || currentUser.role !== "waiter") {
    navigate("/login");
    return null;
  }

  // Create an array of table numbers from 1 to 15
  const allTables = Array.from({ length: 15 }, (_, i) => i + 1);

  // Filter tables based on search query
  const filteredTables = searchQuery
    ? allTables.filter(table => table.toString().includes(searchQuery))
    : allTables;

  // Get customers by table
  const getCustomersByTable = (tableNumber: number) => {
    return customers.filter(customer => customer.tableNumber === tableNumber);
  };

  // Get reservations for a table
  const getReservationsByTable = (tableNumber: number) => {
    return customers.filter(customer => 
      customer.tableNumber === tableNumber && 
      customer.reservationTime &&
      new Date(customer.reservationTime) > new Date() // Only future reservations
    ).sort((a, b) => {
      const timeA = new Date(a.reservationTime || "").getTime();
      const timeB = new Date(b.reservationTime || "").getTime();
      return timeA - timeB; // Sort by time ascending
    });
  };

  // Get orders by table
  const getActiveOrdersByTable = (tableNumber: number) => {
    return orders.filter(
      order => order.tableNumber === tableNumber && order.status !== "completed"
    );
  };

  const getTableStatus = (tableNumber: number) => {
    const activeOrders = getActiveOrdersByTable(tableNumber);
    const tableCustomers = getCustomersByTable(tableNumber);
    const reservations = getReservationsByTable(tableNumber);
    
    if (activeOrders.length > 0) {
      const statuses = activeOrders.map(order => order.status);
      if (statuses.includes("ready")) return "ready";
      if (statuses.includes("preparing")) return "preparing";
      if (statuses.includes("confirmed")) return "confirmed";
      if (statuses.includes("pending")) return "pending";
      if (statuses.includes("served")) return "served";
    }
    
    if (tableCustomers.length > 0) return "occupied";
    
    if (reservations.length > 0) return "reserved";
    
    return "available";
  };

  // Navigate to customer view instead of opening in new tab
  const goToCustomerView = (tableNumber: number) => {
    navigate(`/customer?tableNumber=${tableNumber}`);
  };

  const statusLabels = {
    available: "Available",
    occupied: "Occupied",
    reserved: "Reserved",
    pending: "Order Pending",
    confirmed: "Order Confirmed",
    preparing: "Preparing",
    ready: "Ready to Serve",
    served: "Order Served",
  };

  const statusClasses = {
    available: "bg-green-100 text-green-800",
    occupied: "bg-blue-100 text-blue-800",
    reserved: "bg-purple-100 text-purple-800",
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-indigo-100 text-indigo-800",
    preparing: "bg-orange-100 text-orange-800",
    ready: "bg-emerald-100 text-emerald-800",
    served: "bg-purple-100 text-purple-800",
  };

  // Format reservation time in a readable format
  const formatReservationTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return format(date, "MMM dd, yyyy 'at' h:mm a");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0 text-pink-900 hover:bg-transparent hover:text-pink-700"
          onClick={() => navigate("/waiter")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-pink-900 mb-2">Table Management</h1>
            <p className="text-gray-600">
              View all tables and their current status.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-pink-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTables.map((tableNumber) => {
            const status = getTableStatus(tableNumber);
            const tableCustomers = getCustomersByTable(tableNumber);
            const tableOrders = getActiveOrdersByTable(tableNumber);
            const reservations = getReservationsByTable(tableNumber);
            
            return (
              <Card key={tableNumber} className="border border-pink-100">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">Table #{tableNumber}</CardTitle>
                    <Badge className={statusClasses[status]}>
                      {statusLabels[status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  {tableCustomers.length > 0 ? (
                    <div>
                      <h3 className="font-medium text-sm mb-2">Customers:</h3>
                      <ul className="space-y-1">
                        {tableCustomers.map((customer) => (
                          <li key={customer.id} className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-pink-600" />
                            <span>{customer.name}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {tableOrders.length > 0 && (
                        <div className="mt-3">
                          <h3 className="font-medium text-sm mb-2">Active Orders:</h3>
                          <ul className="space-y-1">
                            {tableOrders.map((order) => (
                              <li key={order.id} className="text-sm">
                                <span className="font-medium">Order #{order.id.substring(0, 6)}</span>
                                <span className="text-xs ml-1 capitalize">({order.status})</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : reservations.length > 0 ? (
                    <div>
                      <h3 className="font-medium text-sm mb-2">Upcoming Reservations:</h3>
                      <ul className="space-y-2">
                        {reservations.map((reservation) => (
                          <li key={reservation.id} className="text-sm">
                            <div className="flex items-start">
                              <Calendar className="h-4 w-4 mr-2 text-pink-600 mt-0.5" />
                              <div>
                                <div className="font-medium">{reservation.name}</div>
                                <div className="text-xs text-gray-600">
                                  {reservation.reservationTime && formatReservationTime(reservation.reservationTime)}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-500">No customers or reservations</p>
                  )}
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  {(status === "pending" || status === "ready") && (
                    <Button 
                      className="bg-pink-700 hover:bg-pink-800 flex-1 mr-2"
                      size="sm"
                      onClick={() => navigate("/waiter")}
                    >
                      {status === "pending" ? "View Orders to Confirm" : "View Ready Orders"}
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center border-pink-200 hover:bg-pink-50 ml-auto"
                    onClick={() => goToCustomerView(tableNumber)}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View Menu
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default WaiterTables;
