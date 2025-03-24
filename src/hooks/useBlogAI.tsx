
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateAISuggestion } from "@/utils/openai/suggestions";

interface BlogSuggestion {
  title: string;
  summary: string;
  content: string;
}

export function useBlogAI() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<BlogSuggestion | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("openai_api_key") || "");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(!apiKey);
  const [apiKeyError, setApiKeyError] = useState<string>("");
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (apiKey.trim().length < 20) {
      setApiKeyError("Please enter a valid OpenAI API key");
      return;
    }
    
    localStorage.setItem("openai_api_key", apiKey);
    setApiKeyError("");
    setShowApiKeyInput(false);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved securely.",
    });
  };

  const generateBlogPost = async () => {
    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic or idea for your blog post",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setApiKeyError("");
    
    try {
      // Create a comprehensive prompt for blog generation
      const blogPrompt = `Create a blog post about: ${prompt}. 
      Return a JSON with three fields: 
      - "title": A catchy title (max 100 characters)
      - "summary": A brief summary (max 200 characters)
      - "content": The full blog post content (at least 300 words)`;
      
      const result = await generateAISuggestion("blog", { prompt: blogPrompt }, apiKey);
      
      if (result.success) {
        try {
          // Try to parse the response as JSON
          let parsedContent;
          // Look for a JSON object in the text
          const jsonMatch = result.text.match(/(\{.*\})/s);
          if (jsonMatch) {
            parsedContent = JSON.parse(jsonMatch[0]);
          } else {
            // Fallback: try to parse the entire response
            parsedContent = JSON.parse(result.text);
          }
          
          setSuggestion({
            title: parsedContent.title || "",
            summary: parsedContent.summary || "",
            content: parsedContent.content || "",
          });
        } catch (parseError) {
          console.error("Failed to parse AI response as JSON:", parseError);
          // Fallback to treating response as content only
          setSuggestion({
            title: prompt, // Use prompt as title
            summary: result.text.substring(0, 150) + "...", // First 150 chars as summary
            content: result.text, // Full response as content
          });
        }
        
        toast({
          title: "AI Suggestion Ready",
          description: "Blog post content has been generated.",
        });
      } else {
        if (result.error?.includes("API key")) {
          setApiKeyError("Invalid API key. Please check and try again.");
          setShowApiKeyInput(true);
        } else {
          toast({
            title: "Generation Failed",
            description: result.error || "Could not generate content. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate content. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating blog content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearSuggestion = () => setSuggestion(null);

  return {
    prompt,
    setPrompt,
    suggestion,
    setSuggestion,
    isGenerating,
    apiKey,
    setApiKey,
    showApiKeyInput,
    setShowApiKeyInput,
    apiKeyError,
    handleSaveApiKey,
    generateBlogPost,
    clearSuggestion
  };
}
