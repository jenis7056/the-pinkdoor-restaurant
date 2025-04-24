
import { Order, OrderItem } from "@/types";

// Add the missing TypeScript interface for Web Serial API
declare global {
  interface Navigator {
    serial: {
      requestPort: () => Promise<any>;
    }
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const generateReceiptContent = (order: Order) => {
  const date = new Date(order.updatedAt);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();

  // Format for 80mm thermal paper
  const content = [
    "\x1B\x40",  // Initialize printer
    "\x1B\x61\x01",  // Center alignment
    "RESTAURANT NAME\n",
    "Thank you for dining with us!\n\n",
    "\x1B\x61\x00",  // Left alignment
    `Order #: ${order.id.substring(0, 8)}\n`,
    `Date: ${formattedDate}\n`,
    `Time: ${formattedTime}\n`,
    `Table: ${order.tableNumber}\n`,
    `Customer: ${order.customerName}\n`,
    "\n",
    "--------------------------------\n",
    "ITEMS\n",
    "--------------------------------\n",
  ];

  // Add items
  order.items.forEach((item: OrderItem) => {
    const itemTotal = item.menuItem.price * item.quantity;
    const itemLine = `${item.quantity}x ${item.menuItem.name}\n`;
    const priceLine = `${" ".repeat(32 - formatCurrency(itemTotal).length)}${formatCurrency(itemTotal)}\n`;
    content.push(itemLine, priceLine);
  });

  content.push(
    "--------------------------------\n",
    `TOTAL:${" ".repeat(25)}${formatCurrency(order.totalAmount)}\n\n`,
    "\x1B\x61\x01",  // Center alignment
    "Thank you! Please visit again!\n\n",
    "\x1B\x45\x0A"  // Cut paper
  );

  return content.join("");
};

export const printReceipt = async (order: Order) => {
  try {
    const receiptContent = generateReceiptContent(order);
    // Send to printer using Web Serial API
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    
    const writer = port.writable.getWriter();
    const data = new TextEncoder().encode(receiptContent);
    await writer.write(data);
    writer.releaseLock();
    await port.close();
    
    return true;
  } catch (error) {
    console.error("Failed to print receipt:", error);
    return false;
  }
};
