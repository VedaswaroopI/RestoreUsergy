import { memo } from "react";
import { RichTextEditor } from "./RichTextEditor";

interface LegalAgreementBodyProps {
  localContent: string;
  onLocalContentChange: (content: string) => void;
}

export const LegalAgreementBody = memo(function LegalAgreementBody({
  localContent,
  onLocalContentChange
}: LegalAgreementBodyProps) {
  return (
    <div className="space-y-3">
      <div>
        <RichTextEditor
          content={localContent}
          onChange={onLocalContentChange}
          placeholder="Enter your NDA, terms of service, or other legal agreement here..."
          className="placeholder:text-xs"
        />
      </div>
      <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md">
        <input type="checkbox" disabled className="w-3 h-3" />
        <span className="text-xs text-muted-foreground">
          I have read and agree to the terms above
        </span>
      </div>
    </div>
  );
});