import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectLaunchProps {
  projectId: string;
  onBack: () => void;
  onStepChange: (stepId: string) => void;
}

interface ProjectData {
  name: string;
  description: string;
  target_testers: number;
  screening_config: any;
  survey_config: any;
}

export function ProjectLaunch({ projectId, onBack, onStepChange }: ProjectLaunchProps) {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const pricePerUser = 35;

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (error) throw error;

        setProjectData(data);
        setNumberOfUsers(data.target_testers || 0);
      } catch (error) {
        console.error('Error fetching project data:', error);
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        });
      }
    };

    fetchProjectData();
  }, [projectId, toast]);

  const totalCost = numberOfUsers * pricePerUser;

  const handleEditSection = (section: string) => {
    onStepChange(section);
  };

  const handleLaunchProject = async () => {
    setIsLaunching(true);
    
    try {
      // Update project status to launched
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: 'launched',
          target_testers: numberOfUsers,
          launch_date: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Project Launched Successfully!",
        description: "Your project has been launched and is now live.",
      });

      // Navigate back to dashboard or success page
      setTimeout(() => {
        window.location.href = '/client-dashboard';
      }, 2000);

    } catch (error) {
      console.error('Error launching project:', error);
      toast({
        title: "Launch Failed",
        description: "Failed to launch project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLaunching(false);
    }
  };

  if (!projectData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_400px] gap-8 h-full">
      {/* Main Content Area */}
      <div className="overflow-y-auto space-y-8">
        {/* Order Summary Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">1. Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Price per user:</span>
              <span className="font-medium">${pricePerUser}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="numberOfUsers">Number of users:</Label>
              <Input
                id="numberOfUsers"
                type="number"
                value={numberOfUsers}
                onChange={(e) => setNumberOfUsers(parseInt(e.target.value) || 0)}
                className="w-24 text-right"
                min="1"
              />
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span>${totalCost.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">2. Payment</CardTitle>
          </CardHeader>
          <CardContent>
            {!showPaymentForm ? (
              <Button 
                onClick={() => setShowPaymentForm(true)}
                variant="outline"
                className="w-full"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Add Card
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-4">
                    Secure payment processing powered by Stripe
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input id="cardName" placeholder="John Doe" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Project Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">3. Review Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Details */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium mb-2">Project Details</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><span className="font-medium">Title:</span> {projectData.name}</p>
                  <p><span className="font-medium">Instructions:</span> {projectData.description || "No description provided"}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEditSection('project-details')}
              >
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>

            <Separator />

            {/* User Recruiting */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium mb-2">User Recruiting</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><span className="font-medium">Target Users:</span> {projectData.target_testers}</p>
                  <p><span className="font-medium">Demographics:</span> All configured criteria applied</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEditSection('tester-recruiting')}
              >
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>

            <Separator />

            {/* Screening */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium mb-2">Screening</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><span className="font-medium">Questions:</span> {
                    projectData.screening_config?.questions?.length || 0
                  } screening questions configured</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEditSection('screening')}
              >
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>

            <Separator />

            {/* Surveys */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium mb-2">Surveys</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><span className="font-medium">Questions:</span> {
                    projectData.survey_config?.questions?.length || 0
                  } survey questions configured</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEditSection('surveys')}
              >
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Summary Panel */}
      <div className="sticky top-0 h-fit">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{numberOfUsers} users</span>
                <span>${totalCost.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Order Total</span>
                <span>${totalCost.toLocaleString()}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleLaunchProject}
              disabled={!showPaymentForm || isLaunching}
              className="w-full"
              size="lg"
            >
              {isLaunching ? "Launching..." : "Launch Project"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onBack}
              className="w-full"
            >
              Back to Surveys
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}