
import { MenuItem, OrderItem } from "@/types";
import { toast } from "sonner";

export const handleAddToCart = (
  menuItem: MenuItem, 
  quantity: number,
  cart: OrderItem[],
  setCart: React.Dispatch<React.SetStateAction<OrderItem[]>>
) => {
  const existingItemIndex = cart.findIndex(
    item => item.menuItemId === menuItem.id
  );

  if (existingItemIndex >= 0) {
    const updatedCart = [...cart];
    updatedCart[existingItemIndex].quantity += quantity;
    setCart(updatedCart);
  } else {
    const newItem: OrderItem = {
      id: crypto.randomUUID(),
      menuItemId: menuItem.id,
      menuItem,
      quantity,
    };
    setCart(prev => [...prev, newItem]);
  }
  
  toast.success(`${menuItem.name} added to cart`);
};

export const handleUpdateCartItem = (
  id: string, 
  quantity: number,
  setCart: React.Dispatch<React.SetStateAction<OrderItem[]>>,
  removeFromCart: (id: string) => void
) => {
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }
  
  setCart(prev => 
    prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    )
  );
};

export const handleRemoveFromCart = (
  id: string,
  cart: OrderItem[],
  setCart: React.Dispatch<React.SetStateAction<OrderItem[]>>
) => {
  const itemName = cart.find(item => item.id === id)?.menuItem.name;
  setCart(prev => prev.filter(item => item.id !== id));
  if (itemName) {
    toast.success(`${itemName} removed from cart`);
  }
};

export const handleClearCart = (
  setCart: React.Dispatch<React.SetStateAction<OrderItem[]>>
) => {
  setCart([]);
  toast.success('Cart cleared');
};
