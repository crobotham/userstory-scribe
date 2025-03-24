
import { UserStoryInputs } from "../story/types";

// Create specific prompts based on the current question
export function createPromptForQuestion(questionId: string, inputs: UserStoryInputs): string {
  const baseContext = `I'm creating a user story with the following information so far:\n${
    inputs.role ? `- Role: ${inputs.role}\n` : ""
  }${inputs.goal ? `- Goal: ${inputs.goal}\n` : ""}${
    inputs.benefit ? `- Benefit: ${inputs.benefit}\n` : ""
  }${inputs.priority ? `- Priority: ${inputs.priority}\n` : ""}`;

  switch (questionId) {
    case "role":
      return `${baseContext}Please suggest a specific user role for a software user story. Be concise and specific.`;
    
    case "goal":
      return `${baseContext}Based on the role "${inputs.role || "user"}", suggest a goal or action they want to accomplish. Be concise and specific.`;
    
    case "benefit":
      return `${baseContext}Based on the role "${inputs.role || "user"}" and their goal to "${inputs.goal || "accomplish something"}", what benefit would they receive? Be concise and specific.`;
    
    case "priority":
      return `${baseContext}Based on this user story information, suggest an appropriate priority (High, Medium, or Low). Only respond with one of these three options.`;
    
    case "acceptanceCriteria":
      return `${baseContext}Suggest 3-5 specific acceptance criteria for this user story. Each criterion should be clear and testable. Format as a list with each item on a new line.`;
    
    case "additionalNotes":
      return `${baseContext}Suggest any additional notes, constraints, or context that might be helpful for implementing this user story. Be concise.`;
    
    default:
      return `${baseContext}Please provide a suggestion for the next part of this user story.`;
  }
}
