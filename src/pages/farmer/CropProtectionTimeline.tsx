import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ShieldAlert,
  Bug,
  Leaf,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Eye,
  Lightbulb,
  FlaskConical,
  ArrowLeft,
  X,
  Droplets,
  Calculator,
  TriangleAlert,
} from "lucide-react";

// ─── Symptom Diagnosis Data ──────────────────────────────────

interface SymptomOption {
  id: string;
  label: string;
  labelTamil: string;
  icon: string;
}

const SYMPTOM_OPTIONS: SymptomOption[] = [
  { id: "yellow-leaves", label: "Leaves turning yellow", labelTamil: "இலைகள் மஞ்சளாகுதல்", icon: "🍂" },
  { id: "white-insects", label: "White insects flying", labelTamil: "வெள்ளை பூச்சிகள் பறத்தல்", icon: "🪰" },
  { id: "holes-leaves", label: "Holes in leaves", labelTamil: "இலைகளில் துளைகள்", icon: "🕳️" },
  { id: "powder-leaves", label: "Powder on leaves", labelTamil: "இலைகளில் பொடி", icon: "🌫️" },
  { id: "spots-leaves", label: "Spots on leaves", labelTamil: "இலைகளில் புள்ளிகள்", icon: "🔴" },
  { id: "drying-patches", label: "Plant drying patches", labelTamil: "செடி காயும் பகுதிகள்", icon: "🏜️" },
];

interface DiagnosisResult {
  pestName: string;
  pestNameTamil: string;
  stage: string;
  severity: "High" | "Medium" | "Low";
  whyItOccurs: string;
  whyItOccursTamil: string;
  recommendedChemical: string;
  sprayMeasurement: string;
  preventiveTips: string[];
  preventiveTipsTamil: string[];
}

const SYMPTOM_DIAGNOSIS: Record<string, DiagnosisResult[]> = {
  "yellow-leaves": [
    {
      pestName: "Nitrogen Deficiency / Nutrient Stress",
      pestNameTamil: "தழை உரப் பற்றாக்குறை",
      stage: "Vegetative",
      severity: "Medium",
      whyItOccurs: "Poor soil nutrition, waterlogging, or root damage preventing nutrient uptake",
      whyItOccursTamil: "மோசமான மண் ஊட்டச்சத்து, நீர் தேங்குதல்",
      recommendedChemical: "Urea 46% (foliar spray 2%)",
      sprayMeasurement: "20g Urea per 1 litre of water. Spray on leaves in the evening. Cover 200L/acre.",
      preventiveTips: [
        "Apply balanced NPK fertilizer at recommended doses",
        "Ensure proper drainage in the field",
        "Test soil before each season",
        "Add organic matter like compost or vermicompost",
      ],
      preventiveTipsTamil: [
        "சரியான NPK உரம் இடவும்",
        "வயலில் சரியான வடிகால் உறுதி செய்யவும்",
        "ஒவ்வொரு பருவத்திற்கும் முன் மண் பரிசோதனை",
        "மண்புழு உரம் சேர்க்கவும்",
      ],
    },
    {
      pestName: "Iron Chlorosis",
      pestNameTamil: "இரும்புச்சத்து குறைபாடு",
      stage: "Seedling",
      severity: "Low",
      whyItOccurs: "Alkaline soil pH preventing iron absorption by roots",
      whyItOccursTamil: "காரமான மண் pH இரும்பு உறிஞ்சுதலைத் தடுக்கிறது",
      recommendedChemical: "Ferrous Sulphate 0.5%",
      sprayMeasurement: "5g Ferrous Sulphate per 1 litre of water. Spray twice at 10-day interval.",
      preventiveTips: [
        "Add sulphur to reduce soil pH",
        "Use iron chelates for faster correction",
        "Incorporate green manure crops",
      ],
      preventiveTipsTamil: [
        "மண் pH குறைக்க கந்தகம் சேர்க்கவும்",
        "வேகமான சரிசெய்தலுக்கு இரும்பு சேலேட்கள் பயன்படுத்தவும்",
        "பசுந்தாள் உரப் பயிர்களை சேர்க்கவும்",
      ],
    },
  ],
  "white-insects": [
    {
      pestName: "Whitefly",
      pestNameTamil: "வெள்ளை ஈ",
      stage: "Vegetative",
      severity: "High",
      whyItOccurs: "Humid conditions and dense planting attract whiteflies. They spread viral diseases.",
      whyItOccursTamil: "ஈரப்பதம் மற்றும் அடர்த்தியான நடவு வெள்ளை ஈக்களை ஈர்க்கிறது",
      recommendedChemical: "Imidacloprid 17.8% SL",
      sprayMeasurement: "0.5ml Imidacloprid per 1 litre of water. Spray in the morning. Use 200L spray solution per acre.",
      preventiveTips: [
        "Install yellow sticky traps (10-15 per acre)",
        "Avoid excess nitrogen fertilizer",
        "Use neem oil spray (5ml/L) as preventive",
        "Maintain proper spacing between plants",
        "Remove alternate host weeds around the field",
      ],
      preventiveTipsTamil: [
        "மஞ்சள் ஒட்டும் பொறிகள் வைக்கவும் (ஏக்கருக்கு 10-15)",
        "அதிக தழை உரம் தவிர்க்கவும்",
        "வேப்பெண்ணெய் தெளிப்பு (5ml/L) தடுப்பு நடவடிக்கை",
        "செடிகளுக்கிடையே சரியான இடைவெளி",
        "வயல் சுற்றி களைகளை அகற்றவும்",
      ],
    },
  ],
  "holes-leaves": [
    {
      pestName: "Caterpillar / Leaf Eating Larvae",
      pestNameTamil: "கம்பளிப்பூச்சி / இலை தின்னும் புழு",
      stage: "Vegetative",
      severity: "High",
      whyItOccurs: "Moths lay eggs on leaf undersides. Larvae hatch and feed on leaves creating holes.",
      whyItOccursTamil: "அந்துப்பூச்சிகள் இலை அடிப்பகுதியில் முட்டையிடும்",
      recommendedChemical: "Emamectin Benzoate 5% SG",
      sprayMeasurement: "0.4g per 1 litre of water. Spray on both sides of leaves. Use 200L/acre.",
      preventiveTips: [
        "Install pheromone traps (5 per acre)",
        "Hand-pick visible caterpillars early morning",
        "Spray neem oil (3ml/L) weekly as deterrent",
        "Encourage natural predators like birds",
        "Use light traps at night to catch adult moths",
      ],
      preventiveTipsTamil: [
        "பெரோமோன் பொறிகள் வைக்கவும் (ஏக்கருக்கு 5)",
        "காலையில் புழுக்களை கைகளால் எடுக்கவும்",
        "வேப்பெண்ணெய் (3ml/L) வாரம் ஒருமுறை தெளிக்கவும்",
        "பறவைகள் போன்ற இயற்கை எதிரிகளை ஊக்குவிக்கவும்",
        "இரவில் விளக்குப் பொறிகள் பயன்படுத்தவும்",
      ],
    },
    {
      pestName: "Flea Beetle",
      pestNameTamil: "தத்துப் பூச்சி",
      stage: "Seedling",
      severity: "Medium",
      whyItOccurs: "Small beetles creating tiny round holes. Common in young seedlings.",
      whyItOccursTamil: "சிறிய வண்டுகள் சிறு வட்டமான துளைகள் உருவாக்கும்",
      recommendedChemical: "Carbaryl 50% WP",
      sprayMeasurement: "2g per litre of water. Spray on affected plants. Repeat after 10 days if needed.",
      preventiveTips: [
        "Use neem cake in soil (250kg/ha)",
        "Maintain field hygiene",
        "Use row covers for young seedlings",
      ],
      preventiveTipsTamil: [
        "மண்ணில் வேப்பம் புண்ணாக்கு (250kg/ha) சேர்க்கவும்",
        "வயல் சுகாதாரம் பேணவும்",
        "இளம் நாற்றுகளுக்கு வரிசை மூடிகள் பயன்படுத்தவும்",
      ],
    },
  ],
  "powder-leaves": [
    {
      pestName: "Powdery Mildew",
      pestNameTamil: "சாம்பல் பூஞ்சாண நோய்",
      stage: "Flowering",
      severity: "Medium",
      whyItOccurs: "Dry weather with high humidity at night favors powdery mildew growth on leaf surface.",
      whyItOccursTamil: "வறண்ட வானிலை மற்றும் இரவில் அதிக ஈரப்பதம்",
      recommendedChemical: "Sulphur WP 80%",
      sprayMeasurement: "3g Sulphur WP per 1 litre of water. Spray at 10-day interval. Avoid in hot afternoon.",
      preventiveTips: [
        "Ensure good air circulation between plants",
        "Avoid overhead irrigation",
        "Remove and destroy affected plant parts",
        "Apply potassium-rich fertilizers to boost immunity",
      ],
      preventiveTipsTamil: [
        "செடிகளுக்கிடையே நல்ல காற்றோட்டம் உறுதி செய்யவும்",
        "மேல் நீர்ப்பாசனம் தவிர்க்கவும்",
        "பாதிக்கப்பட்ட பகுதிகளை அகற்றி அழிக்கவும்",
        "நோய் எதிர்ப்பு சக்திக்கு பொட்டாஷ் உரம் இடவும்",
      ],
    },
  ],
  "spots-leaves": [
    {
      pestName: "Leaf Spot Disease",
      pestNameTamil: "இலை புள்ளி நோய்",
      stage: "Tillering",
      severity: "Medium",
      whyItOccurs: "Fungal infection spreading through water splash and wind. Favored by continuous rain.",
      whyItOccursTamil: "தொடர் மழையால் பரவும் பூஞ்சாண நோய்",
      recommendedChemical: "Mancozeb 75% WP",
      sprayMeasurement: "2.5g Mancozeb per 1 litre of water. Spray at 10-day intervals. Use 200L/acre.",
      preventiveTips: [
        "Remove and burn affected leaves immediately",
        "Avoid excess nitrogen fertilizer",
        "Maintain proper crop spacing for air flow",
        "Use disease-free certified seeds",
      ],
      preventiveTipsTamil: [
        "பாதிக்கப்பட்ட இலைகளை உடனடியாக அகற்றி எரிக்கவும்",
        "அதிக தழை உரம் தவிர்க்கவும்",
        "காற்றோட்டத்திற்கு சரியான பயிர் இடைவெளி",
        "நோயற்ற சான்று விதைகள் பயன்படுத்தவும்",
      ],
    },
    {
      pestName: "Cercospora Leaf Spot",
      pestNameTamil: "செர்கோஸ்போரா இலைப்புள்ளி",
      stage: "Vegetative",
      severity: "Low",
      whyItOccurs: "High humidity and warm temperatures promote this fungal pathogen.",
      whyItOccursTamil: "அதிக ஈரப்பதம் மற்றும் சூடான வெப்பநிலை",
      recommendedChemical: "Carbendazim 50% WP",
      sprayMeasurement: "1g per litre of water. Spray twice at 15-day intervals.",
      preventiveTips: [
        "Crop rotation with non-host crops",
        "Balanced fertilization",
        "Avoid working in wet fields to prevent spread",
      ],
      preventiveTipsTamil: [
        "பயிர் சுழற்சி செய்யவும்",
        "சமச்சீர் உரமிடல்",
        "ஈரமான வயலில் வேலை செய்வதைத் தவிர்க்கவும்",
      ],
    },
  ],
  "drying-patches": [
    {
      pestName: "Brown Plant Hopper",
      pestNameTamil: "பழுப்பு தத்துப்பூச்சி",
      stage: "Tillering",
      severity: "High",
      whyItOccurs: "Humid conditions and standing water in paddy fields attract BPH colonies at plant base.",
      whyItOccursTamil: "ஈரப்பதம் மற்றும் நெற்வயலில் தேங்கிய நீர்",
      recommendedChemical: "Imidacloprid 17.8% SL",
      sprayMeasurement: "0.5ml per litre of water. Direct spray at plant base. Use 200L/acre. Spray in evening.",
      preventiveTips: [
        "Avoid excess standing water in field",
        "Monitor leaf base daily for nymphs",
        "Use light traps at night (1 per 5 acres)",
        "Avoid excess nitrogen application",
        "Maintain alternate wetting and drying irrigation",
      ],
      preventiveTipsTamil: [
        "வயலில் அதிக தேங்கிய நீர் தவிர்க்கவும்",
        "தினமும் இலை அடிப்பகுதியை கண்காணிக்கவும்",
        "இரவில் விளக்குப் பொறிகள் பயன்படுத்தவும் (5 ஏக்கருக்கு 1)",
        "அதிக தழை உரம் தவிர்க்கவும்",
        "மாற்று ஈரமாக்கல் மற்றும் உலர்த்துதல் நீர்ப்பாசனம்",
      ],
    },
    {
      pestName: "Bacterial Wilt",
      pestNameTamil: "பாக்டீரியா வாடல்",
      stage: "Vegetative",
      severity: "High",
      whyItOccurs: "Soil-borne bacteria enters through root wounds. Spreads in warm, wet conditions.",
      whyItOccursTamil: "மண்ணில் உள்ள பாக்டீரியா வேர் காயங்கள் வழியாக நுழைகிறது",
      recommendedChemical: "Pseudomonas fluorescens (Bio-agent)",
      sprayMeasurement: "10g per litre of water as soil drench around plant base. Apply twice at 15-day interval.",
      preventiveTips: [
        "Use resistant rootstocks or varieties",
        "Practice crop rotation (3-year cycle)",
        "Avoid injuring roots during weeding",
        "Solarize soil before planting",
      ],
      preventiveTipsTamil: [
        "எதிர்ப்புத் திறன் கொண்ட ரகங்களை பயன்படுத்தவும்",
        "பயிர் சுழற்சி (3 ஆண்டு சுழற்சி)",
        "களை எடுக்கும்போது வேர்களை காயப்படுத்தாதீர்",
        "நடவுக்கு முன் மண்ணை வெயிலில் காயவிடவும்",
      ],
    },
  ],
};

