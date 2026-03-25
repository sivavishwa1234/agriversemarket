import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";

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

const CustomerComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [reply, setReply] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const farmerName = localStorage.getItem("farmerUsername") || "";

  useEffect(() => {
    loadComplaints();
    const interval = setInterval(loadComplaints, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadComplaints = () => {
    const allComplaints: Complaint[] = JSON.parse(localStorage.getItem("customerComplaints") || "[]");
    const myComplaints = allComplaints.filter(c => c.farmerName === farmerName);
    setComplaints(myComplaints);
  };

  const handleReply = () => {
    if (!reply.trim() || !selectedComplaint) return;

    const allComplaints: Complaint[] = JSON.parse(localStorage.getItem("customerComplaints") || "[]");
    const updated = allComplaints.map(c => {
      if (c.id === selectedComplaint.id) {
        return { ...c, farmerReply: reply, status: "Resolved" };
      }
      return c;
    });
    localStorage.setItem("customerComplaints", JSON.stringify(updated));

    setComplaints(complaints.map(c => c.id === selectedComplaint.id ? { ...c, farmerReply: reply, status: "Resolved" } : c));
    setReply("");
    setIsDialogOpen(false);
    setSelectedComplaint(null);
  };

  const handleMarkInProgress = (id: string) => {
    const allComplaints: Complaint[] = JSON.parse(localStorage.getItem("customerComplaints") || "[]");
    const updated = allComplaints.map(c => c.id === id ? { ...c, status: "In Progress" } : c);
    localStorage.setItem("customerComplaints", JSON.stringify(updated));
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: "In Progress" } : c));
  };

  const pending = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Customer Complaints</h2>
        <p className="text-muted-foreground">View and respond to customer feedback about your products</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{inProgress}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{resolved}</p>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {complaints.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No customer complaints yet. Keep up the good work!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className={complaint.status === "Pending" ? "border-yellow-300" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-lg">{complaint.productName}</p>
                    <p className="text-sm text-muted-foreground">From: {complaint.customerName} • {complaint.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={complaint.type === "Complaint" || complaint.type === "Quality Issue" ? "destructive" : "default"}>
                      {complaint.type}
                    </Badge>
                    <Badge variant={complaint.status === "Resolved" ? "default" : complaint.status === "In Progress" ? "secondary" : "outline"}>
                      {complaint.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{complaint.message}</p>

                {complaint.farmerReply && (
                  <div className="bg-primary/5 p-3 rounded-lg mb-4">
                    <p className="text-xs font-medium text-primary">Your Reply:</p>
                    <p className="text-sm">{complaint.farmerReply}</p>
                  </div>
                )}

                {complaint.status !== "Resolved" && (
                  <div className="flex gap-2">
                    {complaint.status === "Pending" && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkInProgress(complaint.id)}>
                        Mark In Progress
                      </Button>
                    )}
                    <Button size="sm" onClick={() => { setSelectedComplaint(complaint); setIsDialogOpen(true); }}>
                      Reply & Resolve
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {selectedComplaint?.customerName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm font-medium">Product: {selectedComplaint?.productName}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedComplaint?.message}</p>
            </div>
            <Textarea
              placeholder="Write your reply to the customer..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
            />
            <Button className="w-full" onClick={handleReply} disabled={!reply.trim()}>
              Send Reply & Mark Resolved
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerComplaints;
