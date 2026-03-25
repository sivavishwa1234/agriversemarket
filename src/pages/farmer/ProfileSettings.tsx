import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Phone, Upload } from "lucide-react";
import { toast } from "sonner";

const ProfileSettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    contact: "",
    profilePhoto: "/placeholder.svg"
  });

  useEffect(() => {
    const username = localStorage.getItem("farmerUsername") || "";
    const storedUser = localStorage.getItem(`user_${username}`);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setProfileData({
        name: userData.name || username,
        email: userData.email || "",
        contact: userData.phone || "",
        profilePhoto: "/placeholder.svg"
      });
    } else {
      setProfileData(prev => ({ ...prev, name: username }));
    }
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const handleSaveChanges = () => {
    const username = localStorage.getItem("farmerUsername") || "";
    const storedUser = localStorage.getItem(`user_${username}`);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      userData.name = profileData.name;
      userData.email = profileData.email;
      userData.phone = profileData.contact;
      localStorage.setItem(`user_${username}`, JSON.stringify(userData));
    }
    toast.success("Profile updated successfully!");
  };

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
    toast.info(checked ? "Dark mode enabled" : "Light mode enabled");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 ring-4 ring-primary/20">
              <AvatarImage src={profileData.profilePhoto} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {profileData.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Photo
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </Label>
                <Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="contact" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Contact Number
                </Label>
                <Input id="contact" type="tel" value={profileData.contact} onChange={(e) => setProfileData({ ...profileData, contact: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleSaveChanges} className="w-full md:w-auto">Save Changes</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="space-y-0.5">
              <div className="font-medium">Dark Mode</div>
              <div className="text-sm text-muted-foreground">Toggle between light and dark theme</div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
