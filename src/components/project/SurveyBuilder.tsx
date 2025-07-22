
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash-es";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SortableSurveyQuestion } from "./SortableSurveyQuestion";
import { DraggableSurveyToolboxItem } from "./DraggableSurveyToolboxItem";
import { SurveyDropZone } from "./SurveyDropZone";
import { SurveyPreview } from "./SurveyPreview";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { baseQuestionTypes, DEFAULT_REQUIRED, choiceTypes, getDefaultConfig } from "./survey-config";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export interface SurveyQuestion {
  id: string;
  type: string;
  title: string;
  description?: string;
  required?: boolean;
  options?: string[];
  config?: {
    minValue?: number;
    maxValue?: number;
    allowDecimals?: boolean;
    dateFormat?: string;
    timeFormat?: "12" | "24";
    minSelections?: number;
    maxSelections?: number;
    scaleRange?: [number, number];
    scaleLabels?: [string, string];
    ratingIcon?: "star" | "heart" | "thumbs";
    ratingCount?: number;
    matrixRows?: string[];
    matrixColumns?: string[];
    rankingItems?: string[];
    allowedFileTypes?: string[];
    maxFileSize?: number;
    allowMultiple?: boolean;
    allowOther?: boolean;
    imageCaption?: string;
    imageUrl?: string;
  };
  logic?: {
    condition: {
      questionId: string;
      answer: string;
    };
    action: "show" | "jump";
    targetId?: string;
  }[];
}

interface SurveyBuilderProps {
  projectId: string;
  onContinue: () => void;
}

