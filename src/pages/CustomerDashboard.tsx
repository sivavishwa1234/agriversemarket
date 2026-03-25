import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, ShoppingCart, Package, LogOut, Bell, 
  LayoutDashboard, Store, ClipboardList, CreditCard, MapPin, 
  MessageSquare, User 
} from "lucide-react";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [customerName, setCustomerName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [stats, setStats] = useState({ orders: 0, pending: 0, products: 0, cartItems: 0 });

  useEffect(() => {
    const name = localStorage.getItem("customerUsername") || "Customer";
    setCustomerName(name);
    loadStats();
    const interval = setInterval(loadStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = () => {
    const cart = JSON.parse(localStorage.getItem("customerCart") || "[]");
    const orders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    const products = JSON.parse(localStorage.getItem("farmerProducts") || "[]");
    const pending = orders.filter((o: any) => o.status !== "Delivered").length;
    setCartCount(cart.length);
    setStats({
      orders: orders.length,
      pending,
      products: products.length,
      cartItems: cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0),
    });
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/customer-dashboard" },
    { name: "Products", icon: Store, path: "/customer-dashboard/products" },
    { name: "My Orders", icon: ClipboardList, path: "/customer-dashboard/my-orders" },
    { name: "Cart", icon: ShoppingCart, path: "/customer-dashboard/cart" },
    { name: "Order Tracking", icon: MapPin, path: "/customer-dashboard/order-tracking" },
    { name: "Complaints & Feedback", icon: MessageSquare, path: "/customer-dashboard/complaints" },
    { name: "Profile Settings", icon: User, path: "/customer-dashboard/profile" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isDashboardHome = location.pathname === "/customer-dashboard";

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r bg-card p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <Sprout className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Agriverse Market</span>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={isActive(item.path) ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b bg-card p-4 sticky top-0 z-50">
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" size="icon" className="relative" onClick={() => navigate("/customer-dashboard/cart")}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>{customerName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{customerName}</span>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {isDashboardHome ? (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Welcome back, {customerName}!</h1>
                <p className="text-muted-foreground">Explore quality agricultural products from local farmers</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/customer-dashboard/my-orders")}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.orders}</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/customer-dashboard/order-tracking")}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Pending Deliveries</CardTitle>
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.pending}</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/customer-dashboard/products")}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Available Products</CardTitle>
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.products}</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/customer-dashboard/cart")}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Cart Items</CardTitle>
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.cartItems}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate("/customer-dashboard/products")}>
                      <Store className="h-6 w-6 text-primary" />
                      <span className="text-sm">Browse Products</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate("/customer-dashboard/cart")}>
                      <ShoppingCart className="h-6 w-6 text-primary" />
                      <span className="text-sm">View Cart</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate("/customer-dashboard/my-orders")}>
                      <ClipboardList className="h-6 w-6 text-primary" />
                      <span className="text-sm">My Orders</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate("/customer-dashboard/complaints")}>
                      <MessageSquare className="h-6 w-6 text-primary" />
                      <span className="text-sm">Give Feedback</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <RecentOrders />
            </>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

const RecentOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  
  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    setOrders(allOrders.slice(-3).reverse());
  }, []);

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No orders yet. Start shopping to see your orders here!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">{order.orderNo}</p>
                <p className="text-sm text-muted-foreground">{order.date} • ₹{order.total?.toFixed(2)}</p>
              </div>
              <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>{order.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDashboard;
