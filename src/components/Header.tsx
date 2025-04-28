
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { UserRole } from "@/types";
import MobileMenu from "./header/MobileMenu";
import CartButton from "./header/CartButton";
import UserActions from "./header/UserActions";
import NavigationLinks from "./header/NavigationLinks";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header = ({ 
  title = "THE PINKDOOR RESTAURANT", 
  subtitle = "A Multicuisine Restaurant Chain" 
}: HeaderProps) => {
  const { currentUser, logout, currentCustomer, cart } = useApp();
  const navigate = useNavigate();

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
          <MobileMenu
            links={links}
            currentUser={currentUser}
            currentCustomer={currentCustomer}
            totalItems={totalItems}
            logout={logout}
          />
        
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/2f3b9546-8ad0-405f-b2ff-ce03774b7784.png"
              alt="The Pink Door Logo"
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col">
              <h1 
                className="text-xl md:text-2xl font-playfair font-semibold cursor-pointer hover:text-pink-200 transition-colors duration-300 ease-in-out"
                onClick={() => navigate("/")}
              >
                {title}
              </h1>
              <p className="text-xs md:text-sm text-pink-200 italic font-playfair">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        <NavigationLinks links={links} />

        <div className="flex items-center space-x-4">
          {currentCustomer && <CartButton totalItems={totalItems} />}
          <UserActions 
            currentUser={currentUser}
            currentCustomer={currentCustomer}
            logout={logout}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
