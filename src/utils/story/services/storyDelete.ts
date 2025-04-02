
import { supabase } from "@/integrations/supabase/client";

// Delete a story from Supabase
export const deleteStoryFromLocalStorage = async (storyId: string): Promise<void> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to delete stories");
  }
  
  try {
    console.log("Deleting story with ID:", storyId);
    
    // Delete the story from Supabase
    const { error } = await supabase
      .from('user_stories')
      .delete()
      .eq('id', storyId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error deleting story from Supabase:", error);
      throw error;
    }
    
    console.log("Story deleted successfully from Supabase");
  } catch (err) {
    console.error("Error in deleteStoryFromLocalStorage:", err);
    throw err;
  }
};
