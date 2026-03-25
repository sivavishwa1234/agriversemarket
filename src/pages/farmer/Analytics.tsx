import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { ShoppingBag, Leaf, CreditCard, TrendingUp, Package, IndianRupee } from "lucide-react";

interface Product {
  id: string;
  cropName: string;
  quantity: string;
  price: number;
  category: string;
  farmerName: string;
  dateAdded: string;
}

interface Order {
  orderNo: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  date: string;
  status: string;
  paymentVerificationStatus?: string;
}

interface Crop {
  id: number;
  name: string;
  datePlanted: string;
  growthStage: string;
  healthStatus: string;
  expectedYield: string;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const Analytics = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [farmerName, setFarmerName] = useState("");

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const username = localStorage.getItem("farmerUsername") || "Farmer";
    setFarmerName(username);

    const allProducts: Product[] = JSON.parse(localStorage.getItem("farmerProducts") || "[]");
    setProducts(allProducts.filter(p => p.farmerName === username));

    const allOrders: Order[] = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    setOrders(allOrders);

    const storedCrops: Crop[] = JSON.parse(localStorage.getItem("myCrops") || "[]");
    setCrops(storedCrops);
  };

  // --- Sales Analytics ---
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + (o.items?.reduce((s, i) => s + i.quantity, 0) || 0), 0);

  // Sales by product
  const salesByProduct: Record<string, number> = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      salesByProduct[item.name] = (salesByProduct[item.name] || 0) + item.quantity;
    });
  });
  const salesChartData = Object.entries(salesByProduct).map(([name, qty]) => ({ name, quantity: qty }));

  // --- Crop Growth Stage Distribution ---
  const stageCount: Record<string, number> = {};
  crops.forEach(c => {
    stageCount[c.growthStage] = (stageCount[c.growthStage] || 0) + 1;
  });
  const cropStageData = Object.entries(stageCount).map(([name, value]) => ({ name, value }));

  // --- Crop Health Distribution ---
  const healthCount: Record<string, number> = {};
  crops.forEach(c => {
    healthCount[c.healthStatus] = (healthCount[c.healthStatus] || 0) + 1;
  });
  const cropHealthData = Object.entries(healthCount).map(([name, value]) => ({ name, value }));

  // --- Payment Status Distribution ---
  const paymentCount: Record<string, number> = { "Completed": 0, "In Progress": 0, "No Payment": 0 };
  orders.forEach(o => {
    const status = o.paymentVerificationStatus || "In Progress";
    paymentCount[status] = (paymentCount[status] || 0) + 1;
  });
  const paymentChartData = Object.entries(paymentCount)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));
  const paymentColors: Record<string, string> = {
    "Completed": "#10b981",
    "In Progress": "#f59e0b",
    "No Payment": "#ef4444"
  };

  // --- Order Status Flow ---
  const statusCount: Record<string, number> = {
    "Order Placed": 0, "Processing": 0, "Shipping": 0, "Out for Delivery": 0, "Delivered": 0
  };
  orders.forEach(o => {
    if (statusCount[o.status] !== undefined) {
      statusCount[o.status]++;
    }
  });
  const orderStatusData = Object.entries(statusCount).map(([name, count]) => ({ name, count }));

  // --- Products by Category ---
  const categoryCount: Record<string, number> = {};
  products.forEach(p => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

  const hasOrders = orders.length > 0;
  const hasCrops = crops.length > 0;
  const hasProducts = products.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Analytics</h1>
        <p className="text-muted-foreground">Real-time insights from your farm data</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            <IndianRupee className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground mt-1">{orders.length} orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Items Sold</CardTitle>
            <ShoppingBag className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsSold}</div>
            <p className="text-xs text-muted-foreground mt-1">across all orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Crops</CardTitle>
            <Leaf className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crops.length}</div>
            <p className="text-xs text-muted-foreground mt-1">in cultivation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Listed Products</CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">on marketplace</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Sales & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Sales by Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasOrders && salesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="hsl(var(--primary))" name="Qty Sold" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                <p>No sales data yet. Orders will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Order Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasOrders ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={orderStatusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Orders" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                <p>No orders yet. Status tracking will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Crop Health & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Crop Growth Stages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasCrops && cropStageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={cropStageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {cropStageData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No crops added yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasOrders && paymentChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={paymentChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, value }) => `${value}`}
                    >
                      {paymentChartData.map((entry) => (
                        <Cell key={entry.name} fill={paymentColors[entry.name] || "#6b7280"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center mt-2">
                  {paymentChartData.map(entry => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: paymentColors[entry.name] }} />
                      <span>{entry.name} ({entry.value})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No payment data yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Products by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasProducts && categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No products listed yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Crop Health Summary */}
      {hasCrops && cropHealthData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Crop Health Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {cropHealthData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 px-4 py-2 rounded-lg border">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="outline">{item.value} crops</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
