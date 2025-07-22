import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { SurveyQuestion } from "./SurveyBuilder";
import { getQuestionTypeLabel } from "./survey-config";

interface LogicPanelProps {
  question: SurveyQuestion;
  allQuestions: SurveyQuestion[];
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
}

export function LogicPanel({ question, allQuestions, onUpdate }: LogicPanelProps) {
  const [showLogic, setShowLogic] = useState(false);

  return (
    <Dialog open={showLogic} onOpenChange={setShowLogic}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-primary/20"
          aria-label="Question settings"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Question Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Required Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Required</Label>
              <div className="text-sm text-muted-foreground">
                Make this question mandatory for users
              </div>
            </div>
            <Switch
              checked={question.required ?? true}
              onCheckedChange={(checked) => onUpdate({ required: checked })}
            />
          </div>

          {/* Conditional Logic Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Conditional Logic</h4>
            
            {question.logic && question.logic.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium">Existing Rules:</h5>
                {question.logic.map((rule, index) => {
                  const targetQuestion = allQuestions.find(q => q.id === rule.targetId);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded border">
                      <span className="text-sm">
                        IF answer is '{rule.condition.answer}' THEN {rule.action} '{targetQuestion?.title || 'selected question'}'
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newLogic = question.logic?.filter((_, i) => i !== index) || [];
                          onUpdate({ logic: newLogic });
                        }}
                        className="h-6 w-6 p-0 hover:bg-destructive/20"
                        aria-label="Remove rule"
                      >
                        ×
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add New Rule Form */}
            <LogicRuleEditor question={question} allQuestions={allQuestions} onUpdate={onUpdate} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Logic Rule Editor Component
interface LogicRuleEditorProps {
  question: SurveyQuestion;
  allQuestions: SurveyQuestion[];
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
}

function LogicRuleEditor({ question, allQuestions, onUpdate }: LogicRuleEditorProps) {
  const [condition, setCondition] = useState("");
  const [action, setAction] = useState<"show" | "jump">("jump");
  const [targetId, setTargetId] = useState("");

  const choiceBasedTypes = ["multiple-choice", "checkboxes", "dropdown"];
  const isChoiceBased = choiceBasedTypes.includes(question.type);

  const otherQuestions = allQuestions.filter(q => q.id !== question.id);

  const handleAddRule = () => {
    if (!condition || !targetId) return;

    const newRule = {
      condition: {
        questionId: question.id,
        answer: condition
      },
      action,
      targetId
    };

    const currentLogic = question.logic || [];
    onUpdate({ logic: [...currentLogic, newRule] });

    // Reset form
    setCondition("");
    setAction("jump");
    setTargetId("");
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <h5 className="font-medium">Add Logic Rule</h5>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Condition Input */}
        <div className="space-y-2">
          <Label>If answer equals:</Label>
          {isChoiceBased && question.options ? (
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Select an answer option" />
              </SelectTrigger>
              <SelectContent>
                {question.options.filter(opt => opt.trim() !== '').map((option, i) => (
                  <SelectItem key={i} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="Enter answer value"
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
            />
          )}
        </div>

        {/* Action Select */}
        <div className="space-y-2">
          <Label>Then:</Label>
          <Select value={action} onValueChange={(value: "show" | "jump") => setAction(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jump">Jump to question</SelectItem>
              <SelectItem value="show">Show question</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Target Question Select */}
        <div className="space-y-2">
          <Label>Target question:</Label>
          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger>
              <SelectValue placeholder="Select target question" />
            </SelectTrigger>
            <SelectContent>
              {otherQuestions.map((q, index) => (
                <SelectItem key={q.id} value={q.id}>
                  Question {allQuestions.findIndex(aq => aq.id === q.id) + 1}: {q.title || `${getQuestionTypeLabel(q.type)} question`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAddRule}
          disabled={!condition || !targetId}
          className="w-full"
        >
          Add Rule
        </Button>
      </div>
    </div>
  );
}