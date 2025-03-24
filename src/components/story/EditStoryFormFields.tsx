
import React from "react";
import { UserStory, Project } from "@/utils/story";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface EditStoryFormFieldsProps {
  editedStory: UserStory;
  projects: Project[];
  onInputChange: (field: keyof UserStory, value: string | string[]) => void;
  onAcceptanceCriteriaChange: (value: string) => void;
  onProjectChange: (projectId: string) => void;
}

const EditStoryFormFields: React.FC<EditStoryFormFieldsProps> = ({
  editedStory,
  projects,
  onInputChange,
  onAcceptanceCriteriaChange,
  onProjectChange
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="project">Project</Label>
        <Select 
          value={editedStory.projectId || "no-project"} 
          onValueChange={onProjectChange}
        >
          <SelectTrigger id="project">
            <SelectValue placeholder="No Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-project">No Project</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          value={editedStory.role}
          onChange={(e) => onInputChange('role', e.target.value)}
          placeholder="e.g., marketing manager, customer, administrator"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="goal">Goal</Label>
        <Input
          id="goal"
          value={editedStory.goal}
          onChange={(e) => onInputChange('goal', e.target.value)}
          placeholder="e.g., export analytics data, review submitted forms"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="benefit">Benefit</Label>
        <Input
          id="benefit"
          value={editedStory.benefit}
          onChange={(e) => onInputChange('benefit', e.target.value)}
          placeholder="e.g., track campaign performance, save time on review"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="priority">Priority</Label>
        <Select 
          value={editedStory.priority} 
          onValueChange={(value) => onInputChange('priority', value as "High" | "Medium" | "Low")}
        >
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="acceptanceCriteria">Acceptance Criteria</Label>
        <Textarea
          id="acceptanceCriteria"
          value={editedStory.acceptanceCriteria.join('\n')}
          onChange={(e) => onAcceptanceCriteriaChange(e.target.value)}
          placeholder="Enter each acceptance criterion on a new line"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          value={editedStory.additionalNotes || ''}
          onChange={(e) => onInputChange('additionalNotes', e.target.value)}
          placeholder="Any additional context or notes"
        />
      </div>
    </div>
  );
};

export default EditStoryFormFields;
