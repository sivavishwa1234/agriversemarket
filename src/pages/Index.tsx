import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Users, ShoppingCart, Shield } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    // Check if user exists in localStorage
    const storedUser = localStorage.getItem(`user_${username}`);
    
    if (!storedUser) {
      toast.error("Account not found. Please register first.");
      return;
    }

    const userData = JSON.parse(storedUser);

    // Verify password
    if (userData.password !== password) {
      toast.error("Incorrect password. Please try again.");
      return;
    }

    const userRole = userData.role;

    // Redirect based on role
    if (userRole === "farmer") {
      localStorage.setItem("farmerUsername", username);
      const farmers = JSON.parse(localStorage.getItem("registeredFarmers") || "[]");
      if (!farmers.find((f: any) => f.username === username)) {
        farmers.push({ username, name: userData.name || username, email: userData.email || "", phone: userData.phone || "", registeredAt: new Date().toISOString().split('T')[0] });
        localStorage.setItem("registeredFarmers", JSON.stringify(farmers));
      }
      navigate("/farmer-dashboard");
    } else if (userRole === "admin") {
      localStorage.setItem("adminUsername", username);
      navigate("/admin-dashboard");
    } else {
      localStorage.setItem("customerUsername", username);
      navigate("/customer-dashboard");
    }
    
    toast.success("Login successful!");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary-foreground" />
          <span className="text-2xl font-bold text-primary-foreground">Agriverse Market</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <div className="text-primary-foreground space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold leading-tight">
              Intelligent Agriculture, Connected Marketplace
            </h1>
            <p className="text-xl opacity-90">
              Empowering farmers and customers through AI-powered insights and seamless commerce
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-start gap-3">
                <Sprout className="h-6 w-6 mt-1" />
                <div>
                  <h3 className="font-semibold">AI Crop Guidance</h3>
                  <p className="text-sm opacity-80">Smart recommendations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 mt-1" />
                <div>
                  <h3 className="font-semibold">Admin Network</h3>
                  <p className="text-sm opacity-80">Connected supply chain</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShoppingCart className="h-6 w-6 mt-1" />
                <div>
                  <h3 className="font-semibold">Marketplace</h3>
                  <p className="text-sm opacity-80">Direct to customer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 mt-1" />
                <div>
                  <h3 className="font-semibold">Secure Platform</h3>
                  <p className="text-sm opacity-80">Protected transactions</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="shadow-glow animate-slide-up">
            <CardHeader>
              <CardTitle className="text-2xl">Login to Agriverse Market</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <div className="text-center pt-2">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate("/register")}
                  >
                    Don't have an account? Register here
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
