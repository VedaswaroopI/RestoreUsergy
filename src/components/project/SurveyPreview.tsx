import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, Heart, ThumbsUp, GripVertical } from "lucide-react";
import { SurveyQuestion } from "./SurveyBuilder";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SurveyPreviewProps {
  questions: SurveyQuestion[];
  isOpen: boolean;
  onClose: () => void;
}

// Sortable item component for ranking questions
function SortableRankingItem({ id, item, index }: { id: string; item: string; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-3 p-3 border border-border rounded-lg bg-background cursor-pointer"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground" />
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
        {index + 1}
      </div>
      <span className="flex-1">{item}</span>
    </div>
  );
}

export function SurveyPreview({ questions, isOpen, onClose }: SurveyPreviewProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [rankingStates, setRankingStates] = useState<Record<string, string[]>>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleReset = () => {
    setAnswers({});
    setRankingStates({});
  };

  const handleDragEnd = (event: DragEndEvent, questionId: string) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const currentItems = rankingStates[questionId] || [];
      const oldIndex = currentItems.findIndex(item => item === active.id);
      const newIndex = currentItems.findIndex(item => item === over.id);

      const newItems = arrayMove(currentItems, oldIndex, newIndex);
      setRankingStates(prev => ({
        ...prev,
        [questionId]: newItems
      }));
    }
  };

  const renderQuestion = (question: SurveyQuestion) => {
    const answer = answers[question.id];

    switch (question.type) {
      case "single-line":
        return (
          <Input
            placeholder="Type your answer here..."
            value={answer || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        );

      case "long-answer":
        return (
          <Textarea
            placeholder="Type your detailed answer here..."
            value={answer || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            rows={4}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder="Enter a number..."
            value={answer || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            min={question.config?.minValue}
            max={question.config?.maxValue}
            step={question.config?.allowDecimals ? "0.01" : "1"}
          />
        );

      case "link":
        return (
          <Input
            type="url"
            placeholder="https://example.com"
            value={answer || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        );

      case "date":
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={answer || ""}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
            />
          </div>
        );

      case "time":
        return (
          <Input
            type="time"
            value={answer || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        );

      case "multiple-choice":
        return (
          <RadioGroup
            value={answer || ""}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            {question.options?.filter(option => option.trim() !== '').map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-option-${i}`} />
                <Label htmlFor={`${question.id}-option-${i}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkboxes":
        const checkboxAnswers = answer || [];
        return (
          <div className="space-y-2">
            {question.options?.filter(option => option.trim() !== '').map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-checkbox-${i}`}
                  checked={checkboxAnswers.includes(option)}
                  onCheckedChange={(checked) => {
                    const newAnswers = checked
                      ? [...checkboxAnswers, option]
                      : checkboxAnswers.filter((a: string) => a !== option);
                    handleAnswer(question.id, newAnswers);
                  }}
                />
                <Label htmlFor={`${question.id}-checkbox-${i}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case "dropdown":
        return (
          <Select
            value={answer || ""}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.filter(option => option.trim() !== '').map((option, i) => (
                <SelectItem key={i} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multi-select":
        const multiSelectAnswers = answer || [];
        return (
          <div className="space-y-2">
            {question.options?.filter(option => option.trim() !== '').map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-multiselect-${i}`}
                  checked={multiSelectAnswers.includes(option)}
                  onCheckedChange={(checked) => {
                    const newAnswers = checked
                      ? [...multiSelectAnswers, option]
                      : multiSelectAnswers.filter((a: string) => a !== option);
                    handleAnswer(question.id, newAnswers);
                  }}
                />
                <Label htmlFor={`${question.id}-multiselect-${i}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case "linear-scale":
        const range = question.config?.scaleRange || [1, 10];
        return (
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-4">
              <span>{question.config?.scaleLabels?.[0] || "Low"}</span>
              <span>{question.config?.scaleLabels?.[1] || "High"}</span>
            </div>
            <div className="flex space-x-2 flex-wrap">
              {Array.from({ length: range[1] - range[0] + 1 }, (_, i) => (
                <Button
                  key={i}
                  variant={answer === range[0] + i ? "default" : "outline"}
                  size="sm"
                  className="w-12 h-10"
                  onClick={() => handleAnswer(question.id, range[0] + i)}
                >
                  {range[0] + i}
                </Button>
              ))}
            </div>
          </div>
        );

      case "rating":
        const ratingCount = question.config?.ratingCount || 5;
        const ratingIcon = question.config?.ratingIcon || "star";
        const IconComponent = ratingIcon === "star" ? Star : ratingIcon === "heart" ? Heart : ThumbsUp;
        
        return (
          <div className="flex space-x-1">
            {Array.from({ length: ratingCount }, (_, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(question.id, i + 1)}
                className="focus:outline-none"
              >
                <IconComponent 
                  className={`h-8 w-8 transition-colors ${
                    answer && i < answer 
                      ? "text-primary fill-current" 
                      : "text-muted-foreground hover:text-primary"
                  }`} 
                />
              </button>
            ))}
          </div>
        );

      case "file-upload":
        return (
          <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Drag files here or click to upload
              </div>
              <div className="text-xs text-muted-foreground">
                Allowed: {question.config?.allowedFileTypes?.join(", ") || "All files"}
              </div>
              <div className="text-xs text-muted-foreground">
                Max size: {question.config?.maxFileSize || 10}MB
              </div>
            </div>
          </div>
        );

      case "embed-image":
        return (
          <div className="space-y-4">
            {question.config?.imageUrl && (
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
            )}
          </div>
        );

      case "matrix":
        const matrixRows = question.config?.matrixRows?.filter(row => row.trim() !== '') || [];
        const matrixColumns = question.config?.matrixColumns?.filter(col => col.trim() !== '') || [];
        
        if (matrixRows.length === 0 || matrixColumns.length === 0) {
          return (
            <p className="text-xs text-muted-foreground text-center">Add rows and columns to see a preview.</p>
          );
        }
        
        return (
          <div className="overflow-x-auto">
            <table className="w-full border border-border">
              <thead>
                <tr>
                  <th className="p-3 text-left border-b border-border"></th>
                  {matrixColumns.map((column, i) => (
                    <th key={i} className="p-3 text-center border-b border-border text-sm font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="p-3 border-b border-border text-sm font-medium">{row}</td>
                    {matrixColumns.map((_, colIndex) => (
                      <td key={colIndex} className="p-3 text-center border-b border-border">
                        <RadioGroup
                          value={answers[`${question.id}-${rowIndex}`] || ""}
                          onValueChange={(value) => handleAnswer(`${question.id}-${rowIndex}`, value)}
                        >
                          <RadioGroupItem value={`${rowIndex}-${colIndex}`} />
                        </RadioGroup>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "ranking":
        const rankingItems = question.config?.rankingItems?.filter(item => item.trim() !== '') || [];
        
        if (rankingItems.length === 0) {
          return (
            <p className="text-xs text-muted-foreground text-center">Add items to see a preview.</p>
          );
        }
        
        const currentRanking = rankingStates[question.id] || rankingItems;
        
        // Initialize ranking state if not exists
        if (!rankingStates[question.id]) {
          setRankingStates(prev => ({
            ...prev,
            [question.id]: rankingItems
          }));
        }

        return (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, question.id)}
          >
            <SortableContext items={currentRanking} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {currentRanking.map((item, index) => (
                  <SortableRankingItem
                    key={item}
                    id={item}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            Question type: {question.type}
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Survey Preview</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {questions.length} question{questions.length !== 1 ? 's' : ''}
              </span>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset Answers
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Single Scrollable List of All Questions */}
        <div className="overflow-y-auto max-h-[75vh] space-y-6 px-1">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No questions added yet.</p>
            </div>
          ) : (
            questions.map((question, index) => (
              <Card key={question.id} className="p-6 bg-background border border-border">
                <div className="space-y-4">
                  {/* Question Header */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Question {index + 1}
                      </span>
                      {question.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {question.title || "Untitled Question"}
                    </h3>
                    {question.description && (
                      <p className="text-sm text-muted-foreground mb-3">{question.description}</p>
                    )}
                  </div>

                  {/* Question Input */}
                  <div className="space-y-3">
                    {renderQuestion(question)}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}