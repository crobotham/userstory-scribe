
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
  console.log("Starting story update process for ID:", updatedStory.id);
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to update stories");
  }
  
  try {
    // Update the story text based on the new inputs
    const storyText = `As a ${updatedStory.role}, I want to ${updatedStory.goal}, so that ${updatedStory.benefit}.`;
    
    // Sanitize data to ensure it's compatible with database requirements
    const sanitizedStory = {
      project_id: updatedStory.projectId || null,
      title: storyText,
      description: updatedStory.additionalNotes || '',
      persona: updatedStory.role || '',
      goal: updatedStory.goal || '',
      benefit: updatedStory.benefit || '',
      updated_at: new Date().toISOString()
    };

    console.log("Sending update to Supabase with data:", JSON.stringify(sanitizedStory));
    
    // First update the main story record
    const { error, data } = await supabase
      .from('user_stories')
      .update(sanitizedStory)
      .eq('id', updatedStory.id)
      .eq('user_id', user.id)
      .select();
    
    if (error) {
      console.error("Error updating in Supabase:", error);
      throw new Error(`Database update error: ${error.message}`);
    }

    console.log("Supabase update successful, rows affected:", data?.length);

    // Update the local storage copy to ensure UI is in sync (non-critical operation)
    try {
      const localStorageKey = 'userStories';
      const storedStoriesJson = localStorage.getItem(localStorageKey);
      
      if (storedStoriesJson) {
        const storedStories: StoredUserStory[] = JSON.parse(storedStoriesJson);
        
        // Find and update the story in local storage
        const updatedStories = storedStories.map(story => {
          if (story.id === updatedStory.id) {
            return {
              ...story,
              storyText,
              role: updatedStory.role,
              goal: updatedStory.goal,
              benefit: updatedStory.benefit,
              priority: updatedStory.priority,
              acceptanceCriteria: updatedStory.acceptanceCriteria || [],
              additionalNotes: updatedStory.additionalNotes,
              projectId: updatedStory.projectId,
              projectName: updatedStory.projectName
            };
          }
          return story;
        });
        
        // Save back to localStorage
        localStorage.setItem(localStorageKey, JSON.stringify(updatedStories));
        console.log("Local storage updated successfully");
      }
    } catch (localStorageErr) {
      console.warn("Error updating local storage (non-critical):", localStorageErr);
      // Continue even if localStorage update fails - Supabase is the source of truth
    }
    
    console.log("Story update process completed successfully for ID:", updatedStory.id);
  } catch (err) {
    console.error("Error updating story:", err);
    // Provide a more detailed error message for debugging but a user-friendly message to throw
    if (err instanceof Error) {
      console.error("Error details:", err.message);
      throw new Error(`Failed to update story: ${err.message}`);
    } else {
      throw new Error("Failed to update story. Please try again.");
    }
  }
};
