
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("OpenAI proxy function called");
    const { endpoint, payload } = await req.json();
    
    if (!openAIApiKey) {
      console.error("OpenAI API key not configured in environment variables");
      throw new Error('OpenAI API key not configured in environment variables');
    }

    // Determine which OpenAI endpoint to call
    let url = '';
    if (endpoint === 'chat') {
      url = 'https://api.openai.com/v1/chat/completions';
    } else if (endpoint === 'embeddings') {
      url = 'https://api.openai.com/v1/embeddings';
    } else {
      throw new Error('Invalid endpoint specified');
    }

    console.log(`Making request to OpenAI ${endpoint} endpoint with model: ${payload.model}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Error calling OpenAI API');
    }

    console.log('OpenAI response received successfully');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in openai-proxy function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error in OpenAI proxy function' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
