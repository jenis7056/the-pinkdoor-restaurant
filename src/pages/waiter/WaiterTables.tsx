
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";

const WaiterTables = () => {
  const navigate = useNavigate();
  const { currentUser, customers } = useApp();

  // Redirect if not logged in as waiter
  useEffect(() => {
    if (!currentUser || currentUser.role !== "waiter") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Get all tables and their reservations
  const tables = Array.from({ length: 15 }, (_, i) => i + 1);
  const reservationsByTable = tables.map(tableNumber => {
    const tableReservations = customers
      .filter(c => c.tableNumber === tableNumber && c.reservationTime)
      .sort((a, b) => new Date(a.reservationTime!).getTime() - new Date(b.reservationTime!).getTime());
    
    return {
      tableNumber,
      reservations: tableReservations
    };
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-pink-900 mb-2">Table Management</h1>
          <p className="text-gray-600">View and manage table reservations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservationsByTable.map(({ tableNumber, reservations }) => (
            <Card key={tableNumber} className="border-pink-100">
              <CardHeader>
                <CardTitle className="font-playfair text-pink-900">Table {tableNumber}</CardTitle>
                <CardDescription>
                  {reservations.length} upcoming {reservations.length === 1 ? 'reservation' : 'reservations'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reservations.map(reservation => (
                  <div key={reservation.id} className="mb-4 last:mb-0 p-3 bg-pink-50 rounded-md">
                    <p className="font-medium text-pink-900">
                      {reservation.name}
                      {reservation.reservationToken && 
                        <span className="ml-2 text-sm text-pink-700">
                          (Token: {reservation.reservationToken})
                        </span>
                      }
                    </p>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(reservation.reservationTime!).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(reservation.reservationTime!).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
                {reservations.length === 0 && (
                  <p className="text-gray-500 text-center py-2">No upcoming reservations</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default WaiterTables;
