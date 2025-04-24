
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import MenuSection from "@/components/MenuSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Image } from "lucide-react";
import { toast } from "sonner";
import { MenuItem } from "@/types";
import { preventRapidClicks } from "@/lib/performance";

const AdminMenu = () => {
  const navigate = useNavigate();
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, currentUser } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.name || "");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    price: 0,
    description: "",
    category: categories[0]?.name || "",
    subcategory: "",
    isSpecial: false,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isSpecial: checked }));
  };

  const handleOpenAddDialog = () => {
    setFormData({
      name: "",
      price: 0,
      description: "",
      category: categories[0]?.name || "",
      subcategory: "",
      isSpecial: false,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    });
    setIsAddDialogOpen(true);
  };
  
  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };
  
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingItemId(null);
  };

  const handleOpenEditDialog = (itemId: string) => {
    if (!preventRapidClicks(`edit-menu-item-${itemId}`, 500)) return;
    
    const item = menuItems.find((item) => item.id === itemId);
    if (item) {
      setFormData({
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
        subcategory: item.subcategory || "",
        isSpecial: item.isSpecial || false,
        image: item.image
      });
      setEditingItemId(itemId);
      setIsEditDialogOpen(true);
    }
  };

  const handleAddItem = () => {
    if (!preventRapidClicks('add-menu-item', 1000)) return;
    
    if (!formData.name || !formData.description || !formData.category || formData.price <= 0) {
      toast.error("Please fill all required fields");
      return;
    }

    addMenuItem(formData as MenuItem);
    setFormData({
      name: "",
      price: 0,
      description: "",
      category: categories[0]?.name || "",
      subcategory: "",
      isSpecial: false,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    });
    handleCloseAddDialog();
  };

  const handleEditItem = () => {
    if (!preventRapidClicks('edit-menu-item-submit', 1000)) return;
    
    if (!editingItemId) return;
    
    if (!formData.name || !formData.description || !formData.category || formData.price <= 0) {
      toast.error("Please fill all required fields");
      return;
    }

    updateMenuItem(editingItemId, formData);
    setFormData({
      name: "",
      price: 0,
      description: "",
      category: categories[0]?.name || "",
      subcategory: "",
      isSpecial: false,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    });
    setEditingItemId(null);
    handleCloseEditDialog();
  };

  const handleDeleteItem = (itemId: string) => {
    if (!preventRapidClicks(`delete-menu-item-${itemId}`, 1000)) return;
    deleteMenuItem(itemId);
  };

  const subcategories = categories.find(cat => cat.name === selectedCategory)?.subcategories || [];

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, image: value }));
  };

  // Define some image options for easy selection
  const imageOptions = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475", // Default
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9", // Black and brown fruit
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901", // Orange tabby cat
    "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1", // Grey tabby kitten
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"  // Orange flowers
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0 text-pink-900 hover:bg-transparent hover:text-pink-700"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-pink-900 mb-2">Menu Management</h1>
            <p className="text-gray-600">
              Add, edit, or remove menu items from your restaurant's offerings.
            </p>
          </div>
          
          <Button 
            className="mt-4 md:mt-0 bg-pink-700 hover:bg-pink-800"
            onClick={handleOpenAddDialog}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Item
          </Button>
        </div>

        <Tabs defaultValue={categories[0]?.name || ""} value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="mb-8 bg-pink-50">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.name} 
                value={category.name}
                className="data-[state=active]:bg-white"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.name} value={category.name} className="mt-0">
              <MenuSection
                menuItems={filteredItems}
                category={category.name}
                subcategories={subcategories}
                isAdmin={true}
                onEdit={handleOpenEditDialog}
                onDelete={handleDeleteItem}
              />
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new item to your menu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-pink-200"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="border-pink-200 min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={(value) => 
                      setFormData((prev) => ({ ...prev, category: value, subcategory: "" }))
                    }
                  >
                    <SelectTrigger className="border-pink-200">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                  <Select
                    name="subcategory"
                    value={formData.subcategory || "none"}
                    onValueChange={(value) => 
                      setFormData((prev) => ({ ...prev, subcategory: value === "none" ? "" : value }))
                    }
                  >
                    <SelectTrigger className="border-pink-200">
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {categories
                        .find((cat) => cat.name === formData.category)
                        ?.subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleNumberInputChange}
                    className="border-pink-200"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="mb-2">Special Item</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isSpecial"
                      checked={formData.isSpecial}
                      onCheckedChange={handleCheckboxChange}
                      className="data-[state=checked]:bg-pink-700 data-[state=checked]:border-pink-700"
                    />
                    <label
                      htmlFor="isSpecial"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Mark as special item
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleImageUrlChange}
                  className="border-pink-200"
                  placeholder="Enter image URL"
                />

                <div className="mt-2">
                  <Label className="mb-2 block">Quick Select Images</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {imageOptions.map((url, index) => (
                      <div 
                        key={index}
                        className={`relative cursor-pointer rounded-md overflow-hidden border-2 ${
                          formData.image === url ? 'border-pink-600' : 'border-transparent'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, image: url }))}
                      >
                        <img 
                          src={url} 
                          alt={`Option ${index + 1}`}
                          className="w-full h-12 object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518770660439-4636190af475";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {formData.image && (
                  <div className="mt-3 aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="object-cover w-full h-20" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518770660439-4636190af475";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={handleCloseAddDialog}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddItem} 
                className="bg-pink-700 hover:bg-pink-800"
              >
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
              <DialogDescription>
                Update the details of this menu item.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-name">Item Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="border-pink-200"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="border-pink-200 min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={(value) => 
                      setFormData((prev) => ({ ...prev, category: value, subcategory: "" }))
                    }
                  >
                    <SelectTrigger className="border-pink-200">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-subcategory">Subcategory (Optional)</Label>
                  <Select
                    name="subcategory"
                    value={formData.subcategory || "none"}
                    onValueChange={(value) => 
                      setFormData((prev) => ({ ...prev, subcategory: value === "none" ? "" : value }))
                    }
                  >
                    <SelectTrigger className="border-pink-200">
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {categories
                        .find((cat) => cat.name === formData.category)
                        ?.subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-price">Price (₹)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleNumberInputChange}
                    className="border-pink-200"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="mb-2">Special Item</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-isSpecial"
                      checked={formData.isSpecial}
                      onCheckedChange={handleCheckboxChange}
                      className="data-[state=checked]:bg-pink-700 data-[state=checked]:border-pink-700"
                    />
                    <label
                      htmlFor="edit-isSpecial"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Mark as special item
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleImageUrlChange}
                  className="border-pink-200"
                  placeholder="Enter image URL"
                />

                <div className="mt-2">
                  <Label className="mb-2 block">Quick Select Images</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {imageOptions.map((url, index) => (
                      <div 
                        key={index}
                        className={`relative cursor-pointer rounded-md overflow-hidden border-2 ${
                          formData.image === url ? 'border-pink-600' : 'border-transparent'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, image: url }))}
                      >
                        <img 
                          src={url} 
                          alt={`Option ${index + 1}`}
                          className="w-full h-12 object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518770660439-4636190af475";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {formData.image && (
                  <div className="mt-3 aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="object-cover w-full h-20" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518770660439-4636190af475";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={handleCloseEditDialog}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditItem} 
                className="bg-pink-700 hover:bg-pink-800"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminMenu;
