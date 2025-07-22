import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Calendar, Clock } from "lucide-react";
import { SurveyQuestion } from "../SurveyBuilder";

interface DateTimeEditorProps {
  question: SurveyQuestion;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
}

export const DateTimeEditor = memo(function DateTimeEditor({
  question,
  onUpdate
}: DateTimeEditorProps) {
  if (question.type === "date") {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            disabled
            className="bg-muted/50 text-muted-foreground"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Input
          type="time"
          disabled
          className="bg-muted/50 text-muted-foreground"
        />
      </div>
    </div>
  );
});