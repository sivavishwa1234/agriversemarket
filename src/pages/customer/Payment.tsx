import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [upiNumber, setUpiNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderNumber] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const farmerGPayNumber = "9876543210@paytm"; // You can make this dynamic later

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("customerCart") || "[]");
    setCartItems(cart);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePayment = () => {
    if (!upiNumber) {
      toast({
        title: "Error",
        description: "Please enter UPI ID",
        variant: "destructive"
      });
      return;
    }
    if (!transactionId) {
      toast({
        title: "Error",
        description: "Please enter Transaction ID",
        variant: "destructive"
      });
      return;
    }
    if (!deliveryAddress) {
      toast({
        title: "Error",
        description: "Please enter delivery address",
        variant: "destructive"
      });
      return;
    }
    if (!customerPhone) {
      toast({
        title: "Error",
        description: "Please enter contact number",
        variant: "destructive"
      });
      return;
    }

    // Create order object
    const order = {
      orderNo: orderNumber,
      transactionId: transactionId,
      items: cartItems,
      total: total,
      date: new Date().toISOString().split('T')[0],
      status: "Order Placed",
      upiId: upiNumber,
      customerName: localStorage.getItem("username") || "Customer",
      deliveryAddress: deliveryAddress,
      customerPhone: customerPhone,
      paymentVerificationStatus: "In Progress" // "In Progress", "Completed", "No Payment"
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    existingOrders.push(order);
    localStorage.setItem("customerOrders", JSON.stringify(existingOrders));

    // Clear cart
    localStorage.setItem("customerCart", "[]");
    setCartItems([]);

    setShowSuccess(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Payment</h1>
        <p className="text-muted-foreground">Complete your purchase</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <p>Total Amount</p>
                  <p className="text-primary">₹{total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">Scan QR Code to Pay</p>
                <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-2">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-muted flex items-center justify-center rounded-lg mb-2">
                      <p className="text-sm text-muted-foreground">QR Code Placeholder</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Or Pay to GPay Number</p>
                    <p className="font-bold text-lg">{farmerGPayNumber}</p>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="upi">Your GPay/UPI ID</Label>
                <Input
                  id="upi"
                  placeholder="Enter your UPI ID (e.g., name@upi)"
                  value={upiNumber}
                  onChange={(e) => setUpiNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount to Pay</Label>
                <Input
                  id="amount"
                  value={`₹${total.toFixed(2)}`}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="phone">Contact Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter your contact number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  placeholder="Enter complete delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="txnId">Transaction ID</Label>
                <Input
                  id="txnId"
                  placeholder="Enter Transaction ID after payment"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handlePayment} disabled={!upiNumber || !transactionId || !deliveryAddress || !customerPhone}>
                Confirm Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-600">
              <CheckCircle className="h-6 w-6" />
              Payment Submitted!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                ⏳ Waiting for farmer acknowledgement
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Your payment is being verified by the farmer. You'll be notified once verified.
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-bold text-lg">{orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="font-bold text-lg">{transactionId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount Submitted</p>
              <p className="font-bold text-lg text-primary">₹{total.toFixed(2)}</p>
            </div>
            <Button className="w-full" onClick={() => navigate("/customer-dashboard/my-orders")}>
              View My Orders
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payment;
