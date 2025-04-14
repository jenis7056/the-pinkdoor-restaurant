
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { UserRole } from "@/types";
import MobileMenu from "./header/MobileMenu";
import CartButton from "./header/CartButton";
import UserActions from "./header/UserActions";
import NavigationLinks from "./header/NavigationLinks";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "THE PINKDOOR RESTAURANT" }: HeaderProps) => {
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
        
          <h1 
            className="text-xl md:text-2xl font-playfair font-semibold cursor-pointer hover:text-pink-200 transition-colors duration-300 ease-in-out"
            onClick={() => navigate("/")}
          >
            {title}
          </h1>
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
