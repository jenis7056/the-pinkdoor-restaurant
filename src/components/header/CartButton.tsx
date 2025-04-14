
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CartButtonProps {
  totalItems: number;
}

const CartButton = ({ totalItems }: CartButtonProps) => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default CartButton;
