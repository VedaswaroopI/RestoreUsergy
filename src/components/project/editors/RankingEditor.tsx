import { memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { SurveyQuestion } from "../SurveyBuilder";

interface RankingEditorProps {
  question: SurveyQuestion;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
}

export const RankingEditor = memo(function RankingEditor({
  question,
  onUpdate
}: RankingEditorProps) {
  
  const handleUpdateConfig = useCallback((configUpdates: any) => {
    onUpdate({
      config: {
        ...question.config,
        ...configUpdates
      }
    });
  }, [question.config, onUpdate]);

  const handleAddItem = useCallback(() => {
    const currentItems = question.config?.rankingItems || [];
    handleUpdateConfig({ rankingItems: [...currentItems, ""] });
  }, [question.config?.rankingItems, handleUpdateConfig]);

  const handleUpdateItem = useCallback((index: number, value: string) => {
    const newItems = [...(question.config?.rankingItems || [])];
    newItems[index] = value;
    handleUpdateConfig({ rankingItems: newItems });
  }, [question.config?.rankingItems, handleUpdateConfig]);

  const handleRemoveItem = useCallback((index: number) => {
    const newItems = (question.config?.rankingItems || []).filter((_, i) => i !== index);
    handleUpdateConfig({ rankingItems: newItems });
  }, [question.config?.rankingItems, handleUpdateConfig]);

  const rankingItems = question.config?.rankingItems || [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Ranking Items</h4>
        <div className="space-y-2">
          {rankingItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground min-w-[20px]">{index + 1}.</span>
              <Input
                value={item}
                onChange={(e) => handleUpdateItem(index, e.target.value)}
                className="flex-1 text-sm"
                placeholder={`Item ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveItem(index)}
                className="h-8 w-8 p-0 hover:bg-destructive/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            className="text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Ranking Preview */}
      {rankingItems.length > 0 && (
        <div className="mt-4 p-3 bg-muted/20 rounded border">
          <h5 className="text-xs font-medium mb-2">Preview:</h5>
          <ol className="list-decimal list-inside space-y-1">
            {rankingItems.map((item, index) => (
              <li key={index} className="text-sm">{item || `Item ${index + 1}`}</li>
            ))}
          </ol>
        </div>
      )}

      {rankingItems.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">Add items to see a preview.</p>
      )}
    </div>
  );
});