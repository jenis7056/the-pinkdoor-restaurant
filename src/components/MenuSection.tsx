
import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { MenuItem as MenuItemType } from "@/types";
import MenuItem from "./MenuItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Badge } from "@/components/ui/badge";

interface MenuSectionProps {
  menuItems: MenuItemType[];
  category: string;
  subcategories: string[];
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const MenuSection = memo(({
  menuItems,
  category,
  subcategories,
  isAdmin = false,
  onEdit,
  onDelete,
}: MenuSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { orders, currentCustomer } = useApp();

  // Memoize item status lookup for better performance
  const getItemStatus = useMemo(() => {
    return (menuItemId: string) => {
      if (!currentCustomer) return null;
      
      // Create a lookup map for faster access (this avoids repeated lookups)
      const activeOrders = orders.filter(
        order => 
          order.customerId === currentCustomer.id && 
          order.status !== "completed"
      );
  
      for (const order of activeOrders) {
        for (const item of order.items) {
          if (item.menuItemId === menuItemId) {
            return order.status;
          }
        }
      }
      
      return null;
    };
  }, [orders, currentCustomer]);

  // Avoid filtering items on every render
  const filteredItems = useMemo(() => {
    if (!menuItems?.length) return [];
    
    const displayableItems = menuItems.filter(
      (item) => {
        const status = getItemStatus(item.id);
        return !status || (status !== "served");
      }
    );
    
    if (!searchQuery) return displayableItems;
    
    const lowerQuery = searchQuery.toLowerCase();
    return displayableItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );
  }, [menuItems, searchQuery, getItemStatus]);

  // Optimize subcategory data calculation
  const subcategoryData = useMemo(() => {
    if (!filteredItems?.length) {
      return { uncategorizedItems: [], subcategoryItems: [] };
    }
    
    const uncategorizedItems = filteredItems.filter(
      (item) => !item.subcategory || item.subcategory === ""
    );
  
    const subcategoriesMap = new Map();
    
    // Use map for faster lookup
    subcategories.forEach(subcategory => {
      subcategoriesMap.set(subcategory, []);
    });
    
    // Single loop through filtered items
    filteredItems.forEach(item => {
      if (item.subcategory && subcategoriesMap.has(item.subcategory)) {
        subcategoriesMap.get(item.subcategory).push(item);
      }
    });
    
    const subcategoryItems = Array.from(subcategoriesMap.entries())
      .map(([subcategory, items]) => ({ subcategory, items }));

    return {
      uncategorizedItems,
      subcategoryItems
    };
  }, [filteredItems, subcategories]);

  const statusBadgeStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800", 
    ready: "bg-green-100 text-green-800",
    served: "bg-purple-100 text-purple-800",
  };

  // Memoize rendering of menu items
  const renderMenuItem = useCallback((item: MenuItemType) => {
    const status = getItemStatus(item.id);
    return (
      <div key={item.id} className="relative">
        <MenuItem 
          menuItem={item} 
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        {status && (
          <Badge 
            className={`absolute top-2 right-2 ${statusBadgeStyles[status] || ""}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )}
      </div>
    );
  }, [getItemStatus, isAdmin, onEdit, onDelete, statusBadgeStyles]);

  const { uncategorizedItems, subcategoryItems } = subcategoryData;
  const defaultTab = uncategorizedItems.length > 0 ? "_default" : subcategoryItems[0]?.subcategory;

  // Handle search with debounce
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Avoid setting state for every keystroke
    if (Math.abs(value.length - searchQuery.length) > 3 || value.length === 0) {
      setSearchQuery(value);
    } else {
      // Use setTimeout to debounce the search
      const timeoutId = setTimeout(() => {
        setSearchQuery(value);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair font-semibold text-pink-900 mb-4 md:mb-0">
          {category}
        </h2>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            type="text" 
            placeholder="Search items..." 
            className="pl-10 border-pink-200 focus-visible:ring-pink-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {(subcategories.length === 0 || filteredItems.length === 0) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(renderMenuItem)}
        </div>
      ) : (
        <Tabs defaultValue={defaultTab}>
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="mb-6 bg-pink-50">
              {uncategorizedItems.length > 0 && (
                <TabsTrigger value="_default" className="data-[state=active]:bg-white">
                  All
                </TabsTrigger>
              )}
              
              {subcategoryItems.map(({ subcategory, items }) => 
                items.length > 0 ? (
                  <TabsTrigger 
                    key={subcategory} 
                    value={subcategory}
                    className="data-[state=active]:bg-white"
                  >
                    {subcategory}
                  </TabsTrigger>
                ) : null
              )}
            </TabsList>
          </ScrollArea>
          
          {uncategorizedItems.length > 0 && (
            <TabsContent value="_default" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map(renderMenuItem)}
              </div>
            </TabsContent>
          )}
          
          {subcategoryItems.map(({ subcategory, items }) => 
            items.length > 0 ? (
              <TabsContent key={subcategory} value={subcategory} className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map(renderMenuItem)}
                </div>
              </TabsContent>
            ) : null
          )}
        </Tabs>
      )}
    </div>
  );
});

MenuSection.displayName = "MenuSection";

export default MenuSection;
