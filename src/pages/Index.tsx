
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/AppContext";
import { UserRole } from "@/types";
import { ArrowRight, UtensilsCrossed, ChefHat, Clipboard, UserCircle } from "lucide-react";
import { getTabId } from "@/contexts/localStorageHelpers";

const Index = () => {
  const navigate = useNavigate();
  const { currentUser, currentCustomer } = useApp();
  const currentTabId = getTabId();

  // Function to handle direct navigation to role pages
  const goToRolePage = (role: UserRole) => {
    const rolePages: Record<UserRole, string> = {
      admin: "/admin",
      waiter: "/waiter",
      chef: "/chef",
      customer: "/customer",
    };
    navigate(rolePages[role]);
  };

  // Only show customer button if it's for this tab
  const isCurrentTabCustomer = currentCustomer && 
    (!currentCustomer.tabId || currentCustomer.tabId === currentTabId);

  const renderRoleCards = () => {
    // If user is already logged in, show their dashboard button
    if (currentUser) {
      return (
        <div className="mt-8">
          <h2 className="text-2xl font-playfair font-semibold text-center mb-8">
            Your Dashboard
          </h2>
          <Button 
            className="bg-pink-700 hover:bg-pink-800 w-full md:w-auto mx-auto block"
            onClick={() => goToRolePage(currentUser.role)}
          >
            Go to {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }

    // Otherwise, show login options for all roles
    return (
      <div className="mt-8">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-playfair font-semibold text-center mb-8">
            Customer Portal
          </h2>
          <div className="w-full max-w-md">
            <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                    <Clipboard className="h-8 w-8 text-pink-800" />
                  </div>
                  <h4 className="text-xl font-medium mb-4">Browse Our Menu</h4>
                  <p className="text-sm text-gray-600 mb-6">Register to explore our delicious vegetarian dishes</p>
                  <Button 
                    className="bg-pink-700 hover:bg-pink-800 w-full"
                    onClick={() => navigate("/customer-registration")}
                  >
                    Register as Customer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-playfair font-semibold text-center mb-8 mt-12">
            Staff Portals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Admin Portal Card */}
            <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                    <UserCircle className="h-8 w-8 text-pink-800" />
                  </div>
                  <h4 className="text-xl font-medium mb-4">Admin Portal</h4>
                  <p className="text-sm text-gray-600 mb-6">Manage menu, customers, and view orders</p>
                  <Button 
                    className="bg-pink-700 hover:bg-pink-800 w-full"
                    onClick={() => navigate("/login")}
                  >
                    Login as Admin
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Waiter Portal Card */}
            <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                    <UtensilsCrossed className="h-8 w-8 text-pink-800" />
                  </div>
                  <h4 className="text-xl font-medium mb-4">Waiter Portal</h4>
                  <p className="text-sm text-gray-600 mb-6">View and manage customer orders</p>
                  <Button 
                    className="bg-pink-700 hover:bg-pink-800 w-full" 
                    onClick={() => navigate("/login")}
                  >
                    Login as Waiter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chef Portal Card */}
            <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                    <ChefHat className="h-8 w-8 text-pink-800" />
                  </div>
                  <h4 className="text-xl font-medium mb-4">Chef Portal</h4>
                  <p className="text-sm text-gray-600 mb-6">View orders and update preparation status</p>
                  <Button 
                    className="bg-pink-700 hover:bg-pink-800 w-full" 
                    onClick={() => navigate("/login")}
                  >
                    Login as Chef
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <section className="bg-gradient-to-b from-pink-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-pink-900 mb-6">
            Welcome to THE PINKDOOR RESTAURANT
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Experience the finest vegetarian cuisine in an elegant atmosphere. 
            Our digital menu system allows you to browse, order, and track your meals with ease.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {renderRoleCards()}
          
          <Separator className="my-12" />
          
          <div className="mt-8 text-center">
            <h3 className="text-xl font-medium mb-4">Our Digital Menu System</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              The PinkDoor Restaurant offers a seamless digital experience for all users.
              Choose your role above to access the appropriate portal.
            </p>
            
            {isCurrentTabCustomer && (
              <Button 
                className="bg-pink-700 hover:bg-pink-800"
                onClick={() => navigate("/customer")}
              >
                Continue as {currentCustomer.name}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
