
import React from "react";
import { Project } from "@/utils/story";
import { useToast } from "@/hooks/use-toast";
import NewProjectDialog from "./NewProjectDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import ProjectList from "./project/ProjectList";
import EditProjectDialog from "./project/EditProjectDialog";
import ProjectStories from "./project/ProjectStories";
import ProjectActions from "./project/ProjectActions";
import { useProjectManagementState } from "@/hooks/useProjectManagementState";
import { createProject, updateProjectInLocalStorage, deleteProjectFromLocalStorage } from "@/utils/story";

interface ProjectManagementProps {
  onProjectsChanged: () => void;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({ onProjectsChanged }) => {
  const { toast } = useToast();
  const {
    projects,
    isNewProjectDialogOpen,
    projectToEdit,
    projectToDelete,
    isDeleteDialogOpen,
    isLoading,
    selectedProject,
    projectStories,
    isLoadingStories,
    storyCounts,
    setIsNewProjectDialogOpen,
    setProjectToEdit,
    setProjectToDelete,
    setIsDeleteDialogOpen,
    loadProjects,
    handleProjectSelect,
    handleBackToProjects
  } = useProjectManagementState(onProjectsChanged);

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

      if (selectedProject && selectedProject.id === project.id) {
        handleProjectSelect(project);
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
      
      if (selectedProject && selectedProject.id === projectToDelete.id) {
        handleBackToProjects();
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

  return (
    <div className="space-y-6">
      {!selectedProject ? (
        <>
          <ProjectActions onCreateNew={() => setIsNewProjectDialogOpen(true)} />

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
            storyCounts={storyCounts}
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
