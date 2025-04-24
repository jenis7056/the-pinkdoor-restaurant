
import { MenuItem } from "@/types";
import { toast } from "sonner";

export const handleAddMenuItem = (
  item: MenuItem, 
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
) => {
  // Ensure the image URL is valid and not empty
  const imageUrl = item.image && item.image.trim() !== "" 
    ? item.image 
    : "https://images.unsplash.com/photo-1518770660439-4636190af475";
  
  setMenuItems(prev => [...prev, { 
    ...item, 
    id: crypto.randomUUID(),
    image: imageUrl
  }]);
  toast.success(`${item.name} has been added to the menu`);
};

export const handleUpdateMenuItem = (
  id: string, 
  item: Partial<MenuItem>, 
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
) => {
  // Ensure the image URL exists and is not empty
  const updateData = {
    ...item
  };
  
  if (!updateData.image || updateData.image.trim() === "") {
    updateData.image = "https://images.unsplash.com/photo-1518770660439-4636190af475";
  }
  
  setMenuItems(prev => 
    prev.map(menuItem => 
      menuItem.id === id ? { ...menuItem, ...updateData } : menuItem
    )
  );
  toast.success(`Menu item updated successfully`);
};

export const handleDeleteMenuItem = (
  id: string, 
  menuItems: MenuItem[], 
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
) => {
  const itemName = menuItems.find(item => item.id === id)?.name;
  setMenuItems(prev => prev.filter(item => item.id !== id));
  toast.success(`${itemName} has been removed from the menu`);
};
