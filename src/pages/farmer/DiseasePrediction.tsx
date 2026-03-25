import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Activity, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const DiseasePrediction = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<{
    disease: string;
    confidence: number;
    severity: string;
    action: string;
  } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setPrediction(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock disease prediction
      const diseases = [
        {
          disease: "Leaf Spot",
          confidence: 87,
          severity: "Moderate",
          action: "Apply organic fungicide containing copper sulfate. Remove affected leaves and improve air circulation."
        },
        {
          disease: "Powdery Mildew",
          confidence: 92,
          severity: "Mild",
          action: "Spray with neem oil solution. Ensure proper spacing between plants and avoid overhead watering."
        },
        {
          disease: "Bacterial Blight",
          confidence: 79,
          severity: "Severe",
          action: "Remove and destroy infected plants. Apply copper-based bactericide. Rotate crops next season."
        },
        {
          disease: "Healthy Leaf",
          confidence: 95,
          severity: "None",
          action: "No action required. Continue regular care and monitoring."
        }
      ];
      
      const randomPrediction = diseases[Math.floor(Math.random() * diseases.length)];
      setPrediction(randomPrediction);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "severe": return "bg-destructive text-destructive-foreground";
      case "moderate": return "bg-secondary text-secondary-foreground";
      case "mild": return "bg-accent text-accent-foreground";
      default: return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Disease Prediction</h2>
        <p className="text-muted-foreground">Upload a plant leaf image to detect potential diseases</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Plant Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUpload">Select Image</Label>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Upload a clear image of the plant leaf for best results
              </p>
            </div>

            {selectedImage && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-4">
                  <img 
                    src={selectedImage} 
                    alt="Uploaded plant leaf" 
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
                
                <Button 
                  onClick={handlePredict} 
                  className="w-full gap-2"
                  disabled={isAnalyzing}
                >
                  <Activity className="h-4 w-4" />
                  {isAnalyzing ? "Analyzing..." : "Predict Disease"}
                </Button>
              </div>
            )}

            {!selectedImage && (
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No image selected</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Upload an image to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className={`shadow-glow border-2 transition-all ${
          prediction ? "border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5" : "border-border"
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Prediction Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!prediction && !isAnalyzing && (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Upload an image and click "Predict Disease" to see results
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12 space-y-4">
                <div className="animate-pulse">
                  <Activity className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-primary font-medium mb-4">Analyzing plant leaf...</p>
                  <Progress value={60} className="w-full max-w-xs mx-auto" />
                </div>
              </div>
            )}

            {prediction && !isAnalyzing && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center p-6 bg-gradient-primary rounded-xl text-white">
                  <div className="text-sm opacity-90 mb-2">Detected Condition</div>
                  <div className="text-4xl font-bold mb-3">{prediction.disease}</div>
                  <Badge className="bg-white text-primary text-base px-4 py-1">
                    {prediction.confidence}% Confidence
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <span className="font-medium">Severity Level</span>
                    <Badge className={getSeverityColor(prediction.severity)}>
                      {prediction.severity}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Recommended Action
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
                      {prediction.action}
                    </p>
                  </div>

                  {selectedImage && (
                    <div className="space-y-2">
                      <div className="font-medium text-sm">Analyzed Image</div>
                      <img 
                        src={selectedImage} 
                        alt="Analyzed leaf" 
                        className="w-full h-48 object-contain rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiseasePrediction;