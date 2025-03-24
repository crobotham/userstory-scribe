
import { useState } from "react";
import { questionFlow, UserStoryInputs } from "@/utils/story";

export const useQuestionState = (initialProjectId: string = "") => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<UserStoryInputs>({
    role: "",
    goal: "",
    benefit: "",
    priority: "Medium",
    acceptanceCriteria: [],
    additionalNotes: "",
    projectId: initialProjectId
  });
  
  const isResultsScreen = currentStep >= questionFlow.length;
  const currentQuestion = !isResultsScreen ? questionFlow[currentStep] : null;
  
  const handleInputChange = (id: string, value: string | string[]) => {
    setInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  
  const handleNext = () => {
    if (currentStep < questionFlow.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  
  const handleReset = (keepProjectId: boolean = true) => {
    setCurrentStep(0);
    setInputs({
      role: "",
      goal: "",
      benefit: "",
      priority: "Medium",
      acceptanceCriteria: [],
      additionalNotes: "",
      projectId: keepProjectId ? inputs.projectId : "" // Keep the current project selected if needed
    });
  };
  
  return {
    currentStep,
    inputs,
    setInputs,
    isResultsScreen,
    currentQuestion,
    handleInputChange,
    handleNext,
    handleBack,
    handleReset,
    setCurrentStep
  };
};
