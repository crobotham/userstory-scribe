import React, { useState, useEffect } from "react";
import Question from "../question";
import ProgressIndicator from "../ProgressIndicator";
import { questionFlow, UserStory, Project, UserStoryInputs } from "@/utils/story";
import ProjectSelection from "./ProjectSelection";
import LoadingIndicator from "./LoadingIndicator";
import ResultsView from "./ResultsView";
import CreateProjectPrompt from "./CreateProjectPrompt";

interface StepByStepFlowProps {
  currentStep: number;
  inputs: UserStoryInputs;
  generatedStory: UserStory | null;
  isLoading: boolean;
  projects: Project[];
  isResultsScreen: boolean;
  currentQuestion: any;
  onInputChange: (id: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
  onCreateProject: (name: string, description?: string) => Promise<any>;
  retryCount?: number;
  maxRetries?: number;
  onCancel?: () => void;
}

const StepByStepFlow: React.FC<StepByStepFlowProps> = ({
  currentStep,
  inputs,
  generatedStory,
  isLoading,
  projects,
  isResultsScreen,
  currentQuestion,
  onInputChange,
  onNext,
  onBack,
  onReset,
  onCreateProject,
  retryCount = 0,
  maxRetries = 2,
  onCancel
}) => {
  const [projectError, setProjectError] = useState<string | null>(null);
  const [projectSelected, setProjectSelected] = useState(false);
  
  useEffect(() => {
    // Check if project is already selected (for returning users or from URL)
    if (inputs.projectId) {
      console.log("Project already selected:", inputs.projectId);
      setProjectSelected(true);
    }
  }, [inputs.projectId]);
  
  useEffect(() => {
    // Listen for project changes to update the projects list
    const handleProjectChanged = () => {
      console.log("Project changed event detected in StepByStepFlow");
    };
    
    window.addEventListener('projectChanged', handleProjectChanged);
    
    return () => {
      window.removeEventListener('projectChanged', handleProjectChanged);
    };
  }, []);
  
  const handleProjectSelect = (id: string, value: string | string[]) => {
    onInputChange(id, value);
    
    // Clear error if a project is selected
    if (id === "projectId" && value) {
      setProjectError(null);
      setProjectSelected(true);
    }
  };
  
  const handleNextClick = () => {
    // Ensure a project is selected before proceeding
    if (!inputs.projectId && currentStep === 0) {
      setProjectError("Please select a project before continuing");
      return;
    }
    
    onNext();
  };
  
  const handleBackToProject = () => {
    // Go back to project selection
    setProjectSelected(false);
  };
  
  const handleRetry = () => {
    // Go back to the last question to retry
    if (currentStep >= questionFlow.length) {
      onBack();
    }
  };
  
  // Show loading state
  if (isLoading && currentStep === questionFlow.length) {
    console.log("Showing loading indicator, waiting for story generation...");
    return (
      <LoadingIndicator 
        onRetry={handleRetry} 
        onCancel={onCancel}
        retryCount={retryCount}
        maxRetries={maxRetries}
      />
    );
  }
  
  // Show results
  if (isResultsScreen && generatedStory) {
    console.log("Showing results screen with generated story:", generatedStory.id);
    return <ResultsView story={generatedStory} onReset={onReset} />;
  }
  
  // If no projects exist, show project creation prompt
  if (projects.length === 0) {
    return <CreateProjectPrompt onCreateProject={onCreateProject} />;
  }
  
  // First, we show the project selection step until a project is selected
  // Skip this step if a project is already selected from URL parameters
  if (!projectSelected) {
    return (
      <>
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold mb-2">First, select a project</h3>
          <p className="text-muted-foreground mb-6">Choose a project to add your user story to</p>
        </div>
        
        <ProjectSelection 
          inputs={inputs}
          projects={projects}
          projectError={projectError}
          onInputChange={handleProjectSelect}
          onCreateProject={onCreateProject}
          setProjectError={setProjectError}
        />
        
        <div className="flex justify-center mt-8">
          <button
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            onClick={() => {
              if (!inputs.projectId) {
                setProjectError("Please select a project before continuing");
                return;
              }
              setProjectSelected(true);
            }}
          >
            Continue to User Story
          </button>
        </div>
      </>
    );
  }
  
  // After project is selected, show the questionnaire steps
  return (
    <>
      <ProgressIndicator 
        totalSteps={questionFlow.length} 
        currentStep={currentStep} 
      />
      
      {currentQuestion && (
        <Question
          question={currentQuestion.question}
          description={currentQuestion.description}
          type={currentQuestion.type as "text" | "multiline" | "select"}
          placeholder={currentQuestion.placeholder}
          options={currentQuestion.options}
          value={inputs[currentQuestion.id as keyof UserStoryInputs] || ""}
          onChange={(value) => onInputChange(currentQuestion.id, value)}
          onNext={handleNextClick}
          onBack={currentStep === 0 ? handleBackToProject : onBack}
          isFirst={false} // Never first anymore since we have project selection
          isLast={currentStep === questionFlow.length - 1}
          questionId={currentQuestion.id}
          allInputs={inputs}
          isOptional={currentQuestion.isOptional}
        />
      )}
    </>
  );
};

export default StepByStepFlow;
