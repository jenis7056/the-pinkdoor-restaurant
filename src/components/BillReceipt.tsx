
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderItem } from "@/types";

interface BillReceiptProps {
  items: OrderItem[];
  tableNumber: number;
  customerName: string;
  orderId: string;
  date: string;
}

const BillReceipt = ({ items, tableNumber, customerName, orderId, date }: BillReceiptProps) => {
  const calculateSubtotal = () => {
    return items.reduce(
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const subtotal = calculateSubtotal();
  const { sgst, cgst } = calculateTaxes(subtotal);
  const total = subtotal + sgst + cgst;

  return (
    <Card className="w-full max-w-md mx-auto bg-white print:shadow-none">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="font-playfair text-2xl font-bold text-pink-900">Restaurant Name</h2>
          <p className="text-gray-600">Tax Invoice</p>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{orderId.substring(0, 8)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date:</span>
            <span>{date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Table Number:</span>
            <span>{tableNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Customer Name:</span>
            <span>{customerName}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{item.menuItem.name}</p>
                <p className="text-gray-600">{item.quantity} x {formatCurrency(item.menuItem.price)}</p>
              </div>
              <span className="font-medium">
                {formatCurrency(item.menuItem.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">SGST @2.50%</span>
            <span>{formatCurrency(sgst)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">CGST @2.50%</span>
            <span>{formatCurrency(cgst)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span className="text-pink-900">{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Thank you for dining with us!</p>
          <p className="mt-1">Please visit again</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillReceipt;
