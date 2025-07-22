import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MultipleChoiceBodyProps {
  localOptions: string[];
  acceptedAnswersSet: Set<string>;
  onLocalOptionChange: (index: number, value: string) => void;
  onOptionBlur: (index: number) => void;
  onToggleAccepted: (option: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  questionId: string;
}

export const MultipleChoiceBody = memo(function MultipleChoiceBody({
  localOptions,
  acceptedAnswersSet,
  onLocalOptionChange,
  onOptionBlur,
  onToggleAccepted,
  onAddOption,
  onRemoveOption,
  questionId
}: MultipleChoiceBodyProps) {
  return (
    <div className="space-y-2">
      {localOptions.map((option, index) => {
        // Use the live option data instead of saved data
        const isAccepted = acceptedAnswersSet.has(option);
        
        return (
          <div key={`${questionId}-option-${index}`} className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-muted-foreground rounded-sm flex-shrink-0" />
            <Input
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => onLocalOptionChange(index, e.target.value)}
              onBlur={() => onOptionBlur(index)}
              className="border-none pl-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs"
            />
            <div className="flex items-center space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleAccepted(option)}
                      className={cn(
                        "h-6 w-6 p-0",
                        isAccepted 
                          ? "text-green-600 hover:text-green-700" 
                          : "text-muted-foreground hover:text-green-600"
                      )}
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Accept users who choose this answer</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleAccepted(option)}
                      className={cn(
                        "h-6 w-6 p-0",
                        !isAccepted && option
                          ? "text-red-600 hover:text-red-700" 
                          : "text-muted-foreground hover:text-red-600"
                      )}
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reject users who choose this answer</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {localOptions.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveOption(index)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      })}
      <Button
        variant="ghost"
        size="sm"
        onClick={onAddOption}
        className="text-primary hover:text-primary text-xs hover:bg-transparent"
      >
        <Plus className="h-3 w-3 mr-1" />
        Add Option
      </Button>
    </div>
  );
});