import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cloud, Droplets, Wind, Search } from "lucide-react";
import { toast } from "sonner";

export const WeatherWidget = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState({
    temp: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    wind: 12,
    city: "Your Location"
  });

  const handleSearch = () => {
    if (!city.trim()) {
      toast.error("Please enter a city name");
      return;
    }
    
    // Mock weather data - in real app, this would call a weather API
    const mockWeather = {
      temp: Math.floor(Math.random() * 15) + 20,
      condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 30) + 50,
      wind: Math.floor(Math.random() * 15) + 5,
      city: city
    };
    
    setWeatherData(mockWeather);
    toast.success(`Weather updated for ${city}`);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">{weatherData.city}</p>
          <p className="text-5xl font-bold">{weatherData.temp}°C</p>
          <p className="text-muted-foreground">{weatherData.condition}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-semibold">{weatherData.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="font-semibold">{weatherData.wind} km/h</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};