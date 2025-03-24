
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import StepByStepFlow from "../story/StepByStepFlow";
import { Project, UserStory, UserStoryInputs } from "@/utils/story";

interface StepTabContentProps {
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
}

const StepTabContent: React.FC<StepTabContentProps> = (props) => {
  return (
    <TabsContent value="step-by-step" className="pt-4">
      <StepByStepFlow {...props} />
    </TabsContent>
  );
};

export default StepTabContent;
