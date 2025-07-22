import { memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { SurveyQuestion } from "../SurveyBuilder";

interface MatrixEditorProps {
  question: SurveyQuestion;
  onUpdate: (updates: Partial<SurveyQuestion>) => void;
}

export const MatrixEditor = memo(function MatrixEditor({
  question,
  onUpdate
}: MatrixEditorProps) {
  
  const handleUpdateConfig = useCallback((configUpdates: any) => {
    onUpdate({
      config: {
        ...question.config,
        ...configUpdates
      }
    });
  }, [question.config, onUpdate]);

  const handleAddRow = useCallback(() => {
    const currentRows = question.config?.matrixRows || [];
    handleUpdateConfig({ matrixRows: [...currentRows, ""] });
  }, [question.config?.matrixRows, handleUpdateConfig]);

  const handleUpdateRow = useCallback((index: number, value: string) => {
    const newRows = [...(question.config?.matrixRows || [])];
    newRows[index] = value;
    handleUpdateConfig({ matrixRows: newRows });
  }, [question.config?.matrixRows, handleUpdateConfig]);

  const handleRemoveRow = useCallback((index: number) => {
    const newRows = (question.config?.matrixRows || []).filter((_, i) => i !== index);
    handleUpdateConfig({ matrixRows: newRows });
  }, [question.config?.matrixRows, handleUpdateConfig]);

  const handleAddColumn = useCallback(() => {
    const currentColumns = question.config?.matrixColumns || [];
    handleUpdateConfig({ matrixColumns: [...currentColumns, ""] });
  }, [question.config?.matrixColumns, handleUpdateConfig]);

  const handleUpdateColumn = useCallback((index: number, value: string) => {
    const newColumns = [...(question.config?.matrixColumns || [])];
    newColumns[index] = value;
    handleUpdateConfig({ matrixColumns: newColumns });
  }, [question.config?.matrixColumns, handleUpdateConfig]);

  const handleRemoveColumn = useCallback((index: number) => {
    const newColumns = (question.config?.matrixColumns || []).filter((_, i) => i !== index);
    handleUpdateConfig({ matrixColumns: newColumns });
  }, [question.config?.matrixColumns, handleUpdateConfig]);

  const matrixRows = question.config?.matrixRows || [];
  const matrixColumns = question.config?.matrixColumns || [];

  return (
    <div className="space-y-4">
      {/* Matrix Rows */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Rows</h4>
        <div className="space-y-2">
          {matrixRows.map((row, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={row}
                onChange={(e) => handleUpdateRow(index, e.target.value)}
                className="flex-1 text-sm"
                placeholder={`Row ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveRow(index)}
                className="h-8 w-8 p-0 hover:bg-destructive/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddRow}
            className="text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Row
          </Button>
        </div>
      </div>

      {/* Matrix Columns */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Columns</h4>
        <div className="space-y-2">
          {matrixColumns.map((column, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={column}
                onChange={(e) => handleUpdateColumn(index, e.target.value)}
                className="flex-1 text-sm"
                placeholder={`Column ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveColumn(index)}
                className="h-8 w-8 p-0 hover:bg-destructive/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddColumn}
            className="text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Column
          </Button>
        </div>
      </div>

      {/* Matrix Preview */}
      {matrixRows.length > 0 && matrixColumns.length > 0 && (
        <div className="mt-4 p-3 bg-muted/20 rounded border">
          <h5 className="text-xs font-medium mb-2">Preview:</h5>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th></th>
                {matrixColumns.map((column, index) => (
                  <th key={index} className="text-center p-1 font-medium">
                    {column || `Column ${index + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <th className="text-left p-1 font-medium">{row || `Row ${rowIndex + 1}`}</th>
                  {matrixColumns.map((_, colIndex) => (
                    <td key={colIndex} className="text-center p-1">
                      <input
                        type="radio"
                        disabled
                        className="w-3 h-3"
                        name={`matrix-${rowIndex}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(matrixRows.length === 0 || matrixColumns.length === 0) && (
        <p className="text-xs text-muted-foreground text-center">Add rows and columns to see a preview.</p>
      )}
    </div>
  );
});