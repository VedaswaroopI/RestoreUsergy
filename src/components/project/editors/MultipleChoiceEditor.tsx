import { memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { SurveyQuestion } from "../SurveyBuilder";

interface MultipleChoiceEditorProps {
  question: SurveyQuestion;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
}

export const MultipleChoiceEditor = memo(function MultipleChoiceEditor({
  question,
  onUpdate
}: MultipleChoiceEditorProps) {
  
  const handleAddOption = useCallback(() => {
    const currentOptions = question.options || [];
    onUpdate({ options: [...currentOptions, ""] });
  }, [question.options, onUpdate]);

  const handleUpdateOption = useCallback((index: number, value: string) => {
    const currentOptions = question.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  }, [question.options, onUpdate]);

  const handleRemoveOption = useCallback((index: number) => {
    const currentOptions = question.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  }, [question.options, onUpdate]);

  const getOptionIcon = () => {
    if (question.type === "multiple-choice") {
      return <div className="w-4 h-4 rounded-full border-2 border-border bg-background"></div>;
    }
    return <div className="w-4 h-4 rounded border-2 border-border bg-background"></div>;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="text-sm font-medium text-muted-foreground min-w-[20px]">
              {String.fromCharCode(65 + index)}.
            </span>
            {getOptionIcon()}
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
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddOption}
        className="flex items-center space-x-2 text-primary border-primary hover:bg-primary/10 hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        <span>Add Option</span>
      </Button>
    </div>
  );
});