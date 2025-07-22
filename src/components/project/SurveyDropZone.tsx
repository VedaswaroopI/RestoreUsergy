import { memo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface SurveyDropZoneProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  activeId?: string | null;
}

export const SurveyDropZone = memo(function SurveyDropZone({ 
  children, 
  id, 
  className,
  activeId
}: SurveyDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id
  });

  const isToolboxDragOver = isOver && activeId?.startsWith('toolbox-');

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative transition-all duration-200",
        isToolboxDragOver && "ring-2 ring-primary border-primary bg-primary/5 rounded-lg",
        className
      )}
    >
      {isToolboxDragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-lg z-10 pointer-events-none">
          <div className="text-sm font-medium text-primary bg-background px-3 py-1 rounded-md shadow-sm">
            Drop here to add question
          </div>
        </div>
      )}
      {children}
    </div>
  );
});