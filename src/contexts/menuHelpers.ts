
import { MenuItem } from "@/types";
import { toast } from "sonner";

export const handleAddMenuItem = (
  item: MenuItem, 
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
) => {
  setMenuItems(prev => [...prev, { ...item, id: crypto.randomUUID() }]);
  toast.success(`${item.name} has been added to the menu`);
};

export const handleUpdateMenuItem = (
  id: string, 
  item: Partial<MenuItem>, 
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
) => {
  setMenuItems(prev => 
    prev.map(menuItem => 
      menuItem.id === id ? { ...menuItem, ...item } : menuItem
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
