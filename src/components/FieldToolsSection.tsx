import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Wrench, Eye, Shield, Filter } from "lucide-react";

import handHoeImg from "@/assets/tools/hand-hoe.png";
import seedDrillImg from "@/assets/tools/seed-drill.png";
import sprayerPumpImg from "@/assets/tools/sprayer-pump.png";
import weederImg from "@/assets/tools/weeder.png";
import sickleImg from "@/assets/tools/sickle.png";
import plowImg from "@/assets/tools/plow.png";
import levelerImg from "@/assets/tools/leveler.png";
import winnowingFanImg from "@/assets/tools/winnowing-fan.png";

interface FieldTool {
  id: string;
  name: string;
  nameTamil: string;
  stage: string;
  purpose: string;
  purposeTamil: string;
  image: string;
  detailedDescription: string;
  safetyTips: string[];
}

const STAGES = ["All", "Land Preparation", "Sowing", "Crop Growth", "Pest Control", "Harvesting"] as const;

const STAGE_COLORS: Record<string, string> = {
  "Land Preparation": "bg-amber-100 text-amber-800 border-amber-300",
  "Sowing": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Crop Growth": "bg-green-100 text-green-800 border-green-300",
  "Pest Control": "bg-red-100 text-red-800 border-red-300",
  "Harvesting": "bg-yellow-100 text-yellow-800 border-yellow-300",
};

