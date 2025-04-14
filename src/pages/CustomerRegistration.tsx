
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CustomerRegistration = () => {
  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { registerCustomer } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Please enter your name");
      return;
    }

    if (!tableNumber || isNaN(parseInt(tableNumber))) {
      toast.error("Please enter a valid table number");
      return;
    }

    setIsLoading(true);
    
    try {
      registerCustomer(name, parseInt(tableNumber));
      
      setTimeout(() => {
        navigate("/customer");
      }, 500);
    } catch (error) {
      toast.error("Failed to register: " + (error as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-16 px-4">
        <Card className="border-pink-100">
          <CardHeader>
            <CardTitle className="text-2xl font-playfair text-center text-pink-900">Customer Registration</CardTitle>
            <CardDescription className="text-center">
              Please enter your details to access the digital menu
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="border-pink-200 focus-visible:ring-pink-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Table Number</Label>
                <Input
                  id="tableNumber"
                  type="number"
                  placeholder="Enter your table number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  min="1"
                  disabled={isLoading}
                  className="border-pink-200 focus-visible:ring-pink-500"
                />
              </div>

              <div className="text-sm text-gray-500">
                <p>Please check your table for the correct table number or ask your waiter.</p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-pink-700 hover:bg-pink-800" 
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register & View Menu"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            onClick={() => navigate("/login")}
            className="text-pink-700"
          >
            Staff Login
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerRegistration;
