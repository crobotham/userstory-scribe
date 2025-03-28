
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { config } from '@/config/environments';

const SUPABASE_URL = config.supabaseUrl;
const SUPABASE_PUBLISHABLE_KEY = config.supabaseKey;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
