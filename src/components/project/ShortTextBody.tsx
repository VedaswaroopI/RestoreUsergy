import { memo } from "react";
import { Input } from "@/components/ui/input";

export const ShortTextBody = memo(function ShortTextBody() {
  return (
    <div className="mt-3">
      <Input
        placeholder="User's answer will appear here..."
        disabled
        className="bg-muted/50 text-xs"
      />
    </div>
  );
});