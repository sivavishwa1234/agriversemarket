import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, XCircle, MapPin, Phone } from "lucide-react";

const PaymentVerification = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    setOrders(allOrders);
  };

  const updatePaymentStatus = (orderNo: string, newStatus: string) => {
    const allOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    const updatedOrders = allOrders.map((order: any) => 
      order.orderNo === orderNo ? { ...order, paymentVerificationStatus: newStatus } : order
    );
    localStorage.setItem("customerOrders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    
    if (selectedOrder?.orderNo === orderNo) {
      setSelectedOrder({ ...selectedOrder, paymentVerificationStatus: newStatus });
    }

    const statusMessage = 
      newStatus === "Completed" ? "Payment verified successfully" :
      newStatus === "In Progress" ? "Payment marked as in progress" :
      "Payment marked as failed";

    toast({
      title: "Status Updated",
      description: statusMessage,
    });
  };

  const getPaymentStatusVariant = (status: string) => {
    if (status === "Completed") return "default";
    if (status === "In Progress") return "secondary";
    if (status === "No Payment") return "destructive";
    return "outline";
  };

  const getPaymentStatusIcon = (status: string) => {
    if (status === "Completed") return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status === "In Progress") return <Clock className="h-4 w-4 text-yellow-600" />;
    if (status === "No Payment") return <XCircle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Payment Verification</h1>
        <p className="text-muted-foreground">Verify customer payments and transaction details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Payments ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No payment records yet
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => (
                  <TableRow key={order.orderNo || index}>
                    <TableCell className="font-medium">{order.orderNo}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="font-mono text-sm">{order.transactionId}</TableCell>
                    <TableCell>₹{order.total?.toFixed(2)}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentStatusIcon(order.paymentVerificationStatus || "In Progress")}
                        <Badge variant={getPaymentStatusVariant(order.paymentVerificationStatus || "In Progress")}>
                          {order.paymentVerificationStatus || "In Progress"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedOrder(order)}
                      >
                        Verify
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Verification</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-medium">{selectedOrder.orderNo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">Transaction Details</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Transaction ID</p>
                    <p className="font-mono font-bold text-lg">{selectedOrder.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">UPI ID</p>
                    <p className="font-medium">{selectedOrder.upiId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-bold text-lg text-primary">₹{selectedOrder.total?.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Customer Details</p>
                <div className="space-y-2">
                  {selectedOrder.customerPhone && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Contact Number</p>
                        <p className="font-medium">{selectedOrder.customerPhone}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.deliveryAddress && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery Address</p>
                        <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Products Ordered</p>
                {selectedOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Payment Status</p>
                <div className="flex items-center gap-2">
                  {getPaymentStatusIcon(selectedOrder.paymentVerificationStatus || "In Progress")}
                  <Badge variant={getPaymentStatusVariant(selectedOrder.paymentVerificationStatus || "In Progress")}>
                    {selectedOrder.paymentVerificationStatus || "In Progress"}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Update Payment Status</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedOrder.paymentVerificationStatus === "Completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePaymentStatus(selectedOrder.orderNo, "Completed")}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Completed
                  </Button>
                  <Button
                    variant={selectedOrder.paymentVerificationStatus === "In Progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePaymentStatus(selectedOrder.orderNo, "In Progress")}
                    className="flex items-center gap-1"
                  >
                    <Clock className="h-4 w-4" />
                    In Progress
                  </Button>
                  <Button
                    variant={selectedOrder.paymentVerificationStatus === "No Payment" ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => updatePaymentStatus(selectedOrder.orderNo, "No Payment")}
                    className="flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    No Payment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentVerification;
