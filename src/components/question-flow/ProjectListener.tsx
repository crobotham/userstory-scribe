
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ProjectListenerProps {
  loadProjects: () => void;
  setProjectFromId: (projectId: string) => void;
}

const ProjectListener: React.FC<ProjectListenerProps> = ({
  loadProjects,
  setProjectFromId,
}) => {
  const location = useLocation();
  
  useEffect(() => {
    loadProjects();
    
    const handleProjectChanged = () => {
      loadProjects();
    };
    
    const handleProjectSelected = (event: CustomEvent) => {
      if (event.detail?.projectId) {
        console.log("QuestionFlow received projectId event:", event.detail.projectId);
        setProjectFromId(event.detail.projectId);
      }
    };
    
    window.addEventListener('projectChanged', handleProjectChanged);
    window.addEventListener('projectSelected', handleProjectSelected as EventListener);
    
    return () => {
      window.removeEventListener('projectChanged', handleProjectChanged);
      window.removeEventListener('projectSelected', handleProjectSelected as EventListener);
    };
  }, [loadProjects, setProjectFromId]);
  
  // Check URL parameters for project selection
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get('projectId');
    
    if (projectId) {
      console.log("URL contains projectId:", projectId);
      setProjectFromId(projectId);
    }
  }, [location.search, setProjectFromId]);
  
  return null;
};

export default ProjectListener;
