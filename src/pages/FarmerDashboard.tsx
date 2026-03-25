import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sprout, 
  LayoutDashboard, 
  Leaf, 
  ListTodo, 
  Activity, 
  ShoppingBag, 
  Settings, 
  LogOut,
  BookOpen,
  Shield,
  MessageSquare,
  Package,
  CreditCard,
  BarChart3,
  IndianRupee,
  TrendingUp
} from "lucide-react";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [farmerName, setFarmerName] = useState("");
  const [activeRoute, setActiveRoute] = useState("dashboard");
  const [stats, setStats] = useState({ crops: 0, products: 0, orders: 0, revenue: 0, tasks: 0, pendingTasks: 0 });

  useEffect(() => {
    const storedUsername = localStorage.getItem("farmerUsername");
    if (storedUsername) setFarmerName(storedUsername);
    loadStats();
    const interval = setInterval(loadStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = () => {
    const username = localStorage.getItem("farmerUsername") || "";
    const crops = JSON.parse(localStorage.getItem("myCrops") || "[]");
    const allProducts = JSON.parse(localStorage.getItem("farmerProducts") || "[]");
    const products = allProducts.filter((p: any) => p.farmerName === username);
    const orders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    const revenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const allTasks = JSON.parse(localStorage.getItem("farmerTasks") || "[]");
    const myTasks = allTasks.filter((t: any) => t.assignedTo === username);
    const pendingTasks = myTasks.filter((t: any) => t.status !== "Completed").length;
    setStats({ crops: crops.length, products: products.length, orders: orders.length, revenue, tasks: myTasks.length, pendingTasks });
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === "/farmer-dashboard") setActiveRoute("dashboard");
    else if (path.includes("/my-crops")) setActiveRoute("my-crops");
    else if (path.includes("/admin-tasks")) setActiveRoute("admin-tasks");
    else if (path.includes("/ai-recommendation")) setActiveRoute("ai-recommendation");
    else if (path.includes("/market-products")) setActiveRoute("market-products");
    else if (path.includes("/order-management")) setActiveRoute("order-management");
    else if (path.includes("/payment-verification")) setActiveRoute("payment-verification");
    else if (path.includes("/analytics")) setActiveRoute("analytics");
    else if (path.includes("/crop-protection")) setActiveRoute("crop-protection");
    else if (path.includes("/customer-complaints")) setActiveRoute("customer-complaints");
    else if (path.includes("/profile-settings")) setActiveRoute("profile-settings");
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("farmerUsername");
    navigate("/");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/farmer-dashboard" },
    { id: "my-crops", label: "My Crops", icon: Leaf, path: "/farmer-dashboard/my-crops" },
    { id: "crop-guidance", label: "Crop Guidance", icon: BookOpen, path: "/crop-guidance" },
    { id: "admin-tasks", label: "Tasks from Admin", icon: ListTodo, path: "/farmer-dashboard/admin-tasks" },
    { id: "ai-recommendation", label: "AI Crop Recommendation", icon: Activity, path: "/farmer-dashboard/ai-recommendation" },
    { id: "market-products", label: "Sell My Products", icon: ShoppingBag, path: "/farmer-dashboard/market-products" },
    { id: "order-management", label: "Order Management", icon: Package, path: "/farmer-dashboard/order-management" },
    { id: "payment-verification", label: "Payment Verification", icon: CreditCard, path: "/farmer-dashboard/payment-verification" },
    { id: "crop-protection", label: "Crop Protection", icon: Shield, path: "/farmer-dashboard/crop-protection" },
    { id: "analytics", label: "My Analytics", icon: BarChart3, path: "/farmer-dashboard/analytics" },
    { id: "customer-complaints", label: "Customer Complaints", icon: MessageSquare, path: "/farmer-dashboard/customer-complaints" },
    { id: "profile-settings", label: "Profile Settings", icon: Settings, path: "/farmer-dashboard/profile-settings" },
  ];

  const isOnDashboardHome = location.pathname === "/farmer-dashboard";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-primary/10 to-primary/5 border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Agriverse Market</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeRoute === item.id ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                activeRoute === item.id 
                  ? "bg-primary text-primary-foreground shadow-glow" 
                  : "hover:bg-primary/10"
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">
            {navItems.find(item => item.id === activeRoute)?.label || "Dashboard"}
          </h1>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {farmerName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{farmerName}</div>
              <div className="text-muted-foreground text-xs">Farmer</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {isOnDashboardHome ? (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-primary rounded-2xl p-8 text-white shadow-glow">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {farmerName}!</h2>
                <p className="text-white/90">Here's your farm overview for today</p>
              </div>

              {/* Summary Stats - Dynamic */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="shadow-soft hover:shadow-glow transition-shadow cursor-pointer" onClick={() => navigate("/farmer-dashboard/my-crops")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Leaf className="h-4 w-4" /> Active Crops
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{stats.crops}</div>
                    <p className="text-xs text-muted-foreground mt-1">in cultivation</p>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-glow transition-shadow cursor-pointer" onClick={() => navigate("/farmer-dashboard/market-products")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <ShoppingBag className="h-4 w-4" /> Products Listed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{stats.products}</div>
                    <p className="text-xs text-muted-foreground mt-1">on marketplace</p>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-glow transition-shadow cursor-pointer" onClick={() => navigate("/farmer-dashboard/order-management")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Package className="h-4 w-4" /> Total Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{stats.orders}</div>
                    <p className="text-xs text-muted-foreground mt-1">received</p>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-glow transition-shadow cursor-pointer" onClick={() => navigate("/farmer-dashboard/analytics")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" /> Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">₹{stats.revenue.toFixed(0)}</div>
                    <p className="text-xs text-muted-foreground mt-1">total earned</p>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-glow transition-shadow cursor-pointer" onClick={() => navigate("/farmer-dashboard/admin-tasks")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <ListTodo className="h-4 w-4" /> Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{stats.tasks}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stats.pendingTasks} pending</p>
                  </CardContent>
                </Card>

                <Card className="shadow-soft hover:shadow-glow transition-shadow cursor-pointer" onClick={() => navigate("/farmer-dashboard/payment-verification")}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <CreditCard className="h-4 w-4" /> Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{stats.orders}</div>
                    <p className="text-xs text-muted-foreground mt-1">to verify</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate("/farmer-dashboard/my-crops")}>
                      <Leaf className="h-6 w-6 text-primary" />
                      <span className="text-sm">Add Crop</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate("/farmer-dashboard/market-products")}>
                      <ShoppingBag className="h-6 w-6 text-primary" />
                      <span className="text-sm">Sell Product</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate("/farmer-dashboard/analytics")}>
                      <BarChart3 className="h-6 w-6 text-primary" />
                      <span className="text-sm">View Analytics</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate("/crop-guidance")}>
                      <BookOpen className="h-6 w-6 text-primary" />
                      <span className="text-sm">Crop Guidance</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;