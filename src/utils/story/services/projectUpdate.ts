
import { Project } from '../types';
import { supabase } from "@/integrations/supabase/client";

// Update a project in Supabase
export const updateProjectInLocalStorage = async (project: Project): Promise<void> => {
  console.log("Starting project update process for ID:", project.id);
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to update projects");
  }
  
  try {
    // Sanitize data
    const sanitizedProject = {
      name: project.name,
      description: project.description || null,
      updated_at: new Date().toISOString()
    };
    
    console.log("Sending project update to Supabase:", sanitizedProject);
    
    // Update in Supabase
    const { error } = await supabase
      .from('projects')
      .update(sanitizedProject)
      .eq('id', project.id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error updating project in Supabase:", error);
      throw new Error(`Database update error: ${error.message}`);
    }
    
    console.log("Project updated in Supabase successfully:", project.name);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('projectChanged'));
  } catch (err) {
    console.error("Error updating project in Supabase:", err);
    throw err;
  }
};
