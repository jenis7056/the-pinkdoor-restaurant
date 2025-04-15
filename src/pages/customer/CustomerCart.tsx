import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Trash2, X, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";

const CustomerCart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, clearCart, createOrder, currentCustomer } = useApp();

  if (!currentCustomer) {
    navigate("/customer-registration");
    return null;
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartItem(id, quantity);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce(
      (sum, item) => sum + (item.menuItem.price * item.quantity), 
      0
    );
  };

  const calculateTaxes = (subtotal: number) => {
    const sgstRate = 0.025; // 2.50%
    const cgstRate = 0.025; // 2.50%
    
    return {
      sgst: subtotal * sgstRate,
      cgst: subtotal * cgstRate
    };
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const { sgst, cgst } = calculateTaxes(subtotal);
    return subtotal + sgst + cgst;
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    createOrder(cart);
    navigate("/customer/orders");
  };

  const subtotal = calculateSubtotal();
  const { sgst, cgst } = calculateTaxes(subtotal);
  const total = calculateTotal();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 pl-0 text-pink-900 hover:bg-transparent hover:text-pink-700"
            onClick={() => navigate("/customer")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
          
          <h1 className="text-3xl font-playfair font-bold text-pink-900 mb-2">Your Cart</h1>
          <p className="text-gray-600">
            Review your order before confirming.
          </p>
        </div>

        {cart.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-pink-100 mb-8">
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium text-pink-900">Order Items</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-pink-700 hover:bg-pink-50"
                    onClick={clearCart}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Cart
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4">
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900">{item.menuItem.name}</h3>
                          <p className="font-medium text-pink-900">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                              minimumFractionDigits: 0,
                            }).format(item.menuItem.price * item.quantity)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.menuItem.description}</p>
                        <div className="mt-2 flex items-center">
                          <div className="flex items-center border border-pink-200 rounded-md">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none text-pink-700"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center">{item.quantity}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none text-pink-700"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <button
                            className="ml-4 text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>SGST @2.50%</span>
                    <span>{formatCurrency(sgst)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>CGST @2.50%</span>
                    <span>{formatCurrency(cgst)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Table Number</span>
                    <span>{currentCustomer.tableNumber}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Order Total</span>
                    <span className="text-pink-900">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 md:p-6 rounded-b-lg border-t border-pink-100">
                <Button 
                  className="w-full bg-pink-700 hover:bg-pink-800"
                  onClick={handlePlaceOrder}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Place Order
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-center">Your cart is empty</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              <p>Add some delicious items from our menu to get started.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                className="bg-pink-700 hover:bg-pink-800"
                onClick={() => navigate("/customer")}
              >
                Browse Menu
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default CustomerCart;
