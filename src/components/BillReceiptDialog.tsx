
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Receipt, Printer } from "lucide-react";
import BillReceipt from "./BillReceipt";
import { OrderItem } from "@/types";

interface BillReceiptDialogProps {
  items: OrderItem[];
  tableNumber: number;
  customerName: string;
  orderId: string;
}

const BillReceiptDialog = ({ items, tableNumber, customerName, orderId }: BillReceiptDialogProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-pink-200 text-pink-700">
          <Receipt className="h-4 w-4 mr-2" />
          View Bill
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="absolute right-0 top-0 mb-4"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <BillReceipt
            items={items}
            tableNumber={tableNumber}
            customerName={customerName}
            orderId={orderId}
            date={new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillReceiptDialog;
