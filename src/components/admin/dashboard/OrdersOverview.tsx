
import { OrderStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Check, ChefHat } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";

interface BadgeProps {
  count: number;
  highlight?: boolean;
}

const Badge = ({ count, highlight = false }: BadgeProps) => (
  <div 
    className={`px-3 py-1 rounded-full text-sm font-medium ${
      highlight 
        ? "bg-pink-100 text-pink-800" 
        : "bg-gray-100 text-gray-800"
    }`}
  >
    {count}
  </div>
);

interface OrdersOverviewProps {
  pendingOrders: number;
  confirmedOrders: number;
  preparingOrders: number;
  readyOrders: number;
  servedOrders: number;
  completedOrders: number;
  totalOrders: number;
}

const OrdersOverview = ({
  pendingOrders,
  confirmedOrders,
  preparingOrders,
  readyOrders,
  servedOrders,
  completedOrders,
  totalOrders,
}: OrdersOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-playfair">Orders Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <span>Pending</span>
            </div>
            <Badge count={pendingOrders} />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Check className="h-4 w-4 text-blue-600" />
              </div>
              <span>Confirmed</span>
            </div>
            <Badge count={confirmedOrders} />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                <ChefHat className="h-4 w-4 text-orange-600" />
              </div>
              <span>Preparing</span>
            </div>
            <Badge count={preparingOrders} />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-green-600"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18-3v3a2 2 0 0 0 2 2h3M3 16v3a2 2 0 0 0 2 2h3m8-2h3a2 2 0 0 0 2-2v-3"/>
                </svg>
              </div>
              <span>Ready</span>
            </div>
            <Badge count={readyOrders} />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-purple-600"
                >
                  <path d="M10 2v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4h2v-2h-8v8h-1V9h7V7h-3V5h3V3h-5V2h-4z"/>
                </svg>
              </div>
              <span>Served</span>
            </div>
            <Badge count={servedOrders} />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <Check className="h-4 w-4 text-gray-600" />
              </div>
              <span>Completed</span>
            </div>
            <Badge count={completedOrders} />
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center mr-3">
              <ShoppingBag className="h-4 w-4 text-pink-700" />
            </div>
            <span className="font-medium">Total Orders</span>
          </div>
          <Badge count={totalOrders} highlight />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersOverview;
