
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
    console.log("Saving story to Supabase with acceptance criteria:", story.acceptanceCriteria);
    
    const { error } = await supabase.from('user_stories').insert({
      id: story.id,
      user_id: user.id,
      project_id: story.projectId,
      title: story.storyText,
      description: story.additionalNotes || '',
      persona: story.role,
      goal: story.goal,
      benefit: story.benefit,
      // Convert acceptance criteria to a JSON string
      acceptance_criteria: JSON.stringify(story.acceptanceCriteria || [])
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

// Update story in Supabase
export const updateStoryInLocalStorage = async (updatedStory: UserStory): Promise<void> => {
  console.log("Starting story update process for ID:", updatedStory.id);
  console.log("Acceptance criteria to save:", updatedStory.acceptanceCriteria);
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to update stories");
  }
  
  try {
    // Sanitize data to ensure it's compatible with database schema
    const sanitizedStory = {
      project_id: updatedStory.projectId || null,
      title: `As a ${updatedStory.role}, I want to ${updatedStory.goal}, so that ${updatedStory.benefit}.`,
      description: updatedStory.additionalNotes || '',
      persona: updatedStory.role || '',
      goal: updatedStory.goal || '',
      benefit: updatedStory.benefit || '',
      // Convert acceptance criteria to a JSON string, ensure it's an array
      acceptance_criteria: JSON.stringify(updatedStory.acceptanceCriteria || []),
      updated_at: new Date().toISOString()
    };

    console.log("Sending update to Supabase with data:", JSON.stringify(sanitizedStory));
    
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

    console.log("Story update successful in Supabase for ID:", updatedStory.id);
  } catch (err) {
    console.error("Error updating story:", err);
    throw err;
  }
};
