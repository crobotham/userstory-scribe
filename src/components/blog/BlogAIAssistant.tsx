
import React from "react";
import { Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useBlogAI } from "@/hooks/useBlogAI";
import BlogSuggestionDisplay from "./blog-ai-assistant/BlogSuggestionDisplay";
import PromptInput from "./blog-ai-assistant/PromptInput";

interface BlogAIAssistantProps {
  onApplyTitle: (title: string) => void;
  onApplySummary: (summary: string) => void;
  onApplyContent: (content: string) => void;
}

const BlogAIAssistant: React.FC<BlogAIAssistantProps> = ({
  onApplyTitle,
  onApplySummary,
  onApplyContent,
}) => {
  const { toast } = useToast();
  const {
    prompt,
    setPrompt,
    suggestion,
    setSuggestion,
    isGenerating,
    generateBlogPost,
    clearSuggestion
  } = useBlogAI();

  const applyAll = () => {
    if (!suggestion) return;
    
    onApplyTitle(suggestion.title);
    onApplySummary(suggestion.summary);
    onApplyContent(suggestion.content);
    
    toast({
      title: "Applied All Content",
      description: "AI-generated content has been applied to your blog post.",
    });
    
    // Clear suggestion after applying
    setSuggestion(null);
    setPrompt("");
  };

  const applyIndividual = (field: 'title' | 'summary' | 'content') => {
    if (!suggestion) return;
    
    switch (field) {
      case 'title':
        onApplyTitle(suggestion.title);
        break;
      case 'summary':
        onApplySummary(suggestion.summary);
        break;
      case 'content':
        onApplyContent(suggestion.content);
        break;
    }
    
    toast({
      title: "Applied Content",
      description: `AI-generated ${field} has been applied to your blog post.`,
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-secondary/30 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Bot size={18} className="text-primary" />
        <h3 className="font-medium">Blog Content AI Assistant</h3>
      </div>
      
      {!suggestion ? (
        <PromptInput
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={generateBlogPost}
          isGenerating={isGenerating}
        />
      ) : (
        <BlogSuggestionDisplay
          suggestion={suggestion}
          onApplySingle={applyIndividual}
          onApplyAll={applyAll}
          onDiscard={clearSuggestion}
        />
      )}
    </div>
  );
};

export default BlogAIAssistant;
