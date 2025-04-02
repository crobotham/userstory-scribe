
import { UserStory, StoredUserStory } from '../types';
import { supabase } from "@/integrations/supabase/client";

export const updateStoryInLocalStorage = async (updatedStory: UserStory): Promise<void> => {
  console.log("Starting story update process for ID:", updatedStory.id);
  
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
      acceptance_criteria: updatedStory.acceptanceCriteria || [], // New field added here
      updated_at: new Date().toISOString()
    };

    console.log("Sending update to Supabase with data:", JSON.stringify(sanitizedStory));
    
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
