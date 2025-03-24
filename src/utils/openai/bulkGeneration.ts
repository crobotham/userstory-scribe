
import { UserStoryInputs } from "../story/types";
import { BulkStoriesResponse } from "./types";
import { generateOpenAICompletion } from "./client";

export async function generateBulkUserStories(
  projectDescription: string,
  numberOfStories: number,
  apiKey: string
): Promise<BulkStoriesResponse> {
  // We still accept the apiKey parameter for backward compatibility,
  // but we'll use the server-side API key via our edge function
  
  if (numberOfStories < 1 || numberOfStories > 10) {
    return {
      stories: [],
      success: false,
      error: "Number of stories must be between 1 and 10"
    };
  }

  try {
    const systemPrompt = "You are an assistant helping generate user stories for software development. You always respond with valid JSON that exactly matches the requested format.";
    
    const prompt = `Generate ${numberOfStories} distinct user stories for the following project description:
    
${projectDescription}

For each user story, provide:
1. A specific user role
2. A clear goal they want to accomplish
3. The benefit they receive
4. A priority (High, Medium, or Low)
5. 3-4 acceptance criteria for the story

Format your response as a valid JSON array with each story having these properties: role, goal, benefit, priority, acceptanceCriteria (as an array of strings).
IMPORTANT: Make each story unique and focused on a different aspect of the project.`;

    const result = await generateOpenAICompletion(systemPrompt, prompt, {
      maxTokens: 2500,
    });
    
    if (!result.success) {
      return {
        stories: [],
        success: false,
        error: result.error || "Error generating stories"
      };
    }
    
    // Extract the JSON part from the response
    const content = result.text;
    const jsonMatch = content.match(/(\[.*\])/s);
    const jsonContent = jsonMatch ? jsonMatch[0] : content;
    
    try {
      const stories = JSON.parse(jsonContent) as UserStoryInputs[];
      
      // Ensure all stories have the required fields and format
      const validatedStories = stories.map(story => ({
        role: story.role || "",
        goal: story.goal || "",
        benefit: story.benefit || "",
        priority: (["High", "Medium", "Low"].includes(story.priority) ? story.priority : "Medium") as "High" | "Medium" | "Low",
        acceptanceCriteria: Array.isArray(story.acceptanceCriteria) ? story.acceptanceCriteria : [],
        additionalNotes: story.additionalNotes || ""
      }));
      
      return {
        stories: validatedStories.slice(0, numberOfStories),
        success: true
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      return {
        stories: [],
        success: false,
        error: "Failed to parse generated stories. Please try again."
      };
    }
  } catch (error) {
    console.error("OpenAI API bulk generation error:", error);
    return {
      stories: [],
      success: false,
      error: "Failed to connect to OpenAI API"
    };
  }
}
