
import { cn } from "@/lib/utils";

interface ProjectNavigationProps {
  currentStep: string;
  onStepChange: (stepId: string) => void;
}

const navigationSteps = [
  { id: "project-details", label: "Project Details", number: 1 },
  { id: "tester-recruiting", label: "Audience Builder", number: 2 },
  { id: "screening", label: "Screening", number: 3 },
  { id: "surveys", label: "Surveys", number: 4 },
  { id: "launch", label: "Launch", number: 5 },
];

export function ProjectNavigation({ currentStep, onStepChange }: ProjectNavigationProps) {
  return (
    <div className="bg-card border-r border-border p-8 h-full">
      <div className="space-y-1">
        {navigationSteps.map((step) => {
          const isActive = currentStep === step.id;
          
          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={cn(
                "w-full relative flex items-center py-3 px-3 rounded-lg transition-colors duration-200 text-left hover:bg-muted/50 cursor-pointer",
                isActive 
                  ? "bg-primary/5" 
                  : ""
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
              
              <div className="flex items-center space-x-3 ml-2">
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.number}
                </div>
                <span
                  className={cn(
                    "text-sm transition-colors",
                    isActive
                      ? "font-semibold text-primary"
                      : "font-medium text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
