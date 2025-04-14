
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";

interface UserActionsProps {
  currentUser: any;
  currentCustomer: any;
  logout: () => void;
}

const UserActions = ({ currentUser, currentCustomer, logout }: UserActionsProps) => {
  const navigate = useNavigate();
  
  if (currentUser || currentCustomer) {
    return (
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
