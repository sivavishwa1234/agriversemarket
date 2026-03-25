import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

const FarmerManagement = () => {
  const [farmers, setFarmers] = useState<any[]>([]);

  useEffect(() => {
    loadFarmers();
    const interval = setInterval(loadFarmers, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadFarmers = () => {
    const registered = JSON.parse(localStorage.getItem("registeredFarmers") || "[]");
    // Also check products and crops for activity data
    const products = JSON.parse(localStorage.getItem("farmerProducts") || "[]");
    const crops = JSON.parse(localStorage.getItem("myCrops") || "[]");

    const enriched = registered.map((f: any) => {
      const farmerProducts = products.filter((p: any) => p.farmerName === f.username);
      return {
        ...f,
        productsListed: farmerProducts.length,
        status: "Active",
      };
    });
    setFarmers(enriched);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Farmer Management</h1>
        <p className="text-muted-foreground">View all registered farmers on the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Farmers ({farmers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {farmers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No farmers registered yet.</p>
              <p className="text-sm">Farmers will appear here after they register on the platform.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Products Listed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {farmers.map((farmer, index) => (
                  <TableRow key={farmer.username}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{farmer.username}</TableCell>
                    <TableCell>{farmer.registeredAt || "N/A"}</TableCell>
                    <TableCell>{farmer.productsListed}</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
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

export default FarmerManagement;
