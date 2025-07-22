import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Trash2 } from "lucide-react";
import { SurveyQuestion } from "./SurveyBuilder";

interface ConfigurationPanelProps {
  question: SurveyQuestion;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
  onClose: () => void;
  allQuestions: SurveyQuestion[];
}

export function ConfigurationPanel({ question, onUpdate, onClose, allQuestions }: ConfigurationPanelProps) {
  const updateConfig = (configUpdates: Partial<SurveyQuestion['config']>) => {
    onUpdate({
      config: {
        ...question.config,
        ...configUpdates
      }
    });
  };

  const addLogicRule = () => {
    const newRule = {
      condition: { questionId: "", answer: "" },
      action: "show" as const,
      targetId: question.id
    };
    
    onUpdate({
      logic: [...(question.logic || []), newRule]
    });
  };

  const updateLogicRule = (index: number, updates: Partial<typeof question.logic[0]>) => {
    const newLogic = [...(question.logic || [])];
    newLogic[index] = { ...newLogic[index], ...updates };
    onUpdate({ logic: newLogic });
  };

  const removeLogicRule = (index: number) => {
    const newLogic = question.logic?.filter((_, i) => i !== index) || [];
    onUpdate({ logic: newLogic });
  };

  const getAvailableAnswers = (questionId: string) => {
    const targetQuestion = allQuestions.find(q => q.id === questionId);
    if (!targetQuestion?.options) return [];
    return targetQuestion.options;
  };

  const renderTypeSpecificConfig = () => {
    switch (question.type) {
      case "number":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="minValue">Minimum Value</Label>
                <Input
                  id="minValue"
                  type="number"
                  value={question.config?.minValue || ""}
                  onChange={(e) => updateConfig({ minValue: parseInt(e.target.value) || undefined })}
                  placeholder="No minimum"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="maxValue">Maximum Value</Label>
                <Input
                  id="maxValue"
                  type="number"
                  value={question.config?.maxValue || ""}
                  onChange={(e) => updateConfig({ maxValue: parseInt(e.target.value) || undefined })}
                  placeholder="No maximum"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="allowDecimals"
                checked={question.config?.allowDecimals || false}
                onCheckedChange={(checked) => updateConfig({ allowDecimals: checked })}
              />
              <Label htmlFor="allowDecimals">Allow decimal numbers</Label>
            </div>
          </div>
        );

      case "checkboxes":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="minSelections">Minimum Selections</Label>
                <Input
                  id="minSelections"
                  type="number"
                  value={question.config?.minSelections || ""}
                  onChange={(e) => updateConfig({ minSelections: parseInt(e.target.value) || undefined })}
                  placeholder="No minimum"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="maxSelections">Maximum Selections</Label>
                <Input
                  id="maxSelections"
                  type="number"
                  value={question.config?.maxSelections || ""}
                  onChange={(e) => updateConfig({ maxSelections: parseInt(e.target.value) || undefined })}
                  placeholder="No maximum"
                />
              </div>
            </div>
          </div>
        );

      case "linear-scale":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="scaleMin">Scale Minimum</Label>
                <Input
                  id="scaleMin"
                  type="number"
                  value={question.config?.scaleRange?.[0] || 1}
                  onChange={(e) => {
                    const min = parseInt(e.target.value) || 1;
                    const max = question.config?.scaleRange?.[1] || 10;
                    updateConfig({ scaleRange: [min, max] });
                  }}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="scaleMax">Scale Maximum</Label>
                <Input
                  id="scaleMax"
                  type="number"
                  value={question.config?.scaleRange?.[1] || 10}
                  onChange={(e) => {
                    const max = parseInt(e.target.value) || 10;
                    const min = question.config?.scaleRange?.[0] || 1;
                    updateConfig({ scaleRange: [min, max] });
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Scale Labels</Label>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Low end label"
                  value={question.config?.scaleLabels?.[0] || ""}
                  onChange={(e) => {
                    const labels = question.config?.scaleLabels || ["", ""];
                    updateConfig({ scaleLabels: [e.target.value, labels[1]] });
                  }}
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  placeholder="High end label"
                  value={question.config?.scaleLabels?.[1] || ""}
                  onChange={(e) => {
                    const labels = question.config?.scaleLabels || ["", ""];
                    updateConfig({ scaleLabels: [labels[0], e.target.value] });
                  }}
                />
              </div>
            </div>
          </div>
        );

      case "rating":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ratingCount">Number of Rating Items</Label>
              <Input
                id="ratingCount"
                type="number"
                min="2"
                max="10"
                value={question.config?.ratingCount || 5}
                onChange={(e) => updateConfig({ ratingCount: parseInt(e.target.value) || 5 })}
              />
            </div>
            <div>
              <Label htmlFor="ratingIcon">Rating Icon</Label>
              <Select
                value={question.config?.ratingIcon || "star"}
                onValueChange={(value) => updateConfig({ ratingIcon: value as "star" | "heart" | "thumbs" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="star">Star</SelectItem>
                  <SelectItem value="heart">Heart</SelectItem>
                  <SelectItem value="thumbs">Thumbs Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "file-upload":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="allowedTypes">Allowed File Types</Label>
              <Input
                id="allowedTypes"
                value={question.config?.allowedFileTypes?.join(", ") || ""}
                onChange={(e) => updateConfig({ 
                  allowedFileTypes: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                })}
                placeholder=".jpg, .png, .pdf"
              />
            </div>
            <div>
              <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={question.config?.maxFileSize || ""}
                onChange={(e) => updateConfig({ maxFileSize: parseInt(e.target.value) || undefined })}
                placeholder="10"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-80 border-l border-border/50 bg-background/95 backdrop-blur-sm p-6 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Question Settings</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Basic Settings */}
        <Card className="p-4">
          <h4 className="font-medium mb-4">Basic Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={question.required || false}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
              <Label htmlFor="required">Required question</Label>
            </div>
          </div>
        </Card>

        {/* Type-Specific Configuration */}
        {renderTypeSpecificConfig() && (
          <Card className="p-4">
            <h4 className="font-medium mb-4">Configuration</h4>
            {renderTypeSpecificConfig()}
          </Card>
        )}

        {/* Conditional Logic */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Logic</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={addLogicRule}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Rule
            </Button>
          </div>

          {question.logic && question.logic.length > 0 ? (
            <div className="space-y-4">
              {question.logic.map((rule, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">Rule {index + 1}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLogicRule(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-sm space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">IF</span>
                      <Select
                        value={rule.condition.questionId}
                        onValueChange={(value) => updateLogicRule(index, {
                          condition: { ...rule.condition, questionId: value }
                        })}
                      >
                        <SelectTrigger className="flex-1 h-8">
                          <SelectValue placeholder="Select question" />
                        </SelectTrigger>
                        <SelectContent>
                          {allQuestions
                            .filter(q => q.id !== question.id)
                            .map(q => (
                              <SelectItem key={q.id} value={q.id}>
                                {q.title}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">IS</span>
                      <Select
                        value={rule.condition.answer}
                        onValueChange={(value) => updateLogicRule(index, {
                          condition: { ...rule.condition, answer: value }
                        })}
                        disabled={!rule.condition.questionId}
                      >
                        <SelectTrigger className="flex-1 h-8">
                          <SelectValue placeholder="Select answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableAnswers(rule.condition.questionId).map(answer => (
                            <SelectItem key={answer} value={answer}>
                              {answer}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">THEN</span>
                      <Select
                        value={rule.action}
                        onValueChange={(value) => updateLogicRule(index, {
                          action: value as "show" | "jump"
                        })}
                      >
                        <SelectTrigger className="flex-1 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="show">Show this question</SelectItem>
                          <SelectItem value="jump">Jump to question</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {rule.action === "jump" && (
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground w-12"></span>
                        <Select
                          value={rule.targetId}
                          onValueChange={(value) => updateLogicRule(index, { targetId: value })}
                        >
                          <SelectTrigger className="flex-1 h-8">
                            <SelectValue placeholder="Select target question" />
                          </SelectTrigger>
                          <SelectContent>
                            {allQuestions
                              .filter(q => q.id !== question.id)
                              .map(q => (
                                <SelectItem key={q.id} value={q.id}>
                                  {q.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No logic rules defined. Questions will be shown in order.
            </p>
          )}
        </Card>
      </div>
    </motion.div>
  );
}