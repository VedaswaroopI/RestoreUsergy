import { memo } from "react";
import { Image } from "lucide-react";
import { SurveyQuestion } from "../SurveyBuilder";

interface ImageEmbedEditorProps {
  question: SurveyQuestion;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
}

export const ImageEmbedEditor = memo(function ImageEmbedEditor({
  question,
  onUpdate
}: ImageEmbedEditorProps) {
  return (
    <div className="space-y-4">
      {question.config?.imageUrl ? (
        <div className="border rounded-lg overflow-hidden">
          <img 
            src={question.config.imageUrl} 
            alt={question.config?.imageCaption || "Survey image"} 
            className="w-full h-auto max-h-96 object-cover"
          />
          {question.config?.imageCaption && (
            <div className="p-3 bg-muted/30 text-sm text-muted-foreground text-center">
              {question.config.imageCaption}
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/20">
          <div className="space-y-2">
            <Image className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              No image selected
            </div>
            <div className="text-xs text-muted-foreground">
              Configure image URL in question settings
            </div>
          </div>
        </div>
      )}
    </div>
  );
});