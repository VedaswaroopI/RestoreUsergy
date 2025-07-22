export function ScreeningPlaceholder() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Screening</h1>
        <p className="text-muted-foreground">
          This section will be implemented in the next phase.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25">
        <p className="text-muted-foreground text-lg">Screening configuration coming soon...</p>
      </div>
    </div>
  );
}