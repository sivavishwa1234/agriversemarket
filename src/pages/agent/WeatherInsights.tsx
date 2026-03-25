import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Sun, MapPin } from "lucide-react";

const WeatherInsights = () => {
  const weatherData = {
    temperature: 28,
    humidity: 65,
    rainProbability: 40,
    windSpeed: 12,
    uvIndex: 6,
    condition: "Partly Cloudy",
  };

  const forecast = [
    { day: "Monday", temp: "26°C", condition: "Sunny", rain: "10%" },
    { day: "Tuesday", temp: "28°C", condition: "Partly Cloudy", rain: "20%" },
    { day: "Wednesday", temp: "25°C", condition: "Rainy", rain: "80%" },
    { day: "Thursday", temp: "27°C", condition: "Cloudy", rain: "40%" },
    { day: "Friday", temp: "29°C", condition: "Sunny", rain: "5%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Weather Insights</h1>
        <p className="text-muted-foreground">Current weather conditions and regional forecast</p>
      </div>

      <div className="flex items-center gap-2 text-lg">
        <MapPin className="h-5 w-5 text-primary" />
        <span className="font-medium">Punjab Region</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Sun className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{weatherData.temperature}°C</div>
            <p className="text-xs text-muted-foreground mt-1">{weatherData.condition}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{weatherData.humidity}%</div>
            <p className="text-xs text-muted-foreground mt-1">Moderate level</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950 dark:to-blue-950 border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rain Probability</CardTitle>
            <Cloud className="h-5 w-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-600">{weatherData.rainProbability}%</div>
            <p className="text-xs text-muted-foreground mt-1">Chance of rain</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
            <Wind className="h-5 w-5 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-600">{weatherData.windSpeed} km/h</div>
            <p className="text-xs text-muted-foreground mt-1">Light breeze</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>5-Day Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <p className="font-medium text-center mb-2">{day.day}</p>
                <div className="text-2xl font-bold text-center text-primary mb-1">
                  {day.temp}
                </div>
                <p className="text-sm text-center text-muted-foreground mb-1">
                  {day.condition}
                </p>
                <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                  <Droplets className="h-3 w-3" />
                  <span>{day.rain}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regional Weather Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            <span className="font-medium">Current Conditions:</span> The Punjab region is experiencing partly cloudy weather with moderate temperatures ideal for wheat cultivation.
          </p>
          <p className="text-sm">
            <span className="font-medium">Forecast:</span> Expected rainfall mid-week (Wednesday) which will benefit newly planted crops. Temperatures remain stable throughout the week.
          </p>
          <p className="text-sm">
            <span className="font-medium">Agricultural Impact:</span> Good conditions for crop growth. Recommend farmers prepare for Wednesday's rainfall and ensure proper drainage systems are in place.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherInsights;
