
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import MenuSection from "@/components/MenuSection";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, ShoppingCart, ClipboardList, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createPermanentClickHandler, clearClickTracker } from "@/lib/performance";
import { recoverLostOrders } from "@/contexts/orderHelpers";
import { persistentOrderStore } from "@/contexts/orderOptimizer";

const CustomerHome = () => {
  const navigate = useNavigate();
  const { menuItems, categories, currentCustomer, cart, orders, logout, setOrders } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Set initial category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]?.name || "");
    }
  }, [categories, selectedCategory]);
  
  // Initialize page and recover any lost orders
  useEffect(() => {
    clearClickTracker(); // Clear any stale click tracking data
    
    if (currentCustomer) {
      // Try to recover any lost orders
      setTimeout(() => {
        recoverLostOrders(setOrders);
        setIsLoading(false);
      }, 300);
    } else {
      setIsLoading(false);
    }
    
    return () => {
      // When leaving the page, store the current orders
      if (orders.length > 0) {
        orders.forEach(order => {
          persistentOrderStore.setOrder(order);
        });
      }
    };
  }, [currentCustomer, setOrders, orders]);

  // Redirect if not logged in as customer - now in useEffect to avoid React warnings
  useEffect(() => {
    if (!currentCustomer && !isLoading) {
      navigate("/customer-registration");
    }
  }, [currentCustomer, navigate, isLoading]);

  // If still loading or no customer, show nothing
  if (!currentCustomer) {
    return null;
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Check if there are any active orders
  const hasActiveOrders = orders.some(
    order => 
      order.customerId === currentCustomer.id && 
      order.status !== "completed"
  );

  // Filter menu items by selected category
  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  // Get subcategories for the selected category
  const subcategories = categories.find(cat => cat.name === selectedCategory)?.subcategories || [];

  // Handle customer logout with improved click handling
  const handleLogout = useCallback(() => {
    logout();
    navigate("/customer-registration");
  }, [logout, navigate]);

  // Create stable click handlers that won't cause unnecessary re-renders
  const stableLogout = createPermanentClickHandler(handleLogout, "customer-home", "logout", 1000);
  const stableNavigateToCart = createPermanentClickHandler(
    () => navigate("/customer/cart"),
    "customer-home",
    "navigate-to-cart",
    800
  );
  const stableNavigateToOrders = createPermanentClickHandler(
    () => navigate("/customer/orders"),
    "customer-home",
    "navigate-to-orders",
    800
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-pink-50 to-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-pink-900 mb-2">Our Menu</h1>
              <p className="text-gray-600">
                Welcome, {currentCustomer.name}! Browse our selections and add items to your order.
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button 
                onClick={stableNavigateToCart}
                className="bg-pink-700 hover:bg-pink-800 flex items-center"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                View Cart
                {totalItems > 0 && (
                  <Badge className="ml-2 bg-white text-pink-800">{totalItems}</Badge>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={stableLogout}
                className="border-pink-700 text-pink-700 hover:bg-pink-50"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-playfair font-semibold text-pink-900 mb-4 md:mb-0">
              Categories
            </h2>
            
            <div className="w-full md:w-64">
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="border-pink-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {categories.map(category => (
                    <SelectItem 
                      key={category.name} 
                      value={category.name}
                      className="cursor-pointer"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map(category => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className={`justify-start h-auto py-3 px-4 ${
                  selectedCategory === category.name 
                    ? "bg-pink-700 hover:bg-pink-800 text-white" 
                    : "border-pink-200 text-pink-900 hover:bg-pink-50"
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className="text-left flex-grow">{category.name}</span>
                <ChevronRight className={`h-5 w-5 ml-2 ${selectedCategory === category.name ? "text-white" : "text-pink-700"}`} />
              </Button>
            ))}
          </div>
        </div>

        {selectedCategory && (
          <MenuSection
            menuItems={filteredItems}
            category={selectedCategory}
            subcategories={subcategories}
          />
        )}

        {hasActiveOrders && (
          <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8">
            <Button
              onClick={stableNavigateToOrders}
              className="bg-pink-700 hover:bg-pink-800 rounded-full h-14 w-14 p-0 shadow-lg flex items-center justify-center"
              size="icon"
            >
              <ClipboardList className="h-6 w-6" />
            </Button>
          </div>
        )}

        <div className="fixed bottom-6 right-6 md:hidden">
          <Button 
            onClick={stableNavigateToCart}
            className="bg-pink-700 hover:bg-pink-800 rounded-full h-14 w-14 p-0 shadow-lg flex items-center justify-center relative"
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-white text-pink-800">{totalItems}</Badge>
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerHome;
