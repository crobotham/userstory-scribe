
import { Project, StoredProject } from '../types';
import { supabase } from "@/integrations/supabase/client";

// Update a project in Supabase
export const updateProjectInLocalStorage = async (project: Project): Promise<void> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to update projects");
  }
  
  try {
    // Update in Supabase
    const { error } = await supabase
      .from('projects')
      .update({
        name: project.name,
        description: project.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', project.id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error updating project in Supabase:", error);
      throw error;
    }
    
    console.log("Project updated in Supabase successfully:", project.name);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('projectChanged'));
  } catch (err) {
    console.error("Error updating project in Supabase:", err);
    throw err;
  }
};
