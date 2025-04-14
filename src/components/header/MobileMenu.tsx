
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserRole } from "@/types";

interface MobileMenuProps {
  links: { name: string; path: string }[];
  currentUser: any;
  currentCustomer: any;
  totalItems: number;
  logout: () => void;
}

const MobileMenu = ({ links, currentUser, currentCustomer, totalItems, logout }: MobileMenuProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
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
  );
};

export default MobileMenu;
