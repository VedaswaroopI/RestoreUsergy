import { memo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DraggableSurveyToolboxItemProps {
  type: string;
  icon: React.ComponentType<any>;
  label: string;
  description?: string;
  onAdd: (type: string) => void;
}

export const DraggableSurveyToolboxItem = memo(function DraggableSurveyToolboxItem({ 
  type, 
  icon: Icon, 
  label, 
  description,
  onAdd 
}: DraggableSurveyToolboxItemProps) {
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
              "w-full justify-start px-2 py-1.5 h-auto bg-background hover:bg-primary/5 hover:border-primary/20 border border-border text-foreground hover:text-foreground rounded-sm text-xs transition-all duration-200 cursor-grab active:cursor-grabbing",
              isDragging && "opacity-50 shadow-lg ring-2 ring-primary/20"
            )}
            onClick={handleClick}
            {...listeners}
            {...attributes}
          >
            <Icon className="h-3 w-3 mr-2 text-foreground flex-shrink-0" />
            <span className="text-xs font-normal truncate">{label}</span>
          </Button>
        </TooltipTrigger>
        {description && (
          <TooltipContent>
            <p>{description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
});