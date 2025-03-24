
import { useState, useRef, useCallback, useEffect } from "react";
import { 
  generateUserStory, 
  UserStoryInputs, 
  UserStory 
} from "@/utils/story";
import { useToast } from "@/contexts/ToastContext";

export const useStoryGenerator = () => {
  const [generatedStory, setGeneratedStory] = useState<UserStory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2; // Maximum number of automatic retries
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Cleanup function for timeouts and abort controllers
  const cleanup = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setIsLoading(false);
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const resetStory = useCallback(() => {
    setGeneratedStory(null);
    setRetryCount(0);
    cleanup();
  }, [cleanup]);

  const cancelGeneration = useCallback(() => {
    cleanup();
    toast({
      title: "Generation cancelled",
      description: "Story generation has been cancelled.",
    });
  }, [cleanup, toast]);

  const generateStory = useCallback(async (inputs: UserStoryInputs): Promise<UserStory | null> => {
    console.log("Starting story generation with inputs:", inputs);
    
    // Reset any previous generation attempt
    cleanup();
    
    // Create a new abort controller for this generation attempt
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    setIsLoading(true);
    
    // Set a safety timeout to prevent UI from being stuck indefinitely
    loadingTimeoutRef.current = setTimeout(() => {
      if (isLoading && !generatedStory) {
        console.warn("Safety timeout triggered - resetting loading state");
        setIsLoading(false);
        toast({
          title: "Generation timeout",
          description: "The story may have been created but we couldn't confirm it. Please check your stories list.",
          variant: "destructive",
        });
      }
    }, 45000); // 45 second safety timeout
    
    try {
      // Add a timeout promise for the generation process
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Story generation timed out"));
          clearTimeout(timeoutId);
        }, 30000);
        
        // Clean up timeout if aborted
        signal.addEventListener("abort", () => {
          clearTimeout(timeoutId);
          reject(new Error("Story generation was cancelled"));
        });
      });
      
      // Wrap the story generation in a promise that can be aborted
      const storyPromise = new Promise<UserStory>(async (resolve, reject) => {
        try {
          const story = await generateUserStory(inputs);
          if (signal.aborted) {
            reject(new Error("Story generation was cancelled"));
            return;
          }
          resolve(story);
        } catch (error) {
          reject(error);
        }
      });
      
      // Race between the timeout and story generation
      const story = await Promise.race([storyPromise, timeoutPromise]);
      
      console.log("Story generated successfully:", story.id);
      setGeneratedStory(story);
      setRetryCount(0); // Reset retry count on success
      
      // Dispatch event for story creation
      window.dispatchEvent(new CustomEvent('storyCreated'));
      
      toast({
        title: "Story created successfully",
        description: "Your user story has been generated and saved",
      });
      
      return story;
    } catch (error) {
      console.error("Error generating story:", error);
      
      // Handle automatic retry if we haven't exceeded max retries
      if (retryCount < maxRetries && !signal.aborted) {
        setRetryCount(prev => prev + 1);
        toast({
          title: `Retrying story generation (${retryCount + 1}/${maxRetries})`,
          description: "The previous attempt failed. Trying again...",
        });
        
        // Small delay before retrying
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Only if not aborted during the delay
        if (!signal.aborted) {
          return generateStory(inputs);
        }
      }
      
      // If we've exhausted retries or generation was cancelled, show error
      if (!signal.aborted) {
        toast({
          title: "Error generating story",
          description: error instanceof Error ? error.message : "There was a problem creating your user story",
          variant: "destructive",
        });
      }
      
      return null;
    } finally {
      // Always clean up resources and reset loading state if not aborted
      if (!signal.aborted) {
        cleanup();
      }
    }
  }, [toast, retryCount, isLoading, generatedStory, cleanup]);
  
  return {
    generatedStory,
    isLoading,
    retryCount,
    generateStory,
    resetStory,
    cancelGeneration
  };
};
