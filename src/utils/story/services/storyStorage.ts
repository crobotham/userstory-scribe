
import { UserStory, StoredUserStory } from '../types';
import { supabase } from "@/integrations/supabase/client";

// Save story to Supabase
export const saveStoryToLocalStorage = async (story: UserStory): Promise<void> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to save stories");
  }
  
  try {
    console.log("Saving story to Supabase");
    
    const { error } = await supabase.from('user_stories').insert({
      id: story.id,
      user_id: user.id,
      project_id: story.projectId,
      title: story.storyText,
      description: story.additionalNotes || '',
      persona: story.role,
      goal: story.goal,
      benefit: story.benefit,
      acceptance_criteria: JSON.stringify(story.acceptanceCriteria || [])
    });
    
    if (error) {
      console.error("Error saving story to Supabase:", error);
      throw error;
    }
  } catch (err) {
    console.error("Error saving story to Supabase:", err);
    throw err;
  }
};

// Update story in Supabase
export const updateStoryInLocalStorage = async (updatedStory: UserStory): Promise<void> => {
  console.log("Updating story with ID:", updatedStory.id);
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to update stories");
  }
  
  try {
    // Prepare data for update - only include fields that are needed
    const sanitizedStory = {
      project_id: updatedStory.projectId || null,
      title: updatedStory.storyText,
      description: updatedStory.additionalNotes || '',
      persona: updatedStory.role || '',
      goal: updatedStory.goal || '',
      benefit: updatedStory.benefit || '',
      acceptance_criteria: JSON.stringify(updatedStory.acceptanceCriteria || []),
      updated_at: new Date().toISOString()
    };
    
    // Update the story in Supabase
    const { error } = await supabase
      .from('user_stories')
      .update(sanitizedStory)
      .eq('id', updatedStory.id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error updating in Supabase:", error);
      throw new Error(`Database update error: ${error.message}`);
    }
  } catch (err) {
    console.error("Error updating story:", err);
    throw err;
  }
};
