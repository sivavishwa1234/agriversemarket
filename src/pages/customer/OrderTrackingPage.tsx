import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Circle, Package } from "lucide-react";

const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);

  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (orderParam) {
      setOrderNumber(orderParam);
      handleTrack(orderParam);
    }
  }, [searchParams]);

  const getTrackingSteps = (status: string) => {
    const allSteps = [
      { label: "Order Placed", status: "Order Placed" },
      { label: "Processing", status: "Processing" },
      { label: "Shipping", status: "Shipping" },
      { label: "Out for Delivery", status: "Out for Delivery" },
      { label: "Delivered", status: "Delivered" },
    ];

    const currentIndex = allSteps.findIndex(step => step.status === status);
    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex
    }));
  };

  const handleTrack = (orderNo?: string) => {
    const searchOrder = orderNo || orderNumber;
    if (!searchOrder) return;
    
    const orders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    const order = orders.find((o: any) => o.orderNo === searchOrder);
    
    if (order) {
      const steps = getTrackingSteps(order.status);
      setTrackingData({
        orderNumber: order.orderNo,
        items: order.items,
        total: order.total,
        expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        steps: steps,
        currentStatus: order.status
      });
    } else {
      setTrackingData(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Order Tracking</h1>
        <p className="text-muted-foreground">Track your order status</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enter Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="orderNo">Order Number</Label>
                <Input
                  id="orderNo"
                  placeholder="Enter your order number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={() => handleTrack()}>
                Track Order
              </Button>
            </div>
          </CardContent>
        </Card>

        {trackingData && (
          <Card>
            <CardHeader>
              <CardTitle>Order Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">
                      {trackingData.items?.map((item: any) => item.name).join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground">Order #{trackingData.orderNumber}</p>
                    <p className="text-sm font-medium">Total: ₹{trackingData.total?.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {trackingData.steps.map((step: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      {step.completed ? (
                        <CheckCircle className="h-6 w-6 text-primary mt-1" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground mt-1" />
                      )}
                      <div>
                        <p className={`font-medium ${step.completed ? "text-primary" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <p className="font-bold text-lg text-primary">{trackingData.currentStatus}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Expected Delivery</p>
                  <p className="font-bold text-lg">{trackingData.expectedDelivery}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
