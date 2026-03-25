import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Camera, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfileSettings = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contact: "",
    photo: "",
  });

  useEffect(() => {
    const username = localStorage.getItem("adminUsername") || "Admin";
    const storedUser = localStorage.getItem(`user_${username}`);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setProfile({
        name: userData.name || username,
        email: userData.email || "",
        contact: userData.phone || "",
        photo: "",
      });
    } else {
      setProfile(prev => ({ ...prev, name: username }));
    }
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const handleSave = () => {
    const username = localStorage.getItem("adminUsername") || "";
    const storedUser = localStorage.getItem(`user_${username}`);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      userData.name = profile.name;
      userData.email = profile.email;
      userData.phone = profile.contact;
      localStorage.setItem(`user_${username}`, JSON.stringify(userData));
    }
    toast({ title: "Profile Updated", description: "Your profile settings have been saved successfully" });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.photo} />
              <AvatarFallback className="text-2xl">{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Contact Number</Label>
                <Input value={profile.contact} onChange={(e) => setProfile({ ...profile, contact: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full md:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-0.5">
              <Label className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
