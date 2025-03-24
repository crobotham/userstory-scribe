
interface Environment {
  apiUrl: string;
  supabaseUrl: string;
  supabaseKey: string;
  appName: string;
}

type EnvironmentName = 'development' | 'staging' | 'production';

const environments: Record<EnvironmentName, Environment> = {
  development: {
    apiUrl: 'http://localhost:8080',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "https://rtkfehmdemjdslcwaxyi.supabase.co",
    supabaseKey: import.meta.env.VITE_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0a2ZlaG1kZW1qZHNsY3dheHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDE3NTYsImV4cCI6MjA1NzYxNzc1Nn0.jj7_L-Us-NrcyxdQzS4nSIo1wnZ2H_CznWpR0tRI0uA",
    appName: 'UserStory Scribe (Dev)',
  },
  staging: {
    apiUrl: 'https://staging.sonicstories.io',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "https://rtkfehmdemjdslcwaxyi.supabase.co",
    supabaseKey: import.meta.env.VITE_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0a2ZlaG1kZW1qZHNsY3dheHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDE3NTYsImV4cCI6MjA1NzYxNzc1Nn0.jj7_L-Us-NrcyxdQzS4nSIo1wnZ2H_CznWpR0tRI0uA",
    appName: 'UserStory Scribe (Staging)',
  },
  production: {
    apiUrl: 'https://userstory-scribe.lovable.app',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "https://rtkfehmdemjdslcwaxyi.supabase.co",
    supabaseKey: import.meta.env.VITE_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0a2ZlaG1kZW1qZHNsY3dheHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDE3NTYsImV4cCI6MjA1NzYxNzc1Nn0.jj7_L-Us-NrcyxdQzS4nSIo1wnZ2H_CznWpR0tRI0uA",
    appName: 'UserStory Scribe',
  },
};

// Determine the current environment based on URL or env variable
const getCurrentEnvironment = (): EnvironmentName => {
  const hostname = window.location.hostname;
  
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  } else if (hostname.includes('staging') || hostname.includes('sonicstories.io')) {
    return 'staging';
  } else {
    return 'production';
  }
};

const currentEnv = getCurrentEnvironment();
export const config = environments[currentEnv];
export const isProduction = currentEnv === 'production';
export const isStaging = currentEnv === 'staging';
export const isDevelopment = currentEnv === 'development';
