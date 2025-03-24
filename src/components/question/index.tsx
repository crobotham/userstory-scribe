
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import AIAgent from "../ai-agent/AIAgent";
import { UserStoryInputs } from "@/utils/storyGenerator";
import QuestionHeader from "./QuestionHeader";
import QuestionInput from "./QuestionInput";
import QuestionNavigation from "./QuestionNavigation";

interface QuestionProps {
  question: string;
  description?: string;
  type?: "text" | "multiline" | "select";
  placeholder?: string;
  options?: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onNext: () => void;
  onBack?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  questionId: string;
  allInputs: UserStoryInputs;
  isOptional?: boolean;
}

const Question: React.FC<QuestionProps> = ({
  question,
  description,
  type = "text",
  placeholder,
  options = [],
  value,
  onChange,
  onNext,
  onBack,
  isFirst = false,
  isLast = false,
  questionId,
  allInputs,
  isOptional = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAiSuggestion, setHasAiSuggestion] = useState(false);
  
  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && type !== "multiline") {
      e.preventDefault();
      if (value && String(value).trim() !== "") {
        onNext();
      }
    }
  };
  
  const handleMultilineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // For multiline inputs that expect an array, split by newlines
    if (Array.isArray(value)) {
      const lines = e.target.value.split("\n").filter(line => line.trim() !== "");
      onChange(lines);
    } else {
      onChange(e.target.value);
    }
  };
  
  const isNextDisabled = () => {
    if (isOptional) return false;
    
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return !value || value.trim() === "";
  };

  // This function is called when AI generates a suggestion
  const onAiSuggestionGenerated = (hasSuggestion: boolean) => {
    setHasAiSuggestion(hasSuggestion);
  };

  return (
    <div 
      className={cn(
        "max-w-lg mx-auto py-4 px-6 transition-all duration-500 ease-out transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <QuestionHeader 
        question={question} 
        description={description} 
        isOptional={isOptional} 
      />
      
      <div className="space-y-4">
        <QuestionInput
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          options={options}
          onKeyDown={handleKeyDown}
          handleMultilineChange={handleMultilineChange}
        />
        
        <AIAgent 
          currentQuestionId={questionId}
          currentValue={value}
          onSuggestionApply={(newValue) => {
            onChange(newValue);
            // When suggestion is applied, update the state
            setHasAiSuggestion(false);
          }}
          allInputs={allInputs}
          onContinue={onNext} // Pass the onNext function to AIAgent for auto-continuation
          onSuggestionGenerated={onAiSuggestionGenerated}
        />
      </div>
      
      <QuestionNavigation
        onNext={onNext}
        onBack={onBack}
        isFirst={isFirst}
        isLast={isLast}
        isNextDisabled={isNextDisabled()}
        isOptional={isOptional}
        hideNext={hasAiSuggestion} // Hide the continue button when AI is generating a suggestion
      />
    </div>
  );
};

export default Question;
