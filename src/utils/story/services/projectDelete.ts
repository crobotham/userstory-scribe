
import { supabase } from "@/integrations/supabase/client";

export const deleteProjectFromLocalStorage = async (projectId: string): Promise<void> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to delete projects");
  }
  
  try {
    // First, delete all stories associated with the project
    const { error: storiesError } = await supabase
      .from('user_stories')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', user.id);
    
    if (storiesError) {
      console.error("Error deleting project stories from Supabase:", storiesError);
      throw storiesError;
    }
    
    // Then, delete the project itself
    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', user.id);
    
    if (projectError) {
      console.error("Error deleting project from Supabase:", projectError);
      throw projectError;
    }
    
    console.log("Project and associated stories deleted successfully");
  } catch (err) {
    console.error("Error deleting project from Supabase:", err);
    throw err;
  }
};
