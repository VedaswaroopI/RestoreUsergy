import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, Link as LinkIcon, Eraser } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ content, onChange, onBlur, placeholder, className }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start typing your instructions...',
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      onBlur?.();
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none min-h-[150px] p-4 text-foreground',
          className
        ),
      },
    },
  });

  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setIsLinkPopoverOpen(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full border border-input rounded-md bg-muted/30 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-input p-3 flex items-center space-x-1 bg-background/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 p-0 transition-colors",
            editor.isActive('bold') ? "bg-muted text-primary" : "text-muted-foreground"
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0 transition-colors",
            editor.isActive('italic') ? "bg-muted text-primary" : "text-muted-foreground"
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        {/* Heading Buttons */}
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "h-8 w-8 p-0 transition-colors",
            editor.isActive('heading', { level: 1 }) ? "bg-muted text-primary" : "text-muted-foreground"
          )}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "h-8 w-8 p-0 transition-colors",
            editor.isActive('heading', { level: 2 }) ? "bg-muted text-primary" : "text-muted-foreground"
          )}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "h-8 w-8 p-0 transition-colors",
            editor.isActive('heading', { level: 3 }) ? "bg-muted text-primary" : "text-muted-foreground"
          )}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0 transition-colors",
            editor.isActive('bulletList') ? "bg-muted text-primary" : "text-muted-foreground"
          )}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 p-0 transition-colors",
            editor.isActive('orderedList') ? "bg-muted text-primary" : "text-muted-foreground"
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        {/* Link Button */}
        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className={cn(
                "h-8 w-8 p-0 transition-colors",
                editor.isActive('link') ? "bg-muted text-primary" : "text-muted-foreground"
              )}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Add Link</h4>
              <Input
                placeholder="Enter URL (e.g., https://example.com)"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLink();
                  }
                }}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLinkPopoverOpen(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={addLink}>
                  Add Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Formatting Button */}
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="h-8 w-8 p-0 transition-colors text-muted-foreground"
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Editor Content */}
      <div className="min-h-[150px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}