
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import NewProjectDialog from "./NewProjectDialog";
import { useToast } from "@/contexts/ToastContext";

interface CreateProjectPromptProps {
  onCreateProject: (name: string, description?: string) => Promise<any>;
}

const CreateProjectPrompt: React.FC<CreateProjectPromptProps> = ({ onCreateProject }) => {
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(true); // Auto-open the dialog
  const { toast } = useToast();
  
  const handleCreateProject = async (name: string, description?: string) => {
    try {
      const newProject = await onCreateProject(name, description);
      setIsNewProjectDialogOpen(false);
      
      toast({
        title: "Project created",
        description: `'${name}' has been created successfully`,
      });
      
      // Force reload projects after creating a new one
      window.dispatchEvent(new CustomEvent('projectChanged'));
      
      // Switch to the new project
      if (newProject && newProject.id) {
        const event = new CustomEvent('switchToDashboardTab', {
          detail: { tab: 'stories', projectId: newProject.id }
        });
        window.dispatchEvent(event);
      }
      
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      
      toast({
        title: "Error creating project",
        description: "There was a problem creating your project",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="text-center p-8 border rounded-lg bg-background">
      <h3 className="text-xl font-medium mb-2">Create a Project First</h3>
      <p className="text-muted-foreground mb-4">
        You need to create a project before you can create user stories.
      </p>
      <Button onClick={() => setIsNewProjectDialogOpen(true)}>
        Create Project
      </Button>
      
      <NewProjectDialog
        isOpen={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default CreateProjectPrompt;
