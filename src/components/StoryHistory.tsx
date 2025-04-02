
import React from "react";
import ProjectManagement from "./story/ProjectManagement";

const StoryHistory: React.FC = () => {  
  return (
    <div>
      <ProjectManagement onProjectsChanged={() => {}} />
    </div>
  );
};

export default StoryHistory;
