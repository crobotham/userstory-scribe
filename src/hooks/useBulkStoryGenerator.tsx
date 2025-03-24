
import { useState, useEffect } from "react";
import { generateBulkUserStories } from "@/utils/openai/bulkGeneration";
import { 
  generateUserStory, 
  Project,
  getProjectsFromLocalStorage,
  createProject
} from "@/utils/story";
import { useToast } from "@/components/ui/use-toast";

export function useBulkStoryGenerator(onStoriesGenerated: () => void) {
  const [projectDescription, setProjectDescription] = useState("");
  const [numberOfStories, setNumberOfStories] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("openai_api_key") || "";
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
    
    const handleProjectChanged = () => {
      console.log("Project changed event detected in useBulkStoryGenerator");
      loadProjects();
    };
    
    window.addEventListener('projectChanged', handleProjectChanged);
    
    return () => {
      window.removeEventListener('projectChanged', handleProjectChanged);
    };
  }, []);
  
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const loadedProjects = await getProjectsFromLocalStorage();
      console.log("Loaded projects in useBulkStoryGenerator:", loadedProjects.length);
      setProjects(loadedProjects);
      
      // If we have projects but none selected, select the first one
      if (loadedProjects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(loadedProjects[0].id);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (name: string, description?: string) => {
    try {
      const newProject = await createProject(name, description);
      await loadProjects();
      setIsNewProjectDialogOpen(false);
      
      // Auto-select the newly created project
      setSelectedProjectId(newProject.id);
      
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  };

  const handleGenerateStories = async () => {
    if (!projectDescription.trim()) {
      setError("Please provide a project description");
      return;
    }
    
    if (!selectedProjectId && projects.length > 0) {
      setError("Please select a project");
      return;
    }
    
    if (projects.length === 0) {
      setError("Please create a project first");
      setIsNewProjectDialogOpen(true);
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const result = await generateBulkUserStories(
        projectDescription,
        numberOfStories,
        apiKey
      );

      if (result.success && result.stories.length > 0) {
        for (const storyInput of result.stories) {
          const storyWithProject = {
            ...storyInput,
            projectId: selectedProjectId
          };
          await generateUserStory(storyWithProject);
        }

        toast({
          title: "Success!",
          description: `Generated ${result.stories.length} user stories.`,
        });

        setProjectDescription("");
        onStoriesGenerated();
      } else {
        setError(result.error || "Failed to generate stories. Please try again.");
      }
    } catch (err) {
      console.error("Error in bulk generation:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    projectDescription,
    setProjectDescription,
    numberOfStories,
    setNumberOfStories,
    isGenerating,
    error,
    apiKey,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    isNewProjectDialogOpen,
    setIsNewProjectDialogOpen,
    isLoading,
    handleCreateProject,
    handleGenerateStories
  };
}
