import { Type, CheckSquare, ArrowUpDown, BarChart3, Upload, Hash, Clock, Calendar, Link2, Star, Image, FileText } from "lucide-react";

// Default required state for new questions
export const DEFAULT_REQUIRED = true;

// Choice-based question types that need default options
export const choiceTypes = ["multiple-choice", "checkboxes", "dropdown", "multi-select"];

// Default configuration generator for question types
export const getDefaultConfig = (type: string) => {
  switch (type) {
    case "multiple-choice":
      return {};
    case "checkboxes":
      return {};
    case "dropdown":
      return {};
    case "multi-select":
      return {};
    case "number":
      return { allowDecimals: true };
    case "linear-scale":
      return { scaleRange: [1, 10] as [number, number], scaleLabels: ["Not Satisfied", "Very Satisfied"] as [string, string] };
    case "rating":
      return { ratingIcon: "star" as const, ratingCount: 5 };
    case "matrix":
      return { matrixRows: [""], matrixColumns: [""] };
    case "ranking":
      return { rankingItems: [""] };
    case "file-upload":
      return { allowedFileTypes: [".jpg", ".png", ".pdf"], maxFileSize: 10 };
    default:
      return {};
  }
};

// Complete Library of Question Types - Single Source of Truth
export const baseQuestionTypes = [
  // Text Types
  { type: "short-text", label: "Single Line", icon: Type },
  { type: "long-text", label: "Long Answer", icon: FileText },
  
  // Choice Types
  { type: "multiple-choice", label: "Multiple Choice", icon: CheckSquare },
  { type: "checkboxes", label: "Checkboxes", icon: CheckSquare },
  { type: "dropdown", label: "Dropdown", icon: ArrowUpDown },
  { type: "multi-select", label: "Multi-Select", icon: CheckSquare },
  
  // Data & Time Types
  { type: "number", label: "Number", icon: Hash },
  { type: "link", label: "Link", icon: Link2 },
  { type: "file-upload", label: "File Upload", icon: Upload },
  { type: "date", label: "Date", icon: Calendar },
  { type: "time", label: "Time", icon: Clock },
  
  // Scales & Ratings
  { type: "linear-scale", label: "Linear Scale", icon: BarChart3 },
  { type: "rating", label: "Rating", icon: Star },
  { type: "matrix", label: "Matrix", icon: BarChart3 },
  
  // Advanced Types
  { type: "ranking", label: "Ranking", icon: ArrowUpDown },
  { type: "embed-image", label: "Embed Image", icon: Image },
];

// Question type utilities
export const getQuestionTypeIcon = (type: string) => {
  const questionType = baseQuestionTypes.find(qt => qt.type === type);
  return questionType?.icon || Type;
};

export const getQuestionTypeLabel = (type: string) => {
  const questionType = baseQuestionTypes.find(qt => qt.type === type);
  return questionType?.label || "Question";
};