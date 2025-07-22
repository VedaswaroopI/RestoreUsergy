import { memo } from "react";
import { SurveyQuestion } from "./SurveyBuilder";
import { MultipleChoiceEditor } from "./editors/MultipleChoiceEditor";
import { MatrixEditor } from "./editors/MatrixEditor";
import { RankingEditor } from "./editors/RankingEditor";
import { LinearScaleEditor } from "./editors/LinearScaleEditor";
import { RatingEditor } from "./editors/RatingEditor";
import { TextEditor } from "./editors/TextEditor";
import { NumberEditor } from "./editors/NumberEditor";
import { DateTimeEditor } from "./editors/DateTimeEditor";
import { FileUploadEditor } from "./editors/FileUploadEditor";
import { ImageEmbedEditor } from "./editors/ImageEmbedEditor";
import { getQuestionTypeLabel } from "./survey-config";

interface QuestionBodyRendererProps {
  question: SurveyQuestion;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
}

export const QuestionBodyRenderer = memo(function QuestionBodyRenderer({ 
  question, 
  onUpdate 
}: QuestionBodyRendererProps) {
  switch (question.type) {
    case "multiple-choice":
    case "checkboxes":
    case "dropdown":
    case "multi-select":
      return <MultipleChoiceEditor question={question} onUpdate={onUpdate} />;

    case "matrix":
      return <MatrixEditor question={question} onUpdate={onUpdate} />;

    case "ranking":
      return <RankingEditor question={question} onUpdate={onUpdate} />;

    case "linear-scale":
      return <LinearScaleEditor question={question} onUpdate={onUpdate} />;

    case "rating":
      return <RatingEditor question={question} onUpdate={onUpdate} />;

    case "short-text":
    case "long-text":
      return <TextEditor question={question} onUpdate={onUpdate} />;

    case "number":
      return <NumberEditor question={question} onUpdate={onUpdate} />;

    case "date":
    case "time":
      return <DateTimeEditor question={question} onUpdate={onUpdate} />;

    case "file-upload":
      return <FileUploadEditor question={question} onUpdate={onUpdate} />;

    case "embed-image":
      return <ImageEmbedEditor question={question} onUpdate={onUpdate} />;

    case "link":
      return <TextEditor question={question} onUpdate={onUpdate} placeholder="https://example.com" />;

    default:
      return (
        <div className="p-4 text-center text-muted-foreground bg-muted/20 rounded">
          {getQuestionTypeLabel(question.type)} configuration will appear here
        </div>
      );
  }
});