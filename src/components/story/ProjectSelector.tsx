
import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FolderPlus, Trash2 } from "lucide-react";
import { Project, createProject } from "@/utils/story";
import NewProjectDialog from "./NewProjectDialog";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: string | null;
  onSelectProject: (projectId: string | null) => void;
  onProjectCreated: () => void;
  onProjectDeleted?: () => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onProjectCreated,
  onProjectDeleted
}) => {
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProjectData, setSelectedProjectData] = useState<Project | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("ProjectSelector - Projects received:", projects.length);
    console.log("Currently selected project:", selectedProject);

    // Find the project data for the selected project
    if (selectedProject && selectedProject !== "all") {
      const project = projects.find(p => p.id === selectedProject);
      setSelectedProjectData(project || null);
    } else {
      setSelectedProjectData(null);
    }
  }, [projects, selectedProject]);

  const handleCreateProject = async (name: string, description?: string) => {
    try {
      const newProject = await createProject(name, description);
      console.log("Project created in ProjectSelector:", newProject.id);
      
      // Immediately select the new project
      if (newProject && newProject.id) {
        console.log("Setting selected project to:", newProject.id);
        onSelectProject(newProject.id);
        
        toast({
          title: "Project created",
          description: `'${name}' has been created and selected`
        });
      }
      
      onProjectCreated();
      setIsNewProjectDialogOpen(false);
      
      return newProject;
    } catch (error) {
      console.error("Error in handleCreateProject:", error);
      toast({
        title: "Error creating project",
        description: "There was a problem creating your project",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProject = () => {
    if (selectedProjectData && onProjectDeleted) {
      // The actual deletion happens in the parent component
      onProjectDeleted();
      // Reset selected project to "all" after deletion
      onSelectProject("all");
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Project deleted",
        description: `'${selectedProjectData.name}' has been deleted`
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <Select 
          value={selectedProject || "all"} 
          onValueChange={(value) => {
            console.log("Project selected from dropdown:", value);
            onSelectProject(value === "all" ? null : value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a project or view all" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-projects" disabled>
                No projects available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      {selectedProject && selectedProject !== "all" && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsDeleteDialogOpen(true)}
          title="Delete selected project"
          className="text-destructive"
        >
          <Trash2 size={16} />
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setIsNewProjectDialogOpen(true)}
        title="Create new project"
      >
        <FolderPlus size={16} />
      </Button>

      <NewProjectDialog
        isOpen={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onCreateProject={handleCreateProject}
      />
      
      {selectedProjectData && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={handleDeleteProject}
          itemName={selectedProjectData.name}
          itemType="project"
          requireNameConfirmation={true}
        />
      )}
    </div>
  );
};

export default ProjectSelector;
