
import React, { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateAISuggestion } from "@/utils/openai/suggestions";
import { UserStoryInputs } from "@/utils/story/types";
import SuggestionPrompt from "./SuggestionPrompt";
import SuggestionDisplay from "./SuggestionDisplay";

interface AIAgentProps {
  currentQuestionId: string;
  currentValue: string | string[];
  onSuggestionApply: (value: string | string[]) => void;
  allInputs: UserStoryInputs;
  onContinue?: () => void; // Optional prop for auto-continuation
  onSuggestionGenerated?: (hasSuggestion: boolean) => void; // Added this prop to fix the TypeScript error
}

const AIAgent: React.FC<AIAgentProps> = ({
  currentQuestionId,
  currentValue,
  onSuggestionApply,
  allInputs,
  onContinue,
  onSuggestionGenerated,
}) => {
  const [suggestion, setSuggestion] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  // Clear suggestion when question changes
  useEffect(() => {
    setSuggestion("");
  }, [currentQuestionId]);

  const generateSuggestion = async () => {
    setIsGenerating(true);
    
    try {
      const result = await generateAISuggestion(currentQuestionId, allInputs, "");
      
      if (result.success) {
        setSuggestion(result.text);
        // Notify parent component that we have a suggestion
        if (onSuggestionGenerated) {
          onSuggestionGenerated(true);
        }
        toast({
          title: "AI Suggestion Ready",
          description: "An AI-generated suggestion has been created for you.",
        });
      } else {
        toast({
          title: "Suggestion Failed",
          description: result.error || "Could not generate a suggestion. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Suggestion Failed",
        description: "Could not generate a suggestion. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating suggestion:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Clean the suggestion by removing markdown and labels
  const cleanSuggestion = (text: string): string => {
    // Remove markdown formatting like **Label:** or Label:
    return text
      .replace(/\*\*([^:]+):\*\*\s*/g, '')  // Remove **Label:** format
      .replace(/^([^:]+):\s*/gm, '')         // Remove Label: format at start of lines
      .replace(/\*\*/g, '')                  // Remove any remaining **
      .replace(/^-\s+/gm, '')                // Remove bullet points
      .trim();
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    
    // Clean the suggestion text
    const cleanedSuggestion = cleanSuggestion(suggestion);
    
    if (currentQuestionId === "acceptanceCriteria") {
      // Convert multiline string to array for acceptance criteria
      const criteriaArray = cleanedSuggestion
        .split("\n")
        .filter(line => line.trim() !== "")
        .map(line => cleanSuggestion(line)); // Clean each line individually
      onSuggestionApply(criteriaArray);
    } else {
      onSuggestionApply(cleanedSuggestion);
    }
    
    toast({
      title: "Suggestion Applied",
      description: "The AI suggestion has been applied to your input.",
    });
    
    // Clear the suggestion after applying
    setSuggestion("");
    
    // Notify parent that suggestion is no longer active
    if (onSuggestionGenerated) {
      onSuggestionGenerated(false);
    }
    
    // Auto-continue to next step if the callback is provided
    if (onContinue) {
      onContinue();
    }
  };

  const clearSuggestion = () => {
    setSuggestion("");
    // Notify parent that suggestion is no longer active
    if (onSuggestionGenerated) {
      onSuggestionGenerated(false);
    }
  };

  return (
    <div className="mt-6 border rounded-lg p-4 bg-secondary/30">
      <div className="flex items-center gap-2 mb-3">
        <Bot size={18} className="text-primary" />
        <h3 className="font-medium">AI Assistance</h3>
      </div>
      
      {!suggestion ? (
        <SuggestionPrompt
          generateSuggestion={generateSuggestion}
          isGenerating={isGenerating}
        />
      ) : (
        <SuggestionDisplay
          suggestion={suggestion}
          applySuggestion={applySuggestion}
          clearSuggestion={clearSuggestion}
        />
      )}
    </div>
  );
};

export default AIAgent;
