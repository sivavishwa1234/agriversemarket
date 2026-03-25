import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sprout,
  Users,
  Send,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  LayoutDashboard,
  Bell,
  Activity,
  ListTodo,
  Clock,
  Package,
  DollarSign
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState("Admin");
  const [stats, setStats] = useState({ farmers: 0, products: 0, tasks: 0, orders: 0, revenue: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const storedName = localStorage.getItem("adminUsername");
    if (storedName) setAdminName(storedName);
    loadRealData();
    const interval = setInterval(loadRealData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadRealData = () => {
    const farmers = JSON.parse(localStorage.getItem("registeredFarmers") || "[]");
    const products = JSON.parse(localStorage.getItem("farmerProducts") || "[]");
    const tasks = JSON.parse(localStorage.getItem("farmerTasks") || "[]");
    const orders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    const revenue = orders.reduce((sum: number, o: any) => sum + (parseFloat(o.total) || 0), 0);

    setStats({
      farmers: farmers.length,
      products: products.length,
      tasks: tasks.length,
      orders: orders.length,
      revenue
    });

    // Build recent activities from real data
    const activities: any[] = [];
    farmers.slice(-3).reverse().forEach((f: any) => {
      activities.push({ id: `f-${f.username}`, type: "Farmer Registered", message: `${f.username} joined the platform`, time: f.registeredAt || "Recently" });
    });
    tasks.slice(0, 3).forEach((t: any) => {
      activities.push({ id: `t-${t.id}`, type: "Task Sent", message: `"${t.title}" assigned to ${t.farmer}`, time: t.assignedDate || "Recently" });
    });
    orders.slice(-3).reverse().forEach((o: any) => {
      activities.push({ id: `o-${o.id}`, type: "New Order", message: `${o.productName || "Product"} ordered by ${o.customerName || "Customer"}`, time: o.date || "Recently" });
    });
    setRecentActivities(activities.slice(0, 6));
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
    { id: "farmers", label: "Farmer Management", icon: Users, path: "/admin-dashboard/farmer-management" },
    { id: "crop-template", label: "Crop Template Creator", icon: Sprout, path: "/admin-dashboard/crop-template-creator" },
    { id: "tasks", label: "Send Tasks", icon: Send, path: "/admin-dashboard/send-tasks" },
    { id: "market", label: "Market Overview", icon: ShoppingBag, path: "/admin-dashboard/market-overview" },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3, path: "/admin-dashboard/reports-analytics" },
    { id: "settings", label: "Profile Settings", icon: Settings, path: "/admin-dashboard/profile-settings" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === "/admin-dashboard";

  const statCards = [
    { title: "Registered Farmers", value: stats.farmers, icon: Users, color: "text-primary" },
    { title: "Listed Products", value: stats.products, icon: Package, color: "text-blue-600" },
    { title: "Tasks Sent", value: stats.tasks, icon: ListTodo, color: "text-orange-600" },
    { title: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-green-600" },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Agriverse Market</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 mb-6">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {adminName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-sm">{adminName}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-6">
            <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {isHomePage ? (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Welcome, {adminName}!</h1>
                <p className="text-muted-foreground">Manage farmers and monitor platform activities</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {stats.revenue > 0 && (
                <Card className="mb-8">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Platform Revenue</CardTitle>
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">₹{stats.revenue.toLocaleString()}</div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivities.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No activities yet. Data will appear as farmers register, products are listed, and orders are placed.</p>
                  ) : (
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bell className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm mb-1">{activity.type}</p>
                            <p className="text-sm text-muted-foreground mb-2">{activity.message}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{activity.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
