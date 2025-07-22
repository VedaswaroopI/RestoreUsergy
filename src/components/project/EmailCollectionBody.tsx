import { memo } from "react";
import { Input } from "@/components/ui/input";

export const EmailCollectionBody = memo(function EmailCollectionBody() {
  return (
    <div className="mt-3">
      <Input
        placeholder="user@example.com"
        disabled
        className="bg-muted/50 text-xs"
      />
      <p className="text-xs text-muted-foreground mt-1 ml-2">
        This will collect user email addresses for platform invitations (TestFlight, Google Play Beta, etc.)
      </p>
    </div>
  );
});