import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  showPercentage?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, showPercentage = false, ...props }, ref) => (
  <div className="space-y-2">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-muted/30 to-muted/60 shadow-inner",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-gradient-to-r from-turquoise via-sky-blue to-primary rounded-full transition-all duration-700 ease-out shadow-sm"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          background: `linear-gradient(90deg, 
            hsl(var(--turquoise)) 0%, 
            hsl(var(--sky-blue)) 50%, 
            hsl(var(--primary)) 100%
          )`,
          boxShadow: '0 2px 8px hsla(var(--primary), 0.2)'
        }}
      />
      {/* Subtle shimmer effect - reduced frequency */}
      <div 
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{
          backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          animation: 'shimmer 4s infinite'
        }}
      />
    </ProgressPrimitive.Root>
    
    {showPercentage && (
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-medium">Profile Progress</span>
        <span className="text-primary font-bold bg-primary/10 px-2 py-1 rounded-md">
          {Math.round(value || 0)}%
        </span>
      </div>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
