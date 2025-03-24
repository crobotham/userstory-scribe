
import { Project, StoredProject } from '../types';
import { supabase } from "@/integrations/supabase/client";

// Update a project in Supabase
export const saveProjectToLocalStorage = async (project: Project): Promise<void> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to save projects");
  }
  
  try {
    // Check if project already exists
    const { data: existingProject, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', project.id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error("Error checking if project exists:", checkError);
      throw checkError;
    }
    
    if (existingProject) {
      // Update existing project
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          name: project.name,
          description: project.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id)
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error("Error updating project in Supabase:", updateError);
        throw updateError;
      }
    } else {
      // Insert new project
      const { error: insertError } = await supabase
        .from('projects')
        .insert({
          id: project.id,
          name: project.name,
          description: project.description,
          user_id: user.id
        });
      
      if (insertError) {
        console.error("Error inserting project in Supabase:", insertError);
        throw insertError;
      }
    }
    
    console.log("Project saved to Supabase:", project.name);
  } catch (err) {
    console.error("Error saving project to Supabase:", err);
    throw err;
  }
};
