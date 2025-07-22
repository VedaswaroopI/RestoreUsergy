import { memo } from "react";
import { Upload } from "lucide-react";
import { SurveyQuestion } from "../SurveyBuilder";

interface FileUploadEditorProps {
  question: SurveyQuestion;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
}

export const FileUploadEditor = memo(function FileUploadEditor({
  question,
  onUpdate
}: FileUploadEditorProps) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/20">
        <div className="space-y-2">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            Click to upload or drag and drop
          </div>
          <div className="text-xs text-muted-foreground">
            Allowed: {question.config?.allowedFileTypes?.join(", ") || "All files"}
          </div>
          <div className="text-xs text-muted-foreground">
            Max size: {question.config?.maxFileSize || 10}MB
          </div>
        </div>
      </div>
    </div>
  );
});