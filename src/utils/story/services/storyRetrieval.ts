
import { UserStory, StoredUserStory } from '../types';
import { supabase } from "@/integrations/supabase/client";

// Utility function to parse acceptance criteria
const parseAcceptanceCriteria = (criteria: string | null): string[] => {
  if (!criteria) return [];
  try {
    // Try parsing as JSON array
    console.log("Parsing acceptance criteria:", criteria);
    const parsed = JSON.parse(criteria);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error parsing acceptance criteria:", error);
    // If parsing fails, return an empty array
    return [];
  }
};

// Get stories from Supabase
export const getStoriesFromLocalStorage = async (): Promise<UserStory[]> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log("No authenticated user, returning empty stories array");
    return [];
  }
  
  try {
    // Get stories from Supabase
    console.log("Fetching stories from Supabase for user:", user.id);
    const { data, error } = await supabase
      .from('user_stories')
      .select('*, projects(name)')
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error fetching from Supabase:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No stories found in Supabase");
      return [];
    }
    
    console.log("Found stories in Supabase:", data.length);
    // Map Supabase data to UserStory format
    const stories = data.map(item => {
      const acceptanceCriteria = parseAcceptanceCriteria(item.acceptance_criteria);
      console.log(`Story ${item.id} has ${acceptanceCriteria.length} acceptance criteria`);
      
      return {
        id: item.id,
        role: item.persona,
        goal: item.goal,
        benefit: item.benefit,
        priority: determinePriority(item.description || ""), // Convert string to proper enum value
        // Parse acceptance criteria from the stored JSON string
        acceptanceCriteria: acceptanceCriteria,
        additionalNotes: item.description,
        projectId: item.project_id,
        projectName: item.projects?.name,
        storyText: `As a ${item.persona}, I want to ${item.goal}, so that ${item.benefit}.`,
        createdAt: new Date(item.created_at),
        userId: item.user_id
      };
    });
    
    return stories;
  } catch (err) {
    console.error("Error fetching stories from Supabase:", err);
    throw err;
  }
};

// Helper function to determine priority from string
const determinePriority = (description: string): "High" | "Medium" | "Low" => {
  const lowercaseDesc = description.toLowerCase();
  if (lowercaseDesc.includes("high priority") || lowercaseDesc.includes("urgent")) {
    return "High";
  } else if (lowercaseDesc.includes("low priority")) {
    return "Low";
  } else {
    // Default to Medium if no clear indicator
    return "Medium";
  }
};

// Similar changes for getStoriesByProject
export const getStoriesByProject = async (projectId: string | null): Promise<UserStory[]> => {
  console.log("getStoriesByProject called with projectId:", projectId);
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log("No authenticated user, returning empty stories array");
    return [];
  }
  
  try {
    let query = supabase
      .from('user_stories')
      .select('*, projects(name)')
      .eq('user_id', user.id);
    
    // Apply project filter if provided
    if (projectId) {
      // Normalize the target project ID for comparison
      const targetProjectId = projectId.toString().trim();
      console.log(`Filtering stories for project ID: "${targetProjectId}"`);
      
      query = query.eq('project_id', targetProjectId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching stories from Supabase:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      const message = projectId 
        ? `No stories found for project ${projectId}`
        : "No stories found";
      console.log(message);
      return [];
    }
    
    // Map Supabase data to UserStory format
    const stories = data.map(item => {
      const acceptanceCriteria = parseAcceptanceCriteria(item.acceptance_criteria);
      console.log(`Project story ${item.id} has ${acceptanceCriteria.length} acceptance criteria`);
      
      return {
        id: item.id,
        role: item.persona,
        goal: item.goal,
        benefit: item.benefit,
        priority: determinePriority(item.description || ""), // Use helper function
        // Parse acceptance criteria from the stored JSON string
        acceptanceCriteria: acceptanceCriteria,
        additionalNotes: item.description,
        projectId: item.project_id,
        projectName: item.projects?.name,
        storyText: `As a ${item.persona}, I want to ${item.goal}, so that ${item.benefit}.`,
        createdAt: new Date(item.created_at),
        userId: item.user_id
      };
    });
    
    console.log(`Found ${stories.length} stories for ${projectId ? 'project ' + projectId : 'all projects'}`);
    
    return stories;
  } catch (error) {
    console.error("Error in getStoriesByProject:", error);
    throw error;
  }
};
