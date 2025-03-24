
import React, { useRef, useEffect } from "react";
import { Project } from "@/utils/story";
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

interface ProjectSelectorProps {
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  projects: Project[];
  setIsNewProjectDialogOpen: (isOpen: boolean) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  selectedProjectId,
  setSelectedProjectId,
  projects,
  setIsNewProjectDialogOpen
}) => {
  const projectSelectRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    // Focus the project select when component mounts
    if (projectSelectRef.current) {
      setTimeout(() => {
        projectSelectRef.current?.focus();
      }, 100);
    }
  }, []);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="project-select" className="block">Select Project *</Label>
      <div className="flex gap-2">
        <Select 
          value={selectedProjectId} 
          onValueChange={setSelectedProjectId}
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
      {projects.length === 0 && (
        <p className="text-sm text-destructive mt-1">
          Create a project before generating stories
        </p>
      )}
    </div>
  );
};

export default ProjectSelector;
