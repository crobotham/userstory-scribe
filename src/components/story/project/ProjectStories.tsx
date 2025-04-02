
import React, { useState } from "react";
import { Project, UserStory } from "@/utils/story";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { exportStoriesToExcel } from "@/utils/story/exportService";
import { exportStoriesToPdf } from "@/utils/story/exportPdfService";
import { useToast } from "@/hooks/use-toast";
import StoryDetailView from "../StoryDetailView";
import EditStoryModal from "@/components/EditStoryModal";
import ProjectHeader from "./ProjectHeader";
import EmptyStoriesView from "./EmptyStoriesView";
import StoriesGrid from "./StoriesGrid";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteStoryFromLocalStorage } from "@/utils/story/services/storyDelete";

interface ProjectStoriesProps {
  project: Project;
  stories: UserStory[];
  isLoading: boolean;
  onBackClick: () => void;
  onStoryUpdated?: () => void;
}

const ProjectStories: React.FC<ProjectStoriesProps> = ({
  project,
  stories,
  isLoading,
  onBackClick,
  onStoryUpdated = () => {}
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreateStory = () => {
    navigate(`/dashboard?projectId=${project.id}`);
  };

  const handleViewStory = (story: UserStory) => {
    setSelectedStory(story);
    setIsDetailViewOpen(true);
  };

  const handleEditStory = (story: UserStory) => {
    setSelectedStory(story);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (storyId: string) => {
    setStoryToDelete(storyId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!storyToDelete) return;
    
    try {
      await deleteStoryFromLocalStorage(storyToDelete);
      onStoryUpdated();
      toast({
        title: "Story deleted",
        description: "Your user story has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting story:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting your story.",
        variant: "destructive",
      });
    } finally {
      // Ensure we reset all state related to delete operation
      setIsDeleteDialogOpen(false);
      setStoryToDelete(null);
      setIsDetailViewOpen(false); // Close the detail view as well
    }
  };

  // Handler for canceling delete operation
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setStoryToDelete(null);
  };

  const handleStoryUpdated = () => {
    onStoryUpdated();
    toast({
      title: "Story updated",
      description: "Your user story has been updated successfully.",
    });
  };

  const handleExportToPdf = () => {
    if (stories.length === 0) {
      toast({
        title: "No stories to export",
        description: "Create some stories first before exporting.",
        variant: "destructive",
      });
      return;
    }
    
    exportStoriesToPdf(stories, project.name);
    toast({
      title: "Export successful",
      description: "Your stories have been exported to PDF",
    });
  };
  
  const handleExportToCsv = () => {
    if (stories.length === 0) {
      toast({
        title: "No stories to export",
        description: "Create some stories first before exporting.",
        variant: "destructive",
      });
      return;
    }
    
    exportStoriesToExcel(stories);
    toast({
      title: "Export successful",
      description: "Your stories have been exported to CSV",
    });
  };

  // Close detail view and ensure all modals are properly closed
  const handleCloseDetailView = () => {
    setIsDetailViewOpen(false);
    setSelectedStory(null);
  };

  return (
    <div className="space-y-6">
      <ProjectHeader 
        project={project}
        storiesExist={stories.length > 0}
        onBackClick={onBackClick}
        onCreateStory={handleCreateStory}
        onExportToPdf={handleExportToPdf}
        onExportToCsv={handleExportToCsv}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading stories...</span>
        </div>
      ) : stories.length === 0 ? (
        <EmptyStoriesView onCreateStory={handleCreateStory} />
      ) : (
        <StoriesGrid 
          stories={stories} 
          onEdit={handleEditStory} 
          onView={handleViewStory}
          onDelete={handleDeleteClick}
        />
      )}

      <StoryDetailView 
        story={selectedStory}
        isOpen={isDetailViewOpen}
        onClose={handleCloseDetailView}
        onEdit={handleEditStory}
        onBack={handleCloseDetailView}
        onDelete={handleDeleteClick}
      />

      <EditStoryModal 
        story={selectedStory}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onStoryUpdated={handleStoryUpdated}
        projects={[project]}
      />

      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            handleCancelDelete();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Story</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user story? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectStories;
