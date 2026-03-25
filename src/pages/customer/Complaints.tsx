import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Complaint {
  id: string;
  productName: string;
  farmerName: string;
  type: string;
  message: string;
  status: string;
  date: string;
  customerName: string;
  farmerReply?: string;
}

const Complaints = () => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [message, setMessage] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [farmerProducts, setFarmerProducts] = useState<any[]>([]);

  useEffect(() => {
    // Load farmer products for the dropdown
    const products = JSON.parse(localStorage.getItem("farmerProducts") || "[]");
    setFarmerProducts(products);

    // Load existing complaints
    loadComplaints();
    const interval = setInterval(loadComplaints, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadComplaints = () => {
    const customerName = localStorage.getItem("customerUsername") || "Customer";
    const allComplaints: Complaint[] = JSON.parse(localStorage.getItem("customerComplaints") || "[]");
    const myComplaints = allComplaints.filter(c => c.customerName === customerName);
    setComplaints(myComplaints);
  };

  const handleSubmit = () => {
    if (!selectedProduct || !complaintType || !message) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const product = farmerProducts.find(p => p.id === selectedProduct);
    if (!product) return;

    const customerName = localStorage.getItem("customerUsername") || "Customer";
    const complaint: Complaint = {
      id: `CMP-${Date.now()}`,
      productName: product.cropName,
      farmerName: product.farmerName,
      type: complaintType,
      message,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      customerName,
    };

    const allComplaints = JSON.parse(localStorage.getItem("customerComplaints") || "[]");
    allComplaints.push(complaint);
    localStorage.setItem("customerComplaints", JSON.stringify(allComplaints));

    setComplaints([...complaints, complaint]);
    setSelectedProduct("");
    setComplaintType("");
    setMessage("");

    toast({ title: "Submitted Successfully", description: "Your complaint has been sent to the farmer" });
  };

  const statusColor = (status: string) => {
    if (status === "Resolved") return "default";
    if (status === "In Progress") return "secondary";
    return "outline";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Complaints & Feedback</h1>
        <p className="text-muted-foreground">Share your experience directly with the farmer</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Complaint / Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {farmerProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No products available to review. Products will appear once farmers list them.</p>
              ) : (
                <>
                  <div>
                    <Label>Select Product</Label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {farmerProducts.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.cropName} (by {p.farmerName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={complaintType} onValueChange={setComplaintType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Complaint">Complaint</SelectItem>
                        <SelectItem value="Feedback">Feedback</SelectItem>
                        <SelectItem value="Quality Issue">Quality Issue</SelectItem>
                        <SelectItem value="Delivery Issue">Delivery Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Your Message</Label>
                    <Textarea
                      placeholder="Describe your experience or issue..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                    />
                  </div>
                  <Button className="w-full" onClick={handleSubmit}>Submit</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Submissions ({complaints.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {complaints.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No complaints submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {complaints.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{item.productName}</p>
                          <Badge variant={item.type === "Complaint" || item.type === "Quality Issue" ? "destructive" : "default"}>
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Farmer: {item.farmerName}</p>
                        <p className="text-sm text-muted-foreground">{item.message}</p>
                        {item.farmerReply && (
                          <div className="bg-primary/5 p-3 rounded-lg mt-2">
                            <p className="text-xs font-medium text-primary">Farmer Reply:</p>
                            <p className="text-sm">{item.farmerReply}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{item.date}</span>
                          <Badge variant={statusColor(item.status) as any}>{item.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Complaints;
