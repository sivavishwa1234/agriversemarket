import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Package, ShoppingBag, DollarSign } from "lucide-react";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const ReportsAnalytics = () => {
  const [data, setData] = useState({ farmers: 0, products: 0, orders: 0, revenue: 0, productsByFarmer: [] as any[], ordersByStatus: [] as any[], productsByCategory: [] as any[], revenueByFarmer: [] as any[] });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const farmers = JSON.parse(localStorage.getItem("registeredFarmers") || "[]");
    const products = JSON.parse(localStorage.getItem("farmerProducts") || "[]");
    const orders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    const tasks = JSON.parse(localStorage.getItem("farmerTasks") || "[]");
    const revenue = orders.reduce((sum: number, o: any) => sum + (parseFloat(o.total) || 0), 0);

    // Products by farmer
    const farmerMap: Record<string, number> = {};
    products.forEach((p: any) => {
      const name = p.farmerName || "Unknown";
      farmerMap[name] = (farmerMap[name] || 0) + 1;
    });
    const productsByFarmer = Object.entries(farmerMap).map(([name, count]) => ({ name, count }));

    // Orders by status
    const statusMap: Record<string, number> = {};
    orders.forEach((o: any) => {
      const s = o.status || "Processing";
      statusMap[s] = (statusMap[s] || 0) + 1;
    });
    const ordersByStatus = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

    // Products by category
    const catMap: Record<string, number> = {};
    products.forEach((p: any) => {
      const c = p.category || p.crop || "General";
      catMap[c] = (catMap[c] || 0) + 1;
    });
    const productsByCategory = Object.entries(catMap).map(([name, value]) => ({ name, value }));

    // Revenue by farmer
    const revMap: Record<string, number> = {};
    orders.forEach((o: any) => {
      const name = o.farmerName || "Unknown";
      revMap[name] = (revMap[name] || 0) + (parseFloat(o.total) || 0);
    });
    const revenueByFarmer = Object.entries(revMap).map(([name, revenue]) => ({ name, revenue }));

    setData({ farmers: farmers.length, products: products.length, orders: orders.length, revenue, productsByFarmer, ordersByStatus, productsByCategory, revenueByFarmer });
  };

  const hasData = data.farmers > 0 || data.products > 0 || data.orders > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Real-time platform insights from actual data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registered Farmers</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{data.farmers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products Listed</CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-blue-600">{data.products}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ShoppingBag className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-orange-600">{data.orders}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-600">₹{data.revenue.toLocaleString()}</div></CardContent>
        </Card>
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Data Available Yet</h3>
            <p>Charts and reports will populate as farmers register, list products, and customers place orders.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.productsByFarmer.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Products by Farmer</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.productsByFarmer}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="hsl(var(--primary))" name="Products" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {data.revenueByFarmer.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Revenue by Farmer</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.revenueByFarmer}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#10b981" name="Revenue (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.ordersByStatus.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Orders by Status</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={data.ordersByStatus} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} dataKey="value">
                        {data.ordersByStatus.map((_: any, i: number) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {data.productsByCategory.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Products by Category</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={data.productsByCategory} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} dataKey="value">
                        {data.productsByCategory.map((_: any, i: number) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsAnalytics;
