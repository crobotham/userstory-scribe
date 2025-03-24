
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface SuggestionPromptProps {
  generateSuggestion: () => void;
  isGenerating: boolean;
}

const SuggestionPrompt: React.FC<SuggestionPromptProps> = ({
  generateSuggestion,
  isGenerating,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Not sure what to write? Get AI-powered suggestions for this field.
      </p>
      <div className="flex justify-center">
        <Button 
          onClick={generateSuggestion} 
          variant="outline" 
          size="sm"
          disabled={isGenerating}
        >
          <Sparkles size={14} className="mr-2 text-yellow-500 animate-pulse" />
          {isGenerating ? "Generating..." : "Generate Suggestion"}
        </Button>
      </div>
    </div>
  );
};

export default SuggestionPrompt;
