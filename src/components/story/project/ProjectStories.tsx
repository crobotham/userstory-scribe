
import React, { useState } from "react";
import { Project, UserStory } from "@/utils/story";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditStoryModal from "@/components/EditStoryModal";
import ProjectHeader from "./ProjectHeader";
import EmptyStoriesView from "./EmptyStoriesView";
import StoriesGrid from "./StoriesGrid";
import DeleteStoryHandler from "./DeleteStoryHandler";
import StoryDetailHandler from "./StoryDetailHandler";
import { useExportHandlers } from "./ExportHandlers";

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

  // Export handlers
  const { handleExportToPdf, handleExportToCsv } = useExportHandlers({
    stories,
    projectName: project.name
  });

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

  const handleStoryUpdated = () => {
    onStoryUpdated();
    toast({
      title: "Story updated",
      description: "Your user story has been updated successfully.",
    });
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

      <StoryDetailHandler
        selectedStory={selectedStory}
        isDetailViewOpen={isDetailViewOpen}
        setIsDetailViewOpen={setIsDetailViewOpen}
        setSelectedStory={setSelectedStory}
        onEdit={handleEditStory}
        onDelete={handleDeleteClick}
      />

      <EditStoryModal 
        story={selectedStory}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onStoryUpdated={handleStoryUpdated}
        projects={[project]}
      />

      <DeleteStoryHandler
        storyToDelete={storyToDelete}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        setStoryToDelete={setStoryToDelete}
        setIsDetailViewOpen={setIsDetailViewOpen}
        onStoryUpdated={onStoryUpdated}
      />
    </div>
  );
};

export default ProjectStories;
