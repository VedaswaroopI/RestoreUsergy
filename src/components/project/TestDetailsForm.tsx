import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "./RichTextEditor";
import { Upload, FileText, ArrowRight, Asterisk } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface TestDetailsFormProps {
  projectId: string;
  onSave: () => void;
}

export function TestDetailsForm({ projectId, onSave }: TestDetailsFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
  });

  const [attachments, setAttachments] = useState<File[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project title.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.instructions.trim()) {
      toast({
        title: "Error",
        description: "Please provide instructions for users.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Update the project with project details
      const { error } = await supabase
        .from('projects')
        .update({
          name: formData.title,
          description: formData.description,
          // For now, store instructions in description field - later we can add an instructions column
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project details saved successfully.",
      });

      onSave();
    } catch (error) {
      console.error('Error saving project details:', error);
      toast({
        title: "Error",
        description: "Failed to save project details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="w-full max-w-5xl mx-auto px-8 pt-6 pb-12">
        {/* Page Header */}
        <motion.div 
          className="text-center space-y-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Define Your Project</h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            This is where your journey begins. Clearly define your project to attract the right users and gather powerful insights.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Card 1: Project Information */}
          <motion.div variants={cardVariants} whileHover={{ y: -2, boxShadow: "0 8px 25px -5px hsl(var(--primary) / 0.1)" }}>
            <Card className="shadow-md border border-border/40 bg-card hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                  Project Information
                  <Asterisk className="h-4 w-4 text-destructive" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Project Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-foreground">
                    Give your project a title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., AI copywriting tool user experience project"
                    className="h-10 border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This is shown publicly for recruiting participants.
                  </p>
                </div>

                {/* Brief Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-foreground">
                    Brief description of the project
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tell potential users what this project is about..."
                    className="min-h-[100px] border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    If you'd like, you can include details about who this project is designed for or what you're researching.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2: Instructions */}
          <motion.div variants={cardVariants} whileHover={{ y: -2, boxShadow: "0 8px 25px -5px hsl(var(--primary) / 0.1)" }}>
            <Card className="shadow-md border border-border/40 bg-card hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                  Instructions
                  <Asterisk className="h-4 w-4 text-destructive" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RichTextEditor
                  content={formData.instructions}
                  onChange={(content) => handleInputChange('instructions', content)}
                  placeholder="What would you like users to do?"
                />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Include any links needed to access your app or website. These instructions are provided only after users are accepted into your project.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3: Attachments */}
          <motion.div variants={cardVariants} whileHover={{ y: -2, boxShadow: "0 8px 25px -5px hsl(var(--primary) / 0.1)" }}>
            <Card className="shadow-md border border-border/40 bg-card hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-foreground">
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* File Upload Area */}
                <Card className="border-2 border-dashed border-border/30 hover:border-primary/50 transition-all duration-300 bg-muted/20 hover:bg-muted/30">
                  <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.apk,.ipa"
                    />
                    <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      Click to upload files
                    </p>
                    <p className="text-xs text-muted-foreground">
                      APK, PDF, images, or other relevant files
                    </p>
                  </label>
                </Card>

                {/* Uploaded Files List */}
                {attachments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Uploaded Files</h4>
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-md border border-border/30"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="text-sm font-medium text-foreground block">
                                {file.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          className="flex justify-center pt-8 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="px-8 py-3 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  Save & Continue to Audience Builder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}