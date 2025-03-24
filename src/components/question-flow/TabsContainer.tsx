
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StepTabContent from "./StepTabContent";
import BulkTabContent from "./BulkTabContent";
import { Project, UserStory, UserStoryInputs } from "@/utils/story";

interface TabsContainerProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  currentStep: number;
  inputs: UserStoryInputs;
  generatedStory: UserStory | null;
  isLoading: boolean;
  projects: Project[];
  isResultsScreen: boolean;
  currentQuestion: any;
  retryCount?: number;
  maxRetries?: number;
  onInputChange: (id: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
  onCreateProject: (name: string, description?: string) => Promise<any>;
  onCancel?: () => void;
  onStoriesGenerated: () => void;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  activeTab,
  setActiveTab,
  onStoriesGenerated,
  ...stepProps
}) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="mb-8"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="step-by-step">Step-by-Step</TabsTrigger>
        <TabsTrigger value="bulk-generation">Bulk Generation</TabsTrigger>
      </TabsList>
      
      <StepTabContent {...stepProps} />
      <BulkTabContent onStoriesGenerated={onStoriesGenerated} />
    </Tabs>
  );
};

export default TabsContainer;
