import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListTodo, CheckCircle2, Circle } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "Done";
  assignedDate: string;
}

const AdminTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Load tasks from localStorage
    const loadTasks = () => {
      const storedTasks = localStorage.getItem("farmerTasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        // Default tasks if none in localStorage
        setTasks([
          {
            id: 1,
            title: "Submit Monthly Crop Report",
            description: "Provide details on crop growth, health status, and expected yield for all active crops.",
            priority: "High",
            status: "Pending",
            assignedDate: "2025-10-14"
          },
          {
            id: 2,
            title: "Update Soil Test Results",
            description: "Upload the latest soil test results from your land for record keeping.",
            priority: "Medium",
            status: "Pending",
            assignedDate: "2025-10-13"
          },
          {
            id: 3,
            title: "Attend Training Workshop",
            description: "Join the online workshop on sustainable farming practices scheduled for next week.",
            priority: "Medium",
            status: "Done",
            assignedDate: "2025-10-10"
          }
        ]);
      }
    };
    
    loadTasks();
    
    // Listen for storage changes (when agent sends new task)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "farmerTasks") {
        loadTasks();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleTaskStatus = (taskId: number) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === "Pending" ? "Done" : "Pending" as "Pending" | "Done" }
        : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("farmerTasks", JSON.stringify(updatedTasks));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive text-destructive-foreground";
      case "Medium": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const pendingTasks = tasks.filter(t => t.status === "Pending");
  const completedTasks = tasks.filter(t => t.status === "Done");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Tasks from Admin</h2>
        <p className="text-muted-foreground">Manage administrative tasks and assignments</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Tasks</div>
            <div className="text-3xl font-bold text-primary">{tasks.length}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Pending</div>
            <div className="text-3xl font-bold text-secondary">{pendingTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Completed</div>
            <div className="text-3xl font-bold text-accent">{completedTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <Card className="shadow-soft border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-secondary" />
              Pending Tasks ({pendingTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.map((task) => (
              <div key={task.id} className="p-4 bg-muted/30 rounded-xl border hover:shadow-soft transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">{task.title}</h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    <div className="text-xs text-muted-foreground">
                      Assigned: {new Date(task.assignedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleTaskStatus(task.id)}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as Done
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card className="shadow-soft border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              Completed Tasks ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedTasks.map((task) => (
              <div key={task.id} className="p-4 bg-accent/5 rounded-xl border border-accent/20 opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold line-through">{task.title}</h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className="bg-accent text-accent-foreground">Done</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    <div className="text-xs text-muted-foreground">
                      Assigned: {new Date(task.assignedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTasks;