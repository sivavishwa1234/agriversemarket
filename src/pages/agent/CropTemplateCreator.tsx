import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, Calendar, Sprout, Eye, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DayTask {
  day: number;
  phase: string;
  task: string;
  taskTamil: string;
}

interface ToolRecommendation {
  name: string;
  nameTamil: string;
  stage: string;
  purpose: string;
  purposeTamil: string;
  imageUrl: string;
  safetyTips: string;
}

interface CropTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  days: number;
  tasks: DayTask[];
  tools: ToolRecommendation[];
  createdAt: string;
  image?: string;
}

const CropTemplateCreator = () => {
  const [tab, setTab] = useState("create");
  const [existingTemplates, setExistingTemplates] = useState<CropTemplate[]>([]);
  const [viewTemplate, setViewTemplate] = useState<CropTemplate | null>(null);

  // Form state
  const [cropName, setCropName] = useState("");
  const [cropDescription, setCropDescription] = useState("");
  const [totalDays, setTotalDays] = useState(100);
  const [cropType, setCropType] = useState("");
  const [cropImage, setCropImage] = useState("");
  const [tasks, setTasks] = useState<DayTask[]>([]);
  const [tools, setTools] = useState<ToolRecommendation[]>([]);

  // Task input
  const [currentDay, setCurrentDay] = useState(1);
  const [currentPhase, setCurrentPhase] = useState("");
  const [currentTask, setCurrentTask] = useState("");
  const [currentTaskTamil, setCurrentTaskTamil] = useState("");

  // Tool input
  const [toolName, setToolName] = useState("");
  const [toolNameTamil, setToolNameTamil] = useState("");
  const [toolStage, setToolStage] = useState("");
  const [toolPurpose, setToolPurpose] = useState("");
  const [toolPurposeTamil, setToolPurposeTamil] = useState("");
  const [toolImage, setToolImage] = useState("");
  const [toolSafety, setToolSafety] = useState("");

  const phases = ["Land Preparation", "Sowing", "Early Growth", "Vegetative Stage", "Flowering", "Grain Filling", "Maturation & Harvest"];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setExistingTemplates(JSON.parse(localStorage.getItem("cropTemplates") || "[]"));
  };

  const handleAddTask = () => {
    if (!currentPhase || !currentTask) {
      toast.error("Please fill in phase and task details");
      return;
    }
    setTasks([...tasks, { day: currentDay, phase: currentPhase, task: currentTask, taskTamil: currentTaskTamil }].sort((a, b) => a.day - b.day));
    setCurrentDay(currentDay + 1);
    setCurrentTask("");
    setCurrentTaskTamil("");
    toast.success(`Task added for Day ${currentDay}`);
  };

  const handleAddTool = () => {
    if (!toolName || !toolStage || !toolPurpose) {
      toast.error("Fill tool name, stage, and purpose");
      return;
    }
    setTools([...tools, { name: toolName, nameTamil: toolNameTamil, stage: toolStage, purpose: toolPurpose, purposeTamil: toolPurposeTamil, imageUrl: toolImage, safetyTips: toolSafety }]);
    setToolName(""); setToolNameTamil(""); setToolStage(""); setToolPurpose(""); setToolPurposeTamil(""); setToolImage(""); setToolSafety("");
    toast.success("Tool added");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveTemplate = () => {
    if (!cropName || !cropDescription || tasks.length === 0) {
      toast.error("Fill crop details and add at least one task");
      return;
    }
    const template: CropTemplate = {
      id: cropName.toLowerCase().replace(/\s+/g, "-"),
      name: cropName,
      description: cropDescription,
      type: cropType,
      days: totalDays,
      tasks,
      tools,
      image: cropImage,
      createdAt: new Date().toISOString(),
    };

    const templates = JSON.parse(localStorage.getItem("cropTemplates") || "[]");
    templates.push(template);
    localStorage.setItem("cropTemplates", JSON.stringify(templates));
    setExistingTemplates(templates);

    toast.success(`Crop template "${cropName}" saved! It will now appear in Farmer Crop Guidance.`);
    resetForm();
  };

  const resetForm = () => {
    setCropName(""); setCropDescription(""); setTotalDays(100); setCropType(""); setCropImage("");
    setTasks([]); setTools([]); setCurrentDay(1); setCurrentPhase(""); setCurrentTask(""); setCurrentTaskTamil("");
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = existingTemplates.filter(t => t.id !== id);
    localStorage.setItem("cropTemplates", JSON.stringify(updated));
    setExistingTemplates(updated);
    toast.success("Template deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sprout className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Crop Template Creator</h1>
          <p className="text-muted-foreground">Create crop guidance templates that appear on the Farmer Crop Guidance page</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="create">Create New Template</TabsTrigger>
          <TabsTrigger value="manage">Manage Templates ({existingTemplates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          {existingTemplates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Sprout className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No custom templates created yet.</p>
                <p className="text-sm">Templates you create here will appear in the Farmer's Crop Guidance page.</p>
              </CardContent>
            </Card>
          ) : (
            existingTemplates.map((t) => (
              <Card key={t.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {t.image && <img src={t.image} alt={t.name} className="h-16 w-16 rounded-lg object-cover" />}
                    <div>
                      <h3 className="font-semibold">{t.name}</h3>
                      <p className="text-sm text-muted-foreground">{t.days} days • {t.tasks.length} tasks • {t.tools?.length || 0} tools</p>
                      <p className="text-xs text-muted-foreground">Created: {new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setViewTemplate(t)}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteTemplate(t.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="create">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Crop Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Crop Information</CardTitle>
                  <CardDescription>This will create a new crop in Farmer Crop Guidance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Crop Name *</Label>
                    <Input placeholder="e.g., Red Rice" value={cropName} onChange={(e) => setCropName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Crop Type</Label>
                    <Input placeholder="e.g., Cereal, Pulse, Oilseed" value={cropType} onChange={(e) => setCropType(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Cultivation Days *</Label>
                    <Input type="number" min="1" max="365" value={totalDays} onChange={(e) => setTotalDays(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea placeholder="Describe the crop, ideal conditions..." value={cropDescription} onChange={(e) => setCropDescription(e.target.value)} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Crop Image (optional)</Label>
                    <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setCropImage)} />
                    {cropImage && <img src={cropImage} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />}
                  </div>
                </CardContent>
              </Card>

              {/* Daily Task */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Daily Task (Bilingual)</CardTitle>
                  <CardDescription>Tasks in English + Tamil for farmer guidance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 items-end">
                    <div className="space-y-2 flex-1">
                      <Label>Day</Label>
                      <Input type="number" min={1} max={totalDays} value={currentDay} onChange={(e) => setCurrentDay(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2 flex-[2]">
                      <Label>Phase *</Label>
                      <Select value={currentPhase} onValueChange={setCurrentPhase}>
                        <SelectTrigger><SelectValue placeholder="Select phase" /></SelectTrigger>
                        <SelectContent>
                          {phases.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Task (English) *</Label>
                    <Textarea value={currentTask} onChange={(e) => setCurrentTask(e.target.value)} placeholder="Describe the task..." rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>Task (Tamil)</Label>
                    <Textarea value={currentTaskTamil} onChange={(e) => setCurrentTaskTamil(e.target.value)} placeholder="பணி விவரம்..." rows={2} />
                  </div>
                  <Button onClick={handleAddTask} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                </CardContent>
              </Card>

              {/* Tool Recommendation */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Tool Recommendation</CardTitle>
                  <CardDescription>Tools needed during crop production</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tool Name (English) *</Label>
                      <Input value={toolName} onChange={(e) => setToolName(e.target.value)} placeholder="e.g., Hand Hoe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tool Name (Tamil)</Label>
                      <Input value={toolNameTamil} onChange={(e) => setToolNameTamil(e.target.value)} placeholder="e.g., கைக்கொத்து" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Stage *</Label>
                    <Select value={toolStage} onValueChange={setToolStage}>
                      <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                      <SelectContent>
                        {phases.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Purpose (English) *</Label>
                    <Input value={toolPurpose} onChange={(e) => setToolPurpose(e.target.value)} placeholder="What the tool is used for" />
                  </div>
                  <div className="space-y-2">
                    <Label>Purpose (Tamil)</Label>
                    <Input value={toolPurposeTamil} onChange={(e) => setToolPurposeTamil(e.target.value)} placeholder="கருவியின் பயன்" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tool Image</Label>
                    <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setToolImage)} />
                    {toolImage && <img src={toolImage} alt="Tool" className="h-16 w-16 rounded object-cover" />}
                  </div>
                  <div className="space-y-2">
                    <Label>Safety Tips</Label>
                    <Textarea value={toolSafety} onChange={(e) => setToolSafety(e.target.value)} placeholder="Safety instructions..." rows={2} />
                  </div>
                  <Button onClick={handleAddTool} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Tool
                  </Button>
                </CardContent>
              </Card>

              <Button onClick={handleSaveTemplate} className="w-full" size="lg">
                <Save className="h-5 w-5 mr-2" /> Save Crop Template
              </Button>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Schedule ({tasks.length} tasks)</CardTitle>
                  <CardDescription>{cropName || "Untitled Crop"} - {totalDays} days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {tasks.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No tasks added yet.</p>
                      </div>
                    ) : (
                      tasks.map((t, i) => (
                        <Card key={i} className="border-l-4 border-l-primary">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-primary text-sm">Day {t.day}</span>
                                  <Badge variant="outline" className="text-xs">{t.phase}</Badge>
                                </div>
                                <p className="text-sm">{t.task}</p>
                                {t.taskTamil && <p className="text-sm text-muted-foreground">{t.taskTamil}</p>}
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => setTasks(tasks.filter((_, j) => j !== i))}>
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {tools.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Tools ({tools.length})</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tools.map((t, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 border rounded-lg">
                          {t.imageUrl && <img src={t.imageUrl} alt={t.name} className="h-10 w-10 rounded object-cover" />}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{t.name} {t.nameTamil && `(${t.nameTamil})`}</p>
                            <p className="text-xs text-muted-foreground">{t.stage} • {t.purpose}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setTools(tools.filter((_, j) => j !== i))}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {tasks.length > 0 && (
                <Card className="bg-primary/5">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Template Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-muted-foreground">Total Days</p><p className="font-bold">{totalDays}</p></div>
                      <div><p className="text-muted-foreground">Tasks</p><p className="font-bold">{tasks.length}</p></div>
                      <div><p className="text-muted-foreground">Tools</p><p className="font-bold">{tools.length}</p></div>
                      <div><p className="text-muted-foreground">Phases</p><p className="font-bold">{new Set(tasks.map((t) => t.phase)).size}</p></div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Template Dialog */}
      <Dialog open={!!viewTemplate} onOpenChange={() => setViewTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewTemplate?.name}</DialogTitle>
          </DialogHeader>
          {viewTemplate && (
            <div className="space-y-4">
              <p className="text-muted-foreground">{viewTemplate.description}</p>
              <div className="flex gap-4 text-sm">
                <Badge>{viewTemplate.type || "General"}</Badge>
                <span>{viewTemplate.days} days</span>
                <span>{viewTemplate.tasks.length} tasks</span>
                <span>{viewTemplate.tools?.length || 0} tools</span>
              </div>
              <h4 className="font-semibold">Tasks</h4>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {viewTemplate.tasks.map((t, i) => (
                  <div key={i} className="text-sm p-2 border rounded">
                    <span className="font-medium text-primary">Day {t.day}</span> ({t.phase}): {t.task}
                    {t.taskTamil && <span className="block text-muted-foreground">{t.taskTamil}</span>}
                  </div>
                ))}
              </div>
              {viewTemplate.tools && viewTemplate.tools.length > 0 && (
                <>
                  <h4 className="font-semibold">Tools</h4>
                  <div className="space-y-2">
                    {viewTemplate.tools.map((t, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 border rounded">
                        {t.imageUrl && <img src={t.imageUrl} alt={t.name} className="h-12 w-12 rounded object-cover" />}
                        <div>
                          <p className="font-medium text-sm">{t.name} {t.nameTamil && `(${t.nameTamil})`}</p>
                          <p className="text-xs text-muted-foreground">{t.stage} - {t.purpose}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CropTemplateCreator;
