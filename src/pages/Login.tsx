
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    
    // Attempt login
    const result = login(username, password);
    
    setIsLoading(false);
    
    if (result) {
      // Immediately redirect based on role without setTimeout
      const roleRedirects: Record<UserRole, string> = {
        admin: "/admin",
        waiter: "/waiter",
        chef: "/chef",
        customer: "/customer",
      };
      // Type assertion to treat result as UserRole since login returns the user role on success
      navigate(roleRedirects[result as UserRole]);
      toast.success(`Redirecting to ${result} dashboard...`);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-16 px-4">
        <Card className="border-pink-100">
          <CardHeader>
            <CardTitle className="text-2xl font-playfair text-center text-pink-900">Staff Login</CardTitle>
            <CardDescription className="text-center">
              Please enter your credentials to access the staff portal
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="border-pink-200 focus-visible:ring-pink-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="border-pink-200 focus-visible:ring-pink-500"
                />
              </div>
              
              <div className="text-sm text-gray-500">
                <h3 className="font-medium text-gray-700 mb-1">Demo Accounts:</h3>
                <p>Admin: jenis7056 / Jenis@7056</p>
                <p>Waiter: jyot / Jyot@7188</p>
                <p>Chef: chef001 / chef@001</p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-pink-700 hover:bg-pink-800" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            onClick={() => navigate("/customer-registration")}
            className="text-pink-700"
          >
            Register as a Customer Instead
          </Button>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Are you a customer? You can browse our menu and place orders after registering or scanning the QR code at your table.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
