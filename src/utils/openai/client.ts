
import { supabase } from "@/integrations/supabase/client";
import { OpenAIResponse } from "./types";

interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
}

/**
 * Makes a request to the OpenAI API through our secure edge function
 */
export async function callOpenAI(
  endpoint: 'chat' | 'embeddings',
  payload: ChatCompletionRequest
): Promise<any> {
  try {
    console.log('Calling OpenAI via edge function:', endpoint);
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: {
        endpoint,
        payload
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Error calling OpenAI service');
    }

    if (!data) {
      console.error('No data returned from OpenAI proxy');
      throw new Error('No data received from OpenAI service');
    }

    return data;
  } catch (error) {
    console.error('OpenAI client error:', error);
    throw error;
  }
}

/**
 * Generate text using OpenAI's chat completion
 */
export async function generateOpenAICompletion(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<OpenAIResponse> {
  try {
    const { model = "gpt-4o-mini", maxTokens = 500, temperature = 0.7 } = options;
    
    console.log('Generating OpenAI completion with model:', model);
    
    const response = await callOpenAI('chat', {
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: maxTokens,
      temperature
    });

    if (!response || !response.choices || response.choices.length === 0) {
      console.error('Invalid response format from OpenAI:', response);
      throw new Error('Invalid response format from OpenAI');
    }

    return {
      text: response.choices[0].message.content.trim(),
      success: true
    };
  } catch (error) {
    console.error("OpenAI completion error:", error);
    return {
      text: "",
      success: false,
      error: error.message || "Failed to generate completion"
    };
  }
}
