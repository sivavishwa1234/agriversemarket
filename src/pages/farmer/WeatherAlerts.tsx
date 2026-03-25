import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudRain, Sun, Wind, Droplets, AlertTriangle, ThermometerSun, MapPin, Search } from "lucide-react";
import { toast } from "sonner";

const WeatherAlerts = () => {
  const [location, setLocation] = useState("");
  const [searchedLocation, setSearchedLocation] = useState("Your Location");
  
  const weatherData = {
    temperature: "28°C",
    condition: "Partly Cloudy",
    humidity: "65%",
    rainChance: "20%",
    windSpeed: "12 km/h",
    uvIndex: "6 (High)"
  };

  const handleLocationSearch = () => {
    if (!location.trim()) {
      toast.error("Please enter a location");
      return;
    }
    
    // Simulate weather search with mock data
    const mockWeather = {
      temperature: Math.floor(Math.random() * 15 + 20) + "°C",
      condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 30 + 50) + "%",
      rainChance: Math.floor(Math.random() * 50) + "%",
      windSpeed: Math.floor(Math.random() * 20 + 5) + " km/h",
      uvIndex: Math.floor(Math.random() * 5 + 3) + " (Moderate)"
    };
    
    Object.assign(weatherData, mockWeather);
    setSearchedLocation(location);
    toast.success(`Weather updated for ${location}`);
  };

  const alerts = [
    {
      id: 1,
      type: "High Humidity",
      severity: "info",
      message: "Humidity levels are ideal for rice cultivation. Consider transplanting if growing rice.",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "UV Warning",
      severity: "warning",
      message: "High UV index expected today. Protect yourself when working in the field.",
      time: "5 hours ago"
    },
    {
      id: 3,
      type: "Light Rain Expected",
      severity: "info",
      message: "20% chance of light rainfall in the evening. Good for recently planted crops.",
      time: "8 hours ago"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "warning": return "bg-secondary text-secondary-foreground";
      case "danger": return "bg-destructive text-destructive-foreground";
      default: return "bg-accent text-accent-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Weather & Alerts</h2>
        <p className="text-muted-foreground">Stay updated with real-time weather conditions and climate alerts</p>
      </div>

      {/* Location Search */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Search Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter city or location name..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
              className="flex-1"
            />
            <Button onClick={handleLocationSearch} className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Current location: <span className="font-semibold text-primary">{searchedLocation}</span>
          </p>
        </CardContent>
      </Card>

      {/* Current Weather */}
      <Card className="shadow-glow border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-6 w-6 text-secondary" />
            Current Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-primary rounded-xl text-white">
              <Sun className="h-12 w-12 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">{weatherData.temperature}</div>
              <div className="text-white/90">{weatherData.condition}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <Droplets className="h-8 w-8 text-accent" />
                  <div>
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="text-2xl font-bold">{weatherData.humidity}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <CloudRain className="h-8 w-8 text-accent" />
                  <div>
                    <div className="text-sm text-muted-foreground">Rain Chance</div>
                    <div className="text-2xl font-bold">{weatherData.rainChance}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <Wind className="h-8 w-8 text-accent" />
                  <div>
                    <div className="text-sm text-muted-foreground">Wind Speed</div>
                    <div className="text-2xl font-bold">{weatherData.windSpeed}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <ThermometerSun className="h-8 w-8 text-secondary" />
                  <div>
                    <div className="text-sm text-muted-foreground">UV Index</div>
                    <div className="text-2xl font-bold">{weatherData.uvIndex}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Climate Alerts */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-accent" />
            Climate Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 bg-card border rounded-xl hover:shadow-soft transition-shadow">
              <div className="flex items-start gap-4">
                <AlertTriangle className={`h-5 w-5 mt-1 ${
                  alert.severity === 'warning' ? 'text-secondary' : 'text-accent'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{alert.type}</h4>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                  <div className="text-xs text-muted-foreground">{alert.time}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherAlerts;