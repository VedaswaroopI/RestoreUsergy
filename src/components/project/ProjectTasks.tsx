import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckSquare, Clock, Calendar, Award, Play } from "lucide-react";

interface Task {
  id: string;
  name: string;
  status: string;
  dueDate: string;
  reward: number;
}

interface ProjectTasksProps {
  tasks: Task[];
}

const ProjectTasks = ({ tasks }: ProjectTasksProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "in progress":
        return "bg-yellow-500";
      case "not started":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckSquare className="h-4 w-4" />;
      case "in progress":
        return <Play className="h-4 w-4" />;
      case "not started":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <CheckSquare className="h-5 w-5 mr-2 text-primary" />
          Your Assigned Tasks & Surveys
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{task.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {task.dueDate}
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        {task.reward} Points
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getStatusColor(task.status)} text-white flex items-center`}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1">{task.status}</span>
                    </Badge>
                    <Button
                      variant={task.status === "Completed" ? "outline" : "default"}
                      size="sm"
                      disabled={task.status === "Completed"}
                    >
                      {task.status === "Completed" ? "Completed" : "Start Task"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No tasks assigned yet</h3>
              <p className="text-muted-foreground">
                Tasks will appear here once they are assigned to you.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTasks;