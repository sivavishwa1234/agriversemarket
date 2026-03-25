import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const MyOrders = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
      setOrders(savedOrders);
    };
    
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusVariant = (status: string) => {
    if (status === "Delivered") return "default";
    if (status === "Shipping" || status === "Out for Delivery") return "secondary";
    if (status === "Processing") return "outline";
    return "outline";
  };

  const getPaymentStatusVariant = (status: string) => {
    if (status === "Completed") return "default";
    if (status === "In Progress") return "secondary";
    if (status === "No Payment") return "destructive";
    return "outline";
  };

  const getPaymentStatusDisplay = (status: string) => {
    if (status === "Completed") return { icon: <CheckCircle className="h-4 w-4" />, text: "Payment Success", color: "text-green-600" };
    if (status === "In Progress") return { icon: <Clock className="h-4 w-4" />, text: "Wait for Farmer", color: "text-yellow-600" };
    if (status === "No Payment") return { icon: <XCircle className="h-4 w-4" />, text: "Payment Failed", color: "text-red-600" };
    return { icon: <Clock className="h-4 w-4" />, text: "Pending", color: "text-gray-600" };
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your order history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No orders yet. Start shopping!
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => {
                  const paymentStatus = getPaymentStatusDisplay(order.paymentVerificationStatus || "In Progress");
                  return (
                    <TableRow key={order.orderNo || index}>
                      <TableCell className="font-medium">{order.orderNo}</TableCell>
                      <TableCell>
                        {order.items?.map((item: any, i: number) => (
                          <div key={i}>{item.name} (x{item.quantity})</div>
                        ))}
                      </TableCell>
                      <TableCell>{order.items?.[0]?.seller || "N/A"}</TableCell>
                      <TableCell>₹{order.total?.toFixed(2)}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${paymentStatus.color}`}>
                          {paymentStatus.icon}
                          <span className="text-sm font-medium">{paymentStatus.text}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/customer-dashboard/order-tracking?orderNo=${order.orderNo}`)}>
                            Track
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-medium">{selectedOrder.orderNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-medium">{selectedOrder.transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                {selectedOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between mt-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium text-lg">₹{selectedOrder.total?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{selectedOrder.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">UPI ID</p>
                <p className="font-medium">{selectedOrder.upiId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge variant={getPaymentStatusVariant(selectedOrder.paymentVerificationStatus || "In Progress")}>
                  {selectedOrder.paymentVerificationStatus || "In Progress"}
                </Badge>
              </div>
              {selectedOrder.deliveryAddress && (
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                </div>
              )}
              {selectedOrder.customerPhone && (
                <div>
                  <p className="text-sm text-muted-foreground">Contact Number</p>
                  <p className="font-medium">{selectedOrder.customerPhone}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrders;
