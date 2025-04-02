
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import NewProjectDialog from "./NewProjectDialog";
import { useToast } from "@/contexts/ToastContext";

interface CreateProjectPromptProps {
  onCreateProject: (name: string, description?: string) => Promise<any>;
  preselectedProjectId?: string;
}

const CreateProjectPrompt: React.FC<CreateProjectPromptProps> = ({ 
  onCreateProject,
  preselectedProjectId 
}) => {
  // Set the initial state of dialog to false whether there's a preselected project or not
  // We should never auto-open this dialog unless explicitly requested
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // If there's a preselected project, we should trigger a project changed event
    if (preselectedProjectId) {
      console.log("Using preselected project, triggering events:", preselectedProjectId);
      // Force reload projects
      window.dispatchEvent(new CustomEvent('projectChanged'));
      
      // Switch to the project's dashboard tab
      const event = new CustomEvent('switchToDashboardTab', {
        detail: { tab: 'stories', projectId: preselectedProjectId }
      });
      window.dispatchEvent(event);
      
      // Immediately dispatch a project selection event to bypass the create project prompt
      const projectEvent = new CustomEvent('projectSelected', {
        detail: { projectId: preselectedProjectId }
      });
      window.dispatchEvent(projectEvent);
    }
  }, [preselectedProjectId]);
  
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
        
        // Immediately dispatch a project selection event
        const projectEvent = new CustomEvent('projectSelected', {
          detail: { projectId: newProject.id }
        });
        window.dispatchEvent(projectEvent);
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
