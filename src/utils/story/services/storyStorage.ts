
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
    // Sanitize data to ensure it's compatible with database schema
    const sanitizedStory = {
      project_id: updatedStory.projectId || null,
      title: `As a ${updatedStory.role}, I want to ${updatedStory.goal}, so that ${updatedStory.benefit}.`,
      description: updatedStory.additionalNotes || '',
      persona: updatedStory.role || '',
      goal: updatedStory.goal || '',
      benefit: updatedStory.benefit || '',
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
    
    // Update the local storage copy (non-critical operation)
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
              storyText: `As a ${updatedStory.role}, I want to ${updatedStory.goal}, so that ${updatedStory.benefit}.`,
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
      }
    } catch (localStorageErr) {
      console.warn("Error updating local storage (non-critical):", localStorageErr);
      // Continue even if localStorage update fails - Supabase is the source of truth
    }
  } catch (err) {
    console.error("Error updating story:", err);
    throw err;
  }
};
