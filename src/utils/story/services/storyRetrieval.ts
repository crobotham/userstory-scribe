
import { UserStory, StoredUserStory } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { Json } from '@/integrations/supabase/types';

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
    return data.map(item => ({
      id: item.id,
      role: item.persona,
      goal: item.goal,
      benefit: item.benefit,
      priority: determinePriority(item.description || ""), // Convert string to proper enum value
      acceptanceCriteria: parseAcceptanceCriteria(item.acceptance_criteria), // Ensure we parse to string array
      additionalNotes: item.description,
      projectId: item.project_id,
      projectName: item.projects?.name,
      storyText: `As a ${item.persona}, I want to ${item.goal}, so that ${item.benefit}.`,
      createdAt: new Date(item.created_at),
      userId: item.user_id
    }));
  } catch (err) {
    console.error("Error fetching stories from Supabase:", err);
    throw err;
  }
};

// Helper function to safely parse acceptance criteria to string array
const parseAcceptanceCriteria = (criteria: Json | null): string[] => {
  if (!criteria) return [];
  
  try {
    // If it's already an array, map each item to string
    if (Array.isArray(criteria)) {
      return criteria.map(item => String(item));
    }
    
    // If it's a JSON string, parse it first
    if (typeof criteria === 'string') {
      try {
        const parsed = JSON.parse(criteria);
        if (Array.isArray(parsed)) {
          return parsed.map(item => String(item));
        }
      } catch (e) {
        // If not valid JSON, split by newlines or return as single item
        return criteria.includes('\n') 
          ? criteria.split('\n').filter(item => item.trim() !== '')
          : [criteria];
      }
    }
    
    // Fallback: return empty array
    return [];
  } catch (e) {
    console.error("Error parsing acceptance criteria:", e);
    return [];
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

// Get stories for a specific project
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
    const stories = data.map(item => ({
      id: item.id,
      role: item.persona,
      goal: item.goal,
      benefit: item.benefit,
      priority: determinePriority(item.description || ""), // Use helper function
      acceptanceCriteria: parseAcceptanceCriteria(item.acceptance_criteria), // Ensure we parse to string array
      additionalNotes: item.description,
      projectId: item.project_id,
      projectName: item.projects?.name,
      storyText: `As a ${item.persona}, I want to ${item.goal}, so that ${item.benefit}.`,
      createdAt: new Date(item.created_at),
      userId: item.user_id
    }));
    
    console.log(`Found ${stories.length} stories for ${projectId ? 'project ' + projectId : 'all projects'}`);
    
    return stories;
  } catch (error) {
    console.error("Error in getStoriesByProject:", error);
    throw error;
  }
};
