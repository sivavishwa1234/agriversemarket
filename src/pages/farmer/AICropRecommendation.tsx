import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles, Leaf, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const AICropRecommendation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    landSize: "",
    soilType: "",
    location: "",
    weatherCondition: "",
    waterAvailability: "",
    previousCrop: "",
    budget: "",
    farmingExperience: "",
    marketAccess: "",
    primaryGoal: "",
    additionalNotes: ""
  });

  const [recommendation, setRecommendation] = useState<{
    crop: string;
    reason: string;
    tips: string[];
    soilSuitability: string;
    waterRequirement: string;
    expectedYield: string;
    marketDemand: string;
    profitability: string;
    riskLevel: string;
    alternativeCrops: string[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Comprehensive crop database with Indian crops
  const cropDatabase = [
    { name: "Finger Millet (Ragi)", soilTypes: ["Loamy", "Sandy", "Clay"], waterNeeds: "Low", profitability: "Medium" },
    { name: "Pearl Millet (Bajra)", soilTypes: ["Sandy", "Loamy"], waterNeeds: "Low", profitability: "Medium" },
    { name: "Foxtail Millet", soilTypes: ["Loamy", "Sandy"], waterNeeds: "Low", profitability: "Medium" },
    { name: "Kodo Millet", soilTypes: ["Loamy", "Sandy"], waterNeeds: "Low", profitability: "Medium" },
    { name: "Sorghum (Jowar)", soilTypes: ["Loamy", "Clay"], waterNeeds: "Low", profitability: "Medium" },
    { name: "Sesame (Til)", soilTypes: ["Loamy", "Sandy"], waterNeeds: "Low", profitability: "High" },
    { name: "Sunflower", soilTypes: ["Loamy", "Clay"], waterNeeds: "Medium", profitability: "High" },
    { name: "Safflower", soilTypes: ["Loamy", "Sandy"], waterNeeds: "Low", profitability: "Medium" },
    { name: "Groundnut (Peanut)", soilTypes: ["Sandy", "Loamy"], waterNeeds: "Medium", profitability: "High" },
    { name: "Horse Gram", soilTypes: ["Sandy", "Loamy"], waterNeeds: "Low", profitability: "Low" },
    { name: "Green Gram (Moong)", soilTypes: ["Loamy", "Sandy"], waterNeeds: "Low", profitability: "Medium" },
    { name: "Black Gram (Urad)", soilTypes: ["Loamy", "Clay"], waterNeeds: "Medium", profitability: "Medium" },
    { name: "Pigeon Pea (Red Gram)", soilTypes: ["Loamy", "Sandy"], waterNeeds: "Low", profitability: "Medium" },
    { name: "Amaranth", soilTypes: ["Loamy", "Sandy"], waterNeeds: "Low", profitability: "Medium" },
    { name: "Buckwheat", soilTypes: ["Loamy", "Sandy"], waterNeeds: "Low", profitability: "Low" },
    { name: "Moringa (Drumstick)", soilTypes: ["Loamy", "Sandy"], waterNeeds: "Low", profitability: "High" },
    { name: "Okra (Lady's Finger)", soilTypes: ["Loamy", "Clay"], waterNeeds: "Medium", profitability: "High" },
    { name: "Cluster Bean (Guar)", soilTypes: ["Sandy", "Loamy"], waterNeeds: "Low", profitability: "Medium" },
    { name: "Heritage Rice Varieties", soilTypes: ["Clay", "Loamy"], waterNeeds: "High", profitability: "Very High" },
    { name: "Kharchia Wheat", soilTypes: ["Saline", "Loamy"], waterNeeds: "Medium", profitability: "Medium" },
    { name: "Rice", soilTypes: ["Clay", "Loamy"], waterNeeds: "High", profitability: "Medium" },
    { name: "Wheat", soilTypes: ["Loamy", "Clay"], waterNeeds: "Medium", profitability: "Medium" },
    { name: "Cotton", soilTypes: ["Black", "Loamy"], waterNeeds: "Medium", profitability: "High" },
    { name: "Sugarcane", soilTypes: ["Loamy", "Clay"], waterNeeds: "High", profitability: "High" },
    { name: "Turmeric", soilTypes: ["Loamy", "Clay"], waterNeeds: "Medium", profitability: "Very High" },
    { name: "Ginger", soilTypes: ["Loamy", "Sandy"], waterNeeds: "Medium", profitability: "Very High" },
    { name: "Chili", soilTypes: ["Loamy", "Sandy"], waterNeeds: "Medium", profitability: "High" },
  ];

  const handleGetRecommendation = () => {
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Enhanced AI recommendation logic
      let recommendedCrop = "";
      let reason = "";
      let tips: string[] = [];
      let soilSuitability = "";
      let waterRequirement = "";
      let expectedYield = "";
      let marketDemand = "";
      let profitability = "";
      let riskLevel = "";
      let alternativeCrops: string[] = [];

      const landSize = parseFloat(formData.landSize);

      // Advanced matching logic
      if (formData.soilType === "Clay" && formData.weatherCondition === "Humid" && formData.waterAvailability === "High") {
        recommendedCrop = "Heritage Rice Varieties";
        reason = "Clay soil with high water availability and humid climate creates ideal conditions for premium heritage rice cultivation, which commands excellent market prices.";
        soilSuitability = "Excellent - Clay soil retains moisture perfectly for rice paddies";
        waterRequirement = "High (1500-2000mm annually)";
        expectedYield = "4-5 tons per acre for heritage varieties";
        marketDemand = "Very High - Premium market segment with 40-50% higher prices";
        profitability = "Very High - ₹80,000-₹1,20,000 per acre potential";
        riskLevel = "Low-Medium - Stable crop with established market";
        alternativeCrops = ["Regular Rice", "Finger Millet (Ragi)", "Pigeon Pea (Red Gram)"];
        tips = [
          "Select heritage varieties like Mappillai Samba, Karuppu Kavuni, or Kattuyanam",
          "Maintain water depth of 2-3 inches during growing season",
          "Use organic farming methods to command premium prices",
          "Connect with organic certification bodies for better market access",
          "Split fertilizer application - 50% basal, 25% tillering, 25% panicle initiation"
        ];
      } else if (formData.soilType === "Sandy" && formData.waterAvailability === "Low") {
        recommendedCrop = "Groundnut (Peanut)";
        reason = "Sandy, well-drained soil with low water availability is perfect for groundnut cultivation. It's drought-tolerant and highly profitable.";
        soilSuitability = "Excellent - Sandy soil prevents waterlogging and ensures good pod development";
        waterRequirement = "Low-Medium (500-600mm annually)";
        expectedYield = "2.5-3 tons per acre with good management";
        marketDemand = "High - Constant demand for oil extraction and direct consumption";
        profitability = "High - ₹60,000-₹90,000 per acre";
        riskLevel = "Medium - Weather dependent, pest management critical";
        alternativeCrops = ["Pearl Millet (Bajra)", "Green Gram (Moong)", "Sesame (Til)"];
        tips = [
          "Use certified seeds of varieties like TMV-2, JL-24, or TAG-24",
          "Maintain 30x10 cm spacing for optimal yield",
          "Apply gypsum at 200-250 kg/acre during flowering for better pod filling",
          "Implement drip irrigation if possible for 30-40% yield increase",
          "Monitor for leaf miner, thrips, and aphids regularly"
        ];
      } else if (formData.soilType === "Loamy" && formData.primaryGoal === "Income") {
        recommendedCrop = "Turmeric";
        reason = "Loamy soil is ideal for turmeric, which is one of the most profitable spice crops in India with growing domestic and export demand.";
        soilSuitability = "Excellent - Well-drained loamy soil with good organic content";
        waterRequirement = "Medium (1500mm annually with good drainage)";
        expectedYield = "5-7 tons fresh rhizomes per acre (1.5-2 tons dried)";
        marketDemand = "Very High - Growing export market and health benefits driving demand";
        profitability = "Very High - ₹2,00,000-₹3,00,000 per acre";
        riskLevel = "Medium - Requires 8-9 months, disease management important";
        alternativeCrops = ["Ginger", "Chili", "Finger Millet (Ragi)"];
        tips = [
          "Select high-yielding varieties like Lakadong, Salem, or Alleppey",
          "Plant rhizomes during April-May with monsoon onset",
          "Maintain adequate spacing of 30x20 cm for better rhizome development",
          "Apply mulching to conserve moisture and control weeds",
          "Harvest when leaves turn yellow (7-9 months after planting)"
        ];
      } else if (landSize > 3 && formData.waterAvailability === "Medium") {
        recommendedCrop = "Sorghum (Jowar)";
        reason = "For larger land holdings with moderate water availability, sorghum is an excellent choice - it's resilient, versatile, and has growing market demand.";
        soilSuitability = "Good - Adaptable to various soil types, performs well in medium-heavy soils";
        waterRequirement = "Low-Medium (400-600mm annually)";
        expectedYield = "2-3 tons per acre for grain, 8-10 tons fodder";
        marketDemand = "High - Growing demand for millet-based products and animal feed";
        profitability = "Medium - ₹40,000-₹60,000 per acre (grain + fodder)";
        riskLevel = "Low - Drought tolerant, multiple uses";
        alternativeCrops = ["Pearl Millet (Bajra)", "Safflower", "Sunflower"];
        tips = [
          "Choose hybrid varieties like CSH-16, CSH-25 for higher yields",
          "Sow during June-July (Kharif) or September-October (Rabi)",
          "Apply recommended dose: 80kg N, 40kg P2O5, 40kg K2O per acre",
          "Control shoot fly and stem borer through integrated pest management",
          "Can be intercropped with pulses for additional income"
        ];
      } else if (formData.waterAvailability === "Low" && formData.primaryGoal === "Sustainability") {
        recommendedCrop = "Finger Millet (Ragi)";
        reason = "Finger millet is perfect for low water conditions and sustainable farming. It's a superfood with increasing market value and minimal input requirements.";
        soilSuitability = "Good - Adaptable to red, black, and alluvial soils";
        waterRequirement = "Very Low (350-500mm annually)";
        expectedYield = "1.5-2 tons per acre";
        marketDemand = "High - Rising health consciousness driving premium prices";
        profitability = "Medium-High - ₹45,000-₹70,000 per acre";
        riskLevel = "Very Low - Extremely resilient to drought and pests";
        alternativeCrops = ["Pearl Millet (Bajra)", "Foxtail Millet", "Horse Gram"];
        tips = [
          "Use improved varieties like GPU-28, MR-6, or KMR-204",
          "Minimal fertilizer requirement - 40:40:20 NPK per acre",
          "Naturally pest-resistant, reducing chemical costs",
          "Can be marketed as organic superfood for 2-3x prices",
          "Excellent for crop rotation and soil health improvement"
        ];
      } else if (formData.soilType === "Loamy" && formData.farmingExperience === "Beginner") {
        recommendedCrop = "Green Gram (Moong)";
        reason = "Green gram is an excellent starter crop - short duration (60-65 days), easy to manage, and provides good returns with minimal risk.";
        soilSuitability = "Excellent - Well-drained loamy soil is ideal";
        waterRequirement = "Low (300-400mm)";
        expectedYield = "800kg-1 ton per acre";
        marketDemand = "Very High - Staple pulse with consistent demand";
        profitability = "Medium - ₹35,000-₹50,000 per acre";
        riskLevel = "Low - Short duration reduces weather risks";
        alternativeCrops = ["Black Gram (Urad)", "Cowpea", "Cluster Bean (Guar)"];
        tips = [
          "Select varieties like Pusa Vishal, IPM-2-3, or SML-668",
          "Can fit 2-3 crops per year due to short duration",
          "Minimal pest issues compared to other pulses",
          "Fixes nitrogen in soil - excellent for crop rotation",
          "Ready market availability ensures quick payment"
        ];
      } else {
        recommendedCrop = "Pearl Millet (Bajra)";
        reason = "Pearl millet is a versatile, climate-resilient crop suitable for various conditions. It's gaining popularity due to health benefits and requires minimal inputs.";
        soilSuitability = "Good - Grows well in sandy to loamy soils";
        waterRequirement = "Very Low (250-400mm annually)";
        expectedYield = "2-2.5 tons per acre";
        marketDemand = "High - Growing health food market";
        profitability = "Medium - ₹35,000-₹55,000 per acre";
        riskLevel = "Low - Highly drought tolerant";
        alternativeCrops = ["Sorghum (Jowar)", "Foxtail Millet", "Kodo Millet"];
        tips = [
          "Use hybrid varieties like HHB-67, HHB-197 for better yields",
          "Drought and heat tolerant - ideal for semi-arid regions",
          "Can be sold as grain or green fodder for dual income",
          "Minimal pest and disease problems",
          "Growing demand in health food sector for premium prices"
        ];
      }

      setRecommendation({
        crop: recommendedCrop,
        reason,
        tips,
        soilSuitability,
        waterRequirement,
        expectedYield,
        marketDemand,
        profitability,
        riskLevel,
        alternativeCrops
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleViewCropGuidance = () => {
    navigate("/crop-guidance");
    toast.success("Opening Crop Guidance - Select your recommended crop for detailed cultivation steps");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">AI Crop Recommendation</h2>
        <p className="text-muted-foreground">Get intelligent crop suggestions based on your comprehensive farm conditions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Comprehensive Farm Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="landSize">Land Size (in acres) *</Label>
              <Input
                id="landSize"
                type="number"
                placeholder="Enter land size"
                value={formData.landSize}
                onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, soilType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clay">Clay (Heavy, water-retaining)</SelectItem>
                  <SelectItem value="Sandy">Sandy (Light, well-drained)</SelectItem>
                  <SelectItem value="Loamy">Loamy (Balanced, ideal)</SelectItem>
                  <SelectItem value="Silt">Silt (Fine particles)</SelectItem>
                  <SelectItem value="Black">Black Soil (Cotton soil)</SelectItem>
                  <SelectItem value="Red">Red Soil (Low fertility)</SelectItem>
                  <SelectItem value="Saline">Saline (Salt affected)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (District/State) *</Label>
              <Input
                id="location"
                placeholder="e.g., Pune, Maharashtra"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weather">Climate Condition *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, weatherCondition: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select climate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Humid">Humid (Heavy rainfall)</SelectItem>
                  <SelectItem value="Dry">Dry (Low rainfall)</SelectItem>
                  <SelectItem value="Moderate">Moderate (Balanced)</SelectItem>
                  <SelectItem value="Cold">Cold (Low temperature)</SelectItem>
                  <SelectItem value="Hot">Hot (High temperature)</SelectItem>
                  <SelectItem value="Semi-Arid">Semi-Arid (Scanty rain)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="water">Water Availability *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, waterAvailability: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Water source availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High (Assured irrigation)</SelectItem>
                  <SelectItem value="Medium">Medium (Seasonal water)</SelectItem>
                  <SelectItem value="Low">Low (Rainfed only)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousCrop">Previous Crop (Optional)</Label>
              <Input
                id="previousCrop"
                placeholder="What did you grow last season?"
                value={formData.previousCrop}
                onChange={(e) => setFormData({ ...formData, previousCrop: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Investment Budget *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Investment capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low (₹10,000-30,000 per acre)</SelectItem>
                  <SelectItem value="Medium">Medium (₹30,000-60,000 per acre)</SelectItem>
                  <SelectItem value="High">High (₹60,000+ per acre)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Farming Experience *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, farmingExperience: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner (0-2 years)</SelectItem>
                  <SelectItem value="Intermediate">Intermediate (2-5 years)</SelectItem>
                  <SelectItem value="Experienced">Experienced (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="market">Market Access *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, marketAccess: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Nearby market facilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent (Mandi nearby, good transport)</SelectItem>
                  <SelectItem value="Good">Good (Market within 20km)</SelectItem>
                  <SelectItem value="Limited">Limited (Remote location)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Primary Goal *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, primaryGoal: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="What's your main objective?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Income">Maximum Income</SelectItem>
                  <SelectItem value="Sustainability">Long-term Sustainability</SelectItem>
                  <SelectItem value="LowRisk">Low Risk & Stability</SelectItem>
                  <SelectItem value="Organic">Organic/Premium Market</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements or constraints..."
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleGetRecommendation} 
              className="w-full gap-2"
              disabled={!formData.landSize || !formData.soilType || !formData.weatherCondition || !formData.waterAvailability || !formData.budget || !formData.farmingExperience || !formData.marketAccess || !formData.primaryGoal || isLoading}
            >
              <Bot className="h-4 w-4" />
              {isLoading ? "Analyzing..." : "Get AI Recommendation"}
            </Button>
          </CardContent>
        </Card>

        {/* Recommendation Result */}
        <Card className={`shadow-glow border-2 transition-all ${
          recommendation ? "border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5" : "border-border"
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Detailed AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[70vh] overflow-y-auto pr-2">
            {!recommendation ? (
              <div className="text-center py-12">
                <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Fill in all required fields and click "Get AI Recommendation" to receive a comprehensive crop analysis
                </p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse">
                  <Bot className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-primary font-medium">Analyzing your farm conditions...</p>
                  <p className="text-sm text-muted-foreground mt-2">Evaluating {cropDatabase.length}+ crop options</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center p-6 bg-gradient-primary rounded-xl text-white">
                  <div className="text-sm opacity-90 mb-2">🌾 Best Recommended Crop</div>
                  <div className="text-4xl font-bold mb-2">{recommendation.crop}</div>
                  <Badge className="bg-white text-primary">Perfect Match for Your Farm</Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Why This Crop?
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">{recommendation.reason}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-card/50">
                    <CardContent className="pt-4">
                      <div className="text-sm font-semibold mb-1">Soil Suitability</div>
                      <p className="text-xs text-muted-foreground">{recommendation.soilSuitability}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50">
                    <CardContent className="pt-4">
                      <div className="text-sm font-semibold mb-1">Water Requirement</div>
                      <p className="text-xs text-muted-foreground">{recommendation.waterRequirement}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50">
                    <CardContent className="pt-4">
                      <div className="text-sm font-semibold mb-1">Expected Yield</div>
                      <p className="text-xs text-muted-foreground">{recommendation.expectedYield}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50">
                    <CardContent className="pt-4">
                      <div className="text-sm font-semibold mb-1">Market Demand</div>
                      <p className="text-xs text-muted-foreground">{recommendation.marketDemand}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50">
                    <CardContent className="pt-4">
                      <div className="text-sm font-semibold mb-1">Profitability Potential</div>
                      <p className="text-xs text-muted-foreground">{recommendation.profitability}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50">
                    <CardContent className="pt-4">
                      <div className="text-sm font-semibold mb-1">Risk Level</div>
                      <p className="text-xs text-muted-foreground">{recommendation.riskLevel}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">📋 Detailed Cultivation Tips</h4>
                  <ul className="space-y-3">
                    {recommendation.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-card/50 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-white">{index + 1}</span>
                        </div>
                        <span className="text-sm text-muted-foreground leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Alternative Crops to Consider</h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.alternativeCrops.map((crop, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleViewCropGuidance}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Complete Crop Guidance & Cultivation Steps
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICropRecommendation;