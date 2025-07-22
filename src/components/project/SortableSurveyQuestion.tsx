import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { debounce } from "lodash-es";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, 
  Copy, 
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SurveyQuestion } from "./SurveyBuilder";
import { QuestionBodyRenderer } from "./QuestionBodyRenderer";
import { LogicPanel } from "./LogicPanel";
import { getQuestionTypeIcon, getQuestionTypeLabel } from "./survey-config";

interface SortableSurveyQuestionProps {
  question: SurveyQuestion;
  index: number;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  
  allQuestions: SurveyQuestion[];
  projectId?: string;
  activeId: string | null;
  newlyAddedQuestionId?: string | null;
  onFocusHandled?: () => void;
}

export const SortableSurveyQuestion = memo(function SortableSurveyQuestion({ 
  question, 
  index,
  onUpdate, 
  onDelete, 
  onDuplicate,
  
  allQuestions,
  projectId,
  activeId,
  newlyAddedQuestionId,
  onFocusHandled
}: SortableSurveyQuestionProps) {
  // Local state to prevent focus loss during typing
  const [localTitle, setLocalTitle] = useState(question.title);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Sync local state with prop changes (for duplication, etc.)
  useEffect(() => {
    setLocalTitle(question.title);
  }, [question.title]);

  // Auto-focus on newly added questions
  useEffect(() => {
    if (newlyAddedQuestionId === question.id && titleRef.current) {
      titleRef.current.focus();
      titleRef.current.setSelectionRange(0, 0);
      onFocusHandled?.();
    }
  }, [newlyAddedQuestionId, question.id, onFocusHandled]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver
  } = useSortable({ id: question.id });

  const { setNodeRef: setDropRef } = useDroppable({
    id: question.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Combine refs for both sortable and droppable
  const combinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    setDropRef(node);
  };

  // Debounced title update
  const debouncedTitleUpdate = useMemo(
    () => debounce((title: string) => {
      if (title !== question.title) {
        onUpdate({ title });
      }
    }, 400),
    [onUpdate, question.title]
  );

  // Local state handlers
  const handleLocalTitleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalTitle(value);
    debouncedTitleUpdate(value);
  }, [debouncedTitleUpdate]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedTitleUpdate.cancel();
    };
  }, [debouncedTitleUpdate]);

  // Global state update handlers (called on blur)
  const handleTitleBlur = useCallback(() => {
    if (localTitle !== question.title) {
      onUpdate({ title: localTitle });
    }
  }, [localTitle, question.title, onUpdate]);

  const isDropTarget = isOver && activeId?.startsWith('toolbox-');
  const IconComponent = getQuestionTypeIcon(question.type);

  return (
    <motion.div
      ref={combinedRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`
        relative bg-card border border-border rounded-lg shadow-sm p-6 group
        focus-within:border-primary/50
        ${isDragging ? "opacity-40 shadow-2xl ring-2 ring-primary scale-[1.02] z-50" : ""}
        ${isDropTarget ? "ring-2 ring-primary/50 bg-primary/5" : ""}
      `}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            aria-label="Reorder question"
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted transition-colors"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Question Type Icon & Label */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-md">
              <IconComponent className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{getQuestionTypeLabel(question.type)}</p>
              <p className="text-xs text-muted-foreground">Question {index + 1}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
            className="h-8 w-8 p-0 hover:bg-primary/20"
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
          </Button>

          <LogicPanel 
            question={question} 
            allQuestions={allQuestions} 
            onUpdate={onUpdate} 
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 hover:bg-destructive/20"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Question Title Input */}
      <div className="space-y-4">
        <Textarea
          ref={titleRef}
          value={localTitle}
          onChange={handleLocalTitleChange}
          onBlur={handleTitleBlur}
          placeholder="Enter your question here..."
          className="resize-none border-0 bg-transparent text-sm font-normal placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground/70 focus:ring-0 py-1 px-1"
          rows={1}
          style={{ minHeight: "auto" }}
        />

        {/* Question Body Renderer */}
        <QuestionBodyRenderer question={question} onUpdate={onUpdate} />
      </div>
    </motion.div>
  );
});