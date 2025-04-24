
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { getTabId } from "@/contexts/localStorageHelpers";

interface UserActionsProps {
  currentUser: any;
  currentCustomer: any;
  logout: () => void;
}

const UserActions = ({ currentUser, currentCustomer, logout }: UserActionsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine which dashboard we're on based on the current path
  const currentPath = location.pathname;
  
  // Display admin info only in admin routes
  const isAdminRoute = currentPath.startsWith("/admin");
  
  // Display waiter info only in waiter routes
  const isWaiterRoute = currentPath.startsWith("/waiter");
  
  // Display chef info only in chef routes
  const isChefRoute = currentPath.startsWith("/chef");
  
  // Display customer info only in customer routes or if no staff is logged in
  const isCustomerRoute = currentPath.startsWith("/customer");
  
  // Determine which user to display based on current route
  const shouldShowStaffUser = currentUser && (
    (isAdminRoute && currentUser.role === "admin") ||
    (isWaiterRoute && currentUser.role === "waiter") ||
    (isChefRoute && currentUser.role === "chef")
  );
  
  // Only show customer data if it's for this tab
  const currentTabId = getTabId();
  const shouldShowCustomer = currentCustomer && 
    (!currentCustomer.tabId || currentCustomer.tabId === currentTabId) &&
    (isCustomerRoute || (!isAdminRoute && !isWaiterRoute && !isChefRoute));
  
  if (shouldShowStaffUser || shouldShowCustomer) {
    return (
      <div className="flex items-center space-x-3">
        <div className="hidden md:block text-sm">
          {shouldShowCustomer ? (
            <div className="animate-fade-in">
              <p className="font-medium">{currentCustomer.name}</p>
              {currentCustomer.tableNumber && (
                <p className="text-xs text-pink-200 animate-pulse">
                  Table #{currentCustomer.tableNumber}
                </p>
              )}
            </div>
          ) : shouldShowStaffUser ? (
            <div className="animate-fade-in">
              <p className="font-medium">{currentUser?.name}</p>
              <p className="text-xs text-pink-200 capitalize">{currentUser?.role}</p>
            </div>
          ) : null}
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
    );
  }
  
  return (
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
  );
};

export default UserActions;
