
import React from "react";
import { Button } from "@/components/ui/button";

interface SuggestionDisplayProps {
  suggestion: string;
  applySuggestion: () => void;
  clearSuggestion: () => void;
}

const SuggestionDisplay: React.FC<SuggestionDisplayProps> = ({
  suggestion,
  applySuggestion,
  clearSuggestion,
}) => {
  return (
    <div className="space-y-3">
      <div className="bg-slate-50 p-4 rounded-md border text-sm">
        {suggestion}
      </div>
      <div className="flex justify-end gap-2">
        <Button 
          onClick={clearSuggestion} 
          size="sm" 
          variant="outline"
        >
          Discard
        </Button>
        <Button 
          onClick={applySuggestion} 
          size="sm" 
          variant="default"
          className="bg-blue-500 hover:bg-blue-600"
        >
          Accept & Continue
        </Button>
      </div>
    </div>
  );
};

export default SuggestionDisplay;
