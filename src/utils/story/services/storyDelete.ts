
import { supabase } from "@/integrations/supabase/client";

export const deleteStoryFromLocalStorage = async (storyId: string): Promise<void> => {
  console.log("Starting story deletion process for ID:", storyId);
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to delete stories");
  }
  
  try {
    // Delete story from Supabase
    console.log("Sending delete request to Supabase for story ID:", storyId);
    const { error } = await supabase
      .from('user_stories')
      .delete()
      .eq('id', storyId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error deleting from Supabase:", error);
      throw new Error(`Database deletion error: ${error.message}`);
    }

    console.log("Story deletion successful in Supabase for ID:", storyId);
  } catch (err) {
    console.error("Error deleting story:", err);
    throw err;
  }
};
