import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";

interface ProjectStepperProps {
  currentStep: string;
  onStepChange: (stepId: string) => void;
}

const navigationSteps = [
  { id: "project-details", label: "Project Details", number: 1 },
  { id: "tester-recruiting", label: "User Recruiting", number: 2 },
  { id: "screening", label: "Screening", number: 3 },
  { id: "surveys", label: "Surveys", number: 4 },
  { id: "launch", label: "Launch", number: 5 },
];

export function ProjectStepper({ currentStep, onStepChange }: ProjectStepperProps) {
  const currentStepIndex = navigationSteps.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full bg-card border-b border-border px-8 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted transform -translate-y-1/2 z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-turquoise"
              initial={{ width: "0%" }}
              animate={{ 
                width: `${(currentStepIndex / (navigationSteps.length - 1)) * 100}%` 
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>

          {navigationSteps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = index < currentStepIndex;
            const isEnabled = step.id === "project-details" || step.id === "tester-recruiting" || step.id === "screening" || step.id === "surveys";

            return (
              <motion.button
                key={step.id}
                onClick={() => isEnabled && onStepChange(step.id)}
                disabled={!isEnabled}
                className={cn(
                  "relative z-10 flex flex-col items-center space-y-2 group transition-all duration-300",
                  isEnabled ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                )}
                whileHover={isEnabled ? { scale: 1.05 } : {}}
                whileTap={isEnabled ? { scale: 0.95 } : {}}
              >
                {/* Step Circle */}
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all duration-300",
                    isCompleted
                      ? "bg-success text-white border-success"
                      : isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-muted-foreground group-hover:border-primary group-hover:text-primary"
                  )}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    boxShadow: isActive 
                      ? "0 0 20px hsl(var(--primary) / 0.4)" 
                      : "0 0 0px hsl(var(--primary) / 0)"
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </motion.div>

                {/* Step Label */}
                <motion.span
                  className={cn(
                    "text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-success"
                      : "text-muted-foreground group-hover:text-primary"
                  )}
                  initial={false}
                  animate={{
                    opacity: isActive || isCompleted ? 1 : 0.7,
                    fontWeight: isActive ? 600 : 500
                  }}
                >
                  {step.label}
                </motion.span>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-6 w-2 h-2 bg-primary rounded-full"
                    layoutId="activeIndicator"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}