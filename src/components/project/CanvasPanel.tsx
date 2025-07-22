
import { motion, AnimatePresence } from "framer-motion";
import {
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableSurveyQuestion } from "./SortableSurveyQuestion";
import { SurveyDropZone } from "./SurveyDropZone";
import { DraggableSurveyToolboxItem } from "./DraggableSurveyToolboxItem";
import { SurveyQuestion } from "./SurveyBuilder";
import { getQuestionTypeIcon, getQuestionTypeLabel } from "./survey-config";

interface CanvasPanelProps {
  questions: SurveyQuestion[];
  sensors: any;
  activeId: string | null;
  newlyAddedQuestionId: string | null;
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  onUpdateQuestion: (id: string, updates: Partial<SurveyQuestion>) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (id: string) => void;
  onAddQuestionAtIndex: (type: string, insertIndex?: number) => void;
  onFocusHandled: () => void;
}

export function CanvasPanel({
  questions,
  sensors,
  activeId,
  newlyAddedQuestionId,
  onDragStart,
  onDragEnd,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onAddQuestionAtIndex,
  onFocusHandled
}: CanvasPanelProps) {
  const activeItem = activeId?.startsWith('toolbox-') 
    ? { type: activeId.replace('toolbox-', '') }
    : questions.find(q => q.id === activeId);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Survey Builder</h1>
        
        {questions.length === 0 ? (
          <SurveyDropZone id="main-drop-zone" activeId={activeId}>
            <div className="min-h-96 flex items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">No questions yet</h3>
                <p className="text-muted-foreground">Drag question types from the toolbox or use the buttons to get started</p>
              </div>
            </div>
          </SurveyDropZone>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                {questions.map((question, index) => (
                  <SortableSurveyQuestion
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdate={(updates) => onUpdateQuestion(question.id, updates)}
                    onDelete={() => onDeleteQuestion(question.id)}
                    onDuplicate={() => onDuplicateQuestion(question.id)}
                    allQuestions={questions}
                    activeId={activeId}
                    newlyAddedQuestionId={newlyAddedQuestionId}
                    onFocusHandled={onFocusHandled}
                  />
                ))}
              </SortableContext>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
