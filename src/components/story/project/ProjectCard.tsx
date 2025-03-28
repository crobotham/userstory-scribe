
import React from "react";
import { Project } from "@/utils/story";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  
  const handleViewStories = () => {
    // Navigate to stories tab and select this project
    const event = new CustomEvent('switchToDashboardTab', {
      detail: { tab: 'stories', projectId: project.id }
    });
    window.dispatchEvent(event);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(project)}
              title="Edit project"
            >
              <Edit size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(project)}
              title="Delete project"
              className="text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {project.description ? (
          <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
        ) : (
          <p className="text-muted-foreground text-sm italic mb-4">No description</p>
        )}
        
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full mt-2"
          onClick={handleViewStories}
        >
          <BookOpen size={16} className="mr-2" />
          View Stories
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
