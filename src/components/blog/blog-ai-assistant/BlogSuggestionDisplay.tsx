
import React from "react";
import { Button } from "@/components/ui/button";

interface BlogSuggestion {
  title: string;
  summary: string;
  content: string;
}

interface BlogSuggestionDisplayProps {
  suggestion: BlogSuggestion;
  onApplySingle: (field: 'title' | 'summary' | 'content') => void;
  onApplyAll: () => void;
  onDiscard: () => void;
}

const BlogSuggestionDisplay: React.FC<BlogSuggestionDisplayProps> = ({
  suggestion,
  onApplySingle,
  onApplyAll,
  onDiscard,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Generated Title</h4>
          <Button 
            onClick={() => onApplySingle('title')} 
            size="sm" 
            variant="outline"
            className="h-7 px-2"
          >
            Apply
          </Button>
        </div>
        <div className="bg-slate-50 p-3 rounded-md border text-sm">
          {suggestion.title}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Generated Summary</h4>
          <Button 
            onClick={() => onApplySingle('summary')} 
            size="sm" 
            variant="outline"
            className="h-7 px-2"
          >
            Apply
          </Button>
        </div>
        <div className="bg-slate-50 p-3 rounded-md border text-sm">
          {suggestion.summary}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Generated Content</h4>
          <Button 
            onClick={() => onApplySingle('content')} 
            size="sm" 
            variant="outline"
            className="h-7 px-2"
          >
            Apply
          </Button>
        </div>
        <div className="bg-slate-50 p-3 rounded-md border text-sm max-h-[200px] overflow-y-auto">
          {suggestion.content}
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button 
          onClick={onDiscard} 
          variant="outline" 
          size="sm"
        >
          Discard
        </Button>
        <Button 
          onClick={onApplyAll} 
          variant="default" 
          size="sm"
          className="bg-blue-500 hover:bg-blue-600"
        >
          Accept & Continue
        </Button>
      </div>
    </div>
  );
};

export default BlogSuggestionDisplay;
