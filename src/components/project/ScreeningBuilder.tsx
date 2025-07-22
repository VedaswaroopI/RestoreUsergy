
import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { debounce } from "lodash-es";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
  SortableContext as SortableContextProvider
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, 
  Copy, 
  Trash2, 
  Plus, 
  CheckCircle,
  HelpCircle,
  FileText,
  Type,
  CheckSquare,
  Users,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
  Mail,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "./RichTextEditor";
import { MultipleChoiceBody } from "./MultipleChoiceBody";
import { LegalAgreementBody } from "./LegalAgreementBody";
import { ShortTextBody } from "./ShortTextBody";
import { EmailCollectionBody } from "./EmailCollectionBody";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ScreeningBuilderProps {
  projectId: string;
  onBack: () => void;
  onContinue: () => void;
}

export interface ScreeningQuestion {
  id: string;
  type: 'multiple-choice' | 'short-text' | 'legal-agreement' | 'collect-emails';
  question: string;
  options?: string[];
  content?: string; // For legal agreements
  required: boolean;
  acceptedAnswers?: string[]; // For multiple choice - stores which answers qualify users
}

interface ScreeningConfig {
  questions: ScreeningQuestion[];
}

// Draggable toolbox item
function DraggableToolboxItem({ type, icon: Icon, label, description, onAdd }: {
  type: string;
  icon: React.ComponentType<any>;
  label: string;
  description: string;
  onAdd: (type: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `toolbox-${type}`,
    data: { type }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only handle click if it's not a drag operation
    if (!isDragging) {
      onAdd(type);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={setNodeRef}
            style={style}
            variant="outline"
            className={cn(
              "w-full justify-start px-2 py-1.5 h-auto bg-background hover:bg-muted border border-border text-foreground hover:text-foreground rounded text-xs transition-colors cursor-grab active:cursor-grabbing",
              isDragging && "opacity-50"
            )}
            onClick={handleClick}
            {...listeners}
            {...attributes}
          >
            <Icon className="h-4 w-4 mr-2 text-foreground flex-shrink-0" />
            <span className="text-xs font-normal truncate">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Helper functions for question type styling
const getQuestionTypeIcon = (type: string) => {
  switch (type) {
    case 'multiple-choice':
      return CheckSquare;
    case 'short-text':
      return Type;
    case 'legal-agreement':
      return FileText;
    case 'collect-emails':
      return Mail;
    default:
      return CheckSquare;
  }
};

const getQuestionTypeLabel = (type: string) => {
  switch (type) {
    case 'multiple-choice':
      return 'Multiple Choice';
    case 'short-text':
      return 'Short Text';
    case 'legal-agreement':
      return 'Legal Agreement';
    case 'collect-emails':
      return 'Email Collection';
    default:
      return 'Question';
  }
};

// Enhanced Sortable question component with survey builder styling
const SortableQuestion = memo(function SortableQuestion({ 
  question, 
  index,
  onUpdate, 
  onDelete, 
  onDuplicate,
  activeId
}: {
  question: ScreeningQuestion;
  index: number;
  onUpdate: (id: string, updates: Partial<ScreeningQuestion>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  activeId: string | null;
}) {
  // Local state to prevent focus loss during typing
  const [localQuestion, setLocalQuestion] = useState(question.question);
  const [localOptions, setLocalOptions] = useState(question.options || []);
  const [localContent, setLocalContent] = useState(question.content || "");

  // Sync local state with prop changes (for duplication, etc.)
  useEffect(() => {
    setLocalQuestion(question.question);
    setLocalOptions(question.options || []);
    setLocalContent(question.content || "");
  }, [question.question, question.options, question.content]);

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

  // Local state handlers
  const handleLocalQuestionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalQuestion(e.target.value);
  }, []);

  const handleLocalOptionChange = useCallback((index: number, value: string) => {
    const newOptions = [...localOptions];
    newOptions[index] = value;
    setLocalOptions(newOptions);
  }, [localOptions]);

  // Debounced content update for RichTextEditor
  const debouncedContentUpdate = useMemo(
    () => debounce(() => {
      if (localContent !== question.content) {
        onUpdate(question.id, { content: localContent });
      }
    }, 400),
    [onUpdate, question.id, question.content, localContent]
  );

  // Call debounced function directly in handleLocalContentChange
  const handleLocalContentChangeWithDebounce = useCallback((content: string) => {
    setLocalContent(content);
    debouncedContentUpdate();
  }, [debouncedContentUpdate]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedContentUpdate.cancel();
    };
  }, [debouncedContentUpdate]);

  // Global state update handlers (called on blur)
  const handleQuestionBlur = useCallback(() => {
    if (localQuestion !== question.question) {
      onUpdate(question.id, { question: localQuestion });
    }
  }, [localQuestion, question.question, onUpdate, question.id]);

  const handleOptionBlur = useCallback((index: number) => {
    if (localOptions[index] !== question.options?.[index]) {
      const newOptions = [...localOptions];
      onUpdate(question.id, { options: newOptions });
    }
  }, [localOptions, question.options, onUpdate, question.id]);

  const handleContentBlur = useCallback(() => {
    if (localContent !== question.content) {
      onUpdate(question.id, { content: localContent });
    }
  }, [localContent, question.content, onUpdate, question.id]);

  const addOption = useCallback(() => {
    const newOptions = [...localOptions, ""];
    setLocalOptions(newOptions);
  }, [localOptions]);

  const toggleAccepted = useCallback((option: string) => {
    const currentAccepted = question.acceptedAnswers || [];
    const isAccepted = currentAccepted.includes(option);
    
    if (isAccepted) {
      onUpdate(question.id, { 
        acceptedAnswers: currentAccepted.filter(a => a !== option) 
      });
    } else {
      onUpdate(question.id, { 
        acceptedAnswers: [...currentAccepted, option] 
      });
    }
  }, [question.acceptedAnswers, onUpdate, question.id]);

  const removeOption = useCallback((index: number) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);
  }, [localOptions]);

  const acceptedAnswersSet = useMemo(() => {
    return new Set(question.acceptedAnswers || []);
  }, [question.acceptedAnswers]);

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
      {/* Header Row - Enhanced to match survey builder */}
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

          {/* Question Type Icon & Label - Enhanced styling */}
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

        {/* Action Buttons - Enhanced styling */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(question.id)}
            className="h-8 w-8 p-0 hover:bg-primary/20"
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(question.id)}
            className="h-8 w-8 p-0 hover:bg-destructive/20"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Question Content */}
      <div className="space-y-4">
        {question.type !== 'legal-agreement' && (
          <div>
            <Textarea
              placeholder="Enter your question here..."
              value={localQuestion}
              onChange={handleLocalQuestionChange}
              onBlur={handleQuestionBlur}
              className="resize-none border-0 bg-transparent text-sm font-normal placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground/70 focus:ring-0 py-1 px-1"
              rows={1}
              style={{ minHeight: "auto" }}
            />
          </div>
        )}

        {/* Multiple Choice Options */}
        {question.type === 'multiple-choice' && (
          <MultipleChoiceBody
            localOptions={localOptions}
            acceptedAnswersSet={acceptedAnswersSet}
            onLocalOptionChange={handleLocalOptionChange}
            onOptionBlur={handleOptionBlur}
            onToggleAccepted={toggleAccepted}
            onAddOption={addOption}
            onRemoveOption={removeOption}
            questionId={question.id}
          />
        )}

        {/* Short Text Preview */}
        {question.type === 'short-text' && <ShortTextBody />}

        {/* Legal Agreement */}
        {question.type === 'legal-agreement' && (
          <LegalAgreementBody
            localContent={localContent}
            onLocalContentChange={handleLocalContentChangeWithDebounce}
          />
        )}

        {/* Email Collection */}
        {question.type === 'collect-emails' && <EmailCollectionBody />}
      </div>
    </motion.div>
  );
});

