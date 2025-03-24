
import React, { useState, useEffect, useRef } from "react";
import EditStoryModal from "./EditStoryModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectManagement from "./story/ProjectManagement";
import StoriesTabContent from "./story/StoriesTabContent";
import DeleteConfirmationDialog from "./story/DeleteConfirmationDialog";
import { useStoryManagement } from "@/hooks/useStoryManagement";
import { Skeleton } from "./ui/skeleton";

const StoryHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("stories");
  const initialRenderComplete = useRef(false);
  
  const {
    stories,
    projects,
    storyToEdit,
    isEditModalOpen,
    isDeleteDialogOpen,
    selectedProject,
    isLoading,
    setSelectedProject,
    setIsEditModalOpen,
    setIsDeleteDialogOpen,
    loadStories,
    loadProjects,
    handleEditClick,
    handleDeleteClick,
    confirmDelete
  } = useStoryManagement();
  
  useEffect(() => {
    console.log("StoryHistory - Component state:", { 
      activeTab, 
      stories: stories.length, 
      projects: projects.length,
      selectedProject,
      isLoading,
      initialRenderComplete: initialRenderComplete.current
    });
  }, [activeTab, stories, projects, selectedProject, isLoading]);
  
  useEffect(() => {
    if (!initialRenderComplete.current) {
      console.log("StoryHistory - Initial load");
      initialRenderComplete.current = true;
    }
  }, []);
  
  useEffect(() => {
    const handleSwitchTab = (event: CustomEvent) => {
      if (event.detail?.tab) {
        console.log("Switching to tab:", event.detail.tab, "Project ID:", event.detail?.projectId);
        setActiveTab(event.detail.tab);
        
        if (event.detail?.projectId) {
          console.log("Setting selected project from event:", event.detail.projectId);
          // Ensure this runs after tab is switched
          setTimeout(() => {
            setSelectedProject(event.detail.projectId);
          }, 0);
        }
      }
    };
    
    window.addEventListener('switchToDashboardTab', handleSwitchTab as EventListener);
    
    return () => {
      window.removeEventListener('switchToDashboardTab', handleSwitchTab as EventListener);
    };
  }, [setSelectedProject]);
  
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-6">Story Management</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stories" className="pt-6">
          <StoriesTabContent
            stories={stories}
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            loadProjects={loadProjects}
            loadStories={loadStories}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="projects" className="pt-6">
          <ProjectManagement onProjectsChanged={loadProjects} />
        </TabsContent>
      </Tabs>
      
      <EditStoryModal 
        story={storyToEdit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onStoryUpdated={loadStories}
        projects={projects}
      />
      
      <DeleteConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default StoryHistory;
