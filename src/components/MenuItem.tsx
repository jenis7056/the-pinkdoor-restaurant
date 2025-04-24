
import { MenuItem as MenuItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApp } from "@/contexts/AppContext";
import { useState, memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MenuItemProps {
  menuItem: MenuItemType;
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// Use React.memo to prevent unnecessary re-renders
const MenuItem = memo(({ menuItem, isAdmin = false, onEdit, onDelete }: MenuItemProps) => {
  const { addToCart, currentUser, currentCustomer } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    addToCart(menuItem, quantity);
    setQuantity(1);
    setIsDialogOpen(false);
  };

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(menuItem.price);

  // Use a fallback image if the main image fails to load
  const fallbackImage = "https://images.unsplash.com/photo-1518770660439-4636190af475";
  
  // Reset image error state when menuItem changes
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="h-full menu-item-transition bg-white border-pink-100 overflow-hidden relative">
      <AspectRatio ratio={16 / 9}>
        <img 
          src={imageError ? fallbackImage : menuItem.image || fallbackImage} 
          alt={menuItem.name} 
          className="object-cover w-full h-full"
          loading="lazy"  
          decoding="async" 
          onError={handleImageError}
        />
      </AspectRatio>

      {menuItem.isSpecial && (
        <Badge className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground">
          Special
        </Badge>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-playfair text-pink-900">{menuItem.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 flex justify-between">
          {formattedPrice}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-sm pb-2">
        <p className="text-gray-600 line-clamp-2">{menuItem.description}</p>
      </CardContent>
      
      <CardFooter className="pt-1 flex justify-between items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-pink-700 border-pink-300 hover:bg-pink-50 hover:text-pink-800">
              <Info className="h-4 w-4 mr-2" />
              Details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-playfair text-pink-900">{menuItem.name}</DialogTitle>
              <DialogDescription className="text-base font-medium text-pink-800">
                {formattedPrice}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-4">
                <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md">
                  <img 
                    src={imageError ? fallbackImage : menuItem.image || fallbackImage} 
                    alt={menuItem.name} 
                    className="object-cover w-full h-full"
                    onError={handleImageError}
                  />
                </AspectRatio>
              </div>
              
              <p className="text-gray-700 mb-4">{menuItem.description}</p>
              
              {menuItem.subcategory && (
                <div className="mb-4">
                  <Badge variant="outline" className="text-pink-700 border-pink-300">
                    {menuItem.subcategory}
                  </Badge>
                </div>
              )}

              {!isAdmin && currentCustomer && (
                <div className="flex flex-col space-y-4">
                  <div>
                    <Label htmlFor="quantity" className="text-pink-800">Quantity</Label>
                    <div className="flex items-center mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-pink-700"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="h-8 w-20 mx-2 text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-pink-700"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-pink-700 hover:bg-pink-800 text-white"
                    onClick={handleAddToCart}
                  >
                    Add to Order - {formattedPrice} x {quantity}
                  </Button>
                </div>
              )}

              {isAdmin && (
                <div className="flex justify-end space-x-2 mt-4">
                  {onEdit && (
                    <Button 
                      variant="outline" 
                      onClick={() => { onEdit(menuItem.id); setIsDialogOpen(false); }}
                    >
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="destructive" 
                      onClick={() => { onDelete(menuItem.id); setIsDialogOpen(false); }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {!isAdmin && currentCustomer && (
          <Button 
            size="sm"
            className="bg-pink-700 hover:bg-pink-800"
            onClick={() => addToCart(menuItem, 1)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});

// Add display name for better debugging
MenuItem.displayName = "MenuItem";

export default MenuItem;
