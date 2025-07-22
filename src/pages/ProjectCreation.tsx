import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ClientHeader } from "@/components/ClientHeader";
import { ProjectNavigation } from "@/components/project/ProjectNavigation";
import { TestDetailsForm } from "@/components/project/TestDetailsForm";
import { TesterRecruitingForm } from "@/components/project/TesterRecruitingForm";
import { ScreeningBuilder } from "@/components/project/ScreeningBuilder";
import { SurveyBuilder } from "@/components/project/SurveyBuilder";
import { ProjectLaunch } from "@/components/project/ProjectLaunch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ProjectCreation() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState("project-details");

  // Check authentication and project access
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate("/client-login");
          return;
        }

        if (!projectId) {
          navigate("/client-dashboard");
          return;
        }

        // Verify the project exists and belongs to the current user
        const { data: project, error } = await supabase
          .from('projects')
          .select('id')
          .eq('id', projectId)
          .single();

        if (error || !project) {
          toast({
            title: "Project not found",
            description: "The project you're looking for doesn't exist or you don't have access to it.",
            variant: "destructive",
          });
          navigate("/client-dashboard");
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          navigate("/client-login");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/client-login");
        }
      }
    );

    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [projectId, navigate, toast]);

  const handleSave = () => {
    toast({
      title: "Progress Saved",
      description: "Your progress has been saved. You can continue later or move to the next step.",
    });
  };

  const handleStepChange = (stepId: string) => {
    setCurrentStep(stepId);
  };

  const handleTestDetailsComplete = () => {
    setCurrentStep("tester-recruiting");
  };

  const handleTesterRecruitingBack = () => {
    setCurrentStep("project-details");
  };

  const handleTesterRecruitingComplete = () => {
    setCurrentStep("screening");
  };

  const handleScreeningBack = () => {
    setCurrentStep("tester-recruiting");
  };

  const handleScreeningComplete = () => {
    setCurrentStep("surveys");
  };

  const handleSurveysBack = () => {
    setCurrentStep("screening");
  };

  const handleSurveysComplete = () => {
    setCurrentStep("launch");
  };

  const handleLaunchBack = () => {
    setCurrentStep("surveys");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ClientHeader isAuthenticated={true} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !projectId) {
    return null;
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <ClientHeader isAuthenticated={true} />
      
      {/* CSS Grid Layout Container */}
      <div className="grid grid-cols-[248px_1fr] gap-8 h-[calc(100vh-80px)]">
        {/* Left Navigation Panel */}
        <ProjectNavigation currentStep={currentStep} onStepChange={handleStepChange} />
        
        {/* Main Content Area */}
        <div className="overflow-auto">
          <AnimatePresence mode="wait">
            {currentStep === "project-details" && (
              <motion.div
                key="project-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-8"
              >
                <div className="max-w-4xl mx-auto">
                  <TestDetailsForm 
                    projectId={projectId} 
                    onSave={handleTestDetailsComplete}
                  />
                </div>
              </motion.div>
            )}
            
            {currentStep === "tester-recruiting" && (
              <motion.div
                key="tester-recruiting"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-8"
              >
                <div className="max-w-4xl mx-auto">
                  <TesterRecruitingForm
                    projectId={projectId}
                    onBack={handleTesterRecruitingBack}
                    onContinue={handleTesterRecruitingComplete}
                  />
                </div>
              </motion.div>
            )}
            
            {currentStep === "screening" && (
              <motion.div
                key="screening"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-8"
              >
                <div className="max-w-4xl mx-auto">
                  <ScreeningBuilder
                    projectId={projectId}
                    onBack={handleScreeningBack}
                    onContinue={handleScreeningComplete}
                  />
                </div>
              </motion.div>
            )}
            
            {currentStep === "surveys" && (
              <motion.div
                key="surveys"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-8 h-full"
              >
                <div className="max-w-7xl mx-auto h-full">
                  <SurveyBuilder
                    projectId={projectId}
                    onContinue={handleSurveysComplete}
                  />
                </div>
              </motion.div>
            )}
            
            {currentStep === "launch" && (
              <motion.div
                key="launch"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-8 h-full"
              >
                <div className="max-w-7xl mx-auto h-full">
                  <ProjectLaunch
                    projectId={projectId}
                    onBack={handleLaunchBack}
                    onStepChange={handleStepChange}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
