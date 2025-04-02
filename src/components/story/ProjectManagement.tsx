
import React, { useState, useEffect } from "react";
import { 
  Project,
  UserStory,
  getProjectsFromLocalStorage,
  deleteProjectFromLocalStorage,
  updateProjectInLocalStorage,
  createProject,
  getStoriesByProject
} from "@/utils/story";
import { Button } from "@/components/ui/button";
import { Settings, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NewProjectDialog from "./NewProjectDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import ProjectList from "./project/ProjectList";
import EditProjectDialog from "./project/EditProjectDialog";
import ProjectStories from "./project/ProjectStories";

interface ProjectManagementProps {
  onProjectsChanged: () => void;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({ onProjectsChanged }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectStories, setProjectStories] = useState<UserStory[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const loadedProjects = await getProjectsFromLocalStorage();
      loadedProjects.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProjects(loadedProjects);
      onProjectsChanged();
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error loading projects",
        description: "There was a problem loading your projects.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (name: string, description?: string) => {
    try {
      const newProject = await createProject(name, description);
      await loadProjects();
      setIsNewProjectDialogOpen(false);
      toast({
        title: "Project created",
        description: `Project "${name}" has been created successfully.`,
      });
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: "There was a problem creating your project.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = async (project: Project) => {
    try {
      await updateProjectInLocalStorage(project);
      await loadProjects();
      setProjectToEdit(null);
      toast({
        title: "Project updated",
        description: `Project "${project.name}" has been updated successfully.`,
      });

      // If the updated project was selected, update the selected project
      if (selectedProject && selectedProject.id === project.id) {
        setSelectedProject(project);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating the project.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      await deleteProjectFromLocalStorage(projectToDelete.id);
      await loadProjects();
      
      // If the deleted project was selected, clear the selection
      if (selectedProject && selectedProject.id === projectToDelete.id) {
        setSelectedProject(null);
        setProjectStories([]);
      }
      
      toast({
        title: "Project deleted",
        description: `Project "${projectToDelete.name}" has been permanently deleted.`,
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the project.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleProjectSelect = async (project: Project) => {
    setSelectedProject(project);
    await loadProjectStories(project.id);
  };

  const loadProjectStories = async (projectId: string) => {
    setIsLoadingStories(true);
    try {
      const stories = await getStoriesByProject(projectId);
      setProjectStories(stories);
    } catch (error) {
      console.error("Error loading project stories:", error);
      toast({
        title: "Error loading stories",
        description: "There was a problem loading stories for this project.",
        variant: "destructive",
      });
      setProjectStories([]);
    } finally {
      setIsLoadingStories(false);
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setProjectStories([]);
  };

  return (
    <div className="space-y-6">
      {!selectedProject ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold tracking-tight">Project Management</h2>
            <Button 
              onClick={() => setIsNewProjectDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Create New Project</span>
            </Button>
          </div>

          <ProjectList 
            projects={projects}
            isLoading={isLoading}
            onCreateNew={() => setIsNewProjectDialogOpen(true)}
            onEdit={setProjectToEdit}
            onDelete={(project) => {
              setProjectToDelete(project);
              setIsDeleteDialogOpen(true);
            }}
            onSelect={handleProjectSelect}
          />
        </>
      ) : (
        <ProjectStories 
          project={selectedProject}
          stories={projectStories}
          isLoading={isLoadingStories}
          onBackClick={handleBackToProjects}
        />
      )}

      <NewProjectDialog
        isOpen={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <EditProjectDialog
        project={projectToEdit}
        onClose={() => setProjectToEdit(null)}
        onSave={handleUpdateProject}
      />

      <DeleteConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleDeleteProject}
        itemName={projectToDelete?.name}
        itemType="project"
        requireNameConfirmation={true}
      />
    </div>
  );
};

export default ProjectManagement;
