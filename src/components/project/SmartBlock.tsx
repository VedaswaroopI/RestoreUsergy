import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Trash2, Settings, X, GripVertical, Zap, Star, Heart, ThumbsUp, Calendar, Clock, Link2, FileText, Hash, Type, CheckSquare, ArrowUpDown, BarChart3, Upload, Image } from "lucide-react";
import { SurveyQuestion } from "./SurveyBuilder";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SmartBlockProps {
  question: SurveyQuestion;
  index: number;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  allQuestions: SurveyQuestion[];
  projectId?: string;
}

export function SmartBlock({ 
  question, 
  index, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  onMove,
  allQuestions,
  projectId 
}: SmartBlockProps) {
  const [showLogic, setShowLogic] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [logicCondition, setLogicCondition] = useState({
    questionId: "",
    operator: "equals",
    value: "",
    action: "show" as "show" | "jump",
    targetId: ""
  });
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "short-text": return Type;
      case "long-text": return FileText;
      case "multiple-choice": return CheckSquare;
      case "checkboxes": return CheckSquare;
      case "dropdown": return ArrowUpDown;
      case "multi-select": return CheckSquare;
      case "number": return Hash;
      case "link": return Link2;
      case "file-upload": return Upload;
      case "date": return Calendar;
      case "time": return Clock;
      case "linear-scale": return BarChart3;
      case "rating": return Star;
      case "matrix": return BarChart3;
      case "ranking": return ArrowUpDown;
      case "embed-image": return FileText;
      default: return Type;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "short-text": return "Single Line";
      case "long-text": return "Long Answer";
      case "multiple-choice": return "Multiple Choice";
      case "checkboxes": return "Checkboxes";
      case "dropdown": return "Dropdown";
      case "multi-select": return "Multi-Select";
      case "number": return "Number";
      case "link": return "Link";
      case "file-upload": return "File Upload";
      case "date": return "Date";
      case "time": return "Time";
      case "linear-scale": return "Linear Scale";
      case "rating": return "Rating";
      case "matrix": return "Matrix";
      case "ranking": return "Ranking";
      case "embed-image": return "Embed Image";
      default: return "Question";
    }
  };

  const handleAddOption = () => {
    const currentOptions = question.options || [];
    const newOptions = [...currentOptions, `Option ${currentOptions.length + 1}`];
    onUpdate({ options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = question.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  const handleUpdateOption = (index: number, value: string) => {
    const currentOptions = question.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const handleUpdateConfig = (updates: any) => {
    onUpdate({ config: { ...question.config, ...updates } });
  };

  // File Type Selector Component
  const FileTypeSelector = ({ selectedTypes, onTypesChange }: { 
    selectedTypes: string[], 
    onTypesChange: (types: string[]) => void 
  }) => {
    const [open, setOpen] = useState(false);
    
    const commonFileTypes = [
      { value: ".jpg", label: "JPG Images" },
      { value: ".jpeg", label: "JPEG Images" },
      { value: ".png", label: "PNG Images" },
      { value: ".gif", label: "GIF Images" },
      { value: ".pdf", label: "PDF Documents" },
      { value: ".doc", label: "Word Documents" },
      { value: ".docx", label: "Word Documents (New)" },
      { value: ".txt", label: "Text Files" },
      { value: ".csv", label: "CSV Files" },
      { value: ".xlsx", label: "Excel Files" },
      { value: ".mp4", label: "MP4 Videos" },
      { value: ".mov", label: "MOV Videos" },
      { value: ".avi", label: "AVI Videos" },
      { value: ".mp3", label: "MP3 Audio" },
      { value: ".wav", label: "WAV Audio" }
    ];

    const toggleType = (type: string) => {
      if (selectedTypes.includes(type)) {
        onTypesChange(selectedTypes.filter(t => t !== type));
      } else {
        onTypesChange([...selectedTypes, type]);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-sm"
          >
            {selectedTypes.length === 0 
              ? "Select file types..."
              : `${selectedTypes.length} type${selectedTypes.length > 1 ? 's' : ''} selected`
            }
            <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search file types..." />
            <CommandList>
              <CommandEmpty>No file types found.</CommandEmpty>
              <CommandGroup>
                {commonFileTypes.map((type) => (
                  <CommandItem
                    key={type.value}
                    onSelect={() => toggleType(type.value)}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={selectedTypes.includes(type.value)}
                      onChange={() => toggleType(type.value)}
                    />
                    <span className="flex-1">{type.label}</span>
                    <span className="text-xs text-muted-foreground">{type.value}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {selectedTypes.length > 0 && (
            <div className="p-2 border-t">
              <div className="flex flex-wrap gap-1">
                {selectedTypes.map((type) => (
                  <Badge 
                    key={type} 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {type}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => toggleType(type)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  };

  const handleImageUpload = async () => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "Project ID is required for image upload.",
        variant: "destructive",
      });
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 10MB.",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      
      try {
        // Create unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}/${question.id}/${Date.now()}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName);

        // Update question config with image URL
        handleUpdateConfig({ imageUrl: publicUrl });

        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        });
        
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };


  const renderQuestionContent = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-muted-foreground min-w-[20px]">{String.fromCharCode(65 + index)}.</span>
                  <div className="w-4 h-4 rounded-full border-2 border-border bg-background"></div>
                  <Input
                    value={option}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                    className="flex-1 border border-border bg-background text-sm px-3 py-2"
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    className="h-8 w-8 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Option</span>
            </Button>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`allow-multiple-${question.id}`}
                  checked={question.config?.allowMultiple}
                  onCheckedChange={(checked) => handleUpdateConfig({ allowMultiple: checked as boolean })}
                />
                <Label htmlFor={`allow-multiple-${question.id}`} className="text-sm">Use checkboxes for multiple answers</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`allow-other-${question.id}`}
                  checked={question.config?.allowOther}
                  onCheckedChange={(checked) => handleUpdateConfig({ allowOther: checked as boolean })}
                />
                <Label htmlFor={`allow-other-${question.id}`} className="text-sm">Allow "Other" option</Label>
              </div>
            </div>
          </div>
        );
      
      case "checkboxes":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded border-2 border-border bg-background"></div>
                  <Input
                    value={option}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                    className="flex-1 border border-border bg-background text-sm px-3 py-2"
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    className="h-8 w-8 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Option</span>
            </Button>
          </div>
        );

      case "dropdown":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-muted-foreground min-w-[20px]">{index + 1}.</span>
                  <Input
                    value={option}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                    className="flex-1 border border-border bg-background text-sm px-3 py-2"
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    className="h-8 w-8 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Option</span>
            </Button>
          </div>
        );

      case "multi-select":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded border-2 border-border bg-background"></div>
                  <Input
                    value={option}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                    className="flex-1 border border-border bg-background text-sm px-3 py-2"
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    className="h-8 w-8 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Option</span>
            </Button>
          </div>
        );

      case "linear-scale":
        return (
          <div className="space-y-4">
            <div className="border border-border bg-background p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">
                  {question.config?.scaleRange?.[0] || 1}
                </span>
                <div className="flex-1 mx-4 h-2 bg-border rounded-full"></div>
                <span className="text-sm font-medium">
                  {question.config?.scaleRange?.[1] || 10}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{question.config?.scaleLabels?.[0] || "Low"}</span>
                <span>{question.config?.scaleLabels?.[1] || "High"}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">From</Label>
                <Input
                  type="number"
                  value={question.config?.scaleRange?.[0] || 1}
                  onChange={(e) => handleUpdateConfig({ 
                    scaleRange: [parseInt(e.target.value) || 1, question.config?.scaleRange?.[1] || 10] 
                  })}
                  className="border border-border bg-background text-sm px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">To</Label>
                <Input
                  type="number"
                  value={question.config?.scaleRange?.[1] || 10}
                  onChange={(e) => handleUpdateConfig({ 
                    scaleRange: [question.config?.scaleRange?.[0] || 1, parseInt(e.target.value) || 10] 
                  })}
                  className="border border-border bg-background text-sm px-3 py-2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Low value label</Label>
                <Input
                  value={question.config?.scaleLabels?.[0] || ""}
                  onChange={(e) => handleUpdateConfig({ 
                    scaleLabels: [e.target.value, question.config?.scaleLabels?.[1] || ""] 
                  })}
                  className="border border-border bg-background text-sm px-3 py-2"
                  placeholder="e.g., Not satisfied"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">High value label</Label>
                <Input
                  value={question.config?.scaleLabels?.[1] || ""}
                  onChange={(e) => handleUpdateConfig({ 
                    scaleLabels: [question.config?.scaleLabels?.[0] || "", e.target.value] 
                  })}
                  className="border border-border bg-background text-sm px-3 py-2"
                  placeholder="e.g., Very satisfied"
                />
              </div>
            </div>
          </div>
        );

      case "rating":
        return (
          <div className="space-y-4">
            <div className="border border-border bg-background p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                {Array.from({ length: question.config?.ratingCount || 5 }).map((_, i) => (
                  <div key={i} className="text-2xl text-muted-foreground">
                    {question.config?.ratingIcon === "heart" && <Heart className="h-6 w-6" />}
                    {question.config?.ratingIcon === "thumbs" && <ThumbsUp className="h-6 w-6" />}
                    {(!question.config?.ratingIcon || question.config?.ratingIcon === "star") && <Star className="h-6 w-6" />}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Icon</Label>
                <Select
                  value={question.config?.ratingIcon || "star"}
                  onValueChange={(value) => handleUpdateConfig({ ratingIcon: value })}
                >
                  <SelectTrigger className="border border-border bg-background text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="star">Star</SelectItem>
                    <SelectItem value="heart">Heart</SelectItem>
                    <SelectItem value="thumbs">Thumbs Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Count</Label>
                <Input
                  type="number"
                  value={question.config?.ratingCount || 5}
                  onChange={(e) => handleUpdateConfig({ ratingCount: parseInt(e.target.value) || 5 })}
                  className="border border-border bg-background text-sm px-3 py-2"
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </div>
        );

      case "short-text":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-${question.id}`}
                checked={question.required}
                onCheckedChange={(checked) => onUpdate({ required: checked as boolean })}
              />
              <Label htmlFor={`required-${question.id}`} className="text-sm">Required</Label>
            </div>
          </div>
        );
      
      case "long-text":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-${question.id}`}
                checked={question.required}
                onCheckedChange={(checked) => onUpdate({ required: checked as boolean })}
              />
              <Label htmlFor={`required-${question.id}`} className="text-sm">Required</Label>
            </div>
          </div>
        );

      case "number":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span>Number answer</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${question.id}`}
                  checked={question.required}
                  onCheckedChange={(checked) => onUpdate({ required: checked as boolean })}
                />
                <Label htmlFor={`required-${question.id}`} className="text-sm">Required</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`allow-decimals-${question.id}`}
                  checked={question.config?.allowDecimals}
                  onCheckedChange={(checked) => handleUpdateConfig({ allowDecimals: checked as boolean })}
                />
                <Label htmlFor={`allow-decimals-${question.id}`} className="text-sm">Allow decimals</Label>
              </div>
            </div>
          </div>
        );

      case "date":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>dd/mm/yyyy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-${question.id}`}
                checked={question.required}
                onCheckedChange={(checked) => onUpdate({ required: checked as boolean })}
              />
              <Label htmlFor={`required-${question.id}`} className="text-sm">Required</Label>
            </div>
          </div>
        );

      case "time":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>hh:mm</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-${question.id}`}
                checked={question.required}
                onCheckedChange={(checked) => onUpdate({ required: checked as boolean })}
              />
              <Label htmlFor={`required-${question.id}`} className="text-sm">Required</Label>
            </div>
          </div>
        );

      case "link":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Link2 className="h-3 w-3" />
              <span>https://example.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-${question.id}`}
                checked={question.required}
                onCheckedChange={(checked) => onUpdate({ required: checked as boolean })}
              />
              <Label htmlFor={`required-${question.id}`} className="text-sm">Required</Label>
            </div>
          </div>
        );

      case "file-upload":
        return (
          <div className="space-y-4">
            <div className="border border-border bg-background p-4 rounded-lg text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Upload file</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Allowed file types</Label>
                <FileTypeSelector
                  selectedTypes={question.config?.allowedFileTypes || []}
                  onTypesChange={(types) => handleUpdateConfig({ allowedFileTypes: types })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Max file size (MB)</Label>
                <Input
                  type="number"
                  value={question.config?.maxFileSize || 10}
                  onChange={(e) => handleUpdateConfig({ maxFileSize: parseInt(e.target.value) || 10 })}
                  className="border border-border bg-background text-sm px-3 py-2"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-${question.id}`}
                checked={question.required}
                onCheckedChange={(checked) => onUpdate({ required: checked as boolean })}
              />
              <Label htmlFor={`required-${question.id}`} className="text-sm">Required</Label>
            </div>
          </div>
        );

      case "matrix":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Rows</Label>
              <div className="space-y-2">
                {question.config?.matrixRows?.map((row, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Input
                      value={row}
                      onChange={(e) => {
                        const newRows = [...(question.config?.matrixRows || [])];
                        newRows[index] = e.target.value;
                        handleUpdateConfig({ matrixRows: newRows });
                      }}
                      className="border border-border bg-background text-sm px-3 py-2"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newRows = question.config?.matrixRows?.filter((_, i) => i !== index) || [];
                        handleUpdateConfig({ matrixRows: newRows });
                      }}
                      className="h-8 w-8 p-0 hover:bg-destructive/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentRows = question.config?.matrixRows || [];
                    handleUpdateConfig({ matrixRows: [...currentRows, `Row ${currentRows.length + 1}`] });
                  }}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Row</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Columns</Label>
              <div className="space-y-2">
                {question.config?.matrixColumns?.map((column, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Input
                      value={column}
                      onChange={(e) => {
                        const newColumns = [...(question.config?.matrixColumns || [])];
                        newColumns[index] = e.target.value;
                        handleUpdateConfig({ matrixColumns: newColumns });
                      }}
                      className="border border-border bg-background text-sm px-3 py-2"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newColumns = question.config?.matrixColumns?.filter((_, i) => i !== index) || [];
                        handleUpdateConfig({ matrixColumns: newColumns });
                      }}
                      className="h-8 w-8 p-0 hover:bg-destructive/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentColumns = question.config?.matrixColumns || [];
                    handleUpdateConfig({ matrixColumns: [...currentColumns, `Column ${currentColumns.length + 1}`] });
                  }}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Column</span>
                </Button>
              </div>
            </div>
          </div>
        );

      case "ranking":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {question.config?.rankingItems?.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-muted-foreground min-w-[20px]">{index + 1}.</span>
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...(question.config?.rankingItems || [])];
                      newItems[index] = e.target.value;
                      handleUpdateConfig({ rankingItems: newItems });
                    }}
                    className="flex-1 border border-border bg-background text-sm px-3 py-2"
                    placeholder={`Item ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newItems = question.config?.rankingItems?.filter((_, i) => i !== index) || [];
                      handleUpdateConfig({ rankingItems: newItems });
                    }}
                    className="h-8 w-8 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentItems = question.config?.rankingItems || [];
                handleUpdateConfig({ rankingItems: [...currentItems, `Item ${currentItems.length + 1}`] });
              }}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </Button>
          </div>
        );

      case "embed-image":
        return (
          <div className="space-y-4">
            <div className="border border-border bg-background p-6 rounded-lg">
              {question.config?.imageUrl ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={question.config.imageUrl} 
                      alt="Uploaded survey image" 
                      className="w-full h-auto max-h-64 object-cover rounded border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleUpdateConfig({ imageUrl: undefined })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={isUploading}
                    onClick={handleImageUpload}
                  >
                    {isUploading ? "Uploading..." : "Replace Image"}
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded flex items-center justify-center">
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Image will be displayed here</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={isUploading}
                    onClick={handleImageUpload}
                  >
                    {isUploading ? "Uploading..." : "Choose Image"}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Image Caption</Label>
              <Input
                value={question.config?.imageCaption || ""}
                onChange={(e) => handleUpdateConfig({ imageCaption: e.target.value })}
                className="border border-border bg-background text-sm px-3 py-2"
                placeholder="Optional caption for the image"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            Question type not yet implemented
          </div>
        );
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
        <Card className="mb-4 bg-muted/30 border border-border shadow-sm hover:shadow-md transition-shadow relative">
        <CardHeader className="pb-3">
          {/* Question Type and Actions Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted/20 rounded transition-colors"
                aria-label="Drag to reorder"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center space-x-2">
                {(() => {
                  const IconComponent = getQuestionTypeIcon(question.type);
                  return <IconComponent className="h-4 w-4 text-muted-foreground" />;
                })()}
                <span className="text-sm font-medium text-foreground">
                  {getQuestionTypeLabel(question.type)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Dialog open={showLogic} onOpenChange={setShowLogic}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Question Logic</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Show this question when:</Label>
                      <Select
                        value={logicCondition.questionId}
                        onValueChange={(value) => setLogicCondition(prev => ({ ...prev, questionId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a question" />
                        </SelectTrigger>
                        <SelectContent>
                          {allQuestions
                            .filter(q => q.id !== question.id)
                            .map((q) => (
                              <SelectItem key={q.id} value={q.id}>
                                {q.title.length > 30 ? q.title.substring(0, 30) + "..." : q.title}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Answer:</Label>
                      <Input
                        value={logicCondition.value}
                        onChange={(e) => setLogicCondition(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="Enter expected answer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Action:</Label>
                      <Select
                        value={logicCondition.action}
                        onValueChange={(value: "show" | "jump") => setLogicCondition(prev => ({ ...prev, action: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="show">Show this question</SelectItem>
                          <SelectItem value="jump">Jump to question</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {logicCondition.action === "jump" && (
                      <div className="space-y-2">
                        <Label>Jump to:</Label>
                        <Select
                          value={logicCondition.targetId}
                          onValueChange={(value) => setLogicCondition(prev => ({ ...prev, targetId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select target question" />
                          </SelectTrigger>
                          <SelectContent>
                            {allQuestions
                              .filter(q => q.id !== question.id)
                              .map((q) => (
                                <SelectItem key={q.id} value={q.id}>
                                  {q.title.length > 30 ? q.title.substring(0, 30) + "..." : q.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          const newRule = {
                            condition: {
                              questionId: logicCondition.questionId,
                              answer: logicCondition.value
                            },
                            action: logicCondition.action,
                            targetId: logicCondition.targetId
                          };
                          
                          const currentLogic = question.logic || [];
                          onUpdate({ logic: [...currentLogic, newRule] });
                          
                          setLogicCondition({
                            questionId: "",
                            operator: "equals",
                            value: "",
                            action: "show",
                            targetId: ""
                          });
                        }}
                        disabled={!logicCondition.questionId || !logicCondition.value}
                      >
                        Save Logic Rule
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => setShowLogic(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                    
                    {question.logic && question.logic.length > 0 && (
                      <div className="space-y-2">
                        <Separator />
                        <Label>Existing Rules:</Label>
                        {question.logic.map((rule, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">
                              Show when {allQuestions.find(q => q.id === rule.condition.questionId)?.title || 'Question'} = "{rule.condition.answer}"
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newLogic = question.logic?.filter((_, i) => i !== index) || [];
                                onUpdate({ logic: newLogic });
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="ghost" size="sm" onClick={onDuplicate} className="h-8 w-8 p-0">
                <Copy className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0 hover:bg-destructive/20">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Question Title Input */}
          <Textarea
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="The question that you wish to ask to users..."
            className="w-full resize-none border border-border bg-background text-base font-medium px-3 py-2 min-h-[2.5rem] placeholder:text-placeholder placeholder:text-sm focus:ring-1 focus:ring-primary/50"
            rows={1}
          />

          {/* Question-specific Content */}
          {renderQuestionContent()}
        </CardContent>
      </Card>
    </div>
  );
}