const CROP_TOOLS: Record<string, FieldTool[]> = {
  default: [
    {
      id: "plow", name: "Plow", nameTamil: "கலப்பை", stage: "Land Preparation",
      purpose: "Used for primary tillage to turn and break soil",
      purposeTamil: "மண்ணை புரட்டி உடைக்க முதன்மை உழவுக்கு பயன்படுகிறது",
      image: plowImg,
      detailedDescription: "The plow is the most fundamental agricultural tool used for initial soil preparation. It cuts, lifts, and turns over the soil to bury crop residues, control weeds, and aerate the soil. Use at the start of each season before any other land preparation activities.",
      safetyTips: ["Ensure blades are sharp for efficient operation", "Keep hands away from cutting edges", "Inspect before each use for loose bolts", "Store in a dry place to prevent rust"],
    },
    {
      id: "hand-hoe", name: "Hand Hoe", nameTamil: "கைக்கொத்து", stage: "Land Preparation",
      purpose: "Used for loosening soil and removing weeds",
      purposeTamil: "மண்ணை தளர்த்தவும் களைகளை அகற்றவும் பயன்படுகிறது",
      image: handHoeImg,
      detailedDescription: "The hand hoe is a versatile tool for breaking up soil clods, creating furrows, and removing weeds. It's essential during land preparation and can also be used during crop growth for inter-cultivation. Best used when soil is slightly moist for easier operation.",
      safetyTips: ["Wear gloves to prevent blisters", "Use proper posture to avoid back strain", "Keep blade sharp for efficient weeding", "Clean after each use to prevent soil diseases"],
    },
    {
      id: "leveler", name: "Land Leveler", nameTamil: "நில சமன்படுத்தி", stage: "Land Preparation",
      purpose: "Used for leveling the field surface evenly",
      purposeTamil: "நிலத்தின் மேற்பரப்பை சமமாக சமன்படுத்த பயன்படுகிறது",
      image: levelerImg,
      detailedDescription: "A land leveler ensures uniform field surface, which is critical for even water distribution during irrigation. Proper leveling prevents waterlogging in low spots and dry patches on raised areas. Use after plowing and before creating beds or furrows.",
      safetyTips: ["Ensure field is free of large stones before leveling", "Check for proper alignment", "Use on adequately moist soil for best results", "Avoid using on waterlogged fields"],
    },
    {
      id: "seed-drill", name: "Seed Drill", nameTamil: "விதை ஊடுகருவி", stage: "Sowing",
      purpose: "Used for uniform seed placement in soil",
      purposeTamil: "மண்ணில் சீரான விதை விதைப்புக்கு பயன்படுகிறது",
      image: seedDrillImg,
      detailedDescription: "The seed drill enables precise sowing by placing seeds at uniform depth and spacing. This results in better germination rates, optimal plant population, and easier inter-cultivation. Calibrate the seed rate before use based on the crop requirements.",
      safetyTips: ["Calibrate seed rate before sowing", "Clean seed hopper after use to prevent blockage", "Ensure seeds are treated before loading", "Check for uniform seed drop across all outlets"],
    },
    {
      id: "weeder", name: "Manual Weeder", nameTamil: "களைக்கருவி", stage: "Crop Growth",
      purpose: "Removes unwanted weeds between crop rows",
      purposeTamil: "பயிர் வரிசைகளுக்கிடையே தேவையற்ற களைகளை அகற்றுகிறது",
      image: weederImg,
      detailedDescription: "The manual weeder is designed for inter-row weeding without damaging crop plants. It cuts weeds at the root level and loosens the top soil, improving aeration. Use during the vegetative stage when weeds compete with crops for nutrients and light.",
      safetyTips: ["Operate when soil is moist for easier weeding", "Keep a safe distance from crop base to avoid damage", "Clean regularly to prevent weed seed spread", "Wear closed shoes while operating"],
    },
    {
      id: "sprayer-pump", name: "Sprayer Pump", nameTamil: "தெளிப்பான்", stage: "Pest Control",
      purpose: "Used for spraying pesticides and fertilizers",
      purposeTamil: "பூச்சிக்கொல்லிகள் மற்றும் உரங்களை தெளிக்க பயன்படுகிறது",
      image: sprayerPumpImg,
      detailedDescription: "The backpack sprayer pump is used to apply liquid pesticides, herbicides, and foliar fertilizers evenly across the crop canopy. Ensure proper nozzle selection for the chemical being applied. Always spray during early morning or late evening to avoid chemical burn and maximize effectiveness.",
      safetyTips: ["Wear protective gear: mask, goggles, gloves", "Never spray against wind direction", "Clean thoroughly after each chemical change", "Do not eat or drink while spraying", "Wash hands and face immediately after use"],
    },
    {
      id: "sickle", name: "Harvesting Sickle", nameTamil: "அரிவாள்", stage: "Harvesting",
      purpose: "Used for cutting mature crops at harvest",
      purposeTamil: "முதிர்ந்த பயிர்களை அறுவடையில் வெட்ட பயன்படுகிறது",
      image: sickleImg,
      detailedDescription: "The harvesting sickle is a curved blade tool essential for cutting mature crop stalks close to the ground. Its serrated edge ensures clean cuts with minimal effort. Harvest during dry weather and ensure grains are at proper moisture content before cutting.",
      safetyTips: ["Keep the blade sharp for clean cuts", "Cut away from your body", "Wear long sleeves to protect from cuts", "Store with blade covered when not in use"],
    },
    {
      id: "winnowing-fan", name: "Winnowing Fan", nameTamil: "முறம்", stage: "Harvesting",
      purpose: "Used for separating grain from chaff after threshing",
      purposeTamil: "கதிரடிக்கு பின் தானியத்தை பதரிலிருந்து பிரிக்க பயன்படுகிறது",
      image: winnowingFanImg,
      detailedDescription: "The winnowing fan is a traditional tool used to separate grain from chaff by tossing the threshed material into the air and letting the wind blow away the lighter chaff. Best used on a breezy day or near a fan for indoor processing. Essential post-harvest tool for clean grain.",
      safetyTips: ["Use in well-ventilated area", "Wear a dust mask to avoid inhaling chaff", "Stand upwind while winnowing", "Check for foreign materials in separated grain"],
    },
  ],
};

