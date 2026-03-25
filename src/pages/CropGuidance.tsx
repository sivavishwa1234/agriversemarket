import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sprout, ArrowLeft, CheckCircle, XCircle, Clock, Wheat, Leaf, Plus } from "lucide-react";
import { toast } from "sonner";
import FieldToolsSection from "@/components/FieldToolsSection";

// Import crop images
import fingerMilletImg from "@/assets/crops/finger-millet.jpg";
import pearlMilletImg from "@/assets/crops/pearl-millet.jpg";
import foxtailMilletImg from "@/assets/crops/foxtail-millet.jpg";
import kodoMilletImg from "@/assets/crops/kodo-millet.jpg";
import sorghumImg from "@/assets/crops/sorghum.jpg";
import sesameImg from "@/assets/crops/sesame.jpg";
import sunflowerImg from "@/assets/crops/sunflower.jpg";
import safflowerImg from "@/assets/crops/safflower.jpg";
import groundnutImg from "@/assets/crops/groundnut.jpg";
import horseGramImg from "@/assets/crops/horse-gram.jpg";
import greenGramImg from "@/assets/crops/green-gram.jpg";
import blackGramImg from "@/assets/crops/black-gram.jpg";
import pigeonPeaImg from "@/assets/crops/pigeon-pea.jpg";
import amaranthImg from "@/assets/crops/amaranth.jpg";
import buckwheatImg from "@/assets/crops/buckwheat.jpg";
import moringaImg from "@/assets/crops/moringa.jpg";
import okraImg from "@/assets/crops/okra.jpg";
import clusterBeanImg from "@/assets/crops/cluster-bean.jpg";
import heritageRiceImg from "@/assets/crops/heritage-rice.jpg";
import kharchiaWheatImg from "@/assets/crops/kharchia-wheat.jpg";

type CropType = string | null;

