import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DraggableSurveyToolboxItem } from "./DraggableSurveyToolboxItem";
import { baseQuestionTypes } from "./survey-config";
import { SurveyQuestion } from "./SurveyBuilder";

interface ToolboxPanelProps {
  onAddQuestion: (type: string) => void;
  onAddPrefilledQuestion: (question: SurveyQuestion) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ToolboxPanel({ 
  onAddQuestion, 
  onAddPrefilledQuestion, 
  isCollapsed, 
  onToggleCollapse 
}: ToolboxPanelProps) {
  const [baseQuestionsOpen, setBaseQuestionsOpen] = useState(true);
  const [coreQuestionBankOpen, setCoreQuestionBankOpen] = useState(false);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-muted/30 border-r border-border flex flex-col items-center pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0"
          aria-label="Expand toolbox"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-muted/30 border-r border-border p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Question Toolbox</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0"
          aria-label="Collapse toolbox"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Base Question Types */}
        <Collapsible open={baseQuestionsOpen} onOpenChange={setBaseQuestionsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto text-left font-medium hover:bg-transparent"
            >
              Base Question Types
              {baseQuestionsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            <div className="grid grid-cols-2 gap-2">
              {baseQuestionTypes.map((questionType) => (
                <DraggableSurveyToolboxItem
                  key={questionType.type}
                  type={questionType.type}
                  label={questionType.label}
                  icon={questionType.icon}
                  onAdd={onAddQuestion}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Core Question Bank */}
        <Collapsible open={coreQuestionBankOpen} onOpenChange={setCoreQuestionBankOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto text-left font-medium hover:bg-transparent"
            >
              Core Question Bank
              {coreQuestionBankOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            <div className="space-y-2">
              {/* NPS Question */}
              <Button
                variant="outline"
                className="w-full justify-start px-2 py-1.5 h-auto bg-background hover:bg-muted border border-border text-foreground hover:text-foreground rounded text-xs transition-colors"
                onClick={() => {
                  const npsQuestion: SurveyQuestion = {
                    id: crypto.randomUUID(),
                    type: "linear-scale",
                    title: "How likely are you to recommend our product to a friend or colleague?",
                    required: true,
                    config: { scaleRange: [0, 10] as [number, number], scaleLabels: ["Not at all likely", "Extremely likely"] as [string, string] }
                  };
                  onAddPrefilledQuestion(npsQuestion);
                }}
              >
                {(() => {
                  const BarChart3 = baseQuestionTypes.find(qt => qt.type === 'linear-scale')?.icon;
                  return BarChart3 ? <BarChart3 className="h-3 w-3 mr-1" /> : null;
                })()}
                NPS Question
              </Button>

              {/* CSAT Question */}
              <Button
                variant="outline"
                className="w-full justify-start px-2 py-1.5 h-auto bg-background hover:bg-muted border border-border text-foreground hover:text-foreground rounded text-xs transition-colors"
                onClick={() => {
                  const csatQuestion: SurveyQuestion = {
                    id: crypto.randomUUID(),
                    type: "multiple-choice",
                    title: "How would you rate your overall satisfaction with the product?",
                    required: true,
                    options: ["Very dissatisfied", "Somewhat dissatisfied", "Neither satisfied nor dissatisfied", "Somewhat satisfied", "Very satisfied"]
                  };
                  onAddPrefilledQuestion(csatQuestion);
                }}
              >
                {(() => {
                  const CheckSquare = baseQuestionTypes.find(qt => qt.type === 'multiple-choice')?.icon;
                  return CheckSquare ? <CheckSquare className="h-3 w-3 mr-1" /> : null;
                })()}
                CSAT Question
              </Button>

              {/* Star Rating Question */}
              <Button
                variant="outline"
                className="w-full justify-start px-2 py-1.5 h-auto bg-background hover:bg-muted border border-border text-foreground hover:text-foreground rounded text-xs transition-colors"
                onClick={() => {
                  const starRatingQuestion: SurveyQuestion = {
                    id: crypto.randomUUID(),
                    type: "rating",
                    title: "How many stars would you rate the product?",
                    required: true,
                    config: { ratingIcon: "star" as const, ratingCount: 5 }
                  };
                  onAddPrefilledQuestion(starRatingQuestion);
                }}
              >
                {(() => {
                  const Star = baseQuestionTypes.find(qt => qt.type === 'rating')?.icon;
                  return Star ? <Star className="h-3 w-3 mr-1" /> : null;
                })()}
                Star Rating
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}