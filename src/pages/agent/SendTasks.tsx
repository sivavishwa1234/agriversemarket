import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Calendar, ListTodo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SendTasks = () => {
  const { toast } = useToast();
  const [farmers, setFarmers] = useState<string[]>([]);
  const [sentTasks, setSentTasks] = useState<any[]>([]);
  const [task, setTask] = useState({
    farmer: "",
    title: "",
    description: "",
    priority: "",
    deadline: "",
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const registered = JSON.parse(localStorage.getItem("registeredFarmers") || "[]");
    setFarmers(registered.map((f: any) => f.username));
    const tasks = JSON.parse(localStorage.getItem("farmerTasks") || "[]");
    setSentTasks(tasks);
  };

  const handleSendTask = () => {
    if (!task.farmer || !task.title || !task.description || !task.priority || !task.deadline) {
      toast({ title: "Missing Information", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const newTask = {
      id: Date.now(),
      farmer: task.farmer,
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline,
      status: "Pending",
      assignedDate: new Date().toISOString().split('T')[0]
    };

    const existingTasks = JSON.parse(localStorage.getItem("farmerTasks") || "[]");
    const updated = [newTask, ...existingTasks];
    localStorage.setItem("farmerTasks", JSON.stringify(updated));
    setSentTasks(updated);

    toast({ title: "Task Sent", description: `"${task.title}" sent to ${task.farmer}` });
    setTask({ farmer: "", title: "", description: "", priority: "", deadline: "" });
  };

  const getPriorityColor = (p: string) => {
    if (p === "High") return "destructive";
    if (p === "Medium") return "default";
    return "secondary";
  };

  const getStatusColor = (s: string) => {
    if (s === "Completed") return "default";
    if (s === "In Progress") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Send Tasks to Farmers</h1>
        <p className="text-muted-foreground">Assign and manage tasks for registered farmers</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Create New Task</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {farmers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No farmers registered yet. Tasks can be sent once farmers register.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Farmer</Label>
                  <Select value={task.farmer} onValueChange={(v) => setTask({ ...task, farmer: v })}>
                    <SelectTrigger><SelectValue placeholder="Choose a farmer" /></SelectTrigger>
                    <SelectContent>
                      {farmers.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select value={task.priority} onValueChange={(v) => setTask({ ...task, priority: v })}>
                    <SelectTrigger><SelectValue placeholder="Set priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Task Title</Label>
                <Input value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} placeholder="Enter task title" />
              </div>
              <div className="space-y-2">
                <Label>Task Description</Label>
                <Textarea value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} placeholder="Describe the task..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={task.deadline} onChange={(e) => setTask({ ...task, deadline: e.target.value })} />
              </div>
              <Button onClick={handleSendTask} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Task
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Sent Tasks ({sentTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sentTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No tasks sent yet.</p>
          ) : (
            <div className="space-y-3">
              {sentTasks.map((t: any) => (
                <div key={t.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{t.title}</h3>
                      <p className="text-sm text-muted-foreground">Assigned to: {t.farmer}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getPriorityColor(t.priority)}>{t.priority}</Badge>
                      <Badge variant={getStatusColor(t.status)}>{t.status}</Badge>
                    </div>
                  </div>
                  {t.description && <p className="text-sm text-muted-foreground mb-2">{t.description}</p>}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : "N/A"}</span>
                    {t.assignedDate && <span className="ml-2">| Sent: {t.assignedDate}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SendTasks;
