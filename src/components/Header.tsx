import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { UserRole } from "@/types";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "THE PINKDOOR RESTAURANT" }: HeaderProps) => {
  const { currentUser, logout, currentCustomer, cart } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getRoleBasedLinks = (role: UserRole) => {
    switch (role) {
      case "admin":
        return [
          { name: "Dashboard", path: "/admin" },
          { name: "Menu Management", path: "/admin/menu" },
          { name: "Customer Management", path: "/admin/customers" },
          { name: "Orders", path: "/admin/orders" },
        ];
      case "waiter":
        return [
          { name: "Orders", path: "/waiter" },
          { name: "Tables", path: "/waiter/tables" },
        ];
      case "chef":
        return [
          { name: "Orders", path: "/chef" },
        ];
      case "customer":
        return [
          { name: "Menu", path: "/customer" },
          { name: "My Orders", path: "/customer/orders" },
        ];
      default:
        return [];
    }
  };

  const links = currentUser ? getRoleBasedLinks(currentUser.role) : [];

  return (
    <header className="bg-gradient-to-r from-pink-700 via-pink-800 to-pink-900 text-white shadow-lg sticky top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-pink-600 hover:text-white transition-colors duration-200"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] bg-pink-50 text-pink-950">
              <SheetHeader>
                <SheetTitle className="text-pink-900">THE PINKDOOR</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col py-6">
                {links.map((link, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start text-pink-900 hover:text-pink-700 hover:bg-pink-100"
                    onClick={() => {
                      navigate(link.path);
                      setIsMenuOpen(false);
                    }}
                  >
                    {link.name}
                  </Button>
                ))}

                {currentCustomer && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/customer/cart");
                      setIsMenuOpen(false);
                    }}
                    className="justify-start text-pink-900 hover:text-pink-700 hover:bg-pink-100 mt-4"
                  >
                    Cart {totalItems > 0 && `(${totalItems})`}
                  </Button>
                )}

                {!currentUser && !currentCustomer && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                      className="justify-start text-pink-900 hover:text-pink-700 hover:bg-pink-100 mt-4"
                    >
                      Staff Login
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate("/customer-registration");
                        setIsMenuOpen(false);
                      }}
                      className="justify-start text-pink-900 hover:text-pink-700 hover:bg-pink-100"
                    >
                      Customer Registration
                    </Button>
                  </>
                )}

                {(currentUser || currentCustomer) && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      navigate("/");
                      setIsMenuOpen(false);
                    }}
                    className="justify-start text-pink-900 hover:text-pink-700 hover:bg-pink-100 mt-auto"
                  >
                    Logout
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        
          <h1 
            className="text-xl md:text-2xl font-playfair font-semibold cursor-pointer hover:text-pink-200 transition-colors duration-300 ease-in-out"
            onClick={() => navigate("/")}
          >
            {title}
          </h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link, index) => (
            <Button 
              key={index}
              variant="ghost" 
              className="text-white hover:bg-pink-600 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105"
              onClick={() => navigate(link.path)}
            >
              {link.name}
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {currentCustomer && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-pink-600 relative group transition-all duration-200"
              onClick={() => navigate("/customer/cart")}
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-accent text-accent-foreground animate-pulse"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          )}

          {(currentUser || currentCustomer) ? (
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-sm">
                {currentCustomer ? (
                  <div className="animate-fade-in">
                    <p className="font-medium">{currentCustomer.name}</p>
                    {currentCustomer.tableNumber && (
                      <p className="text-xs text-pink-200 animate-pulse">
                        Table #{currentCustomer.tableNumber}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <p className="font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-pink-200 capitalize">{currentUser?.role}</p>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-pink-800 hover:bg-pink-900 text-white border-pink-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                className="hidden md:inline-block text-white hover:bg-pink-600 transition-all duration-200 hover:scale-105"
                onClick={() => navigate("/login")}
              >
                Staff Login
              </Button>
              <Button 
                variant="outline" 
                className="bg-pink-800 hover:bg-pink-900 text-white border-pink-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
                onClick={() => navigate("/customer-registration")}
              >
                Customer
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
