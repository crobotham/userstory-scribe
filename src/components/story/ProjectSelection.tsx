
import React, { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import NewProjectDialog from "./NewProjectDialog";
import { Project, UserStoryInputs } from "@/utils/story";
import { useToast } from "@/hooks/use-toast";

interface ProjectSelectionProps {
  inputs: UserStoryInputs;
  projects: Project[];
  projectError: string | null;
  onInputChange: (id: string, value: string | string[]) => void;
  onCreateProject: (name: string, description?: string) => Promise<any>;
  setProjectError: (error: string | null) => void;
}

const ProjectSelection: React.FC<ProjectSelectionProps> = ({
  inputs,
  projects,
  projectError,
  onInputChange,
  onCreateProject,
  setProjectError
}) => {
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const projectSelectRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Clear error when a project is selected
    if (inputs.projectId) {
      setProjectError(null);
    }
  }, [inputs.projectId, setProjectError]);
  
  useEffect(() => {
    // Focus the project select when component mounts
    if (projectSelectRef.current && projects.length > 0) {
      setTimeout(() => {
        projectSelectRef.current?.focus();
      }, 100);
    }
  }, [projects.length]);
  
  const handleCreateProject = async (name: string, description?: string) => {
    try {
      const newProject = await onCreateProject(name, description);
      setIsNewProjectDialogOpen(false);
      
      // Set the newly created project as selected
      if (newProject && newProject.id) {
        console.log("Setting newly created project as selected:", newProject.name);
        onInputChange("projectId", newProject.id);
        setProjectError(null);
        
        toast({
          title: "Project created",
          description: `'${name}' has been created and selected`,
        });
      }
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
    <div className="mb-6">
      <Label htmlFor="project-select" className="block mb-2">Select Project *</Label>
      <div className="flex gap-2">
        <Select 
          value={inputs.projectId || ""} 
          onValueChange={(value) => onInputChange("projectId", value)}
        >
          <SelectTrigger 
            id="project-select" 
            className="flex-1"
            ref={projectSelectRef}
          >
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.length > 0 ? (
              projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                No projects available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsNewProjectDialogOpen(true)}
          title="Create new project"
        >
          <FolderPlus size={16} />
        </Button>
      </div>
      {projectError && (
        <p className="text-sm text-destructive mt-1">{projectError}</p>
      )}
      
      <NewProjectDialog
        isOpen={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default ProjectSelection;
