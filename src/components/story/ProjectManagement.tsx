
import React from "react";
import { useToast } from "@/hooks/use-toast";
import NewProjectDialog from "./NewProjectDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import ProjectList from "./project/ProjectList";
import EditProjectDialog from "./project/EditProjectDialog";
import ProjectStories from "./project/ProjectStories";
import ProjectActions from "./project/ProjectActions";
import { useProjectManagementState } from "@/hooks/useProjectManagementState";

interface ProjectManagementProps {
  onProjectsChanged: () => void;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({ onProjectsChanged }) => {
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
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
    handleProjectSelect,
    handleBackToProjects
  } = useProjectManagementState(onProjectsChanged);

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
