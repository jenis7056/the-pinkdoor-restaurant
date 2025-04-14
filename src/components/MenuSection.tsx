import { useState } from "react";
import { MenuItem as MenuItemType } from "@/types";
import MenuItem from "./MenuItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface MenuSectionProps {
  menuItems: MenuItemType[];
  category: string;
  subcategories: string[];
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const MenuSection = ({
  menuItems,
  category,
  subcategories,
  isAdmin = false,
  onEdit,
  onDelete,
}: MenuSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get all items without subcategory or with empty subcategory
  const uncategorizedItems = filteredItems.filter(
    (item) => !item.subcategory || item.subcategory === ""
  );

  // Get items for each subcategory
  const subcategoryItems = subcategories.map((subcategory) => ({
    subcategory,
    items: filteredItems.filter((item) => item.subcategory === subcategory),
  }));

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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {(subcategories.length === 0 || filteredItems.length === 0) ? (
        // If no subcategories or no items match search, just show grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <MenuItem 
              key={item.id} 
              menuItem={item} 
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        // Otherwise, show tabs for each subcategory
        <Tabs defaultValue={uncategorizedItems.length > 0 ? "_default" : subcategories[0]}>
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
                {filteredItems.map((item) => (
                  <MenuItem 
                    key={item.id} 
                    menuItem={item} 
                    isAdmin={isAdmin}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </TabsContent>
          )}
          
          {subcategoryItems.map(({ subcategory, items }) => 
            items.length > 0 ? (
              <TabsContent key={subcategory} value={subcategory} className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((item) => (
                    <MenuItem 
                      key={item.id} 
                      menuItem={item} 
                      isAdmin={isAdmin}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </TabsContent>
            ) : null
          )}
        </Tabs>
      )}
    </div>
  );
};

export default MenuSection;
