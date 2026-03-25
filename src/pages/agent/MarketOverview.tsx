import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Package, ShoppingBag, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const MarketOverview = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("date-desc");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setProducts(JSON.parse(localStorage.getItem("farmerProducts") || "[]"));
    setOrders(JSON.parse(localStorage.getItem("customerOrders") || "[]"));
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  const completedOrders = orders.filter(o => o.status === "Delivered" || o.paymentVerified);
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Processing");

  // Sort orders
  const sortedOrders = [...orders].sort((a, b) => {
    switch (sortBy) {
      case "date-desc": return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      case "date-asc": return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
      case "amount-desc": return (parseFloat(b.total) || 0) - (parseFloat(a.total) || 0);
      case "amount-asc": return (parseFloat(a.total) || 0) - (parseFloat(b.total) || 0);
      case "farmer": return (a.farmerName || "").localeCompare(b.farmerName || "");
      default: return 0;
    }
  });

  const filteredOrders = filterStatus === "all" ? sortedOrders : sortedOrders.filter(o => {
    if (filterStatus === "completed") return o.status === "Delivered" || o.paymentVerified;
    if (filterStatus === "pending") return o.status === "Pending" || o.status === "Processing";
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Market Overview</h1>
        <p className="text-muted-foreground">Real-time marketplace data from farmer listings and customer purchases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From {orders.length} orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Listed Products</CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active farmer listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Orders</CardTitle>
            <ShoppingBag className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
            <ShoppingBag className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{pendingOrders.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Product Listings */}
      <Card>
        <CardHeader><CardTitle>Farmer Product Listings</CardTitle></CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No products listed by farmers yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.farmerName || "Unknown"}</TableCell>
                    <TableCell>₹{p.price}/{p.unit || "kg"}</TableCell>
                    <TableCell>{p.quantity} {p.unit || "kg"}</TableCell>
                    <TableCell><Badge variant="outline">{p.category || p.crop || "General"}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Purchase History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Purchase History</CardTitle>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[170px]">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="amount-desc">Highest Amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                  <SelectItem value="farmer">By Farmer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No purchase history yet. Orders will appear when customers buy products.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((o: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{o.productName || "N/A"}</TableCell>
                    <TableCell>{o.customerName || "Customer"}</TableCell>
                    <TableCell>{o.farmerName || "N/A"}</TableCell>
                    <TableCell className="font-semibold">₹{parseFloat(o.total || 0).toLocaleString()}</TableCell>
                    <TableCell>{o.date || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={o.status === "Delivered" ? "default" : "secondary"}>
                        {o.status || "Processing"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={o.paymentVerified ? "default" : "outline"}>
                        {o.paymentVerified ? "Verified" : o.paymentMethod || "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketOverview;
