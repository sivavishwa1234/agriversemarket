import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const CropMonitoring = () => {
  const crops = [
    { id: 1, crop: "Wheat", farmer: "John Smith", stage: "Flowering", health: 85, weather: "Good", yield: "High" },
    { id: 2, crop: "Rice", farmer: "Sarah Johnson", stage: "Vegetative", health: 92, weather: "Excellent", yield: "High" },
    { id: 3, crop: "Peanut", farmer: "Mike Brown", stage: "Maturity", health: 78, weather: "Fair", yield: "Medium" },
    { id: 4, crop: "Cotton", farmer: "Emily Davis", stage: "Flowering", health: 88, weather: "Good", yield: "High" },
    { id: 5, crop: "Chili", farmer: "Raj Kumar", stage: "Fruiting", health: 95, weather: "Excellent", yield: "High" },
  ];

  const [selectedCrop, setSelectedCrop] = useState<any>(null);

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-600";
    if (health >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getWeatherBadge = (weather: string) => {
    if (weather === "Excellent") return "default";
    if (weather === "Good") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crop Monitoring</h1>
        <p className="text-muted-foreground">Monitor crop health and growth stages across all farmers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Crops Monitored
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{crops.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Health Score
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {Math.round(crops.reduce((acc, c) => acc + c.health, 0) / crops.length)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Yield Expected
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {crops.filter(c => c.yield === "High").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crop Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Growth Stage</TableHead>
                <TableHead>Health Status</TableHead>
                <TableHead>Weather</TableHead>
                <TableHead>Expected Yield</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crops.map((crop) => (
                <TableRow key={crop.id}>
                  <TableCell className="font-medium">{crop.crop}</TableCell>
                  <TableCell>{crop.farmer}</TableCell>
                  <TableCell>{crop.stage}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className={`font-semibold ${getHealthColor(crop.health)}`}>
                        {crop.health}%
                      </div>
                      <Progress value={crop.health} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getWeatherBadge(crop.weather)}>
                      {crop.weather}
                    </Badge>
                  </TableCell>
                  <TableCell>{crop.yield}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedCrop(crop)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Crop Details - {selectedCrop?.crop}</DialogTitle>
                        </DialogHeader>
                        {selectedCrop && (
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Farmer</p>
                                <p className="font-medium">{selectedCrop.farmer}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Growth Stage</p>
                                <p className="font-medium">{selectedCrop.stage}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Health Score</p>
                                <p className={`font-bold text-lg ${getHealthColor(selectedCrop.health)}`}>
                                  {selectedCrop.health}%
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Weather Condition</p>
                                <Badge variant={getWeatherBadge(selectedCrop.weather)}>
                                  {selectedCrop.weather}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Expected Yield</p>
                                <p className="font-medium">{selectedCrop.yield}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Planted Date</p>
                                <p className="font-medium">Jan 15, 2025</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Health Progress</p>
                              <Progress value={selectedCrop.health} className="h-3" />
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CropMonitoring;
