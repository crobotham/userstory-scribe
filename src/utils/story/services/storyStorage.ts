
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
    const { error } = await supabase.from('user_stories').insert({
      id: story.id,
      user_id: user.id,
      project_id: story.projectId,
      title: story.storyText,
      description: story.additionalNotes || '',
      persona: story.role,
      goal: story.goal,
      benefit: story.benefit
    });
    
    if (error) {
      console.error("Error saving story to Supabase:", error);
      throw error;
    }
    
    console.log("Story saved to Supabase successfully:", story.id);
  } catch (err) {
    console.error("Error saving story to Supabase:", err);
    throw err;
  }
};

// Delete a story from Supabase
export const deleteStoryFromLocalStorage = async (storyId: string): Promise<void> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to delete stories");
  }
  
  try {
    const { error } = await supabase
      .from('user_stories')
      .delete()
      .eq('id', storyId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error deleting from Supabase:", error);
      throw error;
    }
    
    console.log("Story deleted from Supabase successfully:", storyId);
  } catch (err) {
    console.error("Error deleting from Supabase:", err);
    throw err;
  }
};

// Update a story in Supabase
export const updateStoryInLocalStorage = async (updatedStory: UserStory): Promise<void> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to update stories");
  }
  
  try {
    // Update the story text based on the new inputs
    const storyText = `As a ${updatedStory.role}, I want to ${updatedStory.goal}, so that ${updatedStory.benefit}.`;
    
    const { error } = await supabase
      .from('user_stories')
      .update({
        project_id: updatedStory.projectId,
        title: storyText,
        description: updatedStory.additionalNotes || '',
        persona: updatedStory.role,
        goal: updatedStory.goal,
        benefit: updatedStory.benefit,
        updated_at: new Date().toISOString()
      })
      .eq('id', updatedStory.id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error updating in Supabase:", error);
      throw error;
    }
    
    console.log("Story updated in Supabase successfully:", updatedStory.id);
  } catch (err) {
    console.error("Error updating in Supabase:", err);
    throw err;
  }
};
