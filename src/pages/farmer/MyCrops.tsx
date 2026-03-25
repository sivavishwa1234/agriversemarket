import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Leaf } from "lucide-react";

interface Crop {
  id: number;
  name: string;
  datePlanted: string;
  growthStage: string;
  healthStatus: string;
  expectedYield: string;
}

const MyCrops = () => {
  const [crops, setCrops] = useState<Crop[]>([]);

  // Load crops from localStorage on component mount
  useEffect(() => {
    const storedCrops = localStorage.getItem("myCrops");
    if (storedCrops) {
      setCrops(JSON.parse(storedCrops));
    } else {
      // Initialize with default crops
      const defaultCrops = [
        {
          id: 1,
          name: "Wheat",
          datePlanted: "2025-08-15",
          growthStage: "Vegetative",
          healthStatus: "Excellent",
          expectedYield: "3.5 tons"
        },
        {
          id: 2,
          name: "Rice",
          datePlanted: "2025-09-01",
          growthStage: "Tillering",
          healthStatus: "Good",
          expectedYield: "4.2 tons"
        },
        {
          id: 3,
          name: "Peanut",
          datePlanted: "2025-09-20",
          growthStage: "Seedling",
          healthStatus: "Excellent",
          expectedYield: "2.1 tons"
        }
      ];
      setCrops(defaultCrops);
      localStorage.setItem("myCrops", JSON.stringify(defaultCrops));
    }
  }, []);

  // Save crops to localStorage whenever they change
  useEffect(() => {
    if (crops.length > 0) {
      localStorage.setItem("myCrops", JSON.stringify(crops));
    }
  }, [crops]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: "",
    datePlanted: "",
    growthStage: "",
    expectedYield: ""
  });

  const handleAddCrop = () => {
    if (newCrop.name && newCrop.datePlanted) {
      setCrops([...crops, {
        id: crops.length + 1,
        name: newCrop.name,
        datePlanted: newCrop.datePlanted,
        growthStage: newCrop.growthStage || "Seedling",
        healthStatus: "Good",
        expectedYield: newCrop.expectedYield || "TBD"
      }]);
      setNewCrop({ name: "", datePlanted: "", growthStage: "", expectedYield: "" });
      setIsDialogOpen(false);
    }
  };

  const getHealthBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent": return "default";
      case "good": return "secondary";
      case "fair": return "outline";
      default: return "destructive";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">My Crops</h2>
          <p className="text-muted-foreground">Manage and monitor your crop cultivation</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-glow">
              <Plus className="h-4 w-4" />
              Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Crop</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="cropName">Crop Name</Label>
                <Input
                  id="cropName"
                  placeholder="e.g., Wheat, Rice, Corn"
                  value={newCrop.name}
                  onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="datePlanted">Date Planted</Label>
                <Input
                  id="datePlanted"
                  type="date"
                  value={newCrop.datePlanted}
                  onChange={(e) => setNewCrop({ ...newCrop, datePlanted: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="growthStage">Growth Stage</Label>
                <Select onValueChange={(value) => setNewCrop({ ...newCrop, growthStage: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select growth stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Seedling">Seedling</SelectItem>
                    <SelectItem value="Vegetative">Vegetative</SelectItem>
                    <SelectItem value="Flowering">Flowering</SelectItem>
                    <SelectItem value="Fruiting">Fruiting</SelectItem>
                    <SelectItem value="Harvest Ready">Harvest Ready</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectedYield">Expected Yield</Label>
                <Input
                  id="expectedYield"
                  placeholder="e.g., 3.5 tons"
                  value={newCrop.expectedYield}
                  onChange={(e) => setNewCrop({ ...newCrop, expectedYield: e.target.value })}
                />
              </div>
              
              <Button onClick={handleAddCrop} className="w-full">
                Add Crop
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Current Crops ({crops.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop Name</TableHead>
                <TableHead>Date Planted</TableHead>
                <TableHead>Growth Stage</TableHead>
                <TableHead>Health Status</TableHead>
                <TableHead>Expected Yield</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crops.map((crop) => (
                <TableRow key={crop.id} className="hover:bg-primary/5">
                  <TableCell className="font-medium">{crop.name}</TableCell>
                  <TableCell>{new Date(crop.datePlanted).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{crop.growthStage}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getHealthBadgeVariant(crop.healthStatus)}>
                      {crop.healthStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{crop.expectedYield}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyCrops;