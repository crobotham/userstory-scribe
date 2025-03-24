
import { useEffect } from "react";

interface EventListenerProps {
  loadProjects: () => Promise<void>;
  loadStories: () => Promise<void>;
  initialDataLoaded: React.MutableRefObject<boolean>;
  user: any;
}

export const useStoryEventListeners = ({
  loadProjects,
  loadStories,
  initialDataLoaded,
  user
}: EventListenerProps) => {
  
  // Initialize data loading - run only once when authenticated
  useEffect(() => {
    if (user && !initialDataLoaded.current) {
      console.log("User authenticated, initial data load");
      initialDataLoaded.current = true;
      
      // Load projects first, then load stories once
      const timer = setTimeout(() => {
        loadProjects()
          .then(() => {
            console.log("Initial load of stories for All Stories view");
            return loadStories();
          })
          .catch(err => {
            console.error("Error in initial data load:", err);
          });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, loadProjects, loadStories, initialDataLoaded]);
  
  // Add event listener for project changes
  useEffect(() => {
    const handleProjectChanged = () => {
      console.log("Project changed event detected");
      loadProjects();
    };
    
    window.addEventListener('projectChanged', handleProjectChanged);
    
    return () => {
      window.removeEventListener('projectChanged', handleProjectChanged);
    };
  }, [loadProjects]);
  
  // Add event listener for story creation
  useEffect(() => {
    const handleStoryCreated = () => {
      console.log("Story created event detected");
      loadStories();
    };
    
    window.addEventListener('storyCreated', handleStoryCreated);
    
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('storyCreated', handleStoryCreated);
    };
  }, [loadStories]);
};
