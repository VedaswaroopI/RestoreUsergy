import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Info } from "lucide-react";

interface ProjectInstructionsProps {
  project: {
    name: string;
    instructions: string[];
  };
}

const ProjectInstructions = ({ project }: ProjectInstructionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Info className="h-5 w-5 mr-2 text-primary" />
          Project Instructions for {project.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Please read all instructions carefully before proceeding with the project tasks.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">What you need to do:</h3>
            <div className="space-y-3">
              {project.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-foreground leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Ready to get started?</h4>
                <p className="text-sm text-muted-foreground">
                  Navigate to the "Tasks & Surveys" section to begin completing your assigned tasks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInstructions;