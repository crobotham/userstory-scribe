
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface QuestionInputProps {
  type: "text" | "multiline" | "select";
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  options?: string[];
  onKeyDown: (e: React.KeyboardEvent) => void;
  handleMultilineChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  options = [],
  onKeyDown,
  handleMultilineChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  if (type === "text") {
    return (
      <Input
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={onKeyDown}
        className={cn(
          "text-lg h-12 transition-all duration-200",
          isFocused ? "ring-2 ring-primary/40" : ""
        )}
        autoFocus
      />
    );
  }

  if (type === "multiline") {
    return (
      <Textarea
        value={Array.isArray(value) ? value.join("\n") : value as string}
        onChange={handleMultilineChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "min-h-[120px] text-lg resize-none transition-all duration-200",
          isFocused ? "ring-2 ring-primary/40" : ""
        )}
        autoFocus
      />
    );
  }

  if (type === "select") {
    return (
      <Select 
        value={value as string} 
        onValueChange={onChange as (value: string) => void}
      >
        <SelectTrigger className="h-12 text-lg">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return null;
};

export default QuestionInput;
