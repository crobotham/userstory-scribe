
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
}) => {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Enter a topic or idea, and get AI-generated blog content.
      </p>
      <div className="space-y-3">
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the topic or idea for your blog post"
          className="min-h-[80px]"
        />
        <div className="flex justify-center">
          <Button 
            onClick={onGenerate} 
            variant="default" 
            size="sm"
            disabled={isGenerating}
            className="flex items-center gap-1"
          >
            <Sparkles size={14} className="mr-1 text-yellow-400 animate-pulse" />
            {isGenerating ? "Generating..." : "Generate Blog Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