// Some crops get extra tools
const CROP_SPECIFIC_EXTRAS: Record<string, FieldTool[]> = {
  "heritage-rice": [
    {
      id: "transplanter", name: "Paddy Transplanter", nameTamil: "நாற்று நடுகருவி", stage: "Sowing",
      purpose: "Used for transplanting paddy seedlings uniformly",
      purposeTamil: "நெல் நாற்றுகளை சீராக நடுவதற்கு பயன்படுகிறது",
      image: seedDrillImg,
      detailedDescription: "A manual paddy transplanter helps plant rice seedlings at consistent spacing and depth, ensuring uniform plant population. It significantly reduces labor time compared to manual hand transplanting.",
      safetyTips: ["Ensure seedlings are at proper age (21-25 days)", "Maintain standing water level at 2-3 cm during transplanting", "Clean after use to prevent mud buildup"],
    },
  ],
};

function getToolsForCrop(cropId: string): FieldTool[] {
  const base = CROP_TOOLS.default;
  const extras = CROP_SPECIFIC_EXTRAS[cropId] || [];
  return [...base, ...extras];
}

interface FieldToolsSectionProps {
  cropId: string;
}

const FieldToolsSection = ({ cropId }: FieldToolsSectionProps) => {
  const [activeStage, setActiveStage] = useState<string>("All");
  const [selectedTool, setSelectedTool] = useState<FieldTool | null>(null);

  const tools = getToolsForCrop(cropId);
  const filteredTools = activeStage === "All" ? tools : tools.filter(t => t.stage === activeStage);

  return (
    <div className="mt-10">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Wrench className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Field Tools Required</h2>
          <p className="text-sm text-muted-foreground">வயல் கருவிகள் தேவை • Tools needed for this crop</p>
        </div>
      </div>

      {/* Stage Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STAGES.map((stage) => {
          const count = stage === "All" ? tools.length : tools.filter(t => t.stage === stage).length;
          return (
            <Button
              key={stage}
              size="sm"
              variant={activeStage === stage ? "default" : "outline"}
              className="gap-1.5 rounded-full"
              onClick={() => setActiveStage(stage)}
            >
              {stage === "All" && <Filter className="h-3.5 w-3.5" />}
              {stage}
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs rounded-full">
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.map((tool) => (
          <Card
            key={tool.id}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/40"
          >
            {/* Tool Image */}
            <div className="aspect-square bg-muted/30 flex items-center justify-center p-6 overflow-hidden">
              <img
                src={tool.image}
                alt={tool.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base font-semibold">{tool.name}</CardTitle>
              <p className="text-xs text-muted-foreground italic">{tool.nameTamil}</p>
            </CardHeader>

            <CardContent className="space-y-3 pb-4">
              <Badge className={`text-xs border ${STAGE_COLORS[tool.stage] || "bg-muted text-muted-foreground"}`}>
                {tool.stage}
              </Badge>
              <p className="text-sm text-muted-foreground leading-relaxed">{tool.purpose}</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedTool(tool)}
              >
                <Eye className="h-3.5 w-3.5" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Wrench className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No tools found for this stage.</p>
        </div>
      )}

      {/* Tool Detail Modal */}
      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedTool?.name}</DialogTitle>
            <DialogDescription className="italic">{selectedTool?.nameTamil}</DialogDescription>
          </DialogHeader>

          {selectedTool && (
            <div className="space-y-5">
              {/* Image */}
              <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center p-6">
                <img
                  src={selectedTool.image}
                  alt={selectedTool.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Stage Badge */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Used in Crop Stage</p>
                <Badge className={`border ${STAGE_COLORS[selectedTool.stage] || ""}`}>
                  {selectedTool.stage}
                </Badge>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-semibold mb-1.5">Detailed Usage</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedTool.detailedDescription}</p>
              </div>

              {/* Purpose Tamil */}
              <div className="p-3 bg-secondary/30 rounded-lg border border-secondary/50">
                <p className="text-xs font-medium mb-1">பயன்பாடு (Tamil)</p>
                <p className="text-sm">{selectedTool.purposeTamil}</p>
              </div>

              {/* Safety Tips */}
              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-destructive" />
                  Safety Tips / பாதுகாப்பு குறிப்புகள்
                </p>
                <ul className="space-y-1.5">
                  {selectedTool.safetyTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-destructive mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FieldToolsSection;
