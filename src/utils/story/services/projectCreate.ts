
import { Project, StoredProject } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Create a new project
export const createProject = async (name: string, description?: string): Promise<Project> => {
  // Generate a UUID for Supabase compatibility
  const id = uuidv4();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Authentication required to create projects");
  }
  
  const project = {
    id,
    name, 
    description,
    createdAt: new Date(),
    userId: user.id
  };

  try {
    console.log("Saving project to Supabase with data:", {
      id: project.id,
      name: project.name,
      description: project.description,
      user_id: user.id
    });
    
    // Save to Supabase
    const { data, error } = await supabase.from('projects').insert({
      id: project.id,
      name: project.name,
      description: project.description,
      user_id: user.id
    }).select();
    
    if (error) {
      console.error("Error saving project to Supabase:", error);
      throw error;
    }
    
    console.log("Project saved successfully to Supabase:", data);
  } catch (err) {
    console.error("Error creating project:", err);
    throw err;
  }

  console.log("Project created successfully:", project.name);
  
  // Dispatch event to notify other components
  window.dispatchEvent(new CustomEvent('projectChanged'));
  
  return project;
};