export function SurveyBuilder({ projectId, onContinue }: SurveyBuilderProps) {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newlyAddedQuestionId, setNewlyAddedQuestionId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isToolboxCollapsed, setIsToolboxCollapsed] = useState(false);
  const { toast } = useToast();

  // Data hydration on initial load
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const { data: project, error } = await supabase
          .from('projects')
          .select('survey_config')
          .eq('id', projectId)
          .maybeSingle();

        if (error) {
          console.error('Error loading project:', error);
          toast({
            title: "Error",
            description: "Failed to load survey data",
            variant: "destructive",
          });
          return;
        }

        if (project?.survey_config && typeof project.survey_config === 'object' && 
            'questions' in project.survey_config && Array.isArray(project.survey_config.questions)) {
          setQuestions(project.survey_config.questions as unknown as SurveyQuestion[]);
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast({
          title: "Error",
          description: "Failed to load survey data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId, toast]);

  // Robust auto-save with debouncing
  const debouncedSave = useCallback(
    debounce(async (currentQuestions: SurveyQuestion[]) => {
      try {
        const { error } = await supabase
          .from('projects')
          .update({
            survey_config: { questions: currentQuestions } as any
          })
          .eq('id', projectId);

        if (error) {
          console.error('Auto-save error:', error);
          toast({
            title: "Auto-save failed",
            description: "Your changes might not be saved",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Auto-save error:', error);
      }
    }, 3000),
    [projectId, toast]
  );

  // Auto-save effect
  useEffect(() => {
    if (questions.length > 0) {
      debouncedSave(questions);
    }
  }, [questions, debouncedSave]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const [baseQuestionsOpen, setBaseQuestionsOpen] = useState(true);
  const [coreQuestionBankOpen, setCoreQuestionBankOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const addQuestion = (type: string) => {
    const newQuestion: SurveyQuestion = {
      id: crypto.randomUUID(),
      type,
      title: "",
      required: DEFAULT_REQUIRED,
      options: choiceTypes.includes(type) ? ["", ""] : undefined,
      config: getDefaultConfig(type)
    };

    setQuestions(prev => [...prev, newQuestion]);
    setNewlyAddedQuestionId(newQuestion.id);
  };


  const updateQuestion = (id: string, updates: Partial<SurveyQuestion>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questions.find(q => q.id === id);
    if (questionToDuplicate) {
      const duplicatedQuestion: SurveyQuestion = {
        ...questionToDuplicate,
        id: crypto.randomUUID(),
        title: questionToDuplicate.title + " (Copy)"
      };
      setQuestions(prev => [...prev, duplicatedQuestion]);
    }
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      const [removed] = newQuestions.splice(fromIndex, 1);
      newQuestions.splice(toIndex, 0, removed);
      return newQuestions;
    });
  };

  // Handle adding question from toolbox with optional insertion index
  const handleAddQuestionAtIndex = useCallback((type: string, insertIndex?: number) => {
    const newQuestion: SurveyQuestion = {
      id: crypto.randomUUID(),
      type,
      title: "",
      required: DEFAULT_REQUIRED,
      options: choiceTypes.includes(type) ? ["", ""] : undefined,
      config: getDefaultConfig(type)
    };

    setQuestions(prev => {
      if (insertIndex === undefined) {
        return [...prev, newQuestion];
      }
      const newQuestions = [...prev];
      newQuestions.splice(insertIndex, 0, newQuestion);
      return newQuestions;
    });

    // Set the newly added question ID for auto-focus
    setNewlyAddedQuestionId(newQuestion.id);
  }, []);

  // Handle focus completion callback
  const handleFocusHandled = useCallback(() => {
    setNewlyAddedQuestionId(null);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    // Handle dropping a toolbox item
    if (active.id.toString().startsWith('toolbox-')) {
      const type = active.data.current?.type;
      if (!type) return;

      // Prevent adding toolbox items to other toolbox items
      if (over.id.toString().startsWith('toolbox-')) {
        return;
      }

      // If dropping on canvas or between questions
      if (over.id === 'canvas-drop-zone') {
        handleAddQuestionAtIndex(type);
      } else {
        // Find the index to insert the new question
        const overIndex = questions.findIndex(q => q.id === over.id);
        if (overIndex !== -1) {
          // Insert before the dropped question (more intuitive)
          handleAddQuestionAtIndex(type, overIndex);
        } else {
          // Fallback: add at the end
          handleAddQuestionAtIndex(type);
        }
      }
    } else {
      // Handle reordering existing questions
      if (active.id !== over.id) {
        setQuestions((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          if (oldIndex === -1 || newIndex === -1) return items;
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  };

  const handleContinue = () => {
    onContinue();
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading survey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center space-y-3 mb-6">
        <h1 className="text-3xl font-bold text-foreground">Craft Your Survey</h1>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          Ask the right questions to gather deep insights, understand user sentiment, and build a better product.
        </p>
      </div>

      {/* Single DndContext wrapping everything */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Responsive Grid Layout: 25% / 75% split */}
        <div className="grid grid-cols-12 gap-8 h-full">
          {/* Left Toolbox Panel - 25% (3 columns) */}
          <div className="col-span-3 bg-muted/30 border border-border rounded-lg shadow-sm overflow-y-auto">
            <div className="p-3">
              <h2 className="text-sm font-medium mb-4 text-foreground">Drag & Drop Tasks/Questions</h2>
              
              {/* Base Question Types - Default expanded */}
              <div className="mb-4">
                <Collapsible open={baseQuestionsOpen} onOpenChange={setBaseQuestionsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-2 py-1.5 h-auto bg-background/60 hover:bg-background/80 border border-border rounded text-xs">
                      <span className="font-semibold text-foreground">Base Question Types</span>
                      {baseQuestionsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 space-y-3">
                      {/* Text Questions */}
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1 px-1">TEXT</div>
                        <div className="space-y-1">
                          {baseQuestionTypes.filter(qt => ['short-text', 'long-text'].includes(qt.type)).map((questionType) => (
                            <DraggableSurveyToolboxItem
                              key={questionType.type}
                              type={questionType.type}
                              icon={questionType.icon}
                              label={questionType.label}
                              description={`Add a ${questionType.label} question`}
                              onAdd={addQuestion}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Choice Questions */}
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1 px-1">CHOICE</div>
                        <div className="space-y-1">
                          {baseQuestionTypes.filter(qt => ['multiple-choice', 'checkboxes', 'dropdown', 'multi-select'].includes(qt.type)).map((questionType) => (
                            <DraggableSurveyToolboxItem
                              key={questionType.type}
                              type={questionType.type}
                              icon={questionType.icon}
                              label={questionType.label}
                              description={`Add a ${questionType.label} question`}
                              onAdd={addQuestion}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Data & Time Questions */}
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1 px-1">DATA & TIME</div>
                        <div className="space-y-1">
                          {baseQuestionTypes.filter(qt => ['number', 'link', 'file-upload', 'date', 'time'].includes(qt.type)).map((questionType) => (
                            <DraggableSurveyToolboxItem
                              key={questionType.type}
                              type={questionType.type}
                              icon={questionType.icon}
                              label={questionType.label}
                              description={`Add a ${questionType.label} question`}
                              onAdd={addQuestion}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Scales & Advanced Questions */}
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1 px-1">SCALES & ADVANCED</div>
                        <div className="space-y-1">
                          {baseQuestionTypes.filter(qt => ['linear-scale', 'rating', 'matrix', 'ranking', 'embed-image'].includes(qt.type)).map((questionType) => (
                            <DraggableSurveyToolboxItem
                              key={questionType.type}
                              type={questionType.type}
                              icon={questionType.icon}
                              label={questionType.label}
                              description={`Add a ${questionType.label} question`}
                              onAdd={addQuestion}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Core Question Bank - Default collapsed */}
              <div className="mb-4">
                <Collapsible open={coreQuestionBankOpen} onOpenChange={setCoreQuestionBankOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-2 py-1.5 h-auto bg-background/60 hover:bg-background/80 border border-border rounded text-xs">
                      <span className="font-semibold text-foreground">Core Question Bank</span>
                      {coreQuestionBankOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 space-y-1">
                      <Button
                        variant="outline"
                        className="w-full justify-start px-2 py-1.5 h-auto bg-background hover:bg-muted border border-border text-foreground hover:text-foreground rounded text-xs transition-colors"
                        onClick={() => {
                          const npsQuestion: SurveyQuestion = {
                            id: crypto.randomUUID(),
                            type: "linear-scale",
                            title: "How likely are you to recommend our product to a friend or colleague?",
            required: DEFAULT_REQUIRED,
                            config: { scaleRange: [0, 10] as [number, number], scaleLabels: ["Not at all likely", "Extremely likely"] as [string, string] }
                          };
                          setQuestions(prev => [...prev, npsQuestion]);
                          setNewlyAddedQuestionId(npsQuestion.id);
                        }}
                      >
                        {(() => {
                          const BarChart3 = baseQuestionTypes.find(qt => qt.type === 'linear-scale')?.icon;
                          return BarChart3 ? <BarChart3 className="h-3 w-3 mr-2 text-foreground flex-shrink-0" /> : null;
                        })()}
                        <span className="text-xs font-normal truncate">Net Promoter Score (NPS)</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full justify-start px-2 py-1.5 h-auto bg-background hover:bg-muted border border-border text-foreground hover:text-foreground rounded text-xs transition-colors"
                        onClick={() => {
                          const csatQuestion: SurveyQuestion = {
                            id: crypto.randomUUID(),
                            type: "multiple-choice",
                            title: "How would you rate your overall satisfaction with the product?",
            required: DEFAULT_REQUIRED,
                            options: ["Very dissatisfied", "Somewhat dissatisfied", "Neither satisfied nor dissatisfied", "Somewhat satisfied", "Very satisfied"]
                          };
                          setQuestions(prev => [...prev, csatQuestion]);
                          setNewlyAddedQuestionId(csatQuestion.id);
                        }}
                      >
                        {(() => {
                          const CheckSquare = baseQuestionTypes.find(qt => qt.type === 'multiple-choice')?.icon;
                          return CheckSquare ? <CheckSquare className="h-3 w-3 mr-2 text-foreground flex-shrink-0" /> : null;
                        })()}
                        <span className="text-xs font-normal truncate">Customer Satisfaction (CSAT)</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full justify-start px-2 py-1.5 h-auto bg-background hover:bg-muted border border-border text-foreground hover:text-foreground rounded text-xs transition-colors"
                        onClick={() => {
                          const starRatingQuestion: SurveyQuestion = {
                            id: crypto.randomUUID(),
                            type: "rating",
                            title: "How many stars would you rate the product?",
                            required: DEFAULT_REQUIRED,
                            config: { ratingIcon: "star" as const, ratingCount: 5 }
                          };
                          setQuestions(prev => [...prev, starRatingQuestion]);
                          setNewlyAddedQuestionId(starRatingQuestion.id);
                        }}
                      >
                        {(() => {
                          const Star = baseQuestionTypes.find(qt => qt.type === 'rating')?.icon;
                          return Star ? <Star className="h-3 w-3 mr-2 text-foreground flex-shrink-0" /> : null;
                        })()}
                        <span className="text-xs font-normal truncate">Star Rating (1-5)</span>
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>

          {/* Right Canvas - 75% (9 columns) */}
          <div className="col-span-9 bg-background overflow-y-auto">
            <div className="p-6 pb-24">
              <div className="w-full">
                {/* Header instruction */}
                <div className="mb-6">
                  <p className="text-muted-foreground text-sm">Drag and drop questions from the left-side menu to build your survey.</p>
                </div>

                {/* Questions or Drop Zone with Fixed Animation Structure */}
                <SurveyDropZone id="canvas-drop-zone" activeId={activeId} className="min-h-full">
                  {questions.length === 0 ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-16 text-center bg-muted/30">
                      <h3 className="text-lg font-medium text-foreground mb-2">Drag & Drop Questions Here</h3>
                      <p className="text-sm text-muted-foreground">Drag questions from the left panel or click to add them</p>
                    </div>
                  ) : (
                    <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        <AnimatePresence>
                          {questions.map((question, index) => (
                            <SortableSurveyQuestion
                              key={question.id}
                              question={question}
                              index={index}
                              onUpdate={(updates) => updateQuestion(question.id, updates)}
                              onDelete={() => deleteQuestion(question.id)}
                              onDuplicate={() => duplicateQuestion(question.id)}
                              
                              allQuestions={questions}
                              projectId={projectId}
                              activeId={activeId}
                              newlyAddedQuestionId={newlyAddedQuestionId}
                              onFocusHandled={handleFocusHandled}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </SortableContext>
                  )}
                </SurveyDropZone>
              </div>
            </div>
          </div>
        </div>
        
        <DragOverlay>
          {activeId && activeId.toString().startsWith('toolbox-') ? (
            <div className="bg-card border border-border rounded-lg p-4 shadow-lg opacity-90">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  {(() => {
                    const type = questions.find(q => q.id === activeId)?.type || activeId.toString().replace('toolbox-', '');
                    const questionType = baseQuestionTypes.find(qt => qt.type === type);
                    const Icon = questionType?.icon;
                    return Icon ? <Icon className="h-3 w-3 text-primary" /> : null;
                  })()}
                </div>
                <span className="text-sm font-medium">
                  {(() => {
                    const type = questions.find(q => q.id === activeId)?.type || activeId.toString().replace('toolbox-', '');
                    return baseQuestionTypes.find(qt => qt.type === type)?.label || 'Question';
                  })()}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Fixed Bottom Action Bar */}
      <div className="border-t border-border bg-background p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleContinue}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base font-medium"
            >
              Continue to Settings
            </Button>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            disabled={questions.length === 0}
            className="px-8 py-3 text-base font-medium"
          >
            Preview
          </Button>
        </div>
      </div>

      {/* Survey Preview Modal */}
      <SurveyPreview
        questions={questions}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
}
