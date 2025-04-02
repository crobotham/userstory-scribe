
import React, { useEffect } from "react";
import { useQuestionFlow } from "@/hooks/useQuestionFlow";
import ProjectListener from "./question-flow/ProjectListener";
import TabsContainer from "./question-flow/TabsContainer";

interface QuestionFlowProps {
  initialProjectId?: string | null;
}

const QuestionFlow: React.FC<QuestionFlowProps> = ({ initialProjectId }) => {
  const [activeTab, setActiveTab] = React.useState<string>("step-by-step");
  
  const {
    currentStep,
    inputs,
    generatedStory,
    isLoading,
    projects,
    isResultsScreen,
    currentQuestion,
    retryCount,
    maxRetries,
    loadProjects,
    handleInputChange,
    handleNext,
    handleBack,
    handleReset,
    handleCreateProject,
    setProjectFromId,
    cancelGeneration
  } = useQuestionFlow();
  
  const handleStoriesGenerated = () => {
    window.dispatchEvent(new CustomEvent('storyCreated'));
  };
  
  // Set initial project ID if provided
  useEffect(() => {
    if (initialProjectId) {
      console.log("Setting initial project ID in QuestionFlow:", initialProjectId);
      setProjectFromId(initialProjectId);
    }
  }, [initialProjectId, setProjectFromId]);
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold tracking-tight mb-6">Create Stories</h2>
      
      <ProjectListener 
        loadProjects={loadProjects}
        setProjectFromId={setProjectFromId}
      />
      
      <TabsContainer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStep={currentStep}
        inputs={inputs}
        generatedStory={generatedStory}
        isLoading={isLoading}
        projects={projects}
        isResultsScreen={isResultsScreen}
        currentQuestion={currentQuestion}
        retryCount={retryCount}
        maxRetries={maxRetries}
        onInputChange={handleInputChange}
        onNext={handleNext}
        onBack={handleBack}
        onReset={handleReset}
        onCreateProject={handleCreateProject}
        onCancel={cancelGeneration}
        onStoriesGenerated={handleStoriesGenerated}
      />
    </div>
  );
};

export default QuestionFlow;
