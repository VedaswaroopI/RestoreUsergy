import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SurveyQuestion } from "../SurveyBuilder";

interface TextEditorProps {
  question: SurveyQuestion;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
  placeholder?: string;
}

export const TextEditor = memo(function TextEditor({
  question,
  onUpdate,
  placeholder
}: TextEditorProps) {
  if (question.type === "long-text") {
    return (
      <div className="space-y-4">
        <Textarea
          placeholder={placeholder || "Long answer text"}
          disabled
          className="bg-muted/50 text-muted-foreground min-h-[100px]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder={placeholder || "Short answer text"}
        disabled
        className="bg-muted/50 text-muted-foreground"
      />
    </div>
  );
});