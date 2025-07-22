import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bug, Plus, User, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BugReport {
  id: string;
  title: string;
  severity: string;
  reproducibility: string;
  reportedBy: string;
  status: string;
}

interface ProjectBugsProps {
  bugs: BugReport[];
  projectName: string;
}

const ProjectBugs = ({ bugs, projectName }: ProjectBugsProps) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expectedResult: "",
    actualResult: "",
    reproducibility: "",
    severity: "",
    device: "",
    operatingSystem: "",
    notes: ""
  });
  const { toast } = useToast();

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      case "trivial":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "fixed":
        return <CheckCircle className="h-4 w-4" />;
      case "under review":
        return <Clock className="h-4 w-4" />;
      case "new":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.severity || !formData.reproducibility) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate bug submission
    toast({
      title: "Bug Reported! Thank You, Explorer!",
      description: "Your bug report has been submitted successfully.",
    });

    // Reset form and close modal
    setFormData({
      title: "",
      description: "",
      expectedResult: "",
      actualResult: "",
      reproducibility: "",
      severity: "",
      device: "",
      operatingSystem: "",
      notes: ""
    });
    setIsReportModalOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl">
            <Bug className="h-5 w-5 mr-2 text-primary" />
            Reported Bugs for {projectName}
          </CardTitle>
          <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Report New Bug →
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl mb-2">Report a New Bug</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Help us make this AI product flawless! Please provide as much detail as possible. 
                  Your clear reporting speeds up fixes and earns you valuable points.
                </p>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="font-semibold">
                    Bug Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of the bug"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="font-semibold">
                    Description (Steps to reproduce) <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed steps to reproduce the bug"
                    className="mt-1"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expectedResult" className="font-semibold">
                      Expected Result
                    </Label>
                    <Textarea
                      id="expectedResult"
                      value={formData.expectedResult}
                      onChange={(e) => setFormData(prev => ({ ...prev, expectedResult: e.target.value }))}
                      placeholder="What should have happened"
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="actualResult" className="font-semibold">
                      Actual Result
                    </Label>
                    <Textarea
                      id="actualResult"
                      value={formData.actualResult}
                      onChange={(e) => setFormData(prev => ({ ...prev, actualResult: e.target.value }))}
                      placeholder="What actually happened"
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reproducibility" className="font-semibold">
                      Reproducibility <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.reproducibility} onValueChange={(value) => setFormData(prev => ({ ...prev, reproducibility: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="always">Always</SelectItem>
                        <SelectItem value="sometimes">Sometimes</SelectItem>
                        <SelectItem value="rarely">Rarely</SelectItem>
                        <SelectItem value="once">Once</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="severity" className="font-semibold">
                      Severity <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="trivial">Trivial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="device" className="font-semibold">
                      Device Used
                    </Label>
                    <Input
                      id="device"
                      value={formData.device}
                      onChange={(e) => setFormData(prev => ({ ...prev, device: e.target.value }))}
                      placeholder="e.g., iPhone 14, Desktop"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="operatingSystem" className="font-semibold">
                      Operating System & Version
                    </Label>
                    <Input
                      id="operatingSystem"
                      value={formData.operatingSystem}
                      onChange={(e) => setFormData(prev => ({ ...prev, operatingSystem: e.target.value }))}
                      placeholder="e.g., iOS 17.1, Windows 11"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="font-semibold">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional information that might help"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsReportModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Bug Report
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bugs.map((bug) => (
            <Card key={bug.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{bug.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {bug.reportedBy}
                      </div>
                      <div className="flex items-center">
                        Reproducibility: {bug.reproducibility}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getSeverityColor(bug.severity)} text-white`}>
                      {bug.severity}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      {getStatusIcon(bug.status)}
                      <span className="ml-1">{bug.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {bugs.length === 0 && (
            <div className="text-center py-12">
              <Bug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No bugs reported yet</h3>
              <p className="text-muted-foreground">
                Be the first to report a bug and help improve this project!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectBugs;