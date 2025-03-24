
import { UserStoryInputs } from "../story/types";

// Define the type for OpenAI API responses
export interface OpenAIResponse {
  text: string;
  success: boolean;
  error?: string;
}

export interface BulkStoriesResponse {
  stories: UserStoryInputs[];
  success: boolean;
  error?: string;
}
