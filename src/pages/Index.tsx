
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/AppContext";
import { UserRole } from "@/types";
import { ArrowRight, UtensilsCrossed, ChefHat, Clipboard, UserCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { currentUser, currentCustomer } = useApp();

  const redirectBasedOnRole = (role: UserRole) => {
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "waiter":
        navigate("/waiter");
        break;
      case "chef":
        navigate("/chef");
        break;
      default:
        navigate("/");
    }
  };

  const renderStaffSection = () => {
    if (currentUser) {
      return (
        <div className="mt-8">
          <Button 
            className="bg-pink-700 hover:bg-pink-800 w-full md:w-auto"
            onClick={() => redirectBasedOnRole(currentUser.role)}
          >
            Go to {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Staff Login</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <UserCircle className="h-6 w-6 text-pink-800" />
                </div>
                <h4 className="font-medium mb-2">Admin</h4>
                <p className="text-sm text-gray-600 mb-4">Manage menu, customers, and view orders</p>
                <Button 
                  variant="outline" 
                  className="border-pink-200 text-pink-800 hover:bg-pink-50"
                  onClick={() => navigate("/login")}
                >
                  Admin Login
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <UtensilsCrossed className="h-6 w-6 text-pink-800" />
                </div>
                <h4 className="font-medium mb-2">Waiter</h4>
                <p className="text-sm text-gray-600 mb-4">View and manage customer orders</p>
                <Button 
                  variant="outline" 
                  className="border-pink-200 text-pink-800 hover:bg-pink-50"
                  onClick={() => navigate("/login")}
                >
                  Waiter Login
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <ChefHat className="h-6 w-6 text-pink-800" />
                </div>
                <h4 className="font-medium mb-2">Chef</h4>
                <p className="text-sm text-gray-600 mb-4">View orders and update preparation status</p>
                <Button 
                  variant="outline" 
                  className="border-pink-200 text-pink-800 hover:bg-pink-50"
                  onClick={() => navigate("/login")}
                >
                  Chef Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderCustomerSection = () => {
    if (currentCustomer) {
      return (
        <div className="mt-8 text-center">
          <h3 className="text-lg font-medium mb-4">Welcome, {currentCustomer.name}!</h3>
          {currentCustomer.tableNumber && (
            <p className="mb-4 text-gray-600">You are seated at Table #{currentCustomer.tableNumber}</p>
          )}
          <Button 
            className="bg-pink-700 hover:bg-pink-800"
            onClick={() => navigate("/customer")}
          >
            View Menu
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="mt-8 text-center">
        <h3 className="text-lg font-medium mb-4">Register as a Customer</h3>
        <p className="text-gray-600 mb-6">
          Scan our QR code at your table or register here to browse our menu and place orders
        </p>
        <Button 
          className="bg-pink-700 hover:bg-pink-800"
          onClick={() => navigate("/customer-registration")}
        >
          Customer Registration
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <Layout>
      <section className="bg-gradient-to-b from-pink-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-pink-900 mb-6">
            Welcome to The PinkDoor Restaurant
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Experience the finest vegetarian cuisine in an elegant atmosphere. 
            Our digital menu system allows you to browse, order, and track your meals with ease.
          </p>
          
          {!currentUser && !currentCustomer && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-pink-700 hover:bg-pink-800"
                onClick={() => navigate("/customer-registration")}
              >
                Register as Customer
              </Button>
              <Button 
                variant="outline" 
                className="border-pink-300 text-pink-800 hover:bg-pink-50"
                onClick={() => navigate("/login")}
              >
                Staff Login
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-playfair font-semibold text-center mb-8">
            Our Digital Menu System
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border-pink-100">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                    <Clipboard className="h-6 w-6 text-pink-800" />
                  </div>
                  <h3 className="font-medium mb-2">Browse Menu</h3>
                  <p className="text-sm text-gray-600">
                    Explore our extensive menu with detailed descriptions and prices
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-100">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                    <UtensilsCrossed className="h-6 w-6 text-pink-800" />
                  </div>
                  <h3 className="font-medium mb-2">Place Order</h3>
                  <p className="text-sm text-gray-600">
                    Select your favorite dishes and place your order directly from your table
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-100">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                    <ChefHat className="h-6 w-6 text-pink-800" />
                  </div>
                  <h3 className="font-medium mb-2">Track Preparation</h3>
                  <p className="text-sm text-gray-600">
                    Follow your order from confirmation to ready-to-serve status
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-100">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-6 w-6 text-pink-800"
                    >
                      <path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
                      <path d="M1 10h22"/>
                    </svg>
                  </div>
                  <h3 className="font-medium mb-2">Easy Payment</h3>
                  <p className="text-sm text-gray-600">
                    Receive your bill automatically after your meal is complete
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-12" />

          {currentUser ? renderStaffSection() : renderCustomerSection()}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
