
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Project } from "@/utils/story";

interface AddStoryButtonProps {
  selectedProject: Project | null;
}

const AddStoryButton: React.FC<AddStoryButtonProps> = ({ selectedProject }) => {
  const navigate = useNavigate();

  const handleAddStory = () => {
    // If a project is selected, navigate to Create Stories and pass the project ID
    if (selectedProject) {
      // Navigate to dashboard with the project ID as a query parameter
      navigate(`/dashboard?projectId=${selectedProject.id}`);
    } else {
      // Just navigate to dashboard if no project is selected
      navigate('/dashboard');
    }
  };

  return (
    <Button onClick={handleAddStory} className="flex items-center gap-1">
      <Plus size={16} />
      <span>Add Story</span>
    </Button>
  );
};

export default AddStoryButton;
