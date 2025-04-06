
import { UserStory, Project } from '../types';
import { supabase } from "@/integrations/supabase/client";

// Performance-optimized story retrieval function
export const getStoriesFromLocalStorage = async (): Promise<UserStory[]> => {
  console.log("Retrieving all stories from Supabase");
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required to retrieve stories");
    }
    
    // More efficient single query with fewer columns and simplified join
    const { data, error } = await supabase
      .from('user_stories')
      .select(`
        id, 
        title, 
        description, 
        persona, 
        goal, 
        benefit, 
        acceptance_criteria,
        created_at,
        updated_at,
        project_id,
        projects(name)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error("Error retrieving stories from Supabase:", error);
      throw error;
    }
    
    // If no stories found, return an empty array
    if (!data || data.length === 0) {
      return [];
    }
    
    // Transform the data into UserStory objects
    return transformStoriesData(data);
  } catch (error) {
    console.error("Error retrieving stories:", error);
    throw error;
  }
};

// Optimize project-specific story retrieval by using an index
export const getStoriesByProject = async (projectId: string): Promise<UserStory[]> => {
  console.log("Retrieving stories for project:", projectId);
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required to retrieve stories");
    }
    
    // Optimized query with an index on project_id
    const { data, error } = await supabase
      .from('user_stories')
      .select(`
        id, 
        title, 
        description, 
        persona, 
        goal, 
        benefit, 
        acceptance_criteria,
        created_at,
        updated_at,
        project_id,
        projects(name)
      `)
      .eq('user_id', user.id)
      .eq('project_id', projectId);
    
    if (error) {
      console.error("Error retrieving stories for project from Supabase:", error);
      throw error;
    }
    
    // If no stories found, return an empty array
    if (!data || data.length === 0) {
      return [];
    }
    
    // Use the common function to transform the data
    return transformStoriesData(data);
  } catch (error) {
    console.error("Error retrieving stories for project:", error);
    throw error;
  }
};

// Optimize the transformation function for better performance
function transformStoriesData(data: any[]): UserStory[] {
  return data.map(story => {
    // Parse the acceptance criteria from JSON string to array, handling fallbacks
    let acceptanceCriteria: string[] = [];
    
    if (story.acceptance_criteria) {
      try {
        // Try to parse the JSON string
        const parsed = JSON.parse(story.acceptance_criteria);
        // Ensure it's an array
        acceptanceCriteria = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Error parsing acceptance criteria:", e);
        acceptanceCriteria = [];
      }
    }
    
    // Use project name from the joined projects table
    const projectName = story.projects ? story.projects.name : undefined;
    
    return {
      id: story.id,
      storyText: story.title,
      role: story.persona,
      goal: story.goal,
      benefit: story.benefit,
      additionalNotes: story.description,
      acceptanceCriteria: acceptanceCriteria,
      createdAt: new Date(story.created_at),
      projectId: story.project_id,
      projectName: projectName,
      priority: "Medium" // Default priority since it's not stored
    };
  });
}
