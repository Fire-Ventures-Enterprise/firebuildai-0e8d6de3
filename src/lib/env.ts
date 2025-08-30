import { z } from 'zod';

/**
 * Environment variable validation schema
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Supabase Configuration
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  
  // App Configuration
  VITE_APP_NAME: z.string().default('FireBuild.ai'),
  VITE_APP_URL: z.string().url().default('http://localhost:5173'),
  
  // Feature Flags
  VITE_ENABLE_ANALYTICS: z.boolean().default(false),
  VITE_ENABLE_DEMO_MODE: z.boolean().default(false),
  
  // Build Information
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Validates and exports environment variables
 * Throws error if required variables are missing
 */
export const env = (() => {
  try {
    return envSchema.parse({
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
      VITE_APP_URL: import.meta.env.VITE_APP_URL,
      VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      VITE_ENABLE_DEMO_MODE: import.meta.env.VITE_ENABLE_DEMO_MODE === 'true',
      NODE_ENV: import.meta.env.MODE,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      console.error(error.flatten().fieldErrors);
      
      // In development, log warnings but continue
      if (import.meta.env.MODE === 'development') {
        console.warn('⚠️ Running in development mode with missing environment variables');
        return {
          VITE_SUPABASE_URL: '',
          VITE_SUPABASE_ANON_KEY: '',
          VITE_APP_NAME: 'FireBuild.ai',
          VITE_APP_URL: 'http://localhost:5173',
          VITE_ENABLE_ANALYTICS: false,
          VITE_ENABLE_DEMO_MODE: false,
          NODE_ENV: 'development',
        };
      }
      
      throw new Error('Missing required environment variables');
    }
    throw error;
  }
})();

/**
 * Type-safe environment variable access
 */
export type Env = z.infer<typeof envSchema>;