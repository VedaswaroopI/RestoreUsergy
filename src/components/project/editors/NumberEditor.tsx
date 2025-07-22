import { memo } from "react";
import { Input } from "@/components/ui/input";
import { SurveyQuestion } from "../SurveyBuilder";

interface NumberEditorProps {
  question: SurveyQuestion;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
}

export const NumberEditor = memo(function NumberEditor({
  question,
  onUpdate
}: NumberEditorProps) {
  return (
    <div className="space-y-4">
      <Input
        type="number"
        placeholder="Number input"
        disabled
        className="bg-muted/50 text-muted-foreground"
        min={question.config?.minValue}
        max={question.config?.maxValue}
        step={question.config?.allowDecimals ? "0.01" : "1"}
      />
    </div>
  );
});