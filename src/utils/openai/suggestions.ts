
import { UserStoryInputs } from "../story/types";
import { OpenAIResponse } from "./types";
import { createPromptForQuestion } from "./prompts";
import { generateOpenAICompletion } from "./client";

export async function generateAISuggestion(
  questionId: string,
  allInputs: any,
  apiKey: string
): Promise<OpenAIResponse> {
  // We still accept the apiKey parameter for backward compatibility,
  // but we'll use the server-side API key via our edge function
  try {
    console.log(`Generating AI suggestion for question: ${questionId}`);
    
    // Handle different types of requests
    let prompt;
    let systemPrompt;
    
    if (questionId === "blog") {
      // For blog generation, use the direct prompt from inputs
      prompt = allInputs.prompt;
      systemPrompt = "You are an expert blog writer who creates well-structured, engaging content. Return your response in JSON format with title, summary, and content fields.";
    } else {
      // For user stories, use the existing function
      prompt = createPromptForQuestion(questionId, allInputs as UserStoryInputs);
      systemPrompt = "You are an assistant helping write user stories for software development. Provide concise, relevant suggestions based on the context. Keep suggestions brief and to the point.";
    }
    
    console.log(`Using system prompt: ${systemPrompt.substring(0, 50)}...`);
    
    const result = await generateOpenAICompletion(systemPrompt, prompt, {
      maxTokens: questionId === "blog" ? 1500 : 150,
    });
    
    if (!result.success) {
      console.error("Failed to generate AI suggestion:", result.error);
    }
    
    return result;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      text: "",
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect to OpenAI API"
    };
  }
}
