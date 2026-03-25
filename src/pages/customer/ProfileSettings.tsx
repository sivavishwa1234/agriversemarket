import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const ProfileSettings = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("customerUsername") || "";
    const storedUser = localStorage.getItem(`user_${username}`);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setName(userData.name || username);
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
    } else {
      setName(username);
    }
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const handleSave = () => {
    const username = localStorage.getItem("customerUsername") || "";
    const storedUser = localStorage.getItem(`user_${username}`);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      userData.name = name;
      userData.email = email;
      userData.phone = phone;
      localStorage.setItem(`user_${username}`, JSON.stringify(userData));
    }
    localStorage.setItem("customerUsername", name);
    toast({ title: "Profile Updated", description: "Your profile has been updated successfully" });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
  };

  // Get real order stats
  const orders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
  const completedOrders = orders.filter((o: any) => o.status === "Delivered").length;
  const pendingOrders = orders.filter((o: any) => o.status !== "Delivered").length;
  const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">{name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <Button variant="outline" className="w-full">Upload Photo</Button>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark theme</p>
                </div>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={handleDarkModeToggle} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Orders</span>
                  <span className="font-bold">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed Orders</span>
                  <span className="font-bold">{completedOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending Orders</span>
                  <span className="font-bold">{pendingOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent</span>
                  <span className="font-bold text-primary">₹{totalSpent.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