// ─── Original Crop Data ──────────────────────────────────────

interface Risk {
  name: string;
  nameTamil: string;
  severity: "High" | "Medium" | "Low";
  solution: string;
}

interface Stage {
  name: string;
  nameTamil: string;
  startDay: number;
  endDay: number;
  risks: Risk[];
}

interface CropData {
  nameTamil: string;
  stages: Stage[];
}

const CROP_DATA: Record<string, CropData> = {
  Rice: {
    nameTamil: "நெல்",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 15, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Medium", solution: "Treat seeds with Carbendazim 2g/kg before sowing. Ensure proper drainage in nursery beds." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 16, endDay: 35, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Medium", solution: "Avoid excess watering. Apply Trichoderma viride at 2.5 kg/ha in nursery soil." },
      ]},
      { name: "Tillering", nameTamil: "பிள்ளை விடுதல்", startDay: 36, endDay: 60, risks: [
        { name: "Brown Plant Hopper", nameTamil: "பழுப்பு தத்துப்பூச்சி", severity: "High", solution: "Spray Imidacloprid 0.5ml/L. Avoid excess nitrogen. Ensure alternate wetting and drying." },
        { name: "Blast Disease", nameTamil: "வெடிப்பு நோய்", severity: "Medium", solution: "Apply Tricyclazole 0.6g/L as foliar spray. Remove infected plant debris." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 61, endDay: 85, risks: [
        { name: "Stem Borer", nameTamil: "தண்டு துளைப்பான்", severity: "High", solution: "Install pheromone traps (5/acre). Apply Cartap Hydrochloride 1kg/acre in standing water." },
        { name: "Leaf Spot", nameTamil: "இலை புள்ளி நோய்", severity: "Medium", solution: "Spray Mancozeb 2.5g/L at 10-day intervals. Remove and burn affected leaves." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 86, endDay: 105, risks: [
        { name: "Ear Head Bug", nameTamil: "கதிர்ப் பூச்சி", severity: "Medium", solution: "Spray Malathion 2ml/L during evening hours. Avoid spraying during pollination time." },
        { name: "False Smut", nameTamil: "பொய்ப் பூஞ்சாண நோய்", severity: "Low", solution: "Spray Propiconazole 1ml/L at boot leaf stage. Use disease-free seeds." },
      ]},
      { name: "Grain Filling", nameTamil: "தானிய நிரம்புதல்", startDay: 106, endDay: 120, risks: [
        { name: "Grain Discoloration", nameTamil: "தானிய நிறமாற்றம்", severity: "Low", solution: "Spray Carbendazim 1g/L. Harvest at right moisture (20-22%). Dry grains properly." },
      ]},
    ],
  },
  Cotton: {
    nameTamil: "பருத்தி",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 10, risks: [
        { name: "Seedling Disease", nameTamil: "நாற்று நோய்", severity: "Medium", solution: "Seed treatment with Thiram 3g/kg. Ensure well-drained soil." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 11, endDay: 30, risks: [
        { name: "Aphids", nameTamil: "அசுவினிப் பூச்சி", severity: "Medium", solution: "Spray Dimethoate 1.5ml/L. Encourage natural predators like ladybugs." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 31, endDay: 60, risks: [
        { name: "Whitefly", nameTamil: "வெள்ளை ஈ", severity: "High", solution: "Install yellow sticky traps. Spray Neem oil 5ml/L. Avoid excess nitrogen." },
        { name: "Leaf Curl Virus", nameTamil: "இலை சுருட்டு நோய்", severity: "High", solution: "Remove infected plants. Control whitefly vector. Use resistant varieties." },
      ]},
      { name: "Squaring", nameTamil: "மொட்டு பருவம்", startDay: 61, endDay: 80, risks: [
        { name: "Bollworm", nameTamil: "காய்ப்புழு", severity: "High", solution: "Install pheromone traps. Spray Spinosad 0.3ml/L. Use Bt cotton varieties." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 81, endDay: 110, risks: [
        { name: "Pink Bollworm", nameTamil: "இளஞ்சிவப்பு காய்ப்புழு", severity: "High", solution: "Destroy crop residues. Install pheromone traps (5/acre). Apply Quinalphos 2ml/L." },
        { name: "Bacterial Blight", nameTamil: "பாக்டீரியா கருகல்", severity: "Medium", solution: "Spray Streptomycin sulphate 100ppm. Use certified seeds." },
      ]},
      { name: "Boll Opening", nameTamil: "காய் வெடிப்பு", startDay: 111, endDay: 150, risks: [
        { name: "Boll Rot", nameTamil: "காய் அழுகல்", severity: "Medium", solution: "Ensure proper spacing. Spray Copper Oxychloride 3g/L. Pick bolls timely." },
      ]},
    ],
  },
  Tomato: {
    nameTamil: "தக்காளி",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 10, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Medium", solution: "Treat seeds with Trichoderma viride. Avoid waterlogging in nursery." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 11, endDay: 25, risks: [
        { name: "Leaf Miner", nameTamil: "இலை துளைப்பான்", severity: "Low", solution: "Install yellow sticky traps. Spray Neem oil 3ml/L." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 26, endDay: 45, risks: [
        { name: "Early Blight", nameTamil: "ஆரம்ப கருகல்", severity: "High", solution: "Spray Mancozeb 2.5g/L every 10 days. Remove lower infected leaves. Ensure proper spacing." },
        { name: "Whitefly", nameTamil: "வெள்ளை ஈ", severity: "Medium", solution: "Use yellow sticky traps. Spray Imidacloprid 0.3ml/L. Mulching helps reduce infestation." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 46, endDay: 60, risks: [
        { name: "Tomato Leaf Curl Virus", nameTamil: "இலை சுருட்டு நோய்", severity: "High", solution: "Remove infected plants immediately. Control whitefly. Use resistant hybrids." },
      ]},
      { name: "Fruiting", nameTamil: "காய்ப்பு பருவம்", startDay: 61, endDay: 80, risks: [
        { name: "Fruit Borer", nameTamil: "காய்ப்புழு", severity: "High", solution: "Install pheromone traps. Spray Spinosad 0.3ml/L. Hand-pick infected fruits." },
        { name: "Late Blight", nameTamil: "பிந்தைய கருகல்", severity: "Medium", solution: "Spray Metalaxyl + Mancozeb 2g/L. Avoid overhead irrigation." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 81, endDay: 100, risks: [
        { name: "Fruit Rot", nameTamil: "கனி அழுகல்", severity: "Low", solution: "Harvest at right maturity. Avoid mechanical damage. Store in cool ventilated area." },
      ]},
    ],
  },
  Chilli: {
    nameTamil: "மிளகாய்",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 12, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Medium", solution: "Treat nursery soil with Trichoderma. Avoid excess moisture." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 13, endDay: 30, risks: [
        { name: "Thrips", nameTamil: "இலைப்பேன்", severity: "Medium", solution: "Spray Fipronil 1.5ml/L. Use blue sticky traps. Intercrop with coriander." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 31, endDay: 55, risks: [
        { name: "Leaf Curl Complex", nameTamil: "இலை சுருட்டு", severity: "High", solution: "Control thrips and mites (vectors). Spray Acephate 1.5g/L. Remove affected plants." },
        { name: "Aphids", nameTamil: "அசுவினிப் பூச்சி", severity: "Medium", solution: "Spray Dimethoate 2ml/L. Encourage ladybird beetles as bio-control." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 56, endDay: 75, risks: [
        { name: "Flower Drop", nameTamil: "பூ உதிர்வு", severity: "Medium", solution: "Spray NAA 10ppm. Maintain proper irrigation. Avoid water stress." },
        { name: "Powdery Mildew", nameTamil: "சாம்பல் பூஞ்சாண நோய்", severity: "Medium", solution: "Spray Sulphur WP 3g/L. Ensure good air circulation between plants." },
      ]},
      { name: "Fruiting", nameTamil: "காய்ப்பு பருவம்", startDay: 76, endDay: 100, risks: [
        { name: "Fruit Rot", nameTamil: "காய் அழுகல்", severity: "High", solution: "Spray Copper Oxychloride 3g/L. Remove infected fruits. Ensure drainage." },
        { name: "Fruit Borer", nameTamil: "காய்ப்புழு", severity: "High", solution: "Spray Emamectin Benzoate 0.4g/L. Install pheromone traps." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 101, endDay: 130, risks: [
        { name: "Die Back", nameTamil: "நுனிக் கருகல்", severity: "Medium", solution: "Spray Mancozeb 2.5g/L + Carbendazim 1g/L. Prune dried branches." },
      ]},
    ],
  },
  Brinjal: {
    nameTamil: "கத்தரி",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 10, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Low", solution: "Ensure well-drained nursery. Seed treatment with Captan 3g/kg." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 11, endDay: 25, risks: [
        { name: "Flea Beetle", nameTamil: "தத்துப் பூச்சி", severity: "Medium", solution: "Spray Carbaryl 2g/L. Use neem cake in soil at 250kg/ha." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 26, endDay: 50, risks: [
        { name: "Shoot Borer", nameTamil: "குருத்துத் துளைப்பான்", severity: "High", solution: "Remove wilted shoots weekly. Spray Spinosad 0.3ml/L. Install pheromone traps." },
        { name: "Bacterial Wilt", nameTamil: "பாக்டீரியா வாடல்", severity: "High", solution: "Use resistant rootstocks. Apply Pseudomonas fluorescens 10g/L as soil drench." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 51, endDay: 70, risks: [
        { name: "Shoot & Fruit Borer", nameTamil: "குருத்து & காய்ப்புழு", severity: "High", solution: "Clip and destroy affected shoots. Spray Emamectin Benzoate 0.4g/L at 15-day intervals." },
      ]},
      { name: "Fruiting", nameTamil: "காய்ப்பு பருவம்", startDay: 71, endDay: 100, risks: [
        { name: "Fruit Borer", nameTamil: "காய்ப்புழு", severity: "High", solution: "Spray Neem oil 5ml/L alternated with Spinosad. Harvest mature fruits promptly." },
        { name: "Little Leaf Disease", nameTamil: "சிறு இலை நோய்", severity: "Medium", solution: "Remove and destroy infected plants. Control leafhoppers (vector) with Imidacloprid." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 101, endDay: 130, risks: [
        { name: "Phomopsis Blight", nameTamil: "பொமாப்ஸிஸ் கருகல்", severity: "Medium", solution: "Spray Carbendazim 1g/L. Avoid harvesting in wet conditions." },
      ]},
    ],
  },
  "Finger Millet": {
    nameTamil: "கேழ்வரகு (ராகி)",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 10, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Treat seeds with Thiram 3g/kg. Avoid waterlogging." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 11, endDay: 25, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Medium", solution: "Use Trichoderma viride at 2.5 kg/ha. Ensure drainage." },
      ]},
      { name: "Tillering", nameTamil: "பிள்ளை விடுதல்", startDay: 26, endDay: 50, risks: [
        { name: "Aphids", nameTamil: "அசுவினிப் பூச்சி", severity: "Medium", solution: "Spray Dimethoate 1.5ml/L or Neem oil 5ml/L." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 51, endDay: 70, risks: [
        { name: "Blast Disease", nameTamil: "வெடிப்பு நோய்", severity: "High", solution: "Spray Tricyclazole 0.6g/L. Remove infected plant debris." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 71, endDay: 85, risks: [
        { name: "Ear Head Blast", nameTamil: "கதிர் வெடிப்பு", severity: "High", solution: "Spray Carbendazim 1g/L at ear emergence. Use resistant varieties." },
      ]},
      { name: "Grain Filling", nameTamil: "தானிய நிரம்புதல்", startDay: 86, endDay: 100, risks: [
        { name: "Grain Smut", nameTamil: "தானிய கரிப்பூட்டை", severity: "Low", solution: "Seed treatment with Carbendazim. Harvest at right moisture." },
      ]},
    ],
  },
  "Pearl Millet": {
    nameTamil: "கம்பு",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 10, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Treat seeds with Metalaxyl. Ensure proper drainage." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 11, endDay: 25, risks: [
        { name: "Downy Mildew", nameTamil: "பஞ்சுப் பூஞ்சாண நோய்", severity: "High", solution: "Seed treatment with Metalaxyl 35SD at 6g/kg. Use resistant hybrids." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 26, endDay: 50, risks: [
        { name: "Stem Borer", nameTamil: "தண்டு துளைப்பான்", severity: "Medium", solution: "Apply Carbofuran granules in leaf whorl. Remove dead hearts." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 51, endDay: 70, risks: [
        { name: "Ergot", nameTamil: "எர்காட் நோய்", severity: "Medium", solution: "Spray Mancozeb 2.5g/L at flowering. Avoid late sowing." },
      ]},
      { name: "Grain Filling", nameTamil: "தானிய நிரம்புதல்", startDay: 71, endDay: 90, risks: [
        { name: "Grain Smut", nameTamil: "தானிய கரிப்பூட்டை", severity: "Low", solution: "Remove and burn smutted ears. Seed treatment with Carbendazim." },
      ]},
    ],
  },
  "Foxtail Millet": {
    nameTamil: "தினை",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 10, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Ensure well-drained soil. Treat seeds with Thiram." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 11, endDay: 25, risks: [
        { name: "Shoot Fly", nameTamil: "குருத்து ஈ", severity: "Medium", solution: "Early sowing. Seed treatment with Imidacloprid." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 26, endDay: 50, risks: [
        { name: "Rust", nameTamil: "துரு நோய்", severity: "Medium", solution: "Spray Mancozeb 2.5g/L at 10-day intervals." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 51, endDay: 70, risks: [
        { name: "Head Smut", nameTamil: "கதிர் கரிப்பூட்டை", severity: "Low", solution: "Seed treatment with Carbendazim 2g/kg." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 71, endDay: 85, risks: [
        { name: "Grain Mold", nameTamil: "தானிய பூஞ்சாண நோய்", severity: "Low", solution: "Timely harvest. Dry grains properly." },
      ]},
    ],
  },
  "Kodo Millet": {
    nameTamil: "வரகு",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 12, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Avoid waterlogging. Seed treatment with Thiram." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 13, endDay: 30, risks: [
        { name: "Shoot Fly", nameTamil: "குருத்து ஈ", severity: "Medium", solution: "Timely sowing. Apply Carbofuran granules." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 31, endDay: 60, risks: [
        { name: "Leaf Spot", nameTamil: "இலை புள்ளி நோய்", severity: "Medium", solution: "Spray Mancozeb 2.5g/L. Remove infected leaves." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 61, endDay: 85, risks: [
        { name: "Head Smut", nameTamil: "கதிர் கரிப்பூட்டை", severity: "Low", solution: "Seed treatment with Carbendazim." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 86, endDay: 110, risks: [
        { name: "Grain Discoloration", nameTamil: "தானிய நிறமாற்றம்", severity: "Low", solution: "Harvest at proper maturity. Sun-dry grains." },
      ]},
    ],
  },
  Sorghum: {
    nameTamil: "சோளம்",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 10, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Treat seeds with Thiram 3g/kg." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 11, endDay: 25, risks: [
        { name: "Shoot Fly", nameTamil: "குருத்து ஈ", severity: "High", solution: "Early sowing. Seed treatment with Imidacloprid. Remove dead hearts." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 26, endDay: 55, risks: [
        { name: "Stem Borer", nameTamil: "தண்டு துளைப்பான்", severity: "High", solution: "Apply Carbofuran granules in leaf whorl. Install light traps." },
        { name: "Leaf Spot", nameTamil: "இலை புள்ளி நோய்", severity: "Medium", solution: "Spray Mancozeb 2.5g/L at 10-day intervals." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 56, endDay: 75, risks: [
        { name: "Grain Mold", nameTamil: "தானிய பூஞ்சாண நோய்", severity: "Medium", solution: "Use mold-resistant varieties. Timely harvest." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 76, endDay: 100, risks: [
        { name: "Grain Discoloration", nameTamil: "தானிய நிறமாற்றம்", severity: "Low", solution: "Harvest at right moisture. Dry properly." },
      ]},
    ],
  },
  Sesame: {
    nameTamil: "எள்",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 10, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Avoid waterlogging. Use treated seeds." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 11, endDay: 25, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Medium", solution: "Ensure drainage. Apply Trichoderma viride." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 26, endDay: 50, risks: [
        { name: "Leaf Webber", nameTamil: "இலை சுருட்டுப்புழு", severity: "Medium", solution: "Spray Quinalphos 2ml/L. Hand-pick webs." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 51, endDay: 70, risks: [
        { name: "Phyllody Disease", nameTamil: "பில்லோடி நோய்", severity: "High", solution: "Remove infected plants. Control leafhopper vector with Imidacloprid." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 71, endDay: 85, risks: [
        { name: "Capsule Borer", nameTamil: "காய்ப்புழு", severity: "Medium", solution: "Spray Neem oil 5ml/L. Timely harvest." },
      ]},
    ],
  },
  Sunflower: {
    nameTamil: "சூரியகாந்தி",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 10, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Use certified seeds. Ensure proper drainage." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 11, endDay: 25, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Medium", solution: "Apply Trichoderma. Avoid excess moisture." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 26, endDay: 50, risks: [
        { name: "Leaf Spot", nameTamil: "இலை புள்ளி நோய்", severity: "Medium", solution: "Spray Mancozeb 2.5g/L. Remove infected leaves." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 51, endDay: 70, risks: [
        { name: "Head Rot", nameTamil: "தலை அழுகல்", severity: "High", solution: "Spray Carbendazim 1g/L. Ensure proper spacing." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 71, endDay: 90, risks: [
        { name: "Bird Damage", nameTamil: "பறவை சேதம்", severity: "Medium", solution: "Use bird nets or reflective tapes." },
      ]},
    ],
  },
  Safflower: {
    nameTamil: "குசும்பா",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 12, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Well-drained soil. Seed treatment with Thiram." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 13, endDay: 30, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Low", solution: "Avoid waterlogging. Apply Trichoderma." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 31, endDay: 60, risks: [
        { name: "Aphids", nameTamil: "அசுவினிப் பூச்சி", severity: "High", solution: "Spray Dimethoate 1.5ml/L. Use neem oil as preventive." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 61, endDay: 90, risks: [
        { name: "Safflower Fly", nameTamil: "குசும்பா ஈ", severity: "High", solution: "Spray Endosulfan 2ml/L during bud stage. Early sowing reduces damage." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 91, endDay: 120, risks: [
        { name: "Alternaria Blight", nameTamil: "ஆல்டர்னேரியா கருகல்", severity: "Medium", solution: "Spray Mancozeb 2.5g/L. Harvest at maturity." },
      ]},
    ],
  },
  Groundnut: {
    nameTamil: "நிலக்கடலை",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 10, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Medium", solution: "Treat seeds with Trichoderma viride + Carbendazim." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 11, endDay: 25, risks: [
        { name: "Leaf Miner", nameTamil: "இலை துளைப்பான்", severity: "Low", solution: "Spray Neem oil 3ml/L. Install yellow sticky traps." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 26, endDay: 50, risks: [
        { name: "Tikka Disease", nameTamil: "டிக்கா நோய்", severity: "High", solution: "Spray Mancozeb 2.5g/L at 10-day intervals. Crop rotation." },
        { name: "Thrips", nameTamil: "இலைப்பேன்", severity: "Medium", solution: "Spray Fipronil 1.5ml/L. Use blue sticky traps." },
      ]},
      { name: "Pegging", nameTamil: "ஊசி இறக்கம்", startDay: 51, endDay: 70, risks: [
        { name: "Collar Rot", nameTamil: "காலர் அழுகல்", severity: "Medium", solution: "Apply Trichoderma in soil. Avoid excess irrigation." },
      ]},
      { name: "Pod Formation", nameTamil: "காய் உருவாதல்", startDay: 71, endDay: 100, risks: [
        { name: "Pod Borer", nameTamil: "காய்ப்புழு", severity: "Medium", solution: "Spray Chlorpyriphos 2ml/L in soil. Timely harvest." },
      ]},
    ],
  },
  "Horse Gram": {
    nameTamil: "கொள்ளு",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 10, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Ensure drainage. Use treated seeds." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 11, endDay: 25, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Low", solution: "Avoid excess moisture." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 26, endDay: 55, risks: [
        { name: "Leaf Spot", nameTamil: "இலை புள்ளி நோய்", severity: "Medium", solution: "Spray Mancozeb 2.5g/L. Remove infected leaves." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 56, endDay: 75, risks: [
        { name: "Pod Borer", nameTamil: "காய்ப்புழு", severity: "Medium", solution: "Spray Neem oil 5ml/L or Spinosad 0.3ml/L." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 76, endDay: 100, risks: [
        { name: "Storage Pest", nameTamil: "சேமிப்பு பூச்சி", severity: "Low", solution: "Dry properly. Store in airtight containers." },
      ]},
    ],
  },
  "Green Gram": {
    nameTamil: "பாசிப்பயிறு",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 8, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Use certified seeds. Avoid waterlogging." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 9, endDay: 20, risks: [
        { name: "Stem Fly", nameTamil: "தண்டு ஈ", severity: "Medium", solution: "Seed treatment with Imidacloprid. Early sowing." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 21, endDay: 35, risks: [
        { name: "Yellow Mosaic Virus", nameTamil: "மஞ்சள் தேமல் நோய்", severity: "High", solution: "Use resistant varieties. Control whitefly with Imidacloprid." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 36, endDay: 50, risks: [
        { name: "Powdery Mildew", nameTamil: "சாம்பல் பூஞ்சாண நோய்", severity: "Medium", solution: "Spray Sulphur WP 3g/L." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 51, endDay: 65, risks: [
        { name: "Pod Borer", nameTamil: "காய்ப்புழு", severity: "Medium", solution: "Spray Spinosad 0.3ml/L. Timely harvest." },
      ]},
    ],
  },
  "Black Gram": {
    nameTamil: "உளுந்து",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 10, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Use treated seeds. Proper drainage." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 11, endDay: 25, risks: [
        { name: "Stem Fly", nameTamil: "தண்டு ஈ", severity: "Medium", solution: "Seed treatment with Imidacloprid." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 26, endDay: 50, risks: [
        { name: "Yellow Mosaic Virus", nameTamil: "மஞ்சள் தேமல் நோய்", severity: "High", solution: "Remove infected plants. Control whitefly vector." },
        { name: "Leaf Spot", nameTamil: "இலை புள்ளி நோய்", severity: "Medium", solution: "Spray Mancozeb 2.5g/L." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 51, endDay: 70, risks: [
        { name: "Powdery Mildew", nameTamil: "சாம்பல் பூஞ்சாண நோய்", severity: "Medium", solution: "Spray Sulphur WP 3g/L." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 71, endDay: 90, risks: [
        { name: "Pod Borer", nameTamil: "காய்ப்புழு", severity: "Medium", solution: "Spray Spinosad. Harvest at maturity." },
      ]},
    ],
  },
  "Pigeon Pea": {
    nameTamil: "துவரை",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 12, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Seed treatment with Thiram. Good drainage." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 13, endDay: 30, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Low", solution: "Avoid excess moisture. Apply Trichoderma." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 31, endDay: 70, risks: [
        { name: "Leaf Webber", nameTamil: "இலை சுருட்டுப்புழு", severity: "Medium", solution: "Spray Quinalphos 2ml/L." },
        { name: "Wilt Disease", nameTamil: "வாடல் நோய்", severity: "High", solution: "Use resistant varieties. Crop rotation. Apply Trichoderma." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 71, endDay: 100, risks: [
        { name: "Pod Borer", nameTamil: "காய்ப்புழு", severity: "High", solution: "Spray Spinosad 0.3ml/L. Install pheromone traps." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 101, endDay: 135, risks: [
        { name: "Pod Fly", nameTamil: "காய் ஈ", severity: "Medium", solution: "Spray Monocrotophos 1.6ml/L at 50% pod stage." },
      ]},
    ],
  },
  Amaranth: {
    nameTamil: "அமராந்த்",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 8, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Shallow sowing. Avoid waterlogging." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 9, endDay: 25, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Low", solution: "Ensure drainage." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 26, endDay: 50, risks: [
        { name: "Leaf Webber", nameTamil: "இலை சுருட்டுப்புழு", severity: "Medium", solution: "Spray Neem oil 5ml/L. Hand-pick webs." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 51, endDay: 70, risks: [
        { name: "Aphids", nameTamil: "அசுவினிப் பூச்சி", severity: "Medium", solution: "Spray Dimethoate 1.5ml/L." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 71, endDay: 90, risks: [
        { name: "Grain Mold", nameTamil: "தானிய பூஞ்சாண நோய்", severity: "Low", solution: "Timely harvest. Dry grains." },
      ]},
    ],
  },
  Buckwheat: {
    nameTamil: "கோதுமை மாற்று",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 8, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Ensure proper drainage." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 9, endDay: 20, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Low", solution: "Avoid waterlogging." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 21, endDay: 40, risks: [
        { name: "Aphids", nameTamil: "அசுவினிப் பூச்சி", severity: "Low", solution: "Spray Neem oil 5ml/L if severe." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 41, endDay: 60, risks: [
        { name: "Flower Drop", nameTamil: "பூ உதிர்வு", severity: "Medium", solution: "Maintain proper irrigation." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 61, endDay: 80, risks: [
        { name: "Grain Discoloration", nameTamil: "தானிய நிறமாற்றம்", severity: "Low", solution: "Timely harvest. Dry properly." },
      ]},
    ],
  },
  Moringa: {
    nameTamil: "முருங்கை",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 15, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Well-drained soil. Pre-soak seeds." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 16, endDay: 45, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Low", solution: "Avoid waterlogging." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 46, endDay: 120, risks: [
        { name: "Leaf Caterpillar", nameTamil: "இலைப் புழு", severity: "Medium", solution: "Spray Neem oil 5ml/L. Hand-pick caterpillars." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 121, endDay: 200, risks: [
        { name: "Pod Fly", nameTamil: "காய் ஈ", severity: "Medium", solution: "Spray Dimethoate 2ml/L at pod formation." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 201, endDay: 270, risks: [
        { name: "Bud Worm", nameTamil: "மொட்டுப் புழு", severity: "Low", solution: "Spray Neem oil. Timely picking." },
      ]},
    ],
  },
  Okra: {
    nameTamil: "வெண்டை",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 7, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Soak seeds in water. Avoid waterlogging." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 8, endDay: 15, risks: [
        { name: "Flea Beetle", nameTamil: "தத்துப் பூச்சி", severity: "Medium", solution: "Spray Carbaryl 2g/L." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 16, endDay: 28, risks: [
        { name: "Whitefly", nameTamil: "வெள்ளை ஈ", severity: "High", solution: "Install yellow sticky traps. Spray Imidacloprid 0.3ml/L." },
        { name: "Yellow Vein Mosaic", nameTamil: "மஞ்சள் நரம்பு நோய்", severity: "High", solution: "Use resistant varieties. Control whitefly vector." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 29, endDay: 35, risks: [
        { name: "Fruit Borer", nameTamil: "காய்ப்புழு", severity: "High", solution: "Spray Spinosad 0.3ml/L. Install pheromone traps." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 36, endDay: 45, risks: [
        { name: "Powdery Mildew", nameTamil: "சாம்பல் பூஞ்சாண நோய்", severity: "Medium", solution: "Spray Sulphur WP 3g/L." },
      ]},
    ],
  },
  "Cluster Bean": {
    nameTamil: "கொத்தவரை",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 8, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Use treated seeds. Avoid waterlogging." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 9, endDay: 20, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Low", solution: "Ensure drainage." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 21, endDay: 38, risks: [
        { name: "Leaf Spot", nameTamil: "இலை புள்ளி நோய்", severity: "Medium", solution: "Spray Mancozeb 2.5g/L." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 39, endDay: 50, risks: [
        { name: "Whitefly", nameTamil: "வெள்ளை ஈ", severity: "Medium", solution: "Install yellow sticky traps. Spray Neem oil 5ml/L." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 51, endDay: 65, risks: [
        { name: "Pod Borer", nameTamil: "காய்ப்புழு", severity: "Medium", solution: "Spray Spinosad 0.3ml/L." },
      ]},
    ],
  },
  "Heritage Rice": {
    nameTamil: "பாரம்பரிய நெல்",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 15, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Medium", solution: "Treat seeds with Carbendazim 2g/kg." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 16, endDay: 35, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Medium", solution: "Apply Trichoderma. Proper drainage." },
      ]},
      { name: "Tillering", nameTamil: "பிள்ளை விடுதல்", startDay: 36, endDay: 60, risks: [
        { name: "Brown Plant Hopper", nameTamil: "பழுப்பு தத்துப்பூச்சி", severity: "High", solution: "Spray Imidacloprid 0.5ml/L. Alternate wetting and drying." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 61, endDay: 85, risks: [
        { name: "Stem Borer", nameTamil: "தண்டு துளைப்பான்", severity: "High", solution: "Install pheromone traps. Apply Cartap Hydrochloride." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 86, endDay: 110, risks: [
        { name: "Blast Disease", nameTamil: "வெடிப்பு நோய்", severity: "Medium", solution: "Spray Tricyclazole 0.6g/L." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 111, endDay: 130, risks: [
        { name: "Grain Discoloration", nameTamil: "தானிய நிறமாற்றம்", severity: "Low", solution: "Harvest at right moisture. Dry properly." },
      ]},
    ],
  },
  "Kharchia Wheat": {
    nameTamil: "கார்ச்சியா கோதுமை",
    stages: [
      { name: "Germination", nameTamil: "முளைப்பு", startDay: 0, endDay: 12, risks: [
        { name: "Seed Rot", nameTamil: "விதை அழுகல்", severity: "Low", solution: "Treat seeds with Thiram 3g/kg." },
      ]},
      { name: "Seedling", nameTamil: "நாற்று", startDay: 13, endDay: 25, risks: [
        { name: "Damping Off", nameTamil: "நாற்று கருகல்", severity: "Low", solution: "Ensure drainage." },
      ]},
      { name: "Tillering", nameTamil: "பிள்ளை விடுதல்", startDay: 26, endDay: 50, risks: [
        { name: "Aphids", nameTamil: "அசுவினிப் பூச்சி", severity: "Medium", solution: "Spray Dimethoate 1.5ml/L." },
      ]},
      { name: "Vegetative", nameTamil: "வளர்ச்சி", startDay: 51, endDay: 75, risks: [
        { name: "Rust", nameTamil: "துரு நோய்", severity: "High", solution: "Spray Propiconazole 1ml/L. Use resistant varieties." },
      ]},
      { name: "Flowering", nameTamil: "பூக்கும் பருவம்", startDay: 76, endDay: 95, risks: [
        { name: "Karnal Bunt", nameTamil: "கர்னால் கரிப்பூட்டை", severity: "Medium", solution: "Spray Propiconazole. Use certified seeds." },
      ]},
      { name: "Harvest", nameTamil: "அறுவடை", startDay: 96, endDay: 115, risks: [
        { name: "Grain Discoloration", nameTamil: "தானிய நிறமாற்றம்", severity: "Low", solution: "Timely harvest at 12-14% moisture." },
      ]},
    ],
  },
};

const SEVERITY_CONFIG = {
  High: { color: "bg-destructive text-destructive-foreground", icon: ShieldAlert, border: "border-destructive/30", bg: "bg-destructive/5" },
  Medium: { color: "bg-secondary text-secondary-foreground", icon: AlertTriangle, border: "border-secondary/30", bg: "bg-secondary/5" },
  Low: { color: "bg-accent text-accent-foreground", icon: Info, border: "border-accent/30", bg: "bg-accent/5" },
};

const SEVERITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 };

// ─── Chemical Dosage Data ────────────────────────────────────

interface ChemicalDosage {
  dosage_per_ha_ml: number;
  water_per_ha_litre: number;
  interval_days: number;
  max_spray: number;
}

const CHEMICAL_DATA: Record<string, ChemicalDosage> = {
  "Brown Plant Hopper": { dosage_per_ha_ml: 100, water_per_ha_litre: 500, interval_days: 10, max_spray: 3 },
  "Whitefly": { dosage_per_ha_ml: 125, water_per_ha_litre: 500, interval_days: 12, max_spray: 3 },
  "Caterpillar / Leaf Eating Larvae": { dosage_per_ha_ml: 200, water_per_ha_litre: 500, interval_days: 14, max_spray: 2 },
  "Powdery Mildew": { dosage_per_ha_ml: 1500, water_per_ha_litre: 500, interval_days: 10, max_spray: 3 },
  "Leaf Spot Disease": { dosage_per_ha_ml: 1250, water_per_ha_litre: 500, interval_days: 10, max_spray: 3 },
  "Cercospora Leaf Spot": { dosage_per_ha_ml: 500, water_per_ha_litre: 500, interval_days: 15, max_spray: 2 },
  "Nitrogen Deficiency / Nutrient Stress": { dosage_per_ha_ml: 10000, water_per_ha_litre: 500, interval_days: 7, max_spray: 2 },
  "Iron Chlorosis": { dosage_per_ha_ml: 2500, water_per_ha_litre: 500, interval_days: 10, max_spray: 2 },
  "Bacterial Wilt": { dosage_per_ha_ml: 5000, water_per_ha_litre: 500, interval_days: 15, max_spray: 2 },
  "Flea Beetle": { dosage_per_ha_ml: 1000, water_per_ha_litre: 500, interval_days: 10, max_spray: 3 },
  "Blast Disease": { dosage_per_ha_ml: 300, water_per_ha_litre: 500, interval_days: 10, max_spray: 3 },
  "Stem Borer": { dosage_per_ha_ml: 1000, water_per_ha_litre: 500, interval_days: 14, max_spray: 2 },
  "Seed Rot": { dosage_per_ha_ml: 1000, water_per_ha_litre: 500, interval_days: 0, max_spray: 1 },
  "Damping Off": { dosage_per_ha_ml: 1250, water_per_ha_litre: 500, interval_days: 0, max_spray: 1 },
  "Ear Head Bug": { dosage_per_ha_ml: 1000, water_per_ha_litre: 500, interval_days: 10, max_spray: 2 },
  "Bollworm": { dosage_per_ha_ml: 150, water_per_ha_litre: 500, interval_days: 14, max_spray: 2 },
  "Pink Bollworm": { dosage_per_ha_ml: 1000, water_per_ha_litre: 500, interval_days: 15, max_spray: 2 },
  "Aphids": { dosage_per_ha_ml: 750, water_per_ha_litre: 500, interval_days: 10, max_spray: 3 },
  "Thrips": { dosage_per_ha_ml: 750, water_per_ha_litre: 500, interval_days: 10, max_spray: 3 },
  "Fruit Borer": { dosage_per_ha_ml: 200, water_per_ha_litre: 500, interval_days: 15, max_spray: 2 },
  "Shoot Borer": { dosage_per_ha_ml: 150, water_per_ha_litre: 500, interval_days: 15, max_spray: 2 },
  "Shoot & Fruit Borer": { dosage_per_ha_ml: 200, water_per_ha_litre: 500, interval_days: 15, max_spray: 2 },
  "Early Blight": { dosage_per_ha_ml: 1250, water_per_ha_litre: 500, interval_days: 10, max_spray: 3 },
  "Late Blight": { dosage_per_ha_ml: 1000, water_per_ha_litre: 500, interval_days: 10, max_spray: 3 },
  "Leaf Curl Complex": { dosage_per_ha_ml: 750, water_per_ha_litre: 500, interval_days: 10, max_spray: 3 },
  "Leaf Curl Virus": { dosage_per_ha_ml: 750, water_per_ha_litre: 500, interval_days: 10, max_spray: 3 },
  "Tomato Leaf Curl Virus": { dosage_per_ha_ml: 750, water_per_ha_litre: 500, interval_days: 10, max_spray: 3 },
};

const LAND_CONVERSIONS: Record<string, number> = {
  Hectare: 1,
  Acre: 0.4047,
  Cent: 0.004047,
  "Sq.ft": 1 / 107639,
};

const SEVERITY_MULTIPLIER: Record<string, number> = {
  Low: 0.75,
  Medium: 1.0,
  High: 1.25,
};

interface SprayCalcInput {
  pestName: string;
  chemical: string;
  crop: string;
  landArea: string;
  landUnit: string;
  tankSize: string;
  infectionLevel: string;
}

interface SprayCalcResult {
  tankCount: number;
  chemicalPerTank: number;
  totalWater: number;
  totalChemical: number;
  intervalDays: number;
  maxSpray: number;
  highDosageWarning: boolean;
  resistanceWarning: boolean;
}

// ─── Component ───────────────────────────────────────────────

const CropProtectionTimeline = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [sowingDate, setSowingDate] = useState<Date>();
  const [submitted, setSubmitted] = useState(false);
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});
  const [completedStages, setCompletedStages] = useState<string[]>([]);

  // Diagnosis panel state
  const [diagnosingRisk, setDiagnosingRisk] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[] | null>(null);
  const [showSpray, setShowSpray] = useState<Record<string, boolean>>({});
  const [showTips, setShowTips] = useState<Record<string, boolean>>({});

  // Spray calculator state
  const [sprayCalc, setSprayCalc] = useState<SprayCalcInput | null>(null);
  const [sprayResult, setSprayResult] = useState<SprayCalcResult | null>(null);

  // Load completed stages from localStorage
  useEffect(() => {
    if (selectedCrop && submitted) {
      const saved = localStorage.getItem(`cropProtectionCompleted_${selectedCrop}`);
      setCompletedStages(saved ? JSON.parse(saved) : []);
    }
  }, [selectedCrop, submitted]);

  const saveCompletedStages = (stages: string[]) => {
    setCompletedStages(stages);
    localStorage.setItem(`cropProtectionCompleted_${selectedCrop}`, JSON.stringify(stages));
  };

  const currentDay = useMemo(() => {
    if (!sowingDate) return 0;
    return Math.max(0, differenceInDays(new Date(), sowingDate));
  }, [sowingDate]);

  const cropData = selectedCrop ? CROP_DATA[selectedCrop] : null;

  // Determine the active stage: first non-completed stage, or the day-based stage
  const activeStageIndex = useMemo(() => {
    if (!cropData) return -1;
    const firstIncomplete = cropData.stages.findIndex(s => !completedStages.includes(s.name));
    if (firstIncomplete === -1) return cropData.stages.length; // all done
    return firstIncomplete;
  }, [cropData, completedStages]);

  const currentStage = useMemo(() => {
    if (!cropData || activeStageIndex < 0 || activeStageIndex >= cropData.stages.length) return null;
    return cropData.stages[activeStageIndex];
  }, [cropData, activeStageIndex]);

  const totalDays = cropData ? cropData.stages[cropData.stages.length - 1].endDay : 0;
  const allStagesCompleted = cropData ? activeStageIndex >= cropData.stages.length : false;

  const handleCompleteStage = () => {
    if (!currentStage) return;
    const updated = [...completedStages, currentStage.name];
    saveCompletedStages(updated);
  };

  const handleSubmit = () => {
    if (selectedCrop && sowingDate) setSubmitted(true);
  };

  const toggleSolution = (riskName: string) => {
    // Open diagnosis panel instead of simple toggle
    setDiagnosingRisk(riskName);
    setSelectedSymptoms([]);
    setDiagnosisResults(null);
    setShowSpray({});
    setShowTips({});
  };

  const handleReset = () => {
    setCompletedStages([]);
    setSubmitted(false);
    setSelectedCrop("");
    setSowingDate(undefined);
    setShowSolutions({});
    closeDiagnosis();
  };

  const closeDiagnosis = () => {
    setDiagnosingRisk(null);
    setSelectedSymptoms([]);
    setDiagnosisResults(null);
    setShowSpray({});
    setShowTips({});
    setSprayCalc(null);
    setSprayResult(null);
  };

  const openSprayCalculator = (pestName: string, chemical: string) => {
    setSprayCalc({
      pestName,
      chemical,
      crop: selectedCrop,
      landArea: "",
      landUnit: "Acre",
      tankSize: "15",
      infectionLevel: "Medium",
    });
    setSprayResult(null);
  };

  const calculateSpray = useCallback(() => {
    if (!sprayCalc) return;
    const area = parseFloat(sprayCalc.landArea);
    const tank = parseFloat(sprayCalc.tankSize);
    if (isNaN(area) || area <= 0 || isNaN(tank) || tank <= 0) return;

    const chemData = CHEMICAL_DATA[sprayCalc.pestName];
    if (!chemData) return;

    const hectare = area * (LAND_CONVERSIONS[sprayCalc.landUnit] || 0.4047);
    const severityMult = SEVERITY_MULTIPLIER[sprayCalc.infectionLevel] || 1.0;
    const finalDosagePerHa = chemData.dosage_per_ha_ml * severityMult;

    const totalChemical = Math.round(hectare * finalDosagePerHa);
    const totalWater = Math.round(hectare * chemData.water_per_ha_litre);
    const chemicalPerTank = Math.round((finalDosagePerHa / chemData.water_per_ha_litre) * tank);
    const tankCount = Math.ceil(totalWater / tank);

    setSprayResult({
      tankCount,
      chemicalPerTank,
      totalWater,
      totalChemical,
      intervalDays: chemData.interval_days,
      maxSpray: chemData.max_spray,
      highDosageWarning: chemicalPerTank > 10,
      resistanceWarning: chemData.max_spray > 1,
    });
  }, [sprayCalc, selectedCrop]);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId) ? prev.filter(s => s !== symptomId) : [...prev, symptomId]
    );
  };

  const runDiagnosis = () => {
    const results: DiagnosisResult[] = [];
    const seen = new Set<string>();
    for (const symptomId of selectedSymptoms) {
      const matches = SYMPTOM_DIAGNOSIS[symptomId] || [];
      for (const m of matches) {
        if (!seen.has(m.pestName)) {
          seen.add(m.pestName);
          results.push(m);
        }
      }
    }
    results.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
    setDiagnosisResults(results);
  };

  // ─── Diagnosis Panel ────────────────────────────────────

  const renderDiagnosisPanel = () => {
    if (!diagnosingRisk) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-background w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-bold text-foreground text-base">Diagnose Problem</h3>
                <p className="text-xs text-muted-foreground">பிரச்சனையை கண்டறியுங்கள்</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={closeDiagnosis}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4 space-y-5">
            {/* Step 1: Symptom Selection */}
            {!diagnosisResults && (
              <>
                <div>
                  <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    What do you see? / என்ன தெரிகிறது?
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">Select all symptoms you observe in your field</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SYMPTOM_OPTIONS.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom.id);
                    return (
                      <button
                        key={symptom.id}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border hover:border-primary/40 hover:bg-muted"
                        )}
                      >
                        <span className="text-2xl shrink-0">{symptom.icon}</span>
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-foreground">{symptom.label}</div>
                          <div className="text-xs text-muted-foreground">{symptom.labelTamil}</div>
                        </div>
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-primary shrink-0 ml-auto" />}
                      </button>
                    );
                  })}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={selectedSymptoms.length === 0}
                  onClick={runDiagnosis}
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Find Problem ({selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? "s" : ""})
                </Button>
              </>
            )}

            {/* Step 2: Diagnosis Results */}
            {diagnosisResults && (
              <>
                <Button variant="outline" size="sm" onClick={() => setDiagnosisResults(null)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Symptoms
                </Button>

                {diagnosisResults.length === 0 ? (
                  <Card className="shadow-soft border-primary/20">
                    <CardContent className="pt-5 text-center space-y-2">
                      <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
                      <div className="font-semibold text-foreground">No Match Found</div>
                      <p className="text-sm text-muted-foreground">
                        The selected symptoms didn't match known problems. Try selecting different symptoms or consult your local agriculture officer.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {diagnosisResults.length} possible problem{diagnosisResults.length !== 1 ? "s" : ""} found, sorted by risk
                    </p>

                    {diagnosisResults.map((result, idx) => {
                      const config = SEVERITY_CONFIG[result.severity];
                      const IconComp = config.icon;
                      const sprayOpen = showSpray[result.pestName];
                      const tipsOpen = showTips[result.pestName];

                      return (
                        <Card key={idx} className={cn("shadow-soft border-l-4 overflow-hidden", config.border)}>
                          <CardContent className="pt-5 space-y-4">
                            {/* Problem Header */}
                            <div className="flex items-start gap-3">
                              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", config.color)}>
                                <IconComp className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-foreground">{result.pestName}</div>
                                <div className="text-sm text-muted-foreground">{result.pestNameTamil}</div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge className={config.color}>{result.severity} Risk</Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Stage: {result.stage}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Why it occurs */}
                            <div className={cn("rounded-lg p-3 space-y-1", config.bg)}>
                              <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                                <Lightbulb className="h-4 w-4 text-primary" />
                                Why it occurs / ஏன் வருகிறது
                              </div>
                              <p className="text-sm text-foreground">{result.whyItOccurs}</p>
                              <p className="text-xs text-muted-foreground">{result.whyItOccursTamil}</p>
                            </div>

                            {/* Recommended Chemical */}
                            <div className="bg-primary/5 border border-primary/15 rounded-lg p-3">
                              <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                                <FlaskConical className="h-4 w-4" />
                                Recommended Chemical / பரிந்துரைக்கப்பட்ட மருந்து
                              </div>
                              <p className="text-sm font-medium text-foreground mt-1">{result.recommendedChemical}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => openSprayCalculator(result.pestName, result.recommendedChemical)}
                              >
                                <Calculator className="h-4 w-4 mr-2" />
                                View Spray Measurement
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => setShowTips(prev => ({ ...prev, [result.pestName]: !prev[result.pestName] }))}
                              >
                                <Lightbulb className="h-4 w-4 mr-2" />
                                {tipsOpen ? "Hide" : "Preventive"} Tips
                              </Button>
                            </div>

                            {/* Preventive Tips Panel */}
                            {tipsOpen && (
                              <div className="bg-primary/5 border border-primary/15 rounded-lg p-4 space-y-3">
                                <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                                  <Lightbulb className="h-4 w-4 text-primary" />
                                  Preventive Tips / தடுப்பு குறிப்புகள்
                                </div>
                                <ul className="space-y-2">
                                  {result.preventiveTips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                      <div>
                                        <span className="text-foreground">{tip}</span>
                                        {result.preventiveTipsTamil[i] && (
                                          <span className="block text-xs text-muted-foreground">{result.preventiveTipsTamil[i]}</span>
                                        )}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── Spray Calculator Panel ─────────────────────────────

  const renderSprayCalculator = () => {
    if (!sprayCalc) return null;

    return (
      <div className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-background w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-bold text-foreground text-base">Spray Plan Calculator</h3>
                <p className="text-xs text-muted-foreground">தெளிப்பு திட்ட கணிப்பான்</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => { setSprayCalc(null); setSprayResult(null); }}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            {/* Auto-filled info */}
            <div className="bg-muted rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Crop / பயிர்</span>
                <span className="font-medium text-foreground">{sprayCalc.crop}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pest / பூச்சி</span>
                <span className="font-medium text-foreground">{sprayCalc.pestName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Chemical / மருந்து</span>
                <span className="font-medium text-foreground text-right max-w-[60%]">{sprayCalc.chemical}</span>
              </div>
            </div>

            {!sprayResult ? (
              <>
                {/* Land Area */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Land Area / நில பரப்பளவு</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter area"
                      value={sprayCalc.landArea}
                      onChange={(e) => setSprayCalc(prev => prev ? { ...prev, landArea: e.target.value } : null)}
                      className="flex-1"
                    />
                    <Select value={sprayCalc.landUnit} onValueChange={(v) => setSprayCalc(prev => prev ? { ...prev, landUnit: v } : null)}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Acre">Acre</SelectItem>
                        <SelectItem value="Cent">Cent</SelectItem>
                        <SelectItem value="Sq.ft">Sq.ft</SelectItem>
                        <SelectItem value="Hectare">Hectare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tank Size */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Tank Size (Litres) / தொட்டி அளவு</Label>
                  <Input
                    type="number"
                    value={sprayCalc.tankSize}
                    onChange={(e) => setSprayCalc(prev => prev ? { ...prev, tankSize: e.target.value } : null)}
                    placeholder="15"
                  />
                </div>

                {/* Infection Level */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Infection Level / பாதிப்பு நிலை</Label>
                  <RadioGroup
                    value={sprayCalc.infectionLevel}
                    onValueChange={(v) => setSprayCalc(prev => prev ? { ...prev, infectionLevel: v } : null)}
                    className="flex gap-3"
                  >
                    {["Low", "Medium", "High"].map((level) => (
                      <div key={level} className="flex items-center gap-1.5">
                        <RadioGroupItem value={level} id={`inf-${level}`} />
                        <Label htmlFor={`inf-${level}`} className="text-sm cursor-pointer">{level}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!sprayCalc.landArea || parseFloat(sprayCalc.landArea) <= 0}
                  onClick={calculateSpray}
                >
                  <Droplets className="h-4 w-4 mr-2" />
                  Calculate Spray Plan / கணக்கிடு
                </Button>
              </>
            ) : (
              <>
                {/* Results - Farmer Instruction Mode */}
                <Card className="border-primary/30 shadow-soft bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-primary" />
                      SPRAY PLAN / தெளிப்பு திட்டம்
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-background rounded-xl p-4 border border-border text-center">
                        <div className="text-3xl font-bold text-primary">{sprayResult.tankCount}</div>
                        <div className="text-sm font-medium text-foreground">Tanks Today / இன்று தொட்டிகள்</div>
                      </div>
                      <div className="bg-background rounded-xl p-4 border border-border text-center">
                        <div className="text-3xl font-bold text-primary">{sprayResult.chemicalPerTank} ml</div>
                        <div className="text-sm font-medium text-foreground">Medicine per Tank / ஒரு தொட்டிக்கு மருந்து</div>
                      </div>
                      <div className="bg-background rounded-xl p-4 border border-border text-center">
                        <div className="text-3xl font-bold text-primary">{sprayResult.totalWater} L</div>
                        <div className="text-sm font-medium text-foreground">Total Water / மொத்த நீர்</div>
                      </div>
                    </div>

                    <div className="bg-muted rounded-lg p-3 space-y-2 text-sm">
                      {sprayResult.intervalDays > 0 && (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-foreground">
                            Repeat after <strong>{sprayResult.intervalDays} days</strong> / {sprayResult.intervalDays} நாட்களுக்குப் பிறகு மீண்டும்
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-foreground">
                          Maximum <strong>{sprayResult.maxSpray} sprays</strong> allowed / அதிகபட்சம் {sprayResult.maxSpray} தெளிப்புகள்
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Safety Warnings */}
                {(sprayResult.highDosageWarning || sprayResult.resistanceWarning) && (
                  <div className="space-y-2">
                    {sprayResult.highDosageWarning && (
                      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-2">
                        <TriangleAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm text-destructive">High Dosage Warning / அதிக அளவு எச்சரிக்கை</div>
                          <p className="text-xs text-foreground mt-0.5">
                            Medicine per tank exceeds 10ml. Double-check measurement carefully. Use accurate measuring tools.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ஒரு தொட்டிக்கு மருந்து 10ml-ஐ தாண்டுகிறது. கவனமாக அளவிடவும்.
                          </p>
                        </div>
                      </div>
                    )}
                    {sprayResult.resistanceWarning && (
                      <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-3 flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-secondary-foreground shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm text-foreground">Resistance Warning / எதிர்ப்பு எச்சரிக்கை</div>
                          <p className="text-xs text-foreground mt-0.5">
                            Do not exceed {sprayResult.maxSpray} sprays with the same chemical. Rotate with a different medicine if pest continues.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            அதே மருந்தை {sprayResult.maxSpray} முறைக்கு மேல் பயன்படுத்த வேண்டாம்.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Button variant="outline" className="w-full" onClick={() => setSprayResult(null)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Recalculate / மீண்டும் கணக்கிடு
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── Main Render ───────────────────────────────────────

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Spray Calculator Overlay */}
      {renderSprayCalculator()}
      {/* Diagnosis Panel Overlay */}
      {renderDiagnosisPanel()}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-7 w-7 text-primary" />
            Crop Protection Timeline
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            பயிர் பாதுகாப்பு காலவரிசை — Track growth stages & predict pest risks
          </p>
        </div>
        {submitted && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            New Crop
          </Button>
        )}
      </div>

      {/* Input Form */}
      {!submitted ? (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              Select Crop & Sowing Date
              <span className="text-sm font-normal text-muted-foreground ml-2">பயிர் & விதைப்பு தேதி</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Crop / பயிர்</Label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CROP_DATA).map(([name, data]) => (
                      <SelectItem key={name} value={name}>
                        {name} — {data.nameTamil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sowing Date / விதைப்பு தேதி</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !sowingDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {sowingDate ? format(sowingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={sowingDate}
                      onSelect={setSowingDate}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button
              className="w-full sm:w-auto"
              onClick={handleSubmit}
              disabled={!selectedCrop || !sowingDate}
            >
              <Leaf className="h-4 w-4 mr-2" />
              View Protection Timeline
            </Button>
          </CardContent>
        </Card>
      ) : cropData ? (
        <>
          {/* Crop Info Card */}
          <Card className="shadow-soft border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge variant="outline" className="text-base px-3 py-1 border-primary text-primary">
                  {selectedCrop} — {cropData.nameTamil}
                </Badge>
                <span className="text-muted-foreground">
                  Sowed: <strong>{format(sowingDate!, "dd MMM yyyy")}</strong>
                </span>
                <Badge className="bg-primary text-primary-foreground text-base px-3 py-1">
                  Day {currentDay}
                </Badge>
                {currentStage && (
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {currentStage.name} — {currentStage.nameTamil}
                  </Badge>
                )}
                {allStagesCompleted && (
                  <Badge variant="outline" className="border-primary text-primary">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> All Stages Complete ✅
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Bar */}
          <Card className="shadow-soft overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Growth Timeline / வளர்ச்சி காலவரிசை
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Desktop timeline */}
                <div className="hidden sm:flex rounded-xl overflow-hidden border border-border">
                  {cropData.stages.map((stage, i) => {
                    const widthPercent = ((stage.endDay - stage.startDay + 1) / (totalDays + 1)) * 100;
                    const isCurrent = currentStage?.name === stage.name;
                    const isCompleted = completedStages.includes(stage.name);
                    const hasHighRisk = stage.risks.some(r => r.severity === "High");

                    return (
                      <div
                        key={i}
                        className={cn(
                          "relative py-3 px-2 text-center text-xs transition-all border-r border-border last:border-r-0",
                          isCurrent
                            ? "bg-primary text-primary-foreground font-bold ring-2 ring-primary ring-inset"
                            : isCompleted
                            ? "bg-primary/20 text-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                        style={{ width: `${widthPercent}%`, minWidth: "60px" }}
                      >
                        <div className="font-semibold truncate">{stage.name}</div>
                        <div className="text-[10px] opacity-80 truncate">{stage.nameTamil}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">
                          {stage.startDay}–{stage.endDay}d
                        </div>
                        {isCompleted && (
                          <CheckCircle2 className="h-3 w-3 text-primary absolute top-1 right-1" />
                        )}
                        {hasHighRisk && !isCurrent && !isCompleted && (
                          <ShieldAlert className="h-3 w-3 text-destructive absolute top-1 right-1" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Mobile timeline (vertical) */}
                <div className="sm:hidden space-y-2">
                  {cropData.stages.map((stage, i) => {
                    const isCurrent = currentStage?.name === stage.name;
                    const isCompleted = completedStages.includes(stage.name);

                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-3 rounded-lg p-3 border transition-all",
                          isCurrent
                            ? "bg-primary text-primary-foreground border-primary shadow-glow"
                            : isCompleted
                            ? "bg-primary/10 border-primary/20"
                            : "bg-muted border-border"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                          isCurrent ? "bg-primary-foreground text-primary" : isCompleted ? "bg-primary/20 text-primary" : "bg-border text-muted-foreground"
                        )}>
                          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{stage.name}</div>
                          <div className="text-xs opacity-80">{stage.nameTamil}</div>
                        </div>
                        <div className="text-xs opacity-70 shrink-0">
                          {isCompleted ? "✅ Done" : `${stage.startDay}–${stage.endDay}d`}
                        </div>
                        {isCurrent && <ChevronRight className="h-4 w-4 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Progress indicator (desktop) */}
                {!allStagesCompleted && (
                  <div className="hidden sm:block mt-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (completedStages.length / (cropData.stages.length)) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Stage 1</span>
                      <span>{completedStages.length} of {cropData.stages.length} completed</span>
                      <span>Stage {cropData.stages.length}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Risk Alert Cards */}
          {currentStage && currentStage.risks.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <Bug className="h-5 w-5 text-destructive" />
                Risk Alerts — {currentStage.name} Stage
                <span className="text-sm font-normal text-muted-foreground">
                  அபாய எச்சரிக்கை
                </span>
              </h3>

              {currentStage.risks.map((risk) => {
                const config = SEVERITY_CONFIG[risk.severity];
                const IconComp = config.icon;

                return (
                  <Card key={risk.name} className={cn("shadow-soft border-l-4", config.border)}>
                    <CardContent className="pt-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", config.color)}>
                            <IconComp className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{risk.name}</div>
                            <div className="text-sm text-muted-foreground">{risk.nameTamil}</div>
                          </div>
                        </div>
                        <Badge className={config.color}>{risk.severity} Risk</Badge>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => toggleSolution(risk.name)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Check Problem & Solution
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Complete Stage Button */}
              <Card className="shadow-soft border-2 border-dashed border-primary/30">
                <CardContent className="pt-5">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 text-center sm:text-left">
                      <div className="font-semibold text-foreground">No disease in this stage?</div>
                      <div className="text-sm text-muted-foreground">
                        இந்த நிலையில் நோய் இல்லையா? — Mark as complete and move to next stage
                      </div>
                    </div>
                    <Button
                      className="w-full sm:w-auto"
                      onClick={handleCompleteStage}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Complete {currentStage.name} → Next Stage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : currentStage ? (
            <div className="space-y-4">
              <Card className="shadow-soft border-l-4 border-primary/30">
                <CardContent className="pt-5 flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">Low Risk Period</div>
                    <div className="text-sm text-muted-foreground">
                      No significant pest or disease threats expected in the {currentStage.name} stage. குறைந்த ஆபத்து காலம்.
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Complete Stage Button */}
              <Card className="shadow-soft border-2 border-dashed border-primary/30">
                <CardContent className="pt-5">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 text-center sm:text-left">
                      <div className="font-semibold text-foreground">Stage is healthy! 🌿</div>
                      <div className="text-sm text-muted-foreground">
                        நிலை ஆரோக்கியமானது! — Move to the next growth stage
                      </div>
                    </div>
                    <Button
                      className="w-full sm:w-auto"
                      onClick={handleCompleteStage}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Complete {currentStage.name} → Next Stage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : allStagesCompleted ? (
            <Card className="shadow-soft border-l-4 border-primary/30">
              <CardContent className="pt-5 flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">All Stages Complete! 🎉</div>
                  <div className="text-sm text-muted-foreground">
                    Your {selectedCrop} has passed all growth stages successfully. Ready for harvest! அறுவடைக்கு தயார்!
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* All Stages Risk Overview */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Full Season Risk Overview / முழு பருவ ஆபத்து கண்ணோட்டம்
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cropData.stages.map((stage) => {
                  const isCurrent = currentStage?.name === stage.name;
                  const isCompleted = completedStages.includes(stage.name);
                  return (
                    <div
                      key={stage.name}
                      className={cn(
                        "flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border",
                        isCompleted ? "bg-primary/5 border-primary/20" : isCurrent ? "bg-primary/5 border-primary/20" : "border-border"
                      )}
                    >
                      <div className="font-medium text-sm w-32 shrink-0 flex items-center gap-1">
                        {isCompleted && <CheckCircle2 className="h-3 w-3 text-primary" />}
                        {isCurrent && !isCompleted && <ChevronRight className="h-3 w-3 text-primary" />}
                        {stage.name}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {isCompleted ? (
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">Completed ✅</Badge>
                        ) : stage.risks.length > 0 ? stage.risks.map((risk) => (
                          <Badge
                            key={risk.name}
                            variant="outline"
                            className={cn("text-xs", SEVERITY_CONFIG[risk.severity].border)}
                          >
                            {risk.name} ({risk.severity})
                          </Badge>
                        )) : (
                          <span className="text-xs text-muted-foreground">No major risks</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default CropProtectionTimeline;
