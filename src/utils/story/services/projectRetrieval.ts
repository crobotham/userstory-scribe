
import { Project, StoredProject } from '../types';
import { supabase } from "@/integrations/supabase/client";

// Get projects from Supabase
export const getProjectsFromLocalStorage = async (): Promise<Project[]> => {
  console.log("getProjectsFromLocalStorage - Starting to fetch projects");
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log("No user authenticated, returning empty projects array");
    return [];
  }
  
  try {
    // Get projects from Supabase
    console.log("Fetching projects from Supabase for user:", user.id);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error fetching projects from Supabase:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No projects found in Supabase");
      return [];
    }
    
    console.log("Found projects in Supabase:", data.length);
    // Map Supabase data to Project format
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      createdAt: new Date(item.created_at),
      userId: item.user_id
    }));
  } catch (err) {
    console.error("Error fetching projects from Supabase:", err);
    throw err;
  }
};

// Get project by ID
export const getProjectById = async (projectId: string): Promise<Project | null> => {
  console.log("getProjectById - Starting to fetch project:", projectId);
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log("No authenticated user, returning null project");
    return null;
  }
  
  try {
    console.log("Looking up project in Supabase:", projectId);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      console.error("Error fetching project from Supabase:", error);
      throw error;
    }
    
    if (!data) {
      console.log("Project not found with ID:", projectId);
      return null;
    }
    
    console.log("Found project in Supabase:", data.name);
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: new Date(data.created_at),
      userId: data.user_id
    };
  } catch (error) {
    console.error("Error finding project in Supabase:", error);
    throw error;
  }
};
