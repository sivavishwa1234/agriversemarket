import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<"farmer" | "customer">("farmer");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Check if username already exists
    const existingUser = localStorage.getItem(`user_${formData.username}`);
    if (existingUser) {
      toast.error("Username already taken. Please choose another.");
      return;
    }

    // Store user data with role and password
    const userData = {
      username: formData.username,
      password: formData.password,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: role,
    };
    
    localStorage.setItem(`user_${formData.username}`, JSON.stringify(userData));
    
    // Register farmer for admin visibility
    if (role === "farmer") {
      const farmers = JSON.parse(localStorage.getItem("registeredFarmers") || "[]");
      if (!farmers.find((f: any) => f.username === formData.username)) {
        farmers.push({ username: formData.username, name: formData.name, email: formData.email, phone: formData.phone, registeredAt: new Date().toISOString().split('T')[0] });
        localStorage.setItem("registeredFarmers", JSON.stringify(farmers));
      }
    }
    
    // Auto-login after registration
    if (role === "farmer") {
      localStorage.setItem("farmerUsername", formData.username);
      toast.success("Registration successful! Redirecting to dashboard...");
      navigate("/farmer-dashboard");
    } else {
      localStorage.setItem("customerUsername", formData.username);
      toast.success("Registration successful! Redirecting to dashboard...");
      navigate("/customer-dashboard");
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary-foreground" />
          <span className="text-2xl font-bold text-primary-foreground">Agriverse Market</span>
        </div>
        <Button variant="outline" onClick={() => navigate("/")} className="bg-background">
          Back to Login
        </Button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg shadow-glow">
          <CardHeader>
            <CardTitle className="text-3xl">Create Your Account</CardTitle>
            <CardDescription>Register as a Farmer or Customer</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Register as *</Label>
                <Select value={role} onValueChange={(value: any) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91 1234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <Button type="submit" className="flex-1">
                  Register & Login
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
