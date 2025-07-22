import { memo } from "react";
import { SurveyQuestion } from "../SurveyBuilder";

interface LinearScaleEditorProps {
  question: SurveyQuestion;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
}

export const LinearScaleEditor = memo(function LinearScaleEditor({
  question,
  onUpdate
}: LinearScaleEditorProps) {
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
    </div>
  );
});