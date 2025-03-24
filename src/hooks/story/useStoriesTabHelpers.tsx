
import { useState, useRef, useEffect } from "react";
import { Project, getProjectById, createProject, exportStoriesToExcel } from "@/utils/story";
import { useToast } from "@/hooks/use-toast";

export const useStoriesTabHelpers = (
  selectedProject: string | null,
  stories: any[],
  loadProjects: () => void,
  setSelectedProject: (id: string | null) => void
) => {
  const { toast } = useToast();
  const [selectedProjectData, setSelectedProjectData] = useState<Project | null>(null);
  const projectDataFetchedRef = useRef(false);
  
  // Get the project data for the selected project
  useEffect(() => {
    const getProject = async () => {
      if (selectedProject && selectedProject !== "all") {
        if (projectDataFetchedRef.current) return;
        
        console.log("Fetching project details for:", selectedProject);
        try {
          projectDataFetchedRef.current = true;
          const project = await getProjectById(selectedProject);
          setSelectedProjectData(project);
          console.log("Project details loaded:", project?.name);
        } catch (error) {
          console.error("Error fetching project details:", error);
          setSelectedProjectData(null);
        } finally {
          // Reset the flag after a short delay to allow re-fetching if selectedProject changes
          setTimeout(() => {
            projectDataFetchedRef.current = false;
          }, 300);
        }
      } else {
        setSelectedProjectData(null);
      }
    };
    
    getProject();
  }, [selectedProject]);
  
  // Ensure projects are loaded
  useEffect(() => {
    if (loadProjects && !projectDataFetchedRef.current) {
      console.log("Checking if projects need to be loaded");
      loadProjects();
    }
  }, [loadProjects]);
  
  const handleExport = () => {
    if (stories.length === 0) {
      toast({
        title: "No stories to export",
        description: "Create some user stories first!",
        variant: "destructive",
      });
      return;
    }
    
    try {
      exportStoriesToExcel(stories);
      toast({
        title: "Export successful",
        description: "Your user stories have been exported to CSV",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your stories",
        variant: "destructive",
      });
    }
  };

  // Handle project creation with proper redirection
  const handleCreateProject = async (name: string, description?: string) => {
    const newProject = await createProject(name, description);
    if (newProject) {
      console.log("Setting selected project after creation:", newProject.id);
      setSelectedProject(newProject.id);
      loadProjects();
      
      toast({
        title: "Project created",
        description: `${name} has been created and selected`,
      });
    }
    return newProject;
  };
  
  return {
    selectedProjectData,
    handleExport,
    handleCreateProject
  };
};
