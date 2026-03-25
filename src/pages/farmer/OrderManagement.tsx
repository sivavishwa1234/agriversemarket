import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const OrderManagement = () => {
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

  const updateOrderStatus = (orderNo: string, newStatus: string) => {
    const allOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    const updatedOrders = allOrders.map((order: any) => 
      order.orderNo === orderNo ? { ...order, status: newStatus } : order
    );
    localStorage.setItem("customerOrders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    
    if (selectedOrder?.orderNo === orderNo) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    toast({
      title: "Status Updated",
      description: `Order ${orderNo} status changed to ${newStatus}`,
    });
  };

  const getStatusVariant = (status: string) => {
    if (status === "Delivered") return "default";
    if (status === "Shipping" || status === "Out for Delivery") return "secondary";
    if (status === "Processing") return "outline";
    return "outline";
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = ["Order Placed", "Processing", "Shipping", "Out for Delivery", "Delivered"];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Order Management</h1>
        <p className="text-muted-foreground">Manage and update customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No orders yet
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => (
                  <TableRow key={order.orderNo || index}>
                    <TableCell className="font-medium">{order.orderNo}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      {order.items?.map((item: any, i: number) => (
                        <div key={i}>{item.name} (x{item.quantity})</div>
                      ))}
                    </TableCell>
                    <TableCell>₹{order.total?.toFixed(2)}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedOrder(order)}
                      >
                        Manage
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Order</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-medium">{selectedOrder.orderNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{selectedOrder.customerName}</p>
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
                <p className="text-sm text-muted-foreground">Current Status</p>
                <Badge variant={getStatusVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {["Order Placed", "Processing", "Shipping", "Out for Delivery", "Delivered"].map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.orderNo, status)}
                      disabled={selectedOrder.status === status}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
              {getNextStatus(selectedOrder.status) && (
                <Button 
                  className="w-full" 
                  onClick={() => updateOrderStatus(selectedOrder.orderNo, getNextStatus(selectedOrder.status)!)}
                >
                  Move to {getNextStatus(selectedOrder.status)}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
