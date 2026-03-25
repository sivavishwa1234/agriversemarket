import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";

const OrderTracking = () => {
  const navigate = useNavigate();

  const orders = [
    {
      id: "#ORD-001",
      product: "Organic Wheat (50kg)",
      status: "Delivered",
      date: "2025-01-10",
      timeline: [
        { label: "Order Placed", completed: true, date: "Jan 5, 2025" },
        { label: "Processing", completed: true, date: "Jan 6, 2025" },
        { label: "Shipped", completed: true, date: "Jan 8, 2025" },
        { label: "Delivered", completed: true, date: "Jan 10, 2025" },
      ],
    },
    {
      id: "#ORD-002",
      product: "Home Garden Kit",
      status: "Shipped",
      date: "2025-01-12",
      timeline: [
        { label: "Order Placed", completed: true, date: "Jan 11, 2025" },
        { label: "Processing", completed: true, date: "Jan 11, 2025" },
        { label: "Shipped", completed: true, date: "Jan 12, 2025" },
        { label: "Delivered", completed: false, date: "Est. Jan 15, 2025" },
      ],
    },
    {
      id: "#ORD-003",
      product: "Fresh Tomatoes (10kg)",
      status: "Processing",
      date: "2025-01-13",
      timeline: [
        { label: "Order Placed", completed: true, date: "Jan 13, 2025" },
        { label: "Processing", completed: true, date: "Jan 13, 2025" },
        { label: "Shipped", completed: false, date: "Est. Jan 14, 2025" },
        { label: "Delivered", completed: false, date: "Est. Jan 16, 2025" },
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case "Shipped":
        return <Truck className="h-5 w-5 text-secondary" />;
      case "Processing":
        return <Package className="h-5 w-5 text-accent" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Shipped":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Agriverse Market</span>
          </div>
          <Button variant="outline" onClick={() => navigate("/customer-dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Order Tracking</h1>
          <p className="text-muted-foreground">Track the status of your orders</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      Order {order.id}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{order.product}</p>
                  </div>
                  <Badge variant={getStatusColor(order.status) as any}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {order.timeline.map((step, index) => (
                      <div key={index} className="relative flex items-start gap-4">
                        <div
                          className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            step.completed
                              ? "bg-primary border-primary"
                              : "bg-background border-border"
                          }`}
                        >
                          {step.completed && <CheckCircle className="h-4 w-4 text-primary-foreground" />}
                        </div>
                        <div className="flex-1 pt-1">
                          <p
                            className={`font-medium ${
                              step.completed ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-sm text-muted-foreground">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