const CropGuidance = () => {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState<CropType>(() => {
    const saved = localStorage.getItem("cropGuidanceSelectedCrop");
    return saved || null;
  });
  const [taskStatuses, setTaskStatuses] = useState<Record<number, "completed" | "not-completed" | "in-progress">>(() => {
    const saved = localStorage.getItem("cropGuidanceSelectedCrop");
    if (saved) {
      const statuses = localStorage.getItem(`cropGuidanceProgress_${saved}`);
      return statuses ? JSON.parse(statuses) : {};
    }
    return {};
  });
  const [adminTemplates, setAdminTemplates] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem("cropTemplates") || "[]");
  });

  const handleAddToMyCrops = (cropName: string) => {
    const existingCrops = JSON.parse(localStorage.getItem("myCrops") || "[]");
    const newCrop = {
      id: Date.now(),
      name: cropName,
      datePlanted: new Date().toISOString().split('T')[0],
      growthStage: "Planning",
      healthStatus: "Good",
      expectedYield: "TBD"
    };
    localStorage.setItem("myCrops", JSON.stringify([...existingCrops, newCrop]));
    toast.success(`${cropName} added to My Crops for tracking!`);
  };

  const cropOptions = [
    { id: "finger-millet", name: "Finger Millet (Ragi)", icon: Wheat, days: 100, color: "text-amber-600", image: fingerMilletImg, description: "Nutritious, drought resilient" },
    { id: "pearl-millet", name: "Pearl Millet (Bajra)", icon: Wheat, days: 90, color: "text-yellow-700", image: pearlMilletImg, description: "Semi-arid zones, less water" },
    { id: "foxtail-millet", name: "Foxtail Millet", icon: Wheat, days: 85, color: "text-amber-500", image: foxtailMilletImg, description: "Short duration, water-efficient" },
    { id: "kodo-millet", name: "Kodo Millet", icon: Wheat, days: 110, color: "text-amber-700", image: kodoMilletImg, description: "Marginal lands, niche potential" },
    { id: "sorghum", name: "Sorghum (Jowar)", icon: Wheat, days: 100, color: "text-orange-700", image: sorghumImg, description: "Dryland farming versatile" },
    { id: "sesame", name: "Sesame (Til)", icon: Leaf, days: 85, color: "text-green-700", image: sesameImg, description: "Oilseed, drought tolerant" },
    { id: "sunflower", name: "Sunflower", icon: Leaf, days: 90, color: "text-yellow-600", image: sunflowerImg, description: "Oilseed, moderate water" },
    { id: "safflower", name: "Safflower", icon: Leaf, days: 120, color: "text-orange-600", image: safflowerImg, description: "Oilseed, niche market" },
    { id: "groundnut", name: "Groundnut (Peanut)", icon: Leaf, days: 100, color: "text-orange-800", image: groundnutImg, description: "Under-exploited potential" },
    { id: "horse-gram", name: "Horse Gram", icon: Leaf, days: 100, color: "text-amber-800", image: horseGramImg, description: "Hardy pulse, marginal lands" },
    { id: "green-gram", name: "Green Gram (Moong)", icon: Leaf, days: 65, color: "text-green-600", image: greenGramImg, description: "Short duration, rotation" },
    { id: "black-gram", name: "Black Gram (Urad)", icon: Leaf, days: 90, color: "text-gray-800", image: blackGramImg, description: "Pulse with demand" },
    { id: "pigeon-pea", name: "Pigeon Pea (Red Gram)", icon: Leaf, days: 135, color: "text-yellow-800", image: pigeonPeaImg, description: "Rotational, market potential" },
    { id: "amaranth", name: "Amaranth", icon: Leaf, days: 90, color: "text-red-600", image: amaranthImg, description: "Dual purpose grain/leaf" },
    { id: "buckwheat", name: "Buckwheat", icon: Wheat, days: 80, color: "text-green-800", image: buckwheatImg, description: "Alternative cereal, health food" },
    { id: "moringa", name: "Moringa (Drumstick)", icon: Leaf, days: 270, color: "text-green-700", image: moringaImg, description: "Tree crop, nutrient-rich" },
    { id: "okra", name: "Okra (Lady's Finger)", icon: Leaf, days: 45, color: "text-green-600", image: okraImg, description: "Quick vegetable turnover" },
    { id: "cluster-bean", name: "Cluster Bean (Guar)", icon: Leaf, days: 65, color: "text-green-700", image: clusterBeanImg, description: "Drought tolerant, industrial uses" },
    { id: "heritage-rice", name: "Heritage Rice Varieties", icon: Wheat, days: 130, color: "text-yellow-700", image: heritageRiceImg, description: "Premium niche market" },
    { id: "kharchia-wheat", name: "Kharchia Wheat", icon: Wheat, days: 115, color: "text-amber-600", image: kharchiaWheatImg, description: "Salt tolerant, saline soils" },
  ];

  // Detailed Pearl Millet tasks with Tamil translations
  const pearlMilletTasks = [
    // Land Preparation (Days 1-9)
    { day: 1, phase: "Land Preparation", task: "Plow the field 2-3 times to break soil clods", taskTamil: "மண் கட்டிகளை உடைக்க நிலத்தை 2-3 முறை உழுதல்" },
    { day: 2, phase: "Land Preparation", task: "Apply 10-12 tons of farmyard manure per hectare", taskTamil: "ஒரு ஹெக்டேருக்கு 10-12 டன் தொழு உரம் இடுதல்" },
    { day: 3, phase: "Land Preparation", task: "Level the field using a leveler", taskTamil: "லெவலர் பயன்படுத்தி நிலத்தை சமன் செய்தல்" },
    { day: 4, phase: "Land Preparation", task: "Create drainage channels for excess water", taskTamil: "அதிகப்படியான நீருக்கு வடிகால் வாய்க்கால்கள் அமைத்தல்" },
    { day: 5, phase: "Land Preparation", task: "Test soil pH (ideal: 6.5-7.5)", taskTamil: "மண் pH சோதனை செய்தல் (சிறந்தது: 6.5-7.5)" },
    { day: 6, phase: "Land Preparation", task: "Apply basal dose of fertilizers (40kg N, 20kg P2O5)", taskTamil: "அடியுரம் இடுதல் (40கி.கி N, 20கி.கி P2O5)" },
    { day: 7, phase: "Land Preparation", task: "Prepare ridges and furrows at 45cm spacing", taskTamil: "45செ.மீ இடைவெளியில் பார் மற்றும் வரிசைகள் அமைத்தல்" },
    { day: 8, phase: "Land Preparation", task: "Irrigate field lightly before sowing", taskTamil: "விதைப்புக்கு முன் லேசாக நீர் பாய்ச்சுதல்" },
    { day: 9, phase: "Land Preparation", task: "Final field preparation and seed bed readiness", taskTamil: "இறுதி நில தயாரிப்பு மற்றும் விதைப்படுக்கை தயார்நிலை" },
    // Sowing (Days 10-18)
    { day: 10, phase: "Sowing", task: "Select certified hybrid seeds (HHB 67, GHB 558)", taskTamil: "சான்றளிக்கப்பட்ட கலப்பின விதைகள் தேர்வு (HHB 67, GHB 558)" },
    { day: 11, phase: "Sowing", task: "Treat seeds with Thiram @ 3g/kg seed", taskTamil: "திரம் @ 3கி/கி.கி விதை கொண்டு விதை நேர்த்தி செய்தல்" },
    { day: 12, phase: "Sowing", task: "Sow seeds at 2-3cm depth", taskTamil: "2-3செ.மீ ஆழத்தில் விதைகளை விதைத்தல்" },
    { day: 13, phase: "Sowing", task: "Maintain 45x15cm plant spacing", taskTamil: "45x15செ.மீ செடி இடைவெளி பராமரித்தல்" },
    { day: 14, phase: "Sowing", task: "Use 4-5 kg seed per hectare", taskTamil: "ஒரு ஹெக்டேருக்கு 4-5 கி.கி விதை பயன்படுத்துதல்" },
    { day: 15, phase: "Sowing", task: "Cover seeds lightly with soil", taskTamil: "விதைகளை மண்ணால் லேசாக மூடுதல்" },
    { day: 16, phase: "Sowing", task: "Apply light irrigation after sowing", taskTamil: "விதைப்புக்குப் பிறகு லேசான நீர்ப்பாசனம்" },
    { day: 17, phase: "Sowing", task: "Monitor for bird damage and protect", taskTamil: "பறவை சேதத்தை கண்காணித்து பாதுகாத்தல்" },
    { day: 18, phase: "Sowing", task: "Check germination percentage (should be >80%)", taskTamil: "முளைப்பு சதவீதம் சரிபார்த்தல் (>80% இருக்க வேண்டும்)" },
    // Early Growth (Days 19-36)
    { day: 19, phase: "Early Growth", task: "Observe seedling emergence", taskTamil: "நாற்று வெளிப்படுவதை கவனித்தல்" },
    { day: 20, phase: "Early Growth", task: "Gap filling with healthy seedlings", taskTamil: "ஆரோக்கியமான நாற்றுகளால் இடைவெளி நிரப்புதல்" },
    { day: 21, phase: "Early Growth", task: "First irrigation at 3-4 days after sowing", taskTamil: "விதைப்புக்கு 3-4 நாட்களுக்குப் பிறகு முதல் நீர்ப்பாசனம்" },
    { day: 22, phase: "Early Growth", task: "Thin seedlings to maintain proper spacing", taskTamil: "சரியான இடைவெளிக்கு நாற்றுகளை தேய்த்தல்" },
    { day: 23, phase: "Early Growth", task: "First weeding using hand hoe", taskTamil: "கைக்கொத்து பயன்படுத்தி முதல் களை எடுத்தல்" },
    { day: 24, phase: "Early Growth", task: "Apply Atrazine @ 0.5kg/ha as pre-emergence", taskTamil: "அட்ராசின் @ 0.5கி.கி/ஹெக் முளைப்புக்கு முன் இடுதல்" },
    { day: 25, phase: "Early Growth", task: "Monitor for shoot fly attack", taskTamil: "தண்டு ஈ தாக்குதலை கண்காணித்தல்" },
    { day: 26, phase: "Early Growth", task: "Install pheromone traps for pest monitoring", taskTamil: "பூச்சி கண்காணிப்புக்கு ஃபெரோமோன் பொறிகள் நிறுவுதல்" },
    { day: 27, phase: "Early Growth", task: "Check for downy mildew symptoms", taskTamil: "இலைப்புள்ளி நோய் அறிகுறிகளை சரிபார்த்தல்" },
    { day: 28, phase: "Early Growth", task: "Second irrigation at 10-12 days interval", taskTamil: "10-12 நாட்கள் இடைவெளியில் இரண்டாவது நீர்ப்பாசனம்" },
    { day: 29, phase: "Early Growth", task: "Apply Carbofuran 3G for shoot fly control", taskTamil: "தண்டு ஈ கட்டுப்பாட்டுக்கு கார்போஃபுரான் 3G இடுதல்" },
    { day: 30, phase: "Early Growth", task: "Second weeding and interculture", taskTamil: "இரண்டாவது களை எடுத்தல் மற்றும் இடைப்பண்படுத்தல்" },
    { day: 31, phase: "Early Growth", task: "Monitor plant height and vigor", taskTamil: "செடி உயரம் மற்றும் வீரியம் கண்காணித்தல்" },
    { day: 32, phase: "Early Growth", task: "Check for nutrient deficiency symptoms", taskTamil: "ஊட்டச்சத்து குறைபாடு அறிகுறிகளை சரிபார்த்தல்" },
    { day: 33, phase: "Early Growth", task: "Apply micronutrients if needed (Zn, Fe)", taskTamil: "தேவைப்பட்டால் நுண்ணூட்டச்சத்துகள் இடுதல் (Zn, Fe)" },
    { day: 34, phase: "Early Growth", task: "Third irrigation based on soil moisture", taskTamil: "மண் ஈரப்பதத்தின் அடிப்படையில் மூன்றாவது நீர்ப்பாசனம்" },
    { day: 35, phase: "Early Growth", task: "Remove dead or diseased plants", taskTamil: "இறந்த அல்லது நோயுற்ற செடிகளை அகற்றுதல்" },
    { day: 36, phase: "Early Growth", task: "Earthing up around plant base", taskTamil: "செடியின் அடிப்பாகத்தை மண் அணைத்தல்" },
    // Vegetative Stage (Days 37-59)
    { day: 37, phase: "Vegetative Stage", task: "Apply first top dressing of N (20kg/ha)", taskTamil: "முதல் மேலுரம் N (20கி.கி/ஹெக்) இடுதல்" },
    { day: 38, phase: "Vegetative Stage", task: "Continue regular irrigation every 10-12 days", taskTamil: "ஒவ்வொரு 10-12 நாட்களுக்கும் வழக்கமான நீர்ப்பாசனம் தொடர்தல்" },
    { day: 39, phase: "Vegetative Stage", task: "Monitor for stem borer infestation", taskTamil: "தண்டு துளைப்பான் தாக்குதலை கண்காணித்தல்" },
    { day: 40, phase: "Vegetative Stage", task: "Spray Monocrotophos for borer control", taskTamil: "போரர் கட்டுப்பாட்டுக்கு மோனோக்ரோட்டோபாஸ் தெளித்தல்" },
    { day: 41, phase: "Vegetative Stage", task: "Third weeding if necessary", taskTamil: "தேவைப்பட்டால் மூன்றாவது களை எடுத்தல்" },
    { day: 42, phase: "Vegetative Stage", task: "Check for rust disease symptoms", taskTamil: "துரு நோய் அறிகுறிகளை சரிபார்த்தல்" },
    { day: 43, phase: "Vegetative Stage", task: "Apply fungicide if rust observed", taskTamil: "துரு காணப்பட்டால் பூஞ்சைக்கொல்லி தெளித்தல்" },
    { day: 44, phase: "Vegetative Stage", task: "Monitor plant tillering", taskTamil: "செடி கிளைத்தலை கண்காணித்தல்" },
    { day: 45, phase: "Vegetative Stage", task: "Maintain optimal plant population", taskTamil: "உகந்த செடி எண்ணிக்கையை பராமரித்தல்" },
    { day: 46, phase: "Vegetative Stage", task: "Apply second top dressing of N (20kg/ha)", taskTamil: "இரண்டாவது மேலுரம் N (20கி.கி/ஹெக்) இடுதல்" },
    { day: 47, phase: "Vegetative Stage", task: "Check for grasshopper damage", taskTamil: "வெட்டுக்கிளி சேதத்தை சரிபார்த்தல்" },
    { day: 48, phase: "Vegetative Stage", task: "Spray insecticide if pest threshold exceeded", taskTamil: "பூச்சி வரம்பு தாண்டினால் பூச்சிக்கொல்லி தெளித்தல்" },
    { day: 49, phase: "Vegetative Stage", task: "Monitor leaf area development", taskTamil: "இலை பரப்பு வளர்ச்சியை கண்காணித்தல்" },
    { day: 50, phase: "Vegetative Stage", task: "Ensure adequate soil moisture", taskTamil: "போதுமான மண் ஈரப்பதத்தை உறுதி செய்தல்" },
    { day: 51, phase: "Vegetative Stage", task: "Check for ergot disease signs", taskTamil: "எர்காட் நோய் அறிகுறிகளை சரிபார்த்தல்" },
    { day: 52, phase: "Vegetative Stage", task: "Remove ergot-infected panicles", taskTamil: "எர்காட் பாதிக்கப்பட்ட கதிர்களை அகற்றுதல்" },
    { day: 53, phase: "Vegetative Stage", task: "Irrigation before flag leaf emergence", taskTamil: "கொடி இலை வெளிப்படுவதற்கு முன் நீர்ப்பாசனம்" },
    { day: 54, phase: "Vegetative Stage", task: "Monitor for blast disease", taskTamil: "கருகல் நோயை கண்காணித்தல்" },
    { day: 55, phase: "Vegetative Stage", task: "Apply protective fungicide spray", taskTamil: "பாதுகாப்பு பூஞ்சைக்கொல்லி தெளித்தல்" },
    { day: 56, phase: "Vegetative Stage", task: "Check stem strength for lodging resistance", taskTamil: "சாய்வு எதிர்ப்புக்கு தண்டு வலிமையை சரிபார்த்தல்" },
    { day: 57, phase: "Vegetative Stage", task: "Monitor overall crop health", taskTamil: "ஒட்டுமொத்த பயிர் ஆரோக்கியத்தை கண்காணித்தல்" },
    { day: 58, phase: "Vegetative Stage", task: "Prepare for flowering stage management", taskTamil: "பூக்கும் நிலை மேலாண்மைக்கு தயாராகுதல்" },
    { day: 59, phase: "Vegetative Stage", task: "Document plant growth observations", taskTamil: "செடி வளர்ச்சி கவனிப்புகளை ஆவணப்படுத்துதல்" },
    // Flowering (Days 60-73)
    { day: 60, phase: "Flowering", task: "Observe panicle emergence", taskTamil: "கதிர் வெளிப்படுவதை கவனித்தல்" },
    { day: 61, phase: "Flowering", task: "Critical irrigation at flowering", taskTamil: "பூக்கும் போது முக்கியமான நீர்ப்பாசனம்" },
    { day: 62, phase: "Flowering", task: "Monitor for earhead caterpillar", taskTamil: "கதிர் புழுவை கண்காணித்தல்" },
    { day: 63, phase: "Flowering", task: "Spray Quinalphos for caterpillar control", taskTamil: "புழு கட்டுப்பாட்டுக்கு குயினால்பாஸ் தெளித்தல்" },
    { day: 64, phase: "Flowering", task: "Check for complete panicle emergence", taskTamil: "முழுமையான கதிர் வெளிப்பாட்டை சரிபார்த்தல்" },
    { day: 65, phase: "Flowering", task: "Monitor pollination activity", taskTamil: "மகரந்தச் சேர்க்கை செயல்பாட்டை கண்காணித்தல்" },
    { day: 66, phase: "Flowering", task: "Avoid water stress during flowering", taskTamil: "பூக்கும் போது நீர் பற்றாக்குறையை தவிர்த்தல்" },
    { day: 67, phase: "Flowering", task: "Check for smut disease", taskTamil: "கரிப்பூட்டை நோயை சரிபார்த்தல்" },
    { day: 68, phase: "Flowering", task: "Remove smut-infected earheads", taskTamil: "கரிப்பூட்டை பாதித்த கதிர்களை அகற்றுதல்" },
    { day: 69, phase: "Flowering", task: "Monitor for aphid infestation", taskTamil: "அஃபிட் தாக்குதலை கண்காணித்தல்" },
    { day: 70, phase: "Flowering", task: "Spray Dimethoate for aphid control", taskTamil: "அஃபிட் கட்டுப்பாட்டுக்கு டைமீத்தோயேட் தெளித்தல்" },
    { day: 71, phase: "Flowering", task: "Check seed setting percentage", taskTamil: "விதை உருவாகும் சதவீதத்தை சரிபார்த்தல்" },
    { day: 72, phase: "Flowering", task: "Maintain adequate moisture level", taskTamil: "போதுமான ஈரப்பத நிலையை பராமரித்தல்" },
    { day: 73, phase: "Flowering", task: "Document flowering observations", taskTamil: "பூக்கும் கவனிப்புகளை ஆவணப்படுத்துதல்" },
    // Grain Filling (Days 74-82)
    { day: 74, phase: "Grain Filling", task: "Monitor grain development", taskTamil: "தானிய வளர்ச்சியை கண்காணித்தல்" },
    { day: 75, phase: "Grain Filling", task: "Light irrigation for grain filling", taskTamil: "தானிய நிரப்புதலுக்கு லேசான நீர்ப்பாசனம்" },
    { day: 76, phase: "Grain Filling", task: "Check for bird damage to earheads", taskTamil: "கதிர்களுக்கு பறவை சேதத்தை சரிபார்த்தல்" },
    { day: 77, phase: "Grain Filling", task: "Install bird scarers in field", taskTamil: "வயலில் பறவை விரட்டிகள் நிறுவுதல்" },
    { day: 78, phase: "Grain Filling", task: "Monitor grain moisture content", taskTamil: "தானிய ஈரப்பத உள்ளடக்கத்தை கண்காணித்தல்" },
    { day: 79, phase: "Grain Filling", task: "Check for grain mold development", taskTamil: "தானிய பூஞ்சை வளர்ச்சியை சரிபார்த்தல்" },
    { day: 80, phase: "Grain Filling", task: "Spray fungicide if mold observed", taskTamil: "பூஞ்சை காணப்பட்டால் பூஞ்சைக்கொல்லி தெளித்தல்" },
    { day: 81, phase: "Grain Filling", task: "Prevent lodging by wind breaks", taskTamil: "காற்று தடுப்புகளால் சாய்வை தடுத்தல்" },
    { day: 82, phase: "Grain Filling", task: "Monitor grain hardening", taskTamil: "தானிய கடினமாவதை கண்காணித்தல்" },
    // Maturation & Harvest (Days 83-90)
    { day: 83, phase: "Maturation & Harvest", task: "Stop irrigation 10 days before harvest", taskTamil: "அறுவடைக்கு 10 நாட்களுக்கு முன் நீர்ப்பாசனம் நிறுத்துதல்" },
    { day: 84, phase: "Maturation & Harvest", task: "Check grain maturity by pressing grain", taskTamil: "தானியத்தை அழுத்தி முதிர்வை சரிபார்த்தல்" },
    { day: 85, phase: "Maturation & Harvest", task: "Observe straw color change to golden", taskTamil: "வைக்கோல் நிறம் தங்க நிறமாக மாறுவதை கவனித்தல்" },
    { day: 86, phase: "Maturation & Harvest", task: "Harvest when grain moisture is 18-20%", taskTamil: "தானிய ஈரப்பதம் 18-20% இருக்கும்போது அறுவடை" },
    { day: 87, phase: "Maturation & Harvest", task: "Cut panicles using sickle", taskTamil: "அரிவாள் பயன்படுத்தி கதிர்களை வெட்டுதல்" },
    { day: 88, phase: "Maturation & Harvest", task: "Bundle and stack for drying", taskTamil: "உலர்த்துவதற்கு கட்டுதல் மற்றும் அடுக்குதல்" },
    { day: 89, phase: "Maturation & Harvest", task: "Thresh using thresher or manual beating", taskTamil: "த்ரெஷர் அல்லது கை அடித்து தூற்றுதல்" },
    { day: 90, phase: "Maturation & Harvest", task: "Clean, grade and store grain at 12% moisture", taskTamil: "12% ஈரப்பதத்தில் தானியத்தை சுத்தம், தரம் பிரித்து சேமித்தல்" },
  ];

  // Detailed Finger Millet (Ragi) tasks with Tamil translations - 100 days
  const fingerMilletTasks = [
    // Land Preparation (Days 1-10)
    { day: 1, phase: "Land Preparation", task: "Plow the field 2-3 times thoroughly", taskTamil: "நிலத்தை 2-3 முறை நன்கு உழுதல்" },
    { day: 2, phase: "Land Preparation", task: "Apply 10 tons FYM per hectare and mix well", taskTamil: "ஹெக்டேருக்கு 10 டன் தொழு உரம் இட்டு நன்கு கலத்தல்" },
    { day: 3, phase: "Land Preparation", task: "Level the field for uniform water distribution", taskTamil: "சீரான நீர் விநியோகத்திற்கு நிலத்தை சமன் செய்தல்" },
    { day: 4, phase: "Land Preparation", task: "Form raised nursery beds (1m wide, 15cm height)", taskTamil: "உயர்த்தப்பட்ட நாற்றங்கால் பாத்திகள் அமைத்தல் (1மீ அகலம், 15செ.மீ உயரம்)" },
    { day: 5, phase: "Land Preparation", task: "Test soil pH and nutrient status (ideal pH 5.0-7.5)", taskTamil: "மண் pH மற்றும் ஊட்டச்சத்து நிலையை சோதிக்கவும் (சிறந்த pH 5.0-7.5)" },
    { day: 6, phase: "Land Preparation", task: "Apply basal dose: 40kg N, 20kg P2O5, 20kg K2O per ha", taskTamil: "அடியுரம் இடுதல்: 40கி.கி N, 20கி.கி P2O5, 20கி.கி K2O/ஹெக்" },
    { day: 7, phase: "Land Preparation", task: "Prepare main field with ridges and furrows (30cm spacing)", taskTamil: "30செ.மீ இடைவெளியில் பார் மற்றும் சால் தயாரித்தல்" },
    { day: 8, phase: "Land Preparation", task: "Sow seeds in nursery bed at 10g/sq.m", taskTamil: "நாற்றங்காலில் 10கி/ச.மீ விகிதத்தில் விதைத்தல்" },
    { day: 9, phase: "Land Preparation", task: "Cover nursery with thin layer of soil and irrigate", taskTamil: "நாற்றங்காலை மெல்லிய மண் படையால் மூடி நீர் பாய்ச்சுதல்" },
    { day: 10, phase: "Land Preparation", task: "Protect nursery from birds and ants", taskTamil: "நாற்றங்காலை பறவைகள் மற்றும் எறும்புகளிலிருந்து பாதுகாத்தல்" },
    // Transplanting / Sowing (Days 11-20)
    { day: 11, phase: "Transplanting", task: "Monitor nursery seedling growth (should be 15-20cm)", taskTamil: "நாற்று வளர்ச்சியை கண்காணித்தல் (15-20செ.மீ இருக்க வேண்டும்)" },
    { day: 12, phase: "Transplanting", task: "Irrigate main field one day before transplanting", taskTamil: "நடவுக்கு ஒரு நாள் முன் முக்கிய நிலத்திற்கு நீர்ப்பாசனம்" },
    { day: 13, phase: "Transplanting", task: "Uproot 20-25 day old seedlings carefully", taskTamil: "20-25 நாள் பழைய நாற்றுகளை கவனமாக பிடுங்குதல்" },
    { day: 14, phase: "Transplanting", task: "Transplant 2-3 seedlings per hill at 22.5x10cm", taskTamil: "22.5x10செ.மீ இடைவெளியில் குழிக்கு 2-3 நாற்றுகள் நடுதல்" },
    { day: 15, phase: "Transplanting", task: "Maintain shallow planting depth (2-3cm)", taskTamil: "ஆழம் குறைவாக (2-3செ.மீ) நடவு செய்தல்" },
    { day: 16, phase: "Transplanting", task: "Irrigate immediately after transplanting", taskTamil: "நடவுக்குப் பிறகு உடனடியாக நீர்ப்பாசனம்" },
    { day: 17, phase: "Transplanting", task: "Gap fill with reserve seedlings within 7 days", taskTamil: "7 நாட்களுக்குள் கையிருப்பு நாற்றுகளால் இடைவெளி நிரப்புதல்" },
    { day: 18, phase: "Transplanting", task: "Apply Carbofuran 3G in soil against stem borer", taskTamil: "தண்டு துளைப்பான் எதிர்ப்பாக மண்ணில் கார்போஃபுரான் 3G இடுதல்" },
    { day: 19, phase: "Transplanting", task: "First irrigation 3 days after transplanting", taskTamil: "நடவுக்கு 3 நாட்களுக்குப் பிறகு முதல் நீர்ப்பாசனம்" },
    { day: 20, phase: "Transplanting", task: "Check establishment rate and seedling health", taskTamil: "நிலைபெறும் விகிதம் மற்றும் நாற்று ஆரோக்கியத்தை சரிபார்த்தல்" },
    // Early Growth (Days 21-40)
    { day: 21, phase: "Early Growth", task: "First hand weeding at 15 days after transplanting", taskTamil: "நடவுக்கு 15 நாட்களுக்குப் பிறகு முதல் கை களை எடுத்தல்" },
    { day: 22, phase: "Early Growth", task: "Apply pre-emergence herbicide Butachlor 1.5kg/ha", taskTamil: "முளைப்புக்கு முன் களைக்கொல்லி பூட்டாக்ளோர் 1.5கி.கி/ஹெக் இடுதல்" },
    { day: 23, phase: "Early Growth", task: "Monitor for pink stem borer moths at dusk", taskTamil: "மாலை நேரத்தில் இளஞ்சிவப்பு தண்டு துளைப்பான் அந்துப்பூச்சிகளை கண்காணித்தல்" },
    { day: 24, phase: "Early Growth", task: "Second irrigation at 8-10 day interval", taskTamil: "8-10 நாட்கள் இடைவெளியில் இரண்டாவது நீர்ப்பாசனம்" },
    { day: 25, phase: "Early Growth", task: "Check for leaf blast disease (diamond-shaped spots)", taskTamil: "இலை கருகல் நோயை சரிபார்த்தல் (வைர வடிவ புள்ளிகள்)" },
    { day: 26, phase: "Early Growth", task: "Spray Tricyclazole 75WP @ 0.6g/L for blast", taskTamil: "கருகல் நோய்க்கு டிரைசைக்ளாசோல் 75WP @ 0.6கி/லி தெளித்தல்" },
    { day: 27, phase: "Early Growth", task: "Apply first top dressing: 20kg N/ha at 30 DAT", taskTamil: "முதல் மேலுரம்: 30 DAT இல் 20கி.கி N/ஹெக் இடுதல்" },
    { day: 28, phase: "Early Growth", task: "Second hand weeding at 30 days after transplanting", taskTamil: "நடவுக்கு 30 நாட்களுக்குப் பிறகு இரண்டாவது கை களை எடுத்தல்" },
    { day: 29, phase: "Early Growth", task: "Check for aphid colonies on leaves", taskTamil: "இலைகளில் அஃபிட் கூட்டங்களை சரிபார்த்தல்" },
    { day: 30, phase: "Early Growth", task: "Spray Dimethoate 30EC @ 1.7ml/L if aphids found", taskTamil: "அஃபிட் காணப்பட்டால் டைமீத்தோயேட் 30EC @ 1.7மி.லி/லி தெளித்தல்" },
    { day: 31, phase: "Early Growth", task: "Third irrigation maintaining soil moisture", taskTamil: "மண் ஈரப்பதத்தை பராமரிக்க மூன்றாவது நீர்ப்பாசனம்" },
    { day: 32, phase: "Early Growth", task: "Monitor tillering pattern (8-10 tillers ideal)", taskTamil: "கிளைத்தல் முறையை கண்காணித்தல் (8-10 கிளைகள் சிறந்தது)" },
    { day: 33, phase: "Early Growth", task: "Check for Zinc deficiency (brown spots on leaves)", taskTamil: "துத்தநாக குறைபாட்டை சரிபார்த்தல் (இலைகளில் பழுப்பு புள்ளிகள்)" },
    { day: 34, phase: "Early Growth", task: "Spray ZnSO4 @ 0.5% if deficiency observed", taskTamil: "குறைபாடு காணப்பட்டால் ZnSO4 @ 0.5% தெளித்தல்" },
    { day: 35, phase: "Early Growth", task: "Earthing up around plant base for support", taskTamil: "ஆதரவுக்கு செடியின் அடிப்பாகத்தை மண் அணைத்தல்" },
    { day: 36, phase: "Early Growth", task: "Remove off-type plants from field", taskTamil: "வயலில் இருந்து வேறுபட்ட செடிகளை அகற்றுதல்" },
    { day: 37, phase: "Early Growth", task: "Fourth irrigation at 8-10 day interval", taskTamil: "8-10 நாட்கள் இடைவெளியில் நான்காவது நீர்ப்பாசனம்" },
    { day: 38, phase: "Early Growth", task: "Monitor for army worm caterpillars", taskTamil: "படை புழு கம்பளிப்பூச்சிகளை கண்காணித்தல்" },
    { day: 39, phase: "Early Growth", task: "Install light traps for moth monitoring", taskTamil: "அந்துப்பூச்சி கண்காணிப்புக்கு ஒளி பொறிகள் நிறுவுதல்" },
    { day: 40, phase: "Early Growth", task: "Document growth stage and plant count", taskTamil: "வளர்ச்சி நிலை மற்றும் செடி எண்ணிக்கையை ஆவணப்படுத்துதல்" },
    // Vegetative Stage (Days 41-60)
    { day: 41, phase: "Vegetative Stage", task: "Apply second top dressing: 20kg N/ha at 45 DAT", taskTamil: "இரண்டாவது மேலுரம்: 45 DAT இல் 20கி.கி N/ஹெக் இடுதல்" },
    { day: 42, phase: "Vegetative Stage", task: "Fifth irrigation to maintain moisture", taskTamil: "ஈரப்பதம் பராமரிக்க ஐந்தாவது நீர்ப்பாசனம்" },
    { day: 43, phase: "Vegetative Stage", task: "Check for neck blast symptoms", taskTamil: "கழுத்து கருகல் அறிகுறிகளை சரிபார்த்தல்" },
    { day: 44, phase: "Vegetative Stage", task: "Spray Edifenphos 50EC @ 1ml/L for neck blast", taskTamil: "கழுத்து கருகலுக்கு எடிஃபென்பாஸ் 50EC @ 1மி.லி/லி தெளித்தல்" },
    { day: 45, phase: "Vegetative Stage", task: "Monitor root development and plant anchorage", taskTamil: "வேர் வளர்ச்சி மற்றும் செடி நிலைப்பாட்டை கண்காணித்தல்" },
    { day: 46, phase: "Vegetative Stage", task: "Check for foot rot disease at stem base", taskTamil: "தண்டு அடிப்பாகத்தில் அடி அழுகல் நோயை சரிபார்த்தல்" },
    { day: 47, phase: "Vegetative Stage", task: "Apply Copper Oxychloride 0.25% if foot rot found", taskTamil: "அடி அழுகல் காணப்பட்டால் காப்பர் ஆக்சிகுளோரைடு 0.25% இடுதல்" },
    { day: 48, phase: "Vegetative Stage", task: "Sixth irrigation based on soil condition", taskTamil: "மண் நிலையின் அடிப்படையில் ஆறாவது நீர்ப்பாசனம்" },
    { day: 49, phase: "Vegetative Stage", task: "Spray Neem oil 3% to repel pests", taskTamil: "பூச்சிகளை விரட்ட வேப்ப எண்ணெய் 3% தெளித்தல்" },
    { day: 50, phase: "Vegetative Stage", task: "Check for brown spot disease on leaves", taskTamil: "இலைகளில் பழுப்பு புள்ளி நோயை சரிபார்த்தல்" },
    { day: 51, phase: "Vegetative Stage", task: "Apply Mancozeb 75WP @ 2g/L for brown spot", taskTamil: "பழுப்பு புள்ளிக்கு மான்கோசெப் 75WP @ 2கி/லி தெளித்தல்" },
    { day: 52, phase: "Vegetative Stage", task: "Monitor for flag leaf emergence", taskTamil: "கொடி இலை வெளிப்படுவதை கண்காணித்தல்" },
    { day: 53, phase: "Vegetative Stage", task: "Seventh irrigation before ear emergence", taskTamil: "கதிர் வெளிப்படுவதற்கு முன் ஏழாவது நீர்ப்பாசனம்" },
    { day: 54, phase: "Vegetative Stage", task: "Check plant height (ideal 60-130cm by variety)", taskTamil: "செடி உயரத்தை சரிபார்த்தல் (ரகத்திற்கு ஏற்ப 60-130செ.மீ)" },
    { day: 55, phase: "Vegetative Stage", task: "Monitor for cutworm damage at stem base", taskTamil: "தண்டு அடிப்பாகத்தில் வெட்டுப்புழு சேதத்தை கண்காணித்தல்" },
    { day: 56, phase: "Vegetative Stage", task: "Apply Chlorpyriphos if cutworm found", taskTamil: "வெட்டுப்புழு காணப்பட்டால் குளோர்பைரிபாஸ் இடுதல்" },
    { day: 57, phase: "Vegetative Stage", task: "Maintain weed-free field conditions", taskTamil: "களை இல்லா வயல் நிலையை பராமரித்தல்" },
    { day: 58, phase: "Vegetative Stage", task: "Monitor crop canopy development", taskTamil: "பயிர் மேற்பரப்பு வளர்ச்சியை கண்காணித்தல்" },
    { day: 59, phase: "Vegetative Stage", task: "Apply foliar spray of micronutrients", taskTamil: "நுண்ணூட்டச்சத்துகளின் இலைவழி தெளிப்பு இடுதல்" },
    { day: 60, phase: "Vegetative Stage", task: "Document vegetative growth observations", taskTamil: "தாவர வளர்ச்சி கவனிப்புகளை ஆவணப்படுத்துதல்" },
    // Flowering (Days 61-75)
    { day: 61, phase: "Flowering", task: "Observe finger (ear) emergence from boot leaf", taskTamil: "விரல் (கதிர்) உறையிலிருந்து வெளிப்படுவதை கவனித்தல்" },
    { day: 62, phase: "Flowering", task: "Critical irrigation at 50% flowering stage", taskTamil: "50% பூக்கும் நிலையில் முக்கியமான நீர்ப்பாசனம்" },
    { day: 63, phase: "Flowering", task: "Monitor for earhead caterpillar attack", taskTamil: "கதிர் புழு தாக்குதலை கண்காணித்தல்" },
    { day: 64, phase: "Flowering", task: "Spray Quinalphos 25EC @ 2ml/L for caterpillar", taskTamil: "புழுவுக்கு குயினால்பாஸ் 25EC @ 2மி.லி/லி தெளித்தல்" },
    { day: 65, phase: "Flowering", task: "Check finger blast disease on earheads", taskTamil: "கதிர்களில் விரல் கருகல் நோயை சரிபார்த்தல்" },
    { day: 66, phase: "Flowering", task: "Spray Carbendazim 50WP @ 1g/L for finger blast", taskTamil: "விரல் கருகலுக்கு கார்பென்டாசிம் 50WP @ 1கி/லி தெளித்தல்" },
    { day: 67, phase: "Flowering", task: "Ensure no water stress during grain setting", taskTamil: "தானிய உருவாகும் போது நீர் பற்றாக்குறை இல்லை என்பதை உறுதி செய்தல்" },
    { day: 68, phase: "Flowering", task: "Monitor all fingers for uniform development", taskTamil: "ஒரே மாதிரியான வளர்ச்சிக்கு அனைத்து விரல்களையும் கண்காணித்தல்" },
    { day: 69, phase: "Flowering", task: "Check for bird damage on developing grains", taskTamil: "வளரும் தானியங்களில் பறவை சேதத்தை சரிபார்த்தல்" },
    { day: 70, phase: "Flowering", task: "Install bird scarers around the field", taskTamil: "வயலைச் சுற்றி பறவை விரட்டிகள் நிறுவுதல்" },
    { day: 71, phase: "Flowering", task: "Monitor grain filling progression", taskTamil: "தானிய நிரம்புதலின் முன்னேற்றத்தை கண்காணித்தல்" },
    { day: 72, phase: "Flowering", task: "Ninth irrigation for grain development", taskTamil: "தானிய வளர்ச்சிக்கு ஒன்பதாவது நீர்ப்பாசனம்" },
    { day: 73, phase: "Flowering", task: "Check for sheath blight symptoms", taskTamil: "உறை கருகல் அறிகுறிகளை சரிபார்த்தல்" },
    { day: 74, phase: "Flowering", task: "Spray Hexaconazole 5EC if blight detected", taskTamil: "கருகல் காணப்பட்டால் ஹெக்சாகோனசோல் 5EC தெளித்தல்" },
    { day: 75, phase: "Flowering", task: "Document flowering and grain set observations", taskTamil: "பூக்கும் மற்றும் தானிய உருவாகும் கவனிப்புகளை ஆவணப்படுத்துதல்" },
    // Grain Filling (Days 76-90)
    { day: 76, phase: "Grain Filling", task: "Monitor grain hardening on earheads", taskTamil: "கதிர்களில் தானிய கடினமாவதை கண்காணித்தல்" },
    { day: 77, phase: "Grain Filling", task: "Light irrigation for grain filling support", taskTamil: "தானிய நிரப்புதலுக்கு ஆதரவாக லேசான நீர்ப்பாசனம்" },
    { day: 78, phase: "Grain Filling", task: "Check grain color change (green to brown)", taskTamil: "தானிய நிற மாற்றத்தை சரிபார்த்தல் (பச்சை முதல் பழுப்பு)" },
    { day: 79, phase: "Grain Filling", task: "Protect from heavy rain damage", taskTamil: "கனமழை சேதத்திலிருந்து பாதுகாத்தல்" },
    { day: 80, phase: "Grain Filling", task: "Monitor for grain mold development", taskTamil: "தானிய பூஞ்சை வளர்ச்சியை கண்காணித்தல்" },
    { day: 81, phase: "Grain Filling", task: "Check straw color turning yellow", taskTamil: "வைக்கோல் நிறம் மஞ்சளாக மாறுவதை சரிபார்த்தல்" },
    { day: 82, phase: "Grain Filling", task: "Reduce irrigation frequency gradually", taskTamil: "நீர்ப்பாசன அதிர்வெண்ணை படிப்படியாக குறைத்தல்" },
    { day: 83, phase: "Grain Filling", task: "Check maturity by pressing grain (hard and firm)", taskTamil: "தானியத்தை அழுத்தி முதிர்வை சரிபார்த்தல் (கடினம் மற்றும் உறுதி)" },
    { day: 84, phase: "Grain Filling", task: "Stop irrigation 7 days before harvest", taskTamil: "அறுவடைக்கு 7 நாட்களுக்கு முன் நீர்ப்பாசனம் நிறுத்துதல்" },
    { day: 85, phase: "Grain Filling", task: "Prepare harvesting tools and storage area", taskTamil: "அறுவடை கருவிகள் மற்றும் சேமிப்பு பகுதியை தயாரித்தல்" },
    { day: 86, phase: "Grain Filling", task: "Monitor complete grain maturity indicators", taskTamil: "முழுமையான தானிய முதிர்வு குறிகாட்டிகளை கண்காணித்தல்" },
    { day: 87, phase: "Grain Filling", task: "Check field drying conditions", taskTamil: "வயல் உலர்த்தும் நிலைகளை சரிபார்த்தல்" },
    { day: 88, phase: "Grain Filling", task: "Plan harvest labor and logistics", taskTamil: "அறுவடை தொழிலாளர் மற்றும் தளவாடங்களை திட்டமிடுதல்" },
    { day: 89, phase: "Grain Filling", task: "Final field inspection before harvest", taskTamil: "அறுவடைக்கு முன் இறுதி வயல் ஆய்வு" },
    { day: 90, phase: "Grain Filling", task: "Confirm readiness for harvest", taskTamil: "அறுவடைக்கான தயார்நிலையை உறுதிப்படுத்துதல்" },
    // Maturation & Harvest (Days 91-100)
    { day: 91, phase: "Maturation & Harvest", task: "Harvest earheads when fully mature (brown/dry)", taskTamil: "முழுமையாக முதிர்ந்ததும் (பழுப்பு/உலர்ந்த) கதிர்களை அறுவடை செய்தல்" },
    { day: 92, phase: "Maturation & Harvest", task: "Cut earheads using sickle leaving 5cm stalk", taskTamil: "5செ.மீ தண்டை விட்டு அரிவாளால் கதிர்களை வெட்டுதல்" },
    { day: 93, phase: "Maturation & Harvest", task: "Stack earheads on threshing floor for sun drying", taskTamil: "வெயிலில் உலர்த்த கதிர்களை போர்க்களத்தில் அடுக்குதல்" },
    { day: 94, phase: "Maturation & Harvest", task: "Dry for 3-4 days until moisture reaches 12%", taskTamil: "ஈரப்பதம் 12% அடையும் வரை 3-4 நாட்கள் உலர்த்துதல்" },
    { day: 95, phase: "Maturation & Harvest", task: "Thresh using wooden stick or mechanical thresher", taskTamil: "மரக்குச்சி அல்லது இயந்திர தூற்றுவான் பயன்படுத்தி தூற்றுதல்" },
    { day: 96, phase: "Maturation & Harvest", task: "Winnow to separate grain from chaff", taskTamil: "தானியத்தை பதரிலிருந்து பிரிக்க புடைத்தல்" },
    { day: 97, phase: "Maturation & Harvest", task: "Grade grains by size and quality", taskTamil: "அளவு மற்றும் தரத்தின் படி தானியங்களை தரம் பிரித்தல்" },
    { day: 98, phase: "Maturation & Harvest", task: "Treat grains with storage pest protectant", taskTamil: "சேமிப்பு பூச்சி பாதுகாப்பான் கொண்டு தானியங்களை சிகிச்சை செய்தல்" },
    { day: 99, phase: "Maturation & Harvest", task: "Store in jute bags or metal bins at 12% moisture", taskTamil: "12% ஈரப்பதத்தில் சணல் பைகள் அல்லது உலோக தொட்டிகளில் சேமித்தல்" },
    { day: 100, phase: "Maturation & Harvest", task: "Record yield data: expected 2.5-3.5 tonnes/ha", taskTamil: "மகசூல் தரவை பதிவு செய்தல்: எதிர்பார்ப்பு 2.5-3.5 டன்/ஹெக்" },
  ];

  // Detailed Sorghum (Jowar) tasks with Tamil translations - 100 days
  const sorghumTasks = [
    // Land Preparation (Days 1-10)
    { day: 1, phase: "Land Preparation", task: "Deep plow the field to 25-30cm depth", taskTamil: "25-30செ.மீ ஆழத்திற்கு நிலத்தை ஆழ உழவு செய்தல்" },
    { day: 2, phase: "Land Preparation", task: "Apply 8-10 tons FYM per hectare", taskTamil: "ஹெக்டேருக்கு 8-10 டன் தொழு உரம் இடுதல்" },
    { day: 3, phase: "Land Preparation", task: "Harrow twice to break soil clods", taskTamil: "மண் கட்டிகளை உடைக்க இருமுறை கலப்பை ஓட்டுதல்" },
    { day: 4, phase: "Land Preparation", task: "Level field with planking for uniform moisture", taskTamil: "சீரான ஈரப்பதத்திற்கு பலகையால் நிலத்தை சமன் செய்தல்" },
    { day: 5, phase: "Land Preparation", task: "Test soil (ideal pH 6.0-8.0, well-drained)", taskTamil: "மண் சோதனை செய்தல் (சிறந்த pH 6.0-8.0, நல்ல வடிகால்)" },
    { day: 6, phase: "Land Preparation", task: "Apply basal fertilizer: 80kg N, 40kg P2O5/ha", taskTamil: "அடியுரம் இடுதல்: 80கி.கி N, 40கி.கி P2O5/ஹெக்" },
    { day: 7, phase: "Land Preparation", task: "Create furrows at 45cm row spacing", taskTamil: "45செ.மீ வரிசை இடைவெளியில் சால்கள் அமைத்தல்" },
    { day: 8, phase: "Land Preparation", task: "Pre-sowing irrigation (rauni)", taskTamil: "விதைப்புக்கு முன் நீர்ப்பாசனம் (ரௌனி)" },
    { day: 9, phase: "Land Preparation", task: "Allow field to reach proper tilth condition", taskTamil: "நிலம் சரியான பண்பட்ட நிலையை அடைய அனுமதித்தல்" },
    { day: 10, phase: "Land Preparation", task: "Final seed bed preparation and marking rows", taskTamil: "இறுதி விதைப்படுக்கை தயாரிப்பு மற்றும் வரிசைகளை குறித்தல்" },
    // Sowing (Days 11-20)
    { day: 11, phase: "Sowing", task: "Select certified hybrid seeds (CSH 16, CSH 23)", taskTamil: "சான்றளிக்கப்பட்ட கலப்பின விதைகள் தேர்வு (CSH 16, CSH 23)" },
    { day: 12, phase: "Sowing", task: "Treat seeds with Thiram + Carbendazim @ 2g/kg each", taskTamil: "திரம் + கார்பென்டாசிம் @ 2கி/கி.கி கொண்டு விதை நேர்த்தி" },
    { day: 13, phase: "Sowing", task: "Treat seeds with Imidacloprid 70WS for shoot fly", taskTamil: "தண்டு ஈக்கு இமிடாக்ளோப்ரிட் 70WS கொண்டு விதை நேர்த்தி" },
    { day: 14, phase: "Sowing", task: "Sow seeds at 3-5cm depth using seed drill", taskTamil: "விதை ட்ரில் பயன்படுத்தி 3-5செ.மீ ஆழத்தில் விதைத்தல்" },
    { day: 15, phase: "Sowing", task: "Maintain 45x15cm spacing (10kg seed/ha)", taskTamil: "45x15செ.மீ இடைவெளி பராமரித்தல் (10கி.கி விதை/ஹெக்)" },
    { day: 16, phase: "Sowing", task: "Cover seeds properly and compact soil lightly", taskTamil: "விதைகளை சரியாக மூடி மண்ணை லேசாக அமுக்குதல்" },
    { day: 17, phase: "Sowing", task: "Apply Carbofuran 3G in seed furrows for shoot fly", taskTamil: "தண்டு ஈக்கு விதை சால்களில் கார்போஃபுரான் 3G இடுதல்" },
    { day: 18, phase: "Sowing", task: "Light irrigation if soil moisture is insufficient", taskTamil: "மண் ஈரப்பதம் போதவில்லையெனில் லேசான நீர்ப்பாசனம்" },
    { day: 19, phase: "Sowing", task: "Monitor for ant damage to seeds", taskTamil: "விதைகளுக்கு எறும்பு சேதத்தை கண்காணித்தல்" },
    { day: 20, phase: "Sowing", task: "Check germination (expected >85% in 5-7 days)", taskTamil: "முளைப்பை சரிபார்த்தல் (5-7 நாட்களில் >85% எதிர்பார்ப்பு)" },
    // Early Growth (Days 21-40)
    { day: 21, phase: "Early Growth", task: "Monitor seedling emergence uniformity", taskTamil: "நாற்று வெளிப்பாட்டின் ஒருசீர் தன்மையை கண்காணித்தல்" },
    { day: 22, phase: "Early Growth", task: "Gap fill with soaked seeds within 10 days", taskTamil: "10 நாட்களுக்குள் ஊறவைத்த விதைகளால் இடைவெளி நிரப்புதல்" },
    { day: 23, phase: "Early Growth", task: "Check for shoot fly deadhearts (dried central leaf)", taskTamil: "தண்டு ஈ இறந்த இதயங்களை சரிபார்த்தல் (உலர்ந்த மைய இலை)" },
    { day: 24, phase: "Early Growth", task: "Spray Endosulfan 35EC @ 2ml/L if shoot fly >10%", taskTamil: "தண்டு ஈ >10% இருந்தால் எண்டோசல்பான் 35EC @ 2மி.லி/லி தெளித்தல்" },
    { day: 25, phase: "Early Growth", task: "Thin plants to 15cm spacing at 10-12 DAS", taskTamil: "10-12 DAS இல் 15செ.மீ இடைவெளிக்கு செடிகளை தேய்த்தல்" },
    { day: 26, phase: "Early Growth", task: "First hand weeding and interculture at 15 DAS", taskTamil: "15 DAS இல் முதல் கை களை மற்றும் இடைப்பண்படுத்தல்" },
    { day: 27, phase: "Early Growth", task: "Apply Atrazine 50WP @ 1kg/ha pre-emergence", taskTamil: "முளைப்புக்கு முன் அட்ராசின் 50WP @ 1கி.கி/ஹெக் இடுதல்" },
    { day: 28, phase: "Early Growth", task: "First irrigation at 20 DAS if no rain", taskTamil: "மழை இல்லையெனில் 20 DAS இல் முதல் நீர்ப்பாசனம்" },
    { day: 29, phase: "Early Growth", task: "Monitor for stem borer (bore holes on stem)", taskTamil: "தண்டு துளைப்பானை கண்காணித்தல் (தண்டில் துளை ஓட்டைகள்)" },
    { day: 30, phase: "Early Growth", task: "Apply first top dressing: 40kg N/ha at 30 DAS", taskTamil: "முதல் மேலுரம்: 30 DAS இல் 40கி.கி N/ஹெக் இடுதல்" },
    { day: 31, phase: "Early Growth", task: "Second irrigation at 10-12 day interval", taskTamil: "10-12 நாட்கள் இடைவெளியில் இரண்டாவது நீர்ப்பாசனம்" },
    { day: 32, phase: "Early Growth", task: "Second hand weeding at 30 DAS", taskTamil: "30 DAS இல் இரண்டாவது கை களை எடுத்தல்" },
    { day: 33, phase: "Early Growth", task: "Monitor for leaf spot disease", taskTamil: "இலை புள்ளி நோயை கண்காணித்தல்" },
    { day: 34, phase: "Early Growth", task: "Spray Mancozeb 75WP @ 2.5g/L for leaf spot", taskTamil: "இலை புள்ளிக்கு மான்கோசெப் 75WP @ 2.5கி/லி தெளித்தல்" },
    { day: 35, phase: "Early Growth", task: "Earthing up around plant base for support", taskTamil: "ஆதரவுக்கு செடியின் அடிப்பாகத்தை மண் அணைத்தல்" },
    { day: 36, phase: "Early Growth", task: "Check for fall armyworm infestation", taskTamil: "பால் ஆர்மி புழு தாக்குதலை சரிபார்த்தல்" },
    { day: 37, phase: "Early Growth", task: "Apply Emamectin Benzoate 5SG for armyworm", taskTamil: "ஆர்மி புழுவுக்கு எமமெக்டின் பென்சோயேட் 5SG இடுதல்" },
    { day: 38, phase: "Early Growth", task: "Third irrigation based on crop requirement", taskTamil: "பயிர் தேவையின் அடிப்படையில் மூன்றாவது நீர்ப்பாசனம்" },
    { day: 39, phase: "Early Growth", task: "Check nutrient deficiency: yellowing = N, purpling = P", taskTamil: "ஊட்டச்சத்து குறைபாட்டை சரிபார்த்தல்: மஞ்சள் = N, ஊதா = P" },
    { day: 40, phase: "Early Growth", task: "Document growth stage and plant population", taskTamil: "வளர்ச்சி நிலை மற்றும் செடி எண்ணிக்கையை ஆவணப்படுத்துதல்" },
    // Vegetative Stage (Days 41-60)
    { day: 41, phase: "Vegetative Stage", task: "Apply second top dressing: 40kg N/ha at 45 DAS", taskTamil: "இரண்டாவது மேலுரம்: 45 DAS இல் 40கி.கி N/ஹெக் இடுதல்" },
    { day: 42, phase: "Vegetative Stage", task: "Fourth irrigation at boot leaf stage", taskTamil: "உறை இலை நிலையில் நான்காவது நீர்ப்பாசனம்" },
    { day: 43, phase: "Vegetative Stage", task: "Monitor for downy mildew (white growth on leaves)", taskTamil: "இலைப்புள்ளி நோயை கண்காணித்தல் (இலைகளில் வெள்ளை வளர்ச்சி)" },
    { day: 44, phase: "Vegetative Stage", task: "Spray Metalaxyl 35WS if downy mildew detected", taskTamil: "இலைப்புள்ளி நோய் கண்டறியப்பட்டால் மெட்டாலாக்சில் 35WS தெளித்தல்" },
    { day: 45, phase: "Vegetative Stage", task: "Check for sugarcane aphid infestation", taskTamil: "கரும்பு அஃபிட் தாக்குதலை சரிபார்த்தல்" },
    { day: 46, phase: "Vegetative Stage", task: "Spray Imidacloprid 17.8SL for aphid control", taskTamil: "அஃபிட் கட்டுப்பாட்டுக்கு இமிடாக்ளோப்ரிட் 17.8SL தெளித்தல்" },
    { day: 47, phase: "Vegetative Stage", task: "Monitor plant height and internode length", taskTamil: "செடி உயரம் மற்றும் கணு இடைவெளி நீளத்தை கண்காணித்தல்" },
    { day: 48, phase: "Vegetative Stage", task: "Fifth irrigation before panicle initiation", taskTamil: "கதிர் தொடக்கத்திற்கு முன் ஐந்தாவது நீர்ப்பாசனம்" },
    { day: 49, phase: "Vegetative Stage", task: "Check for charcoal rot at stem base", taskTamil: "தண்டு அடிப்பாகத்தில் கரி அழுகலை சரிபார்த்தல்" },
    { day: 50, phase: "Vegetative Stage", task: "Spray Neem oil 5% as preventive pest measure", taskTamil: "தடுப்பு பூச்சி நடவடிக்கையாக வேப்ப எண்ணெய் 5% தெளித்தல்" },
    { day: 51, phase: "Vegetative Stage", task: "Monitor for head midge at boot stage", taskTamil: "உறை நிலையில் தலை மிட்ஜ் கண்காணித்தல்" },
    { day: 52, phase: "Vegetative Stage", task: "Spray Carbaryl 50WP @ 2g/L for midge control", taskTamil: "மிட்ஜ் கட்டுப்பாட்டுக்கு கார்பாரில் 50WP @ 2கி/லி தெளித்தல்" },
    { day: 53, phase: "Vegetative Stage", task: "Monitor flag leaf emergence", taskTamil: "கொடி இலை வெளிப்படுவதை கண்காணித்தல்" },
    { day: 54, phase: "Vegetative Stage", task: "Sixth irrigation at flag leaf stage", taskTamil: "கொடி இலை நிலையில் ஆறாவது நீர்ப்பாசனம்" },
    { day: 55, phase: "Vegetative Stage", task: "Check for anthracnose on leaves and stems", taskTamil: "இலைகள் மற்றும் தண்டுகளில் ஆந்த்ராக்னோஸ் சரிபார்த்தல்" },
    { day: 56, phase: "Vegetative Stage", task: "Spray Propiconazole 25EC for anthracnose", taskTamil: "ஆந்த்ராக்னோஸுக்கு ப்ரோபிகோனசோல் 25EC தெளித்தல்" },
    { day: 57, phase: "Vegetative Stage", task: "Check stem strength for lodging resistance", taskTamil: "சாய்வு எதிர்ப்புக்கு தண்டு வலிமையை சரிபார்த்தல்" },
    { day: 58, phase: "Vegetative Stage", task: "Monitor overall crop health and vigor", taskTamil: "ஒட்டுமொத்த பயிர் ஆரோக்கியம் மற்றும் வீரியத்தை கண்காணித்தல்" },
    { day: 59, phase: "Vegetative Stage", task: "Prepare for flowering stage management", taskTamil: "பூக்கும் நிலை மேலாண்மைக்கு தயாராகுதல்" },
    { day: 60, phase: "Vegetative Stage", task: "Document vegetative growth observations", taskTamil: "தாவர வளர்ச்சி கவனிப்புகளை ஆவணப்படுத்துதல்" },
    // Flowering (Days 61-75)
    { day: 61, phase: "Flowering", task: "Observe panicle emergence from boot leaf", taskTamil: "உறை இலையிலிருந்து கதிர் வெளிப்படுவதை கவனித்தல்" },
    { day: 62, phase: "Flowering", task: "Critical irrigation at 50% flowering", taskTamil: "50% பூக்கும் நிலையில் முக்கியமான நீர்ப்பாசனம்" },
    { day: 63, phase: "Flowering", task: "Monitor for earhead bug infestation", taskTamil: "கதிர் பூச்சி தாக்குதலை கண்காணித்தல்" },
    { day: 64, phase: "Flowering", task: "Spray Malathion 50EC for earhead bug control", taskTamil: "கதிர் பூச்சி கட்டுப்பாட்டுக்கு மாலத்தியான் 50EC தெளித்தல்" },
    { day: 65, phase: "Flowering", task: "Check for grain mold on developing panicles", taskTamil: "வளரும் கதிர்களில் தானிய பூஞ்சையை சரிபார்த்தல்" },
    { day: 66, phase: "Flowering", task: "Spray Carbendazim 50WP @ 1g/L for grain mold", taskTamil: "தானிய பூஞ்சைக்கு கார்பென்டாசிம் 50WP @ 1கி/லி தெளித்தல்" },
    { day: 67, phase: "Flowering", task: "Avoid water stress during grain setting", taskTamil: "தானிய உருவாகும் போது நீர் பற்றாக்குறையை தவிர்த்தல்" },
    { day: 68, phase: "Flowering", task: "Monitor pollination and seed set uniformity", taskTamil: "மகரந்தச் சேர்க்கை மற்றும் விதை உருவாகும் ஒருசீர் தன்மையை கண்காணித்தல்" },
    { day: 69, phase: "Flowering", task: "Check for bird damage (parrots, sparrows)", taskTamil: "பறவை சேதத்தை சரிபார்த்தல் (கிளிகள், குருவிகள்)" },
    { day: 70, phase: "Flowering", task: "Install reflective tapes and bird scarers", taskTamil: "பிரதிபலிக்கும் நாடாக்கள் மற்றும் பறவை விரட்டிகள் நிறுவுதல்" },
    { day: 71, phase: "Flowering", task: "Eighth irrigation for grain development", taskTamil: "தானிய வளர்ச்சிக்கு எட்டாவது நீர்ப்பாசனம்" },
    { day: 72, phase: "Flowering", task: "Monitor for head smut disease", taskTamil: "தலை கரிப்பூட்டை நோயை கண்காணித்தல்" },
    { day: 73, phase: "Flowering", task: "Remove smut-infected plants from field", taskTamil: "கரிப்பூட்டை பாதிக்கப்பட்ட செடிகளை வயலிலிருந்து அகற்றுதல்" },
    { day: 74, phase: "Flowering", task: "Monitor grain milk stage progression", taskTamil: "தானிய பால் நிலை முன்னேற்றத்தை கண்காணித்தல்" },
    { day: 75, phase: "Flowering", task: "Document flowering and grain set observations", taskTamil: "பூக்கும் மற்றும் தானிய உருவாகும் கவனிப்புகளை ஆவணப்படுத்துதல்" },
    // Grain Filling (Days 76-88)
    { day: 76, phase: "Grain Filling", task: "Monitor grain filling and dough stage", taskTamil: "தானிய நிரப்புதல் மற்றும் மாவு நிலையை கண்காணித்தல்" },
    { day: 77, phase: "Grain Filling", task: "Light irrigation to support grain filling", taskTamil: "தானிய நிரப்புதலுக்கு ஆதரவாக லேசான நீர்ப்பாசனம்" },
    { day: 78, phase: "Grain Filling", task: "Protect from heavy bird damage during dough stage", taskTamil: "மாவு நிலையில் கடுமையான பறவை சேதத்திலிருந்து பாதுகாத்தல்" },
    { day: 79, phase: "Grain Filling", task: "Check for striga weed parasitism on roots", taskTamil: "வேர்களில் ஸ்ட்ரிகா களை ஒட்டுண்ணி தன்மையை சரிபார்த்தல்" },
    { day: 80, phase: "Grain Filling", task: "Monitor grain color change to varietal color", taskTamil: "ரக நிறத்திற்கு தானிய நிற மாற்றத்தை கண்காணித்தல்" },
    { day: 81, phase: "Grain Filling", task: "Reduce irrigation gradually", taskTamil: "நீர்ப்பாசனத்தை படிப்படியாக குறைத்தல்" },
    { day: 82, phase: "Grain Filling", task: "Check grain hardness by pressing with thumbnail", taskTamil: "கட்டைவிரல் நகத்தால் அழுத்தி தானிய கடினத்தன்மையை சரிபார்த்தல்" },
    { day: 83, phase: "Grain Filling", task: "Stop irrigation 10 days before harvest", taskTamil: "அறுவடைக்கு 10 நாட்களுக்கு முன் நீர்ப்பாசனம் நிறுத்துதல்" },
    { day: 84, phase: "Grain Filling", task: "Monitor straw drying and plant senescence", taskTamil: "வைக்கோல் உலர்தல் மற்றும் செடி முதிர்வை கண்காணித்தல்" },
    { day: 85, phase: "Grain Filling", task: "Check physiological maturity (black layer on grain)", taskTamil: "உடலியல் முதிர்வை சரிபார்த்தல் (தானியத்தில் கருப்பு அடுக்கு)" },
    { day: 86, phase: "Grain Filling", task: "Prepare threshing floor and storage", taskTamil: "போர்க்களம் மற்றும் சேமிப்பை தயாரித்தல்" },
    { day: 87, phase: "Grain Filling", task: "Arrange harvesting labor and equipment", taskTamil: "அறுவடை தொழிலாளர் மற்றும் உபகரணங்களை ஏற்பாடு செய்தல்" },
    { day: 88, phase: "Grain Filling", task: "Final maturity check before harvest", taskTamil: "அறுவடைக்கு முன் இறுதி முதிர்வு சோதனை" },
    // Maturation & Harvest (Days 89-100)
    { day: 89, phase: "Maturation & Harvest", task: "Harvest earheads at 20% grain moisture", taskTamil: "20% தானிய ஈரப்பதத்தில் கதிர்களை அறுவடை செய்தல்" },
    { day: 90, phase: "Maturation & Harvest", task: "Cut panicles 15cm below the head", taskTamil: "தலைக்கு 15செ.மீ கீழே கதிர்களை வெட்டுதல்" },
    { day: 91, phase: "Maturation & Harvest", task: "Stack earheads for sun drying on clean surface", taskTamil: "சுத்தமான மேற்பரப்பில் வெயில் உலர்த்த கதிர்களை அடுக்குதல்" },
    { day: 92, phase: "Maturation & Harvest", task: "Cut stalks for fodder use (valuable byproduct)", taskTamil: "தீவன பயன்பாட்டிற்கு தண்டுகளை வெட்டுதல் (மதிப்புள்ள துணை பொருள்)" },
    { day: 93, phase: "Maturation & Harvest", task: "Dry earheads for 3-5 days until 12% moisture", taskTamil: "12% ஈரப்பதம் வரை 3-5 நாட்கள் கதிர்களை உலர்த்துதல்" },
    { day: 94, phase: "Maturation & Harvest", task: "Thresh using mechanical thresher or bullocks", taskTamil: "இயந்திர தூற்றுவான் அல்லது காளைகள் பயன்படுத்தி தூற்றுதல்" },
    { day: 95, phase: "Maturation & Harvest", task: "Winnow to clean grain from chaff and dust", taskTamil: "பதர் மற்றும் தூசியிலிருந்து தானியத்தை சுத்தம் செய்ய புடைத்தல்" },
    { day: 96, phase: "Maturation & Harvest", task: "Grade grains: bold, medium, and small", taskTamil: "தானியங்களை தரம் பிரித்தல்: பெரிய, நடுத்தர, சிறிய" },
    { day: 97, phase: "Maturation & Harvest", task: "Treat with Malathion 5% dust for storage pests", taskTamil: "சேமிப்பு பூச்சிகளுக்கு மாலத்தியான் 5% தூள் கொண்டு சிகிச்சை" },
    { day: 98, phase: "Maturation & Harvest", task: "Store in gunny bags in cool, dry godown", taskTamil: "குளிர்ச்சியான, உலர்ந்த கிடங்கில் சணல் பைகளில் சேமித்தல்" },
    { day: 99, phase: "Maturation & Harvest", task: "Record yield data: expected 3.0-4.5 tonnes/ha", taskTamil: "மகசூல் தரவை பதிவு செய்தல்: எதிர்பார்ப்பு 3.0-4.5 டன்/ஹெக்" },
    { day: 100, phase: "Maturation & Harvest", task: "Plan crop rotation for next season", taskTamil: "அடுத்த பருவத்திற்கு பயிர் சுழற்சியை திட்டமிடுதல்" },
  ];

  // Detailed Groundnut (Peanut) tasks with Tamil translations - 100 days
  const groundnutTasks = [
    // Land Preparation (Days 1-10)
    { day: 1, phase: "Land Preparation", task: "Deep plow field to 25-30cm to loosen soil", taskTamil: "மண்ணை தளர்த்த 25-30செ.மீ ஆழத்திற்கு ஆழ உழவு செய்தல்" },
    { day: 2, phase: "Land Preparation", task: "Apply 5 tons FYM + 500kg gypsum per hectare", taskTamil: "ஹெக்டேருக்கு 5 டன் தொழு உரம் + 500கி.கி ஜிப்சம் இடுதல்" },
    { day: 3, phase: "Land Preparation", task: "Harrow twice and level the field", taskTamil: "இருமுறை கலப்பை ஓட்டி நிலத்தை சமன் செய்தல்" },
    { day: 4, phase: "Land Preparation", task: "Test soil pH (ideal 6.0-6.5) and nutrients", taskTamil: "மண் pH (சிறந்தது 6.0-6.5) மற்றும் ஊட்டச்சத்துகளை சோதிக்கவும்" },
    { day: 5, phase: "Land Preparation", task: "Apply basal dose: 25kg N, 50kg P2O5, 40kg K2O/ha", taskTamil: "அடியுரம்: 25கி.கி N, 50கி.கி P2O5, 40கி.கி K2O/ஹெக் இடுதல்" },
    { day: 6, phase: "Land Preparation", task: "Form ridges and furrows at 30cm spacing", taskTamil: "30செ.மீ இடைவெளியில் பார் மற்றும் சால் அமைத்தல்" },
    { day: 7, phase: "Land Preparation", task: "Apply Trichoderma viride @ 2.5kg/ha to soil", taskTamil: "மண்ணில் டிரைக்கோடெர்மா விரிடி @ 2.5கி.கி/ஹெக் இடுதல்" },
    { day: 8, phase: "Land Preparation", task: "Pre-sowing irrigation and allow to dry to tilth", taskTamil: "விதைப்புக்கு முன் நீர்ப்பாசனம் செய்து பண்படும் வரை உலர விடுதல்" },
    { day: 9, phase: "Land Preparation", task: "Check for soil-borne pest (white grub) presence", taskTamil: "மண்வழி பூச்சி (வெள்ளை புழு) இருப்பை சரிபார்த்தல்" },
    { day: 10, phase: "Land Preparation", task: "Final seed bed preparation for sowing", taskTamil: "விதைப்புக்கு இறுதி விதைப்படுக்கை தயாரிப்பு" },
    // Sowing (Days 11-20)
    { day: 11, phase: "Sowing", task: "Select certified seeds (TMV 7, CO 6, VRI 2)", taskTamil: "சான்றளிக்கப்பட்ட விதைகள் தேர்வு (TMV 7, CO 6, VRI 2)" },
    { day: 12, phase: "Sowing", task: "Shell kernels carefully without damaging seed coat", taskTamil: "விதை தோலை சேதப்படுத்தாமல் கவனமாக உடைத்தல்" },
    { day: 13, phase: "Sowing", task: "Treat seeds with Thiram @ 4g/kg + Rhizobium culture", taskTamil: "திரம் @ 4கி/கி.கி + ரைசோபியம் கலாசாரம் கொண்டு விதை நேர்த்தி" },
    { day: 14, phase: "Sowing", task: "Sow kernels at 5cm depth, 30x10cm spacing", taskTamil: "5செ.மீ ஆழம், 30x10செ.மீ இடைவெளியில் விதைத்தல்" },
    { day: 15, phase: "Sowing", task: "Use 100-120 kg kernels per hectare", taskTamil: "ஹெக்டேருக்கு 100-120 கி.கி கருவைகள் பயன்படுத்துதல்" },
    { day: 16, phase: "Sowing", task: "Cover seeds and compact soil gently", taskTamil: "விதைகளை மூடி மண்ணை மெதுவாக அமுக்குதல்" },
    { day: 17, phase: "Sowing", task: "Apply Chlorpyriphos 10G against white grub", taskTamil: "வெள்ளை புழுவுக்கு எதிராக குளோர்பைரிபாஸ் 10G இடுதல்" },
    { day: 18, phase: "Sowing", task: "Light irrigation after sowing if soil is dry", taskTamil: "மண் உலர்ந்திருந்தால் விதைப்புக்குப் பிறகு லேசான நீர்ப்பாசனம்" },
    { day: 19, phase: "Sowing", task: "Monitor germination (expected in 5-7 days)", taskTamil: "முளைப்பை கண்காணித்தல் (5-7 நாட்களில் எதிர்பார்ப்பு)" },
    { day: 20, phase: "Sowing", task: "Check germination percentage (>85% ideal)", taskTamil: "முளைப்பு சதவீதம் சரிபார்த்தல் (>85% சிறந்தது)" },
    // Early Growth (Days 21-40)
    { day: 21, phase: "Early Growth", task: "Gap fill with pre-soaked seeds within 7 days", taskTamil: "7 நாட்களுக்குள் ஊறவைத்த விதைகளால் இடைவெளி நிரப்புதல்" },
    { day: 22, phase: "Early Growth", task: "First hand weeding at 15-20 DAS", taskTamil: "15-20 DAS இல் முதல் கை களை எடுத்தல்" },
    { day: 23, phase: "Early Growth", task: "Apply Pendimethalin 30EC pre-emergence herbicide", taskTamil: "பென்டிமெத்தாலின் 30EC முளைப்புக்கு முன் களைக்கொல்லி இடுதல்" },
    { day: 24, phase: "Early Growth", task: "First irrigation at 15-20 DAS", taskTamil: "15-20 DAS இல் முதல் நீர்ப்பாசனம்" },
    { day: 25, phase: "Early Growth", task: "Monitor for leaf miner tunnels on leaves", taskTamil: "இலைகளில் இலை துளைப்பான் சுரங்கங்களை கண்காணித்தல்" },
    { day: 26, phase: "Early Growth", task: "Spray Monocrotophos 36SL for leaf miner", taskTamil: "இலை துளைப்பானுக்கு மோனோக்ரோட்டோபாஸ் 36SL தெளித்தல்" },
    { day: 27, phase: "Early Growth", task: "Check for tikka disease (cercospora leaf spot)", taskTamil: "டிக்கா நோயை (செர்கோஸ்போரா இலை புள்ளி) சரிபார்த்தல்" },
    { day: 28, phase: "Early Growth", task: "Spray Mancozeb 75WP @ 2.5g/L for tikka disease", taskTamil: "டிக்கா நோய்க்கு மான்கோசெப் 75WP @ 2.5கி/லி தெளித்தல்" },
    { day: 29, phase: "Early Growth", task: "Second hand weeding at 30 DAS", taskTamil: "30 DAS இல் இரண்டாவது கை களை எடுத்தல்" },
    { day: 30, phase: "Early Growth", task: "Second irrigation at 10-day interval", taskTamil: "10 நாள் இடைவெளியில் இரண்டாவது நீர்ப்பாசனம்" },
    { day: 31, phase: "Early Growth", task: "Monitor for aphid and thrips infestation", taskTamil: "அஃபிட் மற்றும் த்ரிப்ஸ் தாக்குதலை கண்காணித்தல்" },
    { day: 32, phase: "Early Growth", task: "Spray Dimethoate 30EC for sucking pests", taskTamil: "உறிஞ்சும் பூச்சிகளுக்கு டைமீத்தோயேட் 30EC தெளித்தல்" },
    { day: 33, phase: "Early Growth", task: "Check for iron chlorosis (yellowing between veins)", taskTamil: "இரும்பு குறைபாட்டை சரிபார்த்தல் (நரம்புகளுக்கிடையே மஞ்சள்)" },
    { day: 34, phase: "Early Growth", task: "Spray FeSO4 @ 0.5% if iron deficiency observed", taskTamil: "இரும்பு குறைபாடு காணப்பட்டால் FeSO4 @ 0.5% தெளித்தல்" },
    { day: 35, phase: "Early Growth", task: "Apply gypsum @ 500kg/ha at flowering initiation", taskTamil: "பூக்கும் தொடக்கத்தில் ஜிப்சம் @ 500கி.கி/ஹெக் இடுதல்" },
    { day: 36, phase: "Early Growth", task: "Third irrigation to maintain soil moisture", taskTamil: "மண் ஈரப்பதத்தை பராமரிக்க மூன்றாவது நீர்ப்பாசனம்" },
    { day: 37, phase: "Early Growth", task: "Earthing up around plant base", taskTamil: "செடியின் அடிப்பாகத்தை மண் அணைத்தல்" },
    { day: 38, phase: "Early Growth", task: "Monitor for red hairy caterpillar", taskTamil: "சிவப்பு ரோம புழுவை கண்காணித்தல்" },
    { day: 39, phase: "Early Growth", task: "Install pheromone traps for Spodoptera", taskTamil: "ஸ்போடோப்டெராவுக்கு ஃபெரோமோன் பொறிகள் நிறுவுதல்" },
    { day: 40, phase: "Early Growth", task: "Document plant growth and branching pattern", taskTamil: "செடி வளர்ச்சி மற்றும் கிளைத்தல் முறையை ஆவணப்படுத்துதல்" },
    // Flowering & Pegging (Days 41-60)
    { day: 41, phase: "Flowering & Pegging", task: "Observe first flower emergence (30-35 DAS)", taskTamil: "முதல் பூ வெளிப்படுவதை கவனித்தல் (30-35 DAS)" },
    { day: 42, phase: "Flowering & Pegging", task: "Critical irrigation during flowering stage", taskTamil: "பூக்கும் நிலையில் முக்கியமான நீர்ப்பாசனம்" },
    { day: 43, phase: "Flowering & Pegging", task: "Monitor peg penetration into soil", taskTamil: "ஊசி மண்ணில் ஊடுருவுவதை கண்காணித்தல்" },
    { day: 44, phase: "Flowering & Pegging", task: "Ensure loose soil around plant for peg entry", taskTamil: "ஊசி நுழைவதற்கு செடியைச் சுற்றி தளர்வான மண் உறுதி செய்தல்" },
    { day: 45, phase: "Flowering & Pegging", task: "Apply gypsum if not applied earlier (calcium for pods)", taskTamil: "முன்னர் இடவில்லையெனில் ஜிப்சம் இடுதல் (காய்களுக்கு கால்சியம்)" },
    { day: 46, phase: "Flowering & Pegging", task: "Check for collar rot disease at stem base", taskTamil: "தண்டு அடிப்பாகத்தில் காலர் அழுகல் நோயை சரிபார்த்தல்" },
    { day: 47, phase: "Flowering & Pegging", task: "Drench Carbendazim 1g/L around infected plants", taskTamil: "பாதிக்கப்பட்ட செடிகளைச் சுற்றி கார்பென்டாசிம் 1கி/லி ஊற்றுதல்" },
    { day: 48, phase: "Flowering & Pegging", task: "Fourth irrigation at peg formation stage", taskTamil: "ஊசி உருவாகும் நிலையில் நான்காவது நீர்ப்பாசனம்" },
    { day: 49, phase: "Flowering & Pegging", task: "Monitor for rust disease (reddish-brown pustules)", taskTamil: "துரு நோயை கண்காணித்தல் (செம்பழுப்பு கொப்புளங்கள்)" },
    { day: 50, phase: "Flowering & Pegging", task: "Spray Hexaconazole 5EC for rust control", taskTamil: "துரு கட்டுப்பாட்டுக்கு ஹெக்சாகோனசோல் 5EC தெளித்தல்" },
    { day: 51, phase: "Flowering & Pegging", task: "Avoid disturbing soil near pegging zone", taskTamil: "ஊசி பகுதிக்கு அருகில் மண்ணை தொந்தரவு செய்வதை தவிர்த்தல்" },
    { day: 52, phase: "Flowering & Pegging", task: "Fifth irrigation to support pod development", taskTamil: "காய் வளர்ச்சிக்கு ஆதரவாக ஐந்தாவது நீர்ப்பாசனம்" },
    { day: 53, phase: "Flowering & Pegging", task: "Spray Neem oil 3% for pest prevention", taskTamil: "பூச்சி தடுப்புக்கு வேப்ப எண்ணெய் 3% தெளித்தல்" },
    { day: 54, phase: "Flowering & Pegging", task: "Monitor for late leaf spot disease", taskTamil: "பிற்பகுதி இலை புள்ளி நோயை கண்காணித்தல்" },
    { day: 55, phase: "Flowering & Pegging", task: "Spray Chlorothalonil 75WP @ 2g/L if spotted", taskTamil: "புள்ளி காணப்பட்டால் குளோரோத்தாலோனில் 75WP @ 2கி/லி தெளித்தல்" },
    { day: 56, phase: "Flowering & Pegging", task: "Check for pod borer larvae on developing pods", taskTamil: "வளரும் காய்களில் காய் துளைப்பான் புழுக்களை சரிபார்த்தல்" },
    { day: 57, phase: "Flowering & Pegging", task: "Spray Quinalphos 25EC for pod borer control", taskTamil: "காய் துளைப்பான் கட்டுப்பாட்டுக்கு குயினால்பாஸ் 25EC தெளித்தல்" },
    { day: 58, phase: "Flowering & Pegging", task: "Sixth irrigation maintaining adequate moisture", taskTamil: "போதுமான ஈரப்பதம் பராமரிக்க ஆறாவது நீர்ப்பாசனம்" },
    { day: 59, phase: "Flowering & Pegging", task: "Monitor overall flowering and pegging progress", taskTamil: "ஒட்டுமொத்த பூக்கும் மற்றும் ஊசி முன்னேற்றத்தை கண்காணித்தல்" },
    { day: 60, phase: "Flowering & Pegging", task: "Document flowering count and peg formation data", taskTamil: "பூக்கும் எண்ணிக்கை மற்றும் ஊசி உருவாகும் தரவை ஆவணப்படுத்துதல்" },
    // Pod Development (Days 61-80)
    { day: 61, phase: "Pod Development", task: "Monitor underground pod formation and size", taskTamil: "நிலத்தடி காய் உருவாக்கம் மற்றும் அளவை கண்காணித்தல்" },
    { day: 62, phase: "Pod Development", task: "Seventh irrigation for pod filling stage", taskTamil: "காய் நிரம்பும் நிலையில் ஏழாவது நீர்ப்பாசனம்" },
    { day: 63, phase: "Pod Development", task: "Check inner shell color (dark brown = maturing)", taskTamil: "உள் ஓடு நிறத்தை சரிபார்த்தல் (கரும்பழுப்பு = முதிர்ச்சி)" },
    { day: 64, phase: "Pod Development", task: "Monitor for Aspergillus (aflatoxin) contamination", taskTamil: "ஆஸ்பர்ஜில்லஸ் (அஃப்ளாடாக்சின்) மாசுபாட்டை கண்காணித்தல்" },
    { day: 65, phase: "Pod Development", task: "Avoid waterlogging which promotes aflatoxin", taskTamil: "அஃப்ளாடாக்சினை ஊக்குவிக்கும் நீர் தேக்கத்தை தவிர்த்தல்" },
    { day: 66, phase: "Pod Development", task: "Check for termite damage at root zone", taskTamil: "வேர் பகுதியில் கரையான் சேதத்தை சரிபார்த்தல்" },
    { day: 67, phase: "Pod Development", task: "Apply Chlorpyriphos drench if termites found", taskTamil: "கரையான் காணப்பட்டால் குளோர்பைரிபாஸ் ஊற்றுதல்" },
    { day: 68, phase: "Pod Development", task: "Eighth irrigation at pod filling", taskTamil: "காய் நிரம்பும் நிலையில் எட்டாவது நீர்ப்பாசனம்" },
    { day: 69, phase: "Pod Development", task: "Monitor leaf defoliation (natural senescence begins)", taskTamil: "இலை உதிர்வை கண்காணித்தல் (இயற்கை முதிர்வு தொடங்கும்)" },
    { day: 70, phase: "Pod Development", task: "Check pod maturity by sampling (open few pods)", taskTamil: "மாதிரி எடுத்து காய் முதிர்வை சரிபார்த்தல் (சில காய்களை திறக்கவும்)" },
    { day: 71, phase: "Pod Development", task: "Reduce irrigation frequency gradually", taskTamil: "நீர்ப்பாசன அதிர்வெண்ணை படிப்படியாக குறைத்தல்" },
    { day: 72, phase: "Pod Development", task: "Monitor kernel development inside pods", taskTamil: "காய்களுக்குள் கரு வளர்ச்சியை கண்காணித்தல்" },
    { day: 73, phase: "Pod Development", task: "Check for dry root rot symptoms", taskTamil: "உலர் வேர் அழுகல் அறிகுறிகளை சரிபார்த்தல்" },
    { day: 74, phase: "Pod Development", task: "Spray fungicide if root rot is spreading", taskTamil: "வேர் அழுகல் பரவினால் பூஞ்சைக்கொல்லி தெளித்தல்" },
    { day: 75, phase: "Pod Development", task: "Last irrigation 10 days before harvest", taskTamil: "அறுவடைக்கு 10 நாட்களுக்கு முன் கடைசி நீர்ப்பாசனம்" },
    { day: 76, phase: "Pod Development", task: "Check pod maturity: shell veins prominent, kernel plump", taskTamil: "காய் முதிர்வை சரிபார்த்தல்: ஓடு நரம்புகள் புடைப்பு, கரு பருமன்" },
    { day: 77, phase: "Pod Development", task: "Monitor leaf yellowing and drop (80% defoliation ideal)", taskTamil: "இலை மஞ்சள் மற்றும் உதிர்வை கண்காணித்தல் (80% உதிர்வு சிறந்தது)" },
    { day: 78, phase: "Pod Development", task: "Prepare harvesting equipment and drying area", taskTamil: "அறுவடை உபகரணங்கள் மற்றும் உலர்த்தும் பகுதியை தயாரித்தல்" },
    { day: 79, phase: "Pod Development", task: "Final pod maturity test (kernels fill 75% of shell)", taskTamil: "இறுதி காய் முதிர்வு சோதனை (கருக்கள் ஓட்டின் 75% நிரப்பும்)" },
    { day: 80, phase: "Pod Development", task: "Arrange labor for harvest operations", taskTamil: "அறுவடை நடவடிக்கைகளுக்கு தொழிலாளர்களை ஏற்பாடு செய்தல்" },
    // Maturation & Harvest (Days 81-100)
    { day: 81, phase: "Maturation & Harvest", task: "Irrigate lightly one day before harvest for easy pulling", taskTamil: "எளிதாக பிடுங்க அறுவடைக்கு ஒரு நாள் முன் லேசாக நீர்ப்பாசனம்" },
    { day: 82, phase: "Maturation & Harvest", task: "Uproot plants by hand or blade harrow", taskTamil: "கையால் அல்லது கலப்பையால் செடிகளை பிடுங்குதல்" },
    { day: 83, phase: "Maturation & Harvest", task: "Shake off excess soil from pods", taskTamil: "காய்களிலிருந்து அதிகப்படியான மண்ணை உதறுதல்" },
    { day: 84, phase: "Maturation & Harvest", task: "Stack plants in small heaps for field drying (2-3 days)", taskTamil: "வயலில் உலர்த்த சிறிய குவியல்களாக அடுக்குதல் (2-3 நாட்கள்)" },
    { day: 85, phase: "Maturation & Harvest", task: "Strip pods from plants by hand or stripper", taskTamil: "கையால் அல்லது ஸ்ட்ரிப்பர் மூலம் செடிகளிலிருந்து காய்களை பிரித்தல்" },
    { day: 86, phase: "Maturation & Harvest", task: "Wash pods to remove soil if needed", taskTamil: "தேவைப்பட்டால் மண்ணை அகற்ற காய்களை கழுவுதல்" },
    { day: 87, phase: "Maturation & Harvest", task: "Sun dry pods on clean surface for 4-5 days", taskTamil: "சுத்தமான மேற்பரப்பில் 4-5 நாட்கள் வெயிலில் காய்களை உலர்த்துதல்" },
    { day: 88, phase: "Maturation & Harvest", task: "Check pod moisture content (should be 8-10%)", taskTamil: "காய் ஈரப்பத உள்ளடக்கத்தை சரிபார்த்தல் (8-10% இருக்க வேண்டும்)" },
    { day: 89, phase: "Maturation & Harvest", task: "Sort pods: sound, shriveled, damaged categories", taskTamil: "காய்களை வகைப்படுத்துதல்: நல்ல, சுருங்கிய, சேதமடைந்த வகைகள்" },
    { day: 90, phase: "Maturation & Harvest", task: "Shell sample pods to check kernel quality", taskTamil: "கரு தரத்தை சரிபார்க்க மாதிரி காய்களை உடைத்தல்" },
    { day: 91, phase: "Maturation & Harvest", task: "Grade kernels by size: bold, medium, small", taskTamil: "அளவின் படி கருக்களை தரம் பிரித்தல்: பெரிய, நடுத்தர, சிறிய" },
    { day: 92, phase: "Maturation & Harvest", task: "Check for aflatoxin-free status visually", taskTamil: "அஃப்ளாடாக்சின் இல்லா நிலையை காட்சி பரிசோதனை செய்தல்" },
    { day: 93, phase: "Maturation & Harvest", task: "Treat pods with Malathion 5% dust for storage", taskTamil: "சேமிப்புக்கு மாலத்தியான் 5% தூள் கொண்டு காய்களை சிகிச்சை செய்தல்" },
    { day: 94, phase: "Maturation & Harvest", task: "Store in clean jute bags in dry, ventilated godown", taskTamil: "உலர்ந்த, காற்றோட்டமுள்ள கிடங்கில் சுத்தமான சணல் பைகளில் சேமித்தல்" },
    { day: 95, phase: "Maturation & Harvest", task: "Stack bags on wooden platforms (not on floor)", taskTamil: "பைகளை மரத் தளங்களில் அடுக்குதல் (தரையில் அல்ல)" },
    { day: 96, phase: "Maturation & Harvest", task: "Use haulms as quality cattle fodder", taskTamil: "தாள்களை தரமான கால்நடை தீவனமாக பயன்படுத்துதல்" },
    { day: 97, phase: "Maturation & Harvest", task: "Check market price and plan sales", taskTamil: "சந்தை விலையை சரிபார்த்து விற்பனையை திட்டமிடுதல்" },
    { day: 98, phase: "Maturation & Harvest", task: "Maintain storage temperature below 25°C", taskTamil: "சேமிப்பு வெப்பநிலையை 25°C க்கு கீழே பராமரித்தல்" },
    { day: 99, phase: "Maturation & Harvest", task: "Record yield data: expected 1.5-2.5 tonnes/ha", taskTamil: "மகசூல் தரவை பதிவு செய்தல்: எதிர்பார்ப்பு 1.5-2.5 டன்/ஹெக்" },
    { day: 100, phase: "Maturation & Harvest", task: "Plan next season crop rotation (cereals preferred)", taskTamil: "அடுத்த பருவ பயிர் சுழற்சியை திட்டமிடுதல் (தானியங்கள் விரும்பத்தக்கது)" },
  ];

  // Detailed Green Gram (Moong) tasks with Tamil translations - 65 days
  const greenGramTasks = [
    // Land Preparation (Days 1-7)
    { day: 1, phase: "Land Preparation", task: "Plow field once and harrow twice for fine tilth", taskTamil: "நிலத்தை ஒருமுறை உழுது இருமுறை கலப்பை ஓட்டி நல்ல பண்படுத்துதல்" },
    { day: 2, phase: "Land Preparation", task: "Apply 5 tons FYM per hectare and incorporate", taskTamil: "ஹெக்டேருக்கு 5 டன் தொழு உரம் இட்டு கலத்தல்" },
    { day: 3, phase: "Land Preparation", task: "Level field and form ridges at 30cm spacing", taskTamil: "நிலத்தை சமன் செய்து 30செ.மீ இடைவெளியில் பார் அமைத்தல்" },
    { day: 4, phase: "Land Preparation", task: "Test soil pH (ideal 6.2-7.2) and nutrient status", taskTamil: "மண் pH (சிறந்தது 6.2-7.2) மற்றும் ஊட்டச்சத்து நிலையை சோதித்தல்" },
    { day: 5, phase: "Land Preparation", task: "Apply basal dose: 20kg N, 40kg P2O5, 20kg K2O/ha", taskTamil: "அடியுரம்: 20கி.கி N, 40கி.கி P2O5, 20கி.கி K2O/ஹெக் இடுதல்" },
    { day: 6, phase: "Land Preparation", task: "Pre-sowing irrigation and allow soil to dry", taskTamil: "விதைப்புக்கு முன் நீர்ப்பாசனம் செய்து மண் உலர விடுதல்" },
    { day: 7, phase: "Land Preparation", task: "Final seed bed preparation", taskTamil: "இறுதி விதைப்படுக்கை தயாரிப்பு" },
    // Sowing (Days 8-12)
    { day: 8, phase: "Sowing", task: "Select certified seeds (CO 8, VBN 3, SML 668)", taskTamil: "சான்றளிக்கப்பட்ட விதைகள் தேர்வு (CO 8, VBN 3, SML 668)" },
    { day: 9, phase: "Sowing", task: "Treat seeds with Rhizobium + Thiram @ 2g/kg", taskTamil: "ரைசோபியம் + திரம் @ 2கி/கி.கி கொண்டு விதை நேர்த்தி" },
    { day: 10, phase: "Sowing", task: "Sow seeds at 3-4cm depth, 30x10cm spacing", taskTamil: "3-4செ.மீ ஆழம், 30x10செ.மீ இடைவெளியில் விதைத்தல்" },
    { day: 11, phase: "Sowing", task: "Use 20-25 kg seed per hectare", taskTamil: "ஹெக்டேருக்கு 20-25 கி.கி விதை பயன்படுத்துதல்" },
    { day: 12, phase: "Sowing", task: "Light irrigation after sowing and check germination", taskTamil: "விதைப்புக்குப் பிறகு லேசான நீர்ப்பாசனம் மற்றும் முளைப்பை சரிபார்த்தல்" },
    // Early Growth (Days 13-25)
    { day: 13, phase: "Early Growth", task: "Monitor germination (expected 3-5 days)", taskTamil: "முளைப்பை கண்காணித்தல் (3-5 நாட்களில் எதிர்பார்ப்பு)" },
    { day: 14, phase: "Early Growth", task: "Gap filling with pre-soaked seeds", taskTamil: "ஊறவைத்த விதைகளால் இடைவெளி நிரப்புதல்" },
    { day: 15, phase: "Early Growth", task: "First hand weeding at 15 DAS", taskTamil: "15 DAS இல் முதல் கை களை எடுத்தல்" },
    { day: 16, phase: "Early Growth", task: "Apply Pendimethalin pre-emergence herbicide", taskTamil: "பென்டிமெத்தாலின் முளைப்புக்கு முன் களைக்கொல்லி இடுதல்" },
    { day: 17, phase: "Early Growth", task: "First irrigation at 15-20 DAS if no rain", taskTamil: "மழை இல்லையெனில் 15-20 DAS இல் முதல் நீர்ப்பாசனம்" },
    { day: 18, phase: "Early Growth", task: "Monitor for whitefly (vector of Yellow Mosaic Virus)", taskTamil: "வெள்ளை ஈயை கண்காணித்தல் (மஞ்சள் மொசைக் வைரஸ் கடத்தி)" },
    { day: 19, phase: "Early Growth", task: "Spray Imidacloprid 17.8SL for whitefly control", taskTamil: "வெள்ளை ஈ கட்டுப்பாட்டுக்கு இமிடாக்ளோப்ரிட் 17.8SL தெளித்தல்" },
    { day: 20, phase: "Early Growth", task: "Check for Yellow Mosaic Virus symptoms (yellow patches)", taskTamil: "மஞ்சள் மொசைக் வைரஸ் அறிகுறிகளை சரிபார்த்தல் (மஞ்சள் திட்டுகள்)" },
    { day: 21, phase: "Early Growth", task: "Remove YMV-infected plants immediately", taskTamil: "YMV பாதிக்கப்பட்ட செடிகளை உடனடியாக அகற்றுதல்" },
    { day: 22, phase: "Early Growth", task: "Second hand weeding at 25 DAS", taskTamil: "25 DAS இல் இரண்டாவது கை களை எடுத்தல்" },
    { day: 23, phase: "Early Growth", task: "Check for powdery mildew on leaves", taskTamil: "இலைகளில் சாம்பல் பூஞ்சையை சரிபார்த்தல்" },
    { day: 24, phase: "Early Growth", task: "Spray wettable sulphur 80WP @ 3g/L for mildew", taskTamil: "சாம்பல் பூஞ்சைக்கு ஈரமான கந்தகம் 80WP @ 3கி/லி தெளித்தல்" },
    { day: 25, phase: "Early Growth", task: "Second irrigation and monitor growth", taskTamil: "இரண்டாவது நீர்ப்பாசனம் மற்றும் வளர்ச்சியை கண்காணித்தல்" },
    // Flowering (Days 26-40)
    { day: 26, phase: "Flowering", task: "Observe first flower clusters emerging", taskTamil: "முதல் பூ கொத்துகள் வெளிப்படுவதை கவனித்தல்" },
    { day: 27, phase: "Flowering", task: "Critical irrigation at flowering (avoid stress)", taskTamil: "பூக்கும் போது முக்கியமான நீர்ப்பாசனம் (பற்றாக்குறையை தவிர்க்கவும்)" },
    { day: 28, phase: "Flowering", task: "Monitor for thrips damage on flowers", taskTamil: "பூக்களில் த்ரிப்ஸ் சேதத்தை கண்காணித்தல்" },
    { day: 29, phase: "Flowering", task: "Spray Dimethoate 30EC for thrips control", taskTamil: "த்ரிப்ஸ் கட்டுப்பாட்டுக்கு டைமீத்தோயேட் 30EC தெளித்தல்" },
    { day: 30, phase: "Flowering", task: "Check for pod borer (Maruca) on flower buds", taskTamil: "பூ மொட்டுகளில் காய் துளைப்பான் (மருகா) சரிபார்த்தல்" },
    { day: 31, phase: "Flowering", task: "Spray Neem oil 5% for pod borer management", taskTamil: "காய் துளைப்பான் மேலாண்மைக்கு வேப்ப எண்ணெய் 5% தெளித்தல்" },
    { day: 32, phase: "Flowering", task: "Monitor pollination and pod initiation", taskTamil: "மகரந்தச் சேர்க்கை மற்றும் காய் தொடக்கத்தை கண்காணித்தல்" },
    { day: 33, phase: "Flowering", task: "Apply foliar spray of DAP 2% for better pod set", taskTamil: "சிறந்த காய் உருவாக்கத்திற்கு DAP 2% இலைவழி தெளிப்பு" },
    { day: 34, phase: "Flowering", task: "Third irrigation to support pod development", taskTamil: "காய் வளர்ச்சிக்கு ஆதரவாக மூன்றாவது நீர்ப்பாசனம்" },
    { day: 35, phase: "Flowering", task: "Check for cercospora leaf spot disease", taskTamil: "செர்கோஸ்போரா இலை புள்ளி நோயை சரிபார்த்தல்" },
    { day: 36, phase: "Flowering", task: "Spray Carbendazim 50WP @ 1g/L for leaf spot", taskTamil: "இலை புள்ளிக்கு கார்பென்டாசிம் 50WP @ 1கி/லி தெளித்தல்" },
    { day: 37, phase: "Flowering", task: "Monitor for aphid colonies on tender pods", taskTamil: "இளம் காய்களில் அஃபிட் கூட்டங்களை கண்காணித்தல்" },
    { day: 38, phase: "Flowering", task: "Observe pod filling and seed development", taskTamil: "காய் நிரம்புதல் மற்றும் விதை வளர்ச்சியை கவனித்தல்" },
    { day: 39, phase: "Flowering", task: "Avoid water logging (promotes root rot)", taskTamil: "நீர் தேக்கத்தை தவிர்த்தல் (வேர் அழுகலை ஊக்குவிக்கும்)" },
    { day: 40, phase: "Flowering", task: "Document flowering and pod formation data", taskTamil: "பூக்கும் மற்றும் காய் உருவாகும் தரவை ஆவணப்படுத்துதல்" },
    // Pod Maturation (Days 41-55)
    { day: 41, phase: "Pod Maturation", task: "Monitor pod color change (green to brown/black)", taskTamil: "காய் நிற மாற்றத்தை கண்காணித்தல் (பச்சை முதல் பழுப்பு/கருப்பு)" },
    { day: 42, phase: "Pod Maturation", task: "Check seed hardness inside pods", taskTamil: "காய்களுக்குள் விதை கடினத்தன்மையை சரிபார்த்தல்" },
    { day: 43, phase: "Pod Maturation", task: "Reduce irrigation as pods mature", taskTamil: "காய்கள் முதிரும்போது நீர்ப்பாசனத்தை குறைத்தல்" },
    { day: 44, phase: "Pod Maturation", task: "Monitor for pod shattering tendency", taskTamil: "காய் உடைவு போக்கை கண்காணித்தல்" },
    { day: 45, phase: "Pod Maturation", task: "Stop irrigation 5 days before first harvest", taskTamil: "முதல் அறுவடைக்கு 5 நாட்களுக்கு முன் நீர்ப்பாசனம் நிறுத்துதல்" },
    { day: 46, phase: "Pod Maturation", task: "Check 80% pods turned brown for harvest readiness", taskTamil: "80% காய்கள் பழுப்பு நிறமாக மாறியதை சரிபார்த்தல்" },
    { day: 47, phase: "Pod Maturation", task: "Plan first picking of mature pods", taskTamil: "முதிர்ந்த காய்களின் முதல் பறிப்பை திட்டமிடுதல்" },
    { day: 48, phase: "Pod Maturation", task: "First harvest: pick mature brown/black pods", taskTamil: "முதல் அறுவடை: முதிர்ந்த பழுப்பு/கருப்பு காய்களை பறித்தல்" },
    { day: 49, phase: "Pod Maturation", task: "Sun dry picked pods for 2-3 days", taskTamil: "பறித்த காய்களை 2-3 நாட்கள் வெயிலில் உலர்த்துதல்" },
    { day: 50, phase: "Pod Maturation", task: "Second picking of remaining mature pods", taskTamil: "மீதமுள்ள முதிர்ந்த காய்களின் இரண்டாவது பறிப்பு" },
    { day: 51, phase: "Pod Maturation", task: "Monitor remaining pods on plant", taskTamil: "செடியில் மீதமுள்ள காய்களை கண்காணித்தல்" },
    { day: 52, phase: "Pod Maturation", task: "Third and final picking", taskTamil: "மூன்றாவது மற்றும் இறுதி பறிப்பு" },
    { day: 53, phase: "Pod Maturation", task: "Cut remaining plant for fodder", taskTamil: "மீதமுள்ள செடியை தீவனத்திற்கு வெட்டுதல்" },
    { day: 54, phase: "Pod Maturation", task: "Dry all harvested pods thoroughly", taskTamil: "அறுவடை செய்த அனைத்து காய்களையும் நன்கு உலர்த்துதல்" },
    { day: 55, phase: "Pod Maturation", task: "Prepare for threshing operations", taskTamil: "தூற்றும் நடவடிக்கைகளுக்கு தயாரித்தல்" },
    // Post-Harvest (Days 56-65)
    { day: 56, phase: "Post-Harvest", task: "Thresh dried pods by beating or machine", taskTamil: "உலர்ந்த காய்களை அடித்து அல்லது இயந்திரம் மூலம் தூற்றுதல்" },
    { day: 57, phase: "Post-Harvest", task: "Winnow to separate grain from husk", taskTamil: "தானியத்தை உமியிலிருந்து பிரிக்க புடைத்தல்" },
    { day: 58, phase: "Post-Harvest", task: "Sun dry grains to 10-12% moisture content", taskTamil: "10-12% ஈரப்பதத்திற்கு தானியங்களை வெயிலில் உலர்த்துதல்" },
    { day: 59, phase: "Post-Harvest", task: "Grade grains by size and remove damaged ones", taskTamil: "அளவின் படி தரம் பிரித்து சேதமடைந்தவை அகற்றுதல்" },
    { day: 60, phase: "Post-Harvest", task: "Treat with Neem leaf powder for storage pest control", taskTamil: "சேமிப்பு பூச்சி கட்டுப்பாட்டுக்கு வேப்ப இலை தூள் கொண்டு சிகிச்சை" },
    { day: 61, phase: "Post-Harvest", task: "Store in clean, dry gunny or HDPE bags", taskTamil: "சுத்தமான, உலர்ந்த சணல் அல்லது HDPE பைகளில் சேமித்தல்" },
    { day: 62, phase: "Post-Harvest", task: "Stack bags on raised platform in cool godown", taskTamil: "குளிர்ச்சியான கிடங்கில் உயர்த்தப்பட்ட தளத்தில் பைகளை அடுக்குதல்" },
    { day: 63, phase: "Post-Harvest", task: "Check market rates and plan sales timing", taskTamil: "சந்தை விலைகளை சரிபார்த்து விற்பனை நேரத்தை திட்டமிடுதல்" },
    { day: 64, phase: "Post-Harvest", task: "Record yield data: expected 0.8-1.2 tonnes/ha", taskTamil: "மகசூல் தரவை பதிவு செய்தல்: எதிர்பார்ப்பு 0.8-1.2 டன்/ஹெக்" },
    { day: 65, phase: "Post-Harvest", task: "Incorporate green gram residues for soil enrichment", taskTamil: "மண் வளப்படுத்தலுக்கு பயிர் எச்சங்களை கலத்தல்" },
  ];

  // Detailed Sesame (Til) tasks with Tamil translations - 85 days
  const sesameTasks = [
    // Land Preparation (Days 1-8)
    { day: 1, phase: "Land Preparation", task: "Plow field 2-3 times to obtain fine tilth", taskTamil: "நல்ல பண்படுத்தல் பெற 2-3 முறை நிலத்தை உழுதல்" },
    { day: 2, phase: "Land Preparation", task: "Apply 5 tons FYM per hectare", taskTamil: "ஹெக்டேருக்கு 5 டன் தொழு உரம் இடுதல்" },
    { day: 3, phase: "Land Preparation", task: "Level the field for uniform moisture distribution", taskTamil: "சீரான ஈரப்பத விநியோகத்திற்கு நிலத்தை சமன் செய்தல்" },
    { day: 4, phase: "Land Preparation", task: "Test soil pH (ideal 5.5-8.0, well-drained)", taskTamil: "மண் pH சோதித்தல் (சிறந்தது 5.5-8.0, நல்ல வடிகால்)" },
    { day: 5, phase: "Land Preparation", task: "Apply basal dose: 35kg N, 15kg P2O5, 15kg K2O/ha", taskTamil: "அடியுரம்: 35கி.கி N, 15கி.கி P2O5, 15கி.கி K2O/ஹெக் இடுதல்" },
    { day: 6, phase: "Land Preparation", task: "Form ridges and furrows at 30cm row spacing", taskTamil: "30செ.மீ வரிசை இடைவெளியில் பார் மற்றும் சால் அமைத்தல்" },
    { day: 7, phase: "Land Preparation", task: "Pre-sowing irrigation (light) for moisture", taskTamil: "ஈரப்பதத்திற்கு விதைப்புக்கு முன் (லேசான) நீர்ப்பாசனம்" },
    { day: 8, phase: "Land Preparation", task: "Final seed bed preparation", taskTamil: "இறுதி விதைப்படுக்கை தயாரிப்பு" },
    // Sowing (Days 9-15)
    { day: 9, phase: "Sowing", task: "Select certified seeds (TMV 7, CO 1, SVPR 1)", taskTamil: "சான்றளிக்கப்பட்ட விதைகள் தேர்வு (TMV 7, CO 1, SVPR 1)" },
    { day: 10, phase: "Sowing", task: "Treat seeds with Trichoderma viride @ 4g/kg", taskTamil: "டிரைக்கோடெர்மா விரிடி @ 4கி/கி.கி கொண்டு விதை நேர்த்தி" },
    { day: 11, phase: "Sowing", task: "Mix seeds with fine sand for uniform sowing (small seeds)", taskTamil: "சீரான விதைப்புக்கு மெல்லிய மணலுடன் விதைகளை கலத்தல் (சிறிய விதைகள்)" },
    { day: 12, phase: "Sowing", task: "Sow in lines at 1-2cm depth, 30x15cm spacing", taskTamil: "1-2செ.மீ ஆழம், 30x15செ.மீ இடைவெளியில் வரிசையில் விதைத்தல்" },
    { day: 13, phase: "Sowing", task: "Use 5-6 kg seed per hectare (very fine seeds)", taskTamil: "ஹெக்டேருக்கு 5-6 கி.கி விதை பயன்படுத்துதல் (மிக நுண்ணிய விதைகள்)" },
    { day: 14, phase: "Sowing", task: "Cover lightly and avoid deep burial of seeds", taskTamil: "லேசாக மூடி விதைகளை ஆழமாக புதைப்பதை தவிர்த்தல்" },
    { day: 15, phase: "Sowing", task: "Check germination after 4-5 days", taskTamil: "4-5 நாட்களுக்குப் பிறகு முளைப்பை சரிபார்த்தல்" },
    // Early Growth (Days 16-30)
    { day: 16, phase: "Early Growth", task: "Monitor seedling emergence uniformity", taskTamil: "நாற்று வெளிப்பாட்டின் ஒருசீர் தன்மையை கண்காணித்தல்" },
    { day: 17, phase: "Early Growth", task: "Thin seedlings to 15cm plant spacing at 15 DAS", taskTamil: "15 DAS இல் 15செ.மீ செடி இடைவெளிக்கு நாற்றுகளை தேய்த்தல்" },
    { day: 18, phase: "Early Growth", task: "First hand weeding at 15 DAS", taskTamil: "15 DAS இல் முதல் கை களை எடுத்தல்" },
    { day: 19, phase: "Early Growth", task: "Apply Alachlor 50EC pre-emergence herbicide", taskTamil: "அலாக்ளோர் 50EC முளைப்புக்கு முன் களைக்கொல்லி இடுதல்" },
    { day: 20, phase: "Early Growth", task: "First irrigation at 15-20 DAS", taskTamil: "15-20 DAS இல் முதல் நீர்ப்பாசனம்" },
    { day: 21, phase: "Early Growth", task: "Monitor for shoot webber caterpillar", taskTamil: "தண்டு வலை புழுவை கண்காணித்தல்" },
    { day: 22, phase: "Early Growth", task: "Spray Quinalphos 25EC for shoot webber", taskTamil: "தண்டு வலை புழுவுக்கு குயினால்பாஸ் 25EC தெளித்தல்" },
    { day: 23, phase: "Early Growth", task: "Apply first top dressing: 17.5kg N/ha", taskTamil: "முதல் மேலுரம்: 17.5கி.கி N/ஹெக் இடுதல்" },
    { day: 24, phase: "Early Growth", task: "Second hand weeding at 30 DAS", taskTamil: "30 DAS இல் இரண்டாவது கை களை எடுத்தல்" },
    { day: 25, phase: "Early Growth", task: "Check for phyllody disease (green flowers)", taskTamil: "பில்லோடி நோயை சரிபார்த்தல் (பச்சை பூக்கள்)" },
    { day: 26, phase: "Early Growth", task: "Remove phyllody-infected plants immediately", taskTamil: "பில்லோடி பாதிக்கப்பட்ட செடிகளை உடனடியாக அகற்றுதல்" },
    { day: 27, phase: "Early Growth", task: "Second irrigation at 10-day interval", taskTamil: "10 நாள் இடைவெளியில் இரண்டாவது நீர்ப்பாசனம்" },
    { day: 28, phase: "Early Growth", task: "Monitor for leaf roller caterpillar", taskTamil: "இலை சுருட்டு புழுவை கண்காணித்தல்" },
    { day: 29, phase: "Early Growth", task: "Spray Neem oil 3% for pest prevention", taskTamil: "பூச்சி தடுப்புக்கு வேப்ப எண்ணெய் 3% தெளித்தல்" },
    { day: 30, phase: "Early Growth", task: "Document growth stage observations", taskTamil: "வளர்ச்சி நிலை கவனிப்புகளை ஆவணப்படுத்துதல்" },
    // Flowering (Days 31-50)
    { day: 31, phase: "Flowering", task: "Observe first flower appearance (30-35 DAS)", taskTamil: "முதல் பூ தோற்றத்தை கவனித்தல் (30-35 DAS)" },
    { day: 32, phase: "Flowering", task: "Critical irrigation at flowering initiation", taskTamil: "பூக்கும் தொடக்கத்தில் முக்கியமான நீர்ப்பாசனம்" },
    { day: 33, phase: "Flowering", task: "Monitor for gall midge on flower buds", taskTamil: "பூ மொட்டுகளில் கால் மிட்ஜ் கண்காணித்தல்" },
    { day: 34, phase: "Flowering", task: "Spray Dimethoate 30EC for gall midge", taskTamil: "கால் மிட்ஜுக்கு டைமீத்தோயேட் 30EC தெளித்தல்" },
    { day: 35, phase: "Flowering", task: "Check for Alternaria leaf blight", taskTamil: "அல்டர்நேரியா இலை கருகலை சரிபார்த்தல்" },
    { day: 36, phase: "Flowering", task: "Spray Mancozeb 75WP @ 2.5g/L for blight", taskTamil: "கருகலுக்கு மான்கோசெப் 75WP @ 2.5கி/லி தெளித்தல்" },
    { day: 37, phase: "Flowering", task: "Monitor capsule formation on lower branches", taskTamil: "கீழ் கிளைகளில் காப்ஸ்யூல் உருவாவதை கண்காணித்தல்" },
    { day: 38, phase: "Flowering", task: "Third irrigation at capsule development", taskTamil: "காப்ஸ்யூல் வளர்ச்சியில் மூன்றாவது நீர்ப்பாசனம்" },
    { day: 39, phase: "Flowering", task: "Apply foliar micronutrients (Boron + Zinc)", taskTamil: "இலைவழி நுண்ணூட்டச்சத்துகள் (போரான் + துத்தநாகம்) இடுதல்" },
    { day: 40, phase: "Flowering", task: "Check for bacterial leaf spot symptoms", taskTamil: "பாக்டீரியா இலை புள்ளி அறிகுறிகளை சரிபார்த்தல்" },
    { day: 41, phase: "Flowering", task: "Monitor continuous flowering up the stem", taskTamil: "தண்டு மேல் தொடர்ச்சியான பூக்குதலை கண்காணித்தல்" },
    { day: 42, phase: "Flowering", task: "Fourth irrigation for seed filling in capsules", taskTamil: "காப்ஸ்யூல்களில் விதை நிரம்ப நான்காவது நீர்ப்பாசனம்" },
    { day: 43, phase: "Flowering", task: "Monitor for hawk moth caterpillar on leaves", taskTamil: "இலைகளில் ஹாக் மாத் புழுவை கண்காணித்தல்" },
    { day: 44, phase: "Flowering", task: "Hand pick large caterpillars or spray Bio-pesticide", taskTamil: "பெரிய புழுக்களை கையால் பிடித்தல் அல்லது உயிரி பூச்சிக்கொல்லி தெளித்தல்" },
    { day: 45, phase: "Flowering", task: "Check capsule filling progression", taskTamil: "காப்ஸ்யூல் நிரம்பும் முன்னேற்றத்தை சரிபார்த்தல்" },
    { day: 46, phase: "Flowering", task: "Monitor for root rot in waterlogged areas", taskTamil: "நீர் தேக்கமான பகுதிகளில் வேர் அழுகலை கண்காணித்தல்" },
    { day: 47, phase: "Flowering", task: "Ensure drainage in case of heavy rains", taskTamil: "கனமழை ஏற்பட்டால் வடிகால் உறுதி செய்தல்" },
    { day: 48, phase: "Flowering", task: "Check upper capsules for seed development", taskTamil: "மேல் காப்ஸ்யூல்களில் விதை வளர்ச்சியை சரிபார்த்தல்" },
    { day: 49, phase: "Flowering", task: "Reduce irrigation as capsules begin maturing", taskTamil: "காப்ஸ்யூல்கள் முதிரத் தொடங்கும்போது நீர்ப்பாசனத்தை குறைத்தல்" },
    { day: 50, phase: "Flowering", task: "Document flowering and capsule count per plant", taskTamil: "ஒரு செடிக்கு பூக்கும் எண்ணிக்கை மற்றும் காப்ஸ்யூல் எண்ணிக்கையை ஆவணப்படுத்துதல்" },
    // Maturation (Days 51-70)
    { day: 51, phase: "Maturation", task: "Monitor lower capsule color change to yellow", taskTamil: "கீழ் காப்ஸ்யூல் நிறம் மஞ்சளாக மாறுவதை கண்காணித்தல்" },
    { day: 52, phase: "Maturation", task: "Check seed color inside capsules (turning brown)", taskTamil: "காப்ஸ்யூல்களுக்குள் விதை நிறத்தை சரிபார்த்தல் (பழுப்பாக மாறுதல்)" },
    { day: 53, phase: "Maturation", task: "Stop irrigation completely", taskTamil: "நீர்ப்பாசனத்தை முழுமையாக நிறுத்துதல்" },
    { day: 54, phase: "Maturation", task: "Monitor leaf yellowing and defoliation", taskTamil: "இலை மஞ்சள் மற்றும் உதிர்வை கண்காணித்தல்" },
    { day: 55, phase: "Maturation", task: "Check capsule dehiscence tendency (splitting)", taskTamil: "காப்ஸ்யூல் வெடிக்கும் போக்கை சரிபார்த்தல் (பிளவு)" },
    { day: 56, phase: "Maturation", task: "Observe stem and capsule drying pattern", taskTamil: "தண்டு மற்றும் காப்ஸ்யூல் உலர்தல் முறையை கவனித்தல்" },
    { day: 57, phase: "Maturation", task: "Plan harvest timing (before capsules split open)", taskTamil: "அறுவடை நேரத்தை திட்டமிடுதல் (காப்ஸ்யூல்கள் பிளவுபடுவதற்கு முன்)" },
    { day: 58, phase: "Maturation", task: "Check seed moisture content in capsules", taskTamil: "காப்ஸ்யூல்களில் விதை ஈரப்பத உள்ளடக்கத்தை சரிபார்த்தல்" },
    { day: 59, phase: "Maturation", task: "Monitor 75% capsules turned yellow/brown", taskTamil: "75% காப்ஸ்யூல்கள் மஞ்சள்/பழுப்பு நிறமாக மாறியதை கண்காணித்தல்" },
    { day: 60, phase: "Maturation", task: "Prepare drying area and threshing floor", taskTamil: "உலர்த்தும் பகுதி மற்றும் போர்க்களத்தை தயாரித்தல்" },
    { day: 61, phase: "Maturation", task: "Arrange labor for harvest", taskTamil: "அறுவடைக்கு தொழிலாளர்களை ஏற்பாடு செய்தல்" },
    { day: 62, phase: "Maturation", task: "Harvest when lower capsules start to dehisce", taskTamil: "கீழ் காப்ஸ்யூல்கள் வெடிக்கத் தொடங்கும்போது அறுவடை" },
    { day: 63, phase: "Maturation", task: "Cut plants at base using sickle", taskTamil: "அரிவாளால் அடிப்பாகத்தில் செடிகளை வெட்டுதல்" },
    { day: 64, phase: "Maturation", task: "Tie plants in small bundles (10-15 plants)", taskTamil: "சிறிய கட்டுகளாக செடிகளை கட்டுதல் (10-15 செடிகள்)" },
    { day: 65, phase: "Maturation", task: "Stand bundles upright for field drying (5-7 days)", taskTamil: "வயல் உலர்த்தலுக்கு கட்டுகளை நிமிர்த்தி நிறுத்துதல் (5-7 நாட்கள்)" },
    { day: 66, phase: "Maturation", task: "Turn bundles daily for uniform drying", taskTamil: "சீரான உலர்த்தலுக்கு கட்டுகளை தினமும் திருப்புதல்" },
    { day: 67, phase: "Maturation", task: "Check drying progress of capsules", taskTamil: "காப்ஸ்யூல்களின் உலர்தல் முன்னேற்றத்தை சரிபார்த்தல்" },
    { day: 68, phase: "Maturation", task: "Protect from rain during drying period", taskTamil: "உலர்த்தும் காலத்தில் மழையிலிருந்து பாதுகாத்தல்" },
    { day: 69, phase: "Maturation", task: "Check capsules are fully dry and ready for threshing", taskTamil: "காப்ஸ்யூல்கள் முழுமையாக உலர்ந்து தூற்றத் தயாராக உள்ளனவா சரிபார்த்தல்" },
    { day: 70, phase: "Maturation", task: "Transport dried bundles to threshing floor", taskTamil: "உலர்ந்த கட்டுகளை போர்க்களத்திற்கு கொண்டு செல்லுதல்" },
    // Post-Harvest (Days 71-85)
    { day: 71, phase: "Post-Harvest", task: "Invert bundles over sheet and tap to release seeds", taskTamil: "கட்டுகளை விரிப்பின் மீது கவிழ்த்து தட்டி விதைகளை வெளியிடுதல்" },
    { day: 72, phase: "Post-Harvest", task: "Thresh remaining capsules by gentle beating", taskTamil: "மீதமுள்ள காப்ஸ்யூல்களை மெதுவாக அடித்து தூற்றுதல்" },
    { day: 73, phase: "Post-Harvest", task: "Winnow seeds to remove chaff and debris", taskTamil: "பதர் மற்றும் குப்பைகளை அகற்ற விதைகளை புடைத்தல்" },
    { day: 74, phase: "Post-Harvest", task: "Sieve seeds to remove small stones and soil", taskTamil: "சிறிய கற்கள் மற்றும் மண்ணை அகற்ற விதைகளை சல்லடையிடுதல்" },
    { day: 75, phase: "Post-Harvest", task: "Sun dry seeds for 2-3 days to 6-8% moisture", taskTamil: "6-8% ஈரப்பதத்திற்கு 2-3 நாட்கள் விதைகளை வெயிலில் உலர்த்துதல்" },
    { day: 76, phase: "Post-Harvest", task: "Grade seeds by color: white, brown, black varieties", taskTamil: "நிறத்தின் படி விதைகளை தரம் பிரித்தல்: வெள்ளை, பழுப்பு, கருப்பு ரகங்கள்" },
    { day: 77, phase: "Post-Harvest", task: "Remove off-colored and damaged seeds", taskTamil: "நிறம் மாறிய மற்றும் சேதமடைந்த விதைகளை அகற்றுதல்" },
    { day: 78, phase: "Post-Harvest", task: "Check for storage pest presence", taskTamil: "சேமிப்பு பூச்சி இருப்பை சரிபார்த்தல்" },
    { day: 79, phase: "Post-Harvest", task: "Treat with Neem oil coating for storage protection", taskTamil: "சேமிப்பு பாதுகாப்புக்கு வேப்ப எண்ணெய் பூச்சு கொண்டு சிகிச்சை" },
    { day: 80, phase: "Post-Harvest", task: "Store in airtight tins or HDPE bags", taskTamil: "காற்றுப்புகா டின்கள் அல்லது HDPE பைகளில் சேமித்தல்" },
    { day: 81, phase: "Post-Harvest", task: "Keep storage area cool, dry (below 25°C)", taskTamil: "சேமிப்பு பகுதியை குளிர்ச்சியாக, உலர்வாக (25°C க்கு கீழே) வைத்தல்" },
    { day: 82, phase: "Post-Harvest", task: "Check oil content quality if selling for oil extraction", taskTamil: "எண்ணெய் எடுப்புக்கு விற்றால் எண்ணெய் உள்ளடக்க தரத்தை சரிபார்த்தல்" },
    { day: 83, phase: "Post-Harvest", task: "Check market rates for best selling time", taskTamil: "சிறந்த விற்பனை நேரத்திற்கு சந்தை விலைகளை சரிபார்த்தல்" },
    { day: 84, phase: "Post-Harvest", task: "Record yield data: expected 0.5-0.8 tonnes/ha", taskTamil: "மகசூல் தரவை பதிவு செய்தல்: எதிர்பார்ப்பு 0.5-0.8 டன்/ஹெக்" },
    { day: 85, phase: "Post-Harvest", task: "Plan next crop rotation (cereals/pulses preferred)", taskTamil: "அடுத்த பயிர் சுழற்சியை திட்டமிடுதல் (தானியங்கள்/பருப்பு வகைகள் விரும்பத்தக்கது)" },
  ];

  // Generate tasks based on crop's cultivation period
  const generateTasks = (totalDays: number, cropId: string) => {
    // Return detailed bilingual tasks for specific crops
    if (cropId === "pearl-millet") return pearlMilletTasks;
    if (cropId === "finger-millet") return fingerMilletTasks;
    if (cropId === "sorghum") return sorghumTasks;
    if (cropId === "groundnut") return groundnutTasks;
    if (cropId === "green-gram") return greenGramTasks;
    if (cropId === "sesame") return sesameTasks;

    // Generic task generation for other crops
    const phases = [
      {
        name: "Land Preparation",
        percentage: 0.1,
        tasks: ["Plow the field", "Level the soil", "Add organic fertilizer", "Prepare seed bed"],
      },
      {
        name: "Sowing",
        percentage: 0.1,
        tasks: ["Select quality seeds", "Treat seeds", "Sow seeds at proper depth", "Ensure proper spacing"],
      },
      {
        name: "Early Growth",
        percentage: 0.2,
        tasks: ["Monitor germination", "Light irrigation", "Weed control", "Check for pests"],
      },
      {
        name: "Vegetative Stage",
        percentage: 0.25,
        tasks: [
          "Regular irrigation",
          "Apply nitrogen fertilizer",
          "Monitor plant health",
          "Disease prevention",
        ],
      },
      {
        name: "Flowering",
        percentage: 0.15,
        tasks: ["Controlled irrigation", "Pest monitoring", "Apply phosphorus", "Check pollination"],
      },
      {
        name: "Grain Filling",
        percentage: 0.1,
        tasks: ["Maintain moisture", "Monitor grain development", "Prevent lodging", "Watch for diseases"],
      },
      {
        name: "Maturation & Harvest",
        percentage: 0.1,
        tasks: ["Reduce irrigation", "Monitor grain color", "Harvest at right moisture", "Post-harvest handling"],
      },
    ];

    const allTasks = [];
    let currentDay = 1;

    for (const phase of phases) {
      const phaseDays = Math.ceil(totalDays * phase.percentage);
      const endDay = Math.min(currentDay + phaseDays - 1, totalDays);

      for (let day = currentDay; day <= endDay; day++) {
        const taskIndex = Math.floor(((day - currentDay) / phaseDays) * phase.tasks.length);
        allTasks.push({
          day,
          phase: phase.name,
          task: phase.tasks[Math.min(taskIndex, phase.tasks.length - 1)],
        });
      }
      currentDay = endDay + 1;
      if (currentDay > totalDays) break;
    }
    return allTasks;
  };

  const currentCrop = cropOptions.find(c => c.id === selectedCrop);
  const adminTemplate = !currentCrop ? adminTemplates.find((t: any) => t.id === selectedCrop) : null;
  const tasks = selectedCrop ? (
    currentCrop ? generateTasks(currentCrop.days, selectedCrop) :
    adminTemplate ? adminTemplate.tasks.map((t: any) => ({ day: t.day, phase: t.phase, task: t.task, taskTamil: t.taskTamil || "" })) :
    []
  ) : [];
  const isBilingualCrop = selectedCrop === "pearl-millet" || selectedCrop === "finger-millet" || selectedCrop === "sorghum" || selectedCrop === "groundnut" || selectedCrop === "green-gram" || selectedCrop === "sesame" || !!adminTemplate;

  const handleStatusChange = (day: number, status: "completed" | "not-completed" | "in-progress") => {
    setTaskStatuses((prev) => {
      const updated = { ...prev, [day]: status };
      if (selectedCrop) {
        localStorage.setItem(`cropGuidanceProgress_${selectedCrop}`, JSON.stringify(updated));
      }
      return updated;
    });
    const messages = {
      completed: "Task marked as completed!",
      "not-completed": "Task marked as not completed",
      "in-progress": "Task marked as in progress",
    };
    toast.success(messages[status]);
  };

  const getStatusIcon = (day: number) => {
    const status = taskStatuses[day];
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case "not-completed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-secondary" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (day: number) => {
    const status = taskStatuses[day];
    switch (status) {
      case "completed":
        return "default";
      case "not-completed":
        return "destructive";
      case "in-progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Show crop selection if no crop is selected
  if (!selectedCrop) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Agriverse Market</span>
            </div>
            <Button variant="outline" onClick={() => navigate("/farmer-dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Select Your Crop</h1>
            <p className="text-muted-foreground">Choose a crop to view its cultivation guide</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cropOptions.map((crop) => (
              <Card 
                key={crop.id} 
                className="cursor-pointer hover:shadow-glow transition-all overflow-hidden"
                onClick={() => {
                  const cropId = crop.id as CropType;
                  setSelectedCrop(cropId);
                  localStorage.setItem("cropGuidanceSelectedCrop", crop.id);
                  const savedProgress = localStorage.getItem(`cropGuidanceProgress_${crop.id}`);
                  setTaskStatuses(savedProgress ? JSON.parse(savedProgress) : {});
                  toast.success(`${crop.name} cultivation guide selected`);
                }}
              >
                <div className="h-40 overflow-hidden">
                  <img 
                    src={crop.image} 
                    alt={crop.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <crop.icon className={`h-5 w-5 ${crop.color}`} />
                    <span className="line-clamp-1">{crop.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-muted-foreground line-clamp-2">{crop.description}</p>
                  <p className="text-sm font-semibold text-primary">{crop.days} days</p>
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline" size="sm">
                      View Guide
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default"
                      className="gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToMyCrops(crop.name);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                      Track
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Admin-created crop templates */}
            {adminTemplates.map((template: any) => {
              // Skip if already exists in built-in crops
              if (cropOptions.find(c => c.id === template.id)) return null;
              return (
                <Card 
                  key={`admin-${template.id}`} 
                  className="cursor-pointer hover:shadow-glow transition-all overflow-hidden border-primary/30"
                  onClick={() => {
                    setSelectedCrop(template.id);
                    localStorage.setItem("cropGuidanceSelectedCrop", template.id);
                    const savedProgress = localStorage.getItem(`cropGuidanceProgress_${template.id}`);
                    setTaskStatuses(savedProgress ? JSON.parse(savedProgress) : {});
                    toast.success(`${template.name} cultivation guide selected`);
                  }}
                >
                  <div className="h-40 overflow-hidden bg-primary/10 flex items-center justify-center">
                    {template.image ? (
                      <img src={template.image} alt={template.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <Sprout className="h-16 w-16 text-primary/50" />
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sprout className="h-5 w-5 text-primary" />
                      <span className="line-clamp-1">{template.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge variant="outline" className="text-xs">Admin Created</Badge>
                    <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                    <p className="text-sm font-semibold text-primary">{template.days} days</p>
                    <div className="flex gap-2">
                      <Button className="flex-1" variant="outline" size="sm">View Guide</Button>
                      <Button size="sm" variant="default" className="gap-1" onClick={(e) => { e.stopPropagation(); handleAddToMyCrops(template.name); }}>
                        <Plus className="h-3 w-3" /> Track
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Agriverse Market</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setSelectedCrop(null); localStorage.removeItem("cropGuidanceSelectedCrop"); setTaskStatuses({}); }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Change Crop
            </Button>
            <Button variant="outline" onClick={() => navigate("/farmer-dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{(currentCrop?.name || adminTemplate?.name || "Crop")} Cultivation Guide</h1>
          <p className="text-muted-foreground">{(currentCrop?.days || adminTemplate?.days || 0)}-day complete cultivation checklist</p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {Object.values(taskStatuses).filter((s) => s === "completed").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">
                    {Object.values(taskStatuses).filter((s) => s === "in-progress").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold">{(currentCrop?.days || adminTemplate?.days || 0) - Object.keys(taskStatuses).length}</p>
                </div>
                <Sprout className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Dialog key={task.day}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-glow transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">Day {task.day}</span>
                      {getStatusIcon(task.day)}
                    </CardTitle>
                    <Badge variant="outline" className="w-fit">
                      {task.phase}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">{task.task}</p>
                    {isBilingualCrop && 'taskTamil' in task && (
                      <p className="text-xs text-secondary-foreground/70 line-clamp-1 italic">{(task as any).taskTamil}</p>
                    )}
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Day {task.day} - {task.phase}</DialogTitle>
                  <DialogDescription>
                    {isBilingualCrop ? "நாள் " + task.day + " - விவரமான பணி / Detailed cultivation task" : "Cultivation task details and status management"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="text-lg">🇬🇧</span> English
                      </h3>
                      <p className="text-foreground font-medium">{task.task}</p>
                    </div>
                    
                    {isBilingualCrop && 'taskTamil' in task && (
                      <div className="p-4 bg-secondary/50 rounded-lg border border-secondary">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <span className="text-lg">🇮🇳</span> தமிழ் (Tamil)
                        </h3>
                        <p className="text-foreground font-medium">{(task as any).taskTamil}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">
                      {isBilingualCrop ? "Detailed Steps / விரிவான படிகள்" : "Detailed Steps"}
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>{isBilingualCrop ? "Prepare necessary tools and materials / தேவையான கருவிகள் மற்றும் பொருட்களை தயார் செய்யுங்கள்" : "Prepare necessary tools and materials"}</li>
                      <li>{isBilingualCrop ? "Check weather conditions before starting / தொடங்குவதற்கு முன் வானிலை நிலைகளை சரிபார்க்கவும்" : "Check weather conditions before starting"}</li>
                      <li>{isBilingualCrop ? "Follow recommended techniques for this phase / இந்த கட்டத்திற்கு பரிந்துரைக்கப்பட்ட நுட்பங்களை பின்பற்றுங்கள்" : "Follow recommended techniques for this phase"}</li>
                      <li>{isBilingualCrop ? "Document observations and any issues / கவனிப்புகள் மற்றும் சிக்கல்களை ஆவணப்படுத்துங்கள்" : "Document observations and any issues"}</li>
                      <li>{isBilingualCrop ? "Update task status upon completion / முடிந்ததும் பணி நிலையை புதுப்பிக்கவும்" : "Update task status upon completion"}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Update Status</h3>
                    <div className="flex gap-2">
                      <Button
                        variant={taskStatuses[task.day] === "completed" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => handleStatusChange(task.day, "completed")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </Button>
                      <Button
                        variant={taskStatuses[task.day] === "in-progress" ? "secondary" : "outline"}
                        className="flex-1"
                        onClick={() => handleStatusChange(task.day, "in-progress")}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        In Progress
                      </Button>
                      <Button
                        variant={taskStatuses[task.day] === "not-completed" ? "destructive" : "outline"}
                        className="flex-1"
                        onClick={() => handleStatusChange(task.day, "not-completed")}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Not Done
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Field Tools Section */}
        {selectedCrop && <FieldToolsSection cropId={selectedCrop} />}
      </main>
    </div>
  );
};

export default CropGuidance;
