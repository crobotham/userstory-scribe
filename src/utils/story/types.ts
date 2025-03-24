
// Common types for the story generator

export type UserStoryInputs = {
  role: string;
  goal: string;
  benefit: string;
  priority: "High" | "Medium" | "Low";
  acceptanceCriteria: string[];
  additionalNotes?: string;
  projectId?: string;  // Field to associate with a project
  userId?: string;     // Field to associate with a user
};

export type UserStory = UserStoryInputs & {
  id: string;
  storyText: string;
  createdAt: Date;
  projectName?: string; // Optional project name for display purposes
  userId?: string;     // User ID for ownership
  supabaseId?: string; // Added to reference the Supabase UUID
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  userId?: string;     // User ID for ownership
};

// For localStorage storage
export type StoredUserStory = Omit<UserStory, 'createdAt'> & {
  createdAt: string;
};

export type StoredProject = Omit<Project, 'createdAt'> & {
  createdAt: string;
};
