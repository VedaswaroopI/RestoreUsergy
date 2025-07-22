import { memo } from "react";
import { Star, Heart, ThumbsUp } from "lucide-react";
import { SurveyQuestion } from "../SurveyBuilder";

interface RatingEditorProps {
  question: SurveyQuestion;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
}

export const RatingEditor = memo(function RatingEditor({
  question,
  onUpdate
}: RatingEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-1 justify-start pl-px">
        {Array.from({ length: question.config?.ratingCount || 5 }).map((_, index) => {
          const RatingIcon = question.config?.ratingIcon === "heart" ? Heart : 
                             question.config?.ratingIcon === "thumbs" ? ThumbsUp : Star;
          return (
            <RatingIcon key={index} className="h-6 w-6 text-muted-foreground" />
          );
        })}
      </div>
    </div>
  );
});