export function ScreeningBuilder({ projectId, onBack, onContinue }: ScreeningBuilderProps) {
  const { toast } = useToast();
  const [config, setConfig] = useState<ScreeningConfig>({
    questions: []
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionTypesOpen, setQuestionTypesOpen] = useState(true);
  const [coreQuestionBankOpen, setCoreQuestionBankOpen] = useState(true);
  const [draggedType, setDraggedType] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced distance for better responsiveness
      },
    })
  );

  // Load existing screening config
  useEffect(() => {
    const loadScreeningConfig = async () => {
      try {
        const { data: project } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (project?.screening_config) {
          setConfig(project.screening_config as unknown as ScreeningConfig);
        }
      } catch (error) {
        console.error('Error loading screening config:', error);
      }
    };

    loadScreeningConfig();
  }, [projectId]);

  // Handle adding question from toolbox
  const handleAddQuestion = (type: string) => {
    let newQuestion: ScreeningQuestion;
    
    if (type === 'collect-ios-email') {
      newQuestion = {
        id: `question_${Date.now()}`,
        type: 'collect-emails',
        question: "What's your email address for TestFlight access?",
        required: true
      };
    } else if (type === 'collect-android-email') {
      newQuestion = {
        id: `question_${Date.now()}`,
        type: 'collect-emails',
        question: "What's your email address for Google Play Beta access?",
        required: true
      };
    } else {
      newQuestion = {
        id: `question_${Date.now()}`,
        type: type as any,
        question: "",
        required: true,
        ...(type === 'multiple-choice' && { options: [""], acceptedAnswers: [] }),
        ...(type === 'legal-agreement' && { content: "" })
      };
    }

    setConfig(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  // Question management - memoized to prevent unnecessary re-renders
  const updateQuestion = useCallback((id: string, updates: Partial<ScreeningQuestion>) => {
    setConfig(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, ...updates } : q
      )
    }));
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  }, []);

  const duplicateQuestion = useCallback((id: string) => {
    setConfig(prev => {
      const question = prev.questions.find(q => q.id === id);
      if (!question) return prev;

      const newQuestion: ScreeningQuestion = {
        ...question,
        id: `question_${Date.now()}`,
        question: `${question.question} (Copy)`
      };

      return {
        ...prev,
        questions: [...prev.questions, newQuestion]
      };
    });
  }, []);

  // Handle adding question from toolbox with optional insertion index
  const handleAddQuestionAtIndex = (type: string, insertIndex?: number) => {
    let newQuestion: ScreeningQuestion;
    
    if (type === 'collect-ios-email') {
      newQuestion = {
        id: `question_${Date.now()}`,
        type: 'collect-emails',
        question: "What's your email address for TestFlight access?",
        required: true
      };
    } else if (type === 'collect-android-email') {
      newQuestion = {
        id: `question_${Date.now()}`,
        type: 'collect-emails',
        question: "What's your email address for Google Play Beta access?",
        required: true
      };
    } else {
      newQuestion = {
        id: `question_${Date.now()}`,
        type: type as any,
        question: "",
        required: true,
        ...(type === 'multiple-choice' && { options: [""], acceptedAnswers: [] }),
        ...(type === 'legal-agreement' && { content: "" })
      };
    }

    setConfig(prev => {
      const newQuestions = [...prev.questions];
      if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= newQuestions.length) {
        newQuestions.splice(insertIndex, 0, newQuestion);
      } else {
        newQuestions.push(newQuestion);
      }
      return {
        ...prev,
        questions: newQuestions
      };
    });
  };

  // Drag and drop for reordering and adding from toolbox
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveId(id);
    
    // Check if dragging from toolbox
    if (id.startsWith('toolbox-')) {
      const type = event.active.data.current?.type;
      setDraggedType(type);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Reset drag state
    setActiveId(null);
    setDraggedType(null);

    // If no valid drop zone, do nothing
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    
    // If dragging from toolbox
    if (activeId.startsWith('toolbox-')) {
      const type = active.data.current?.type;
      if (!type) return;

      // Only add if dropped specifically on canvas or on/between existing questions
      // Explicitly check that it's not dropped back on toolbox area or outside canvas
      const isDroppedOnCanvas = overId === 'canvas-drop-zone' || config.questions.some(q => q.id === overId);
      const isDroppedOnToolbox = overId.startsWith('toolbox-');
      
      if (isDroppedOnCanvas && !isDroppedOnToolbox) {
        let insertIndex: number | undefined;
        
        // If dropped on an existing question, insert before it
        if (overId !== 'canvas-drop-zone') {
          insertIndex = config.questions.findIndex(q => q.id === overId);
        }
        
        handleAddQuestionAtIndex(type, insertIndex);
      }
      // If dropped back on toolbox or outside canvas, do nothing (no question added)
      return;
    }
    
    // If reordering existing questions
    if (activeId !== overId && config.questions.some(q => q.id === activeId)) {
      setConfig(prev => {
        const oldIndex = prev.questions.findIndex(q => q.id === activeId);
        const newIndex = prev.questions.findIndex(q => q.id === overId);
        
        if (oldIndex === -1 || newIndex === -1) return prev;

        return {
          ...prev,
          questions: arrayMove(prev.questions, oldIndex, newIndex)
        };
      });
    }
  };

  // Save configuration
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({ screening_config: config } as any)
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Qualifiers saved successfully",
        description: "Your screening criteria have been configured.",
      });

      onContinue();
    } catch (error) {
      console.error('Error saving screening config:', error);
      toast({
        title: "Error saving configuration",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    // Save empty config and continue
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({ screening_config: { questions: [] } } as any)
        .eq('id', projectId);

      if (error) throw error;
      onContinue();
    } catch (error) {
      console.error('Error skipping screening:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Drop zone component
  function DropZone({ children, isEmpty }: { children: React.ReactNode; isEmpty: boolean }) {
    const { isOver, setNodeRef } = useDroppable({
      id: 'canvas-drop-zone'
    });

    const isValidDrop = isOver && draggedType && activeId?.startsWith('toolbox-');

    return (
      <div 
        ref={setNodeRef}
        className={cn(
          "h-full",
          isValidDrop && isEmpty && "bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg",
          isValidDrop && !isEmpty && "bg-primary/5"
        )}
      >
        {children}
      </div>
    );
  }

  const questionTypes = [
    {
      type: 'multiple-choice',
      icon: CheckSquare,
      label: 'Multiple Choice',
      description: 'Ask a question with several answers, then decide which answers qualify or disqualify a user.'
    },
    {
      type: 'legal-agreement',
      icon: FileText,
      label: 'Legal Agreement',
      description: 'Protect your project by requiring users to accept your NDA or terms before continuing.'
    }
  ];

  const coreQuestions = [
    {
      type: 'collect-ios-email',
      icon: Mail,
      label: 'Collect iOS User Email',
      description: 'Add a pre-built question to collect user emails for TestFlight invitations.'
    },
    {
      type: 'collect-android-email',
      icon: Mail,
      label: 'Collect Android User Email',
      description: 'Add a pre-built question to collect user emails for Google Play Beta invitations.'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center space-y-3 mb-6">
        <h1 className="text-3xl font-bold text-foreground">Set Your Qualifiers</h1>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          Ensure every participant is a perfect match. Add qualifying questions to build your ideal audience.
        </p>
      </div>

      {/* Responsive Grid Layout: 25% / 75% split - matching SurveyBuilder */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-12 gap-0 h-full">
          {/* Left Toolbox Panel - 25% (3 columns) - matching SurveyBuilder exact styling */}
          <div className="col-span-3 bg-muted/30 rounded-lg shadow-sm overflow-y-auto">
            <div className="p-6">
              <h2 className="text-sm font-medium mb-4 text-foreground">Drag & Drop Questions</h2>
              
              {/* Question Types - Default expanded */}
              <div className="mb-6">
                <Collapsible open={questionTypesOpen} onOpenChange={setQuestionTypesOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-2 py-1.5 h-auto bg-background/60 hover:bg-background/80 border border-border rounded text-xs">
                      <span className="font-semibold text-foreground">Question Types</span>
                      {questionTypesOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 space-y-1">
                      {questionTypes.map((questionType) => (
                        <DraggableToolboxItem
                          key={questionType.type}
                          type={questionType.type}
                          icon={questionType.icon}
                          label={questionType.label}
                          description={questionType.description}
                          onAdd={handleAddQuestion}
                        />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Core Question Bank - Default expanded */}
              <div className="mb-6">
                <Collapsible open={coreQuestionBankOpen} onOpenChange={setCoreQuestionBankOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-2 py-1.5 h-auto bg-background/60 hover:bg-background/80 border border-border rounded text-xs">
                      <span className="font-semibold text-foreground">Core Question Bank</span>
                      {coreQuestionBankOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 space-y-1">
                      {coreQuestions.map((questionType) => (
                        <DraggableToolboxItem
                          key={questionType.type}
                          type={questionType.type}
                          icon={questionType.icon}
                          label={questionType.label}
                          description={questionType.description}
                          onAdd={handleAddQuestion}
                        />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>

          {/* Right Canvas - 75% (9 columns) - matching SurveyBuilder */}
          <div className="col-span-9 bg-background overflow-y-auto">
            <DropZone isEmpty={config.questions.length === 0}>
              <div className="p-6 pb-24">
                <div className="w-full">
                  {/* Questions or Drop Zone */}
                  {config.questions.length === 0 ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-16 text-center bg-muted/30 min-h-[200px]">
                      <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Build Your Qualifiers</h3>
                      <p className="text-sm text-muted-foreground">Click or drag a question type from the left panel to add your first qualifier...</p>
                    </div>
                  ) : (
                    <SortableContext items={config.questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        <AnimatePresence>
                          {config.questions.map((question, index) => (
                           <SortableQuestion
                             key={question.id}
                             question={question}
                             index={index}
                             onUpdate={updateQuestion}
                             onDelete={deleteQuestion}
                             onDuplicate={duplicateQuestion}
                             activeId={activeId}
                           />
                          ))}
                        </AnimatePresence>
                      </div>
                    </SortableContext>
                  )}
                </div>
              </div>
            </DropZone>
          </div>
        </div>
        
        <DragOverlay>
          {activeId ? (
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg rotate-2">
              {activeId.startsWith('toolbox-') ? 'Adding question...' : 'Reordering question...'}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Fixed Bottom Action Bar */}
      <div className="border-t border-border bg-background p-6">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            Back
          </Button>

          <div className="flex items-center space-x-4">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base font-medium"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
              ) : (
                "Save & Continue"
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip Qualifiers Step
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
