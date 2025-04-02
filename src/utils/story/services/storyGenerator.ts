
import { UserStory, UserStoryInputs, StoredUserStory } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// User Story Generator Function
export const generateUserStory = async (inputs: UserStoryInputs): Promise<UserStory> => {
  // Generate a unique ID for the story
  const id = uuidv4(); // Use UUID format for Supabase
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to create stories");
  }
  
  // Validate that project ID is provided
  if (!inputs.projectId) {
    console.error("No project ID provided when generating story");
    throw new Error("A project must be selected before generating a story");
  }
  
  // Create the user story text
  const storyText = `As a ${inputs.role}, I want to ${inputs.goal}, so that ${inputs.benefit}.`;
  
  // Get project name from project ID
  let projectName;
  try {
    console.log("Looking up project name for ID:", inputs.projectId);
    const { data: projectData, error } = await supabase
      .from('projects')
      .select('name')
      .eq('id', inputs.projectId)
      .single();
    
    if (error) {
      console.error("Error finding project in Supabase:", error);
      throw error;
    }
    
    if (projectData) {
      projectName = projectData.name;
      console.log(`Found project name: ${projectName} for ID: ${inputs.projectId}`);
    } else {
      throw new Error(`Project with ID ${inputs.projectId} not found`);
    }
  } catch (error) {
    console.error("Error finding project:", error);
    throw error;
  }
  
  // Create the story object
  const story = {
    ...inputs,
    id,
    storyText,
    createdAt: new Date(),
    projectName,
    userId: user.id
  };
  
  // Save to Supabase
  try {
    console.log("Saving story to Supabase with data:", {
      id: id,
      user_id: user.id,
      project_id: story.projectId, 
      title: storyText,
      description: story.additionalNotes || '',
      persona: story.role,
      goal: story.goal,
      benefit: story.benefit
    });
    
    const { data, error } = await supabase.from('user_stories').insert({
      id: id,
      user_id: user.id,
      project_id: story.projectId,
      title: storyText,
      description: story.additionalNotes || '',
      persona: story.role,
      goal: story.goal,
      benefit: story.benefit
    }).select();
    
    if (error) {
      console.error("Error saving to Supabase:", error);
      throw error;
    }
    
    console.log("Story successfully saved to Supabase:", data);
  } catch (err) {
    console.error("Error saving to Supabase:", err);
    throw err;
  }
  
  // Return the complete user story object
  return story;
};
