import { useState, useEffect, useCallback } from "react";
import { useStoryGenerator } from "./useStoryGenerator";
import { useStoryManagement } from "./useStoryManagement";
import { questionFlow, UserStoryInputs } from "@/utils/story";
import { createProject } from "@/utils/story";
import { useToast } from "@/contexts/ToastContext";

export const useQuestionFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<UserStoryInputs>({
    role: "",
    goal: "",
    benefit: "",
    priority: "Medium",
    acceptanceCriteria: [],
    additionalNotes: "",
  });
  
  // Get story generation and management hooks
  const { generatedStory, isLoading, retryCount, generateStory, resetStory, cancelGeneration } = useStoryGenerator();
  const { projects, loadProjects } = useStoryManagement();
  const { toast } = useToast();
  
  // Compute current question based on step
  const currentQuestion = currentStep < questionFlow.length ? questionFlow[currentStep] : null;
  
  // Determine if we're at the results screen
  const isResultsScreen = currentStep === questionFlow.length && generatedStory !== null && !isLoading;
  
  // Initialize with projects
  useEffect(() => {
    if (projects.length === 0) {
      loadProjects();
    }
  }, [loadProjects, projects.length]);
  
  // Handle input changes for form fields
  const handleInputChange = useCallback((id: string, value: string | string[]) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  }, []);
  
  // Handle navigation
  const handleNext = useCallback(async () => {
    // If we're at the last question, generate the story
    if (currentStep === questionFlow.length - 1) {
      try {
        await generateStory(inputs);
        setCurrentStep(prev => prev + 1);
      } catch (error) {
        console.error("Failed to generate story:", error);
        toast({
          title: "Error generating story",
          description: "Failed to generate your user story. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Otherwise, just go to next question
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, inputs, generateStory, toast]);
  
  const handleBack = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);
  
  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setInputs({
      role: "",
      goal: "",
      benefit: "",
      priority: "Medium",
      acceptanceCriteria: [],
      additionalNotes: "",
    });
    resetStory();
  }, [resetStory]);
  
  // Project creation
  const handleCreateProject = useCallback(async (name: string, description?: string) => {
    try {
      const newProject = await createProject(name, description);
      loadProjects();
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: "There was a problem creating your project",
        variant: "destructive",
      });
      throw error;
    }
  }, [loadProjects, toast]);
  
  // Set project from ID
  const setProjectFromId = useCallback((projectId: string) => {
    handleInputChange("projectId", projectId);
  }, [handleInputChange]);
  
  return {
    currentStep,
    inputs,
    generatedStory,
    isLoading,
    projects,
    isResultsScreen,
    currentQuestion,
    retryCount,
    maxRetries: 2, // Match the value in the story generator
    loadProjects,
    handleInputChange,
    handleNext,
    handleBack,
    handleReset,
    handleCreateProject,
    setProjectFromId,
    cancelGeneration
  };
};

export default useQuestionFlow;
