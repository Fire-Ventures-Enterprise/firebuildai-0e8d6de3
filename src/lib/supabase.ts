import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Trial status types
export type TrialStatus = 'active' | 'expired' | 'suspended' | 'upgraded';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  trial_starts_at: string;
  trial_ends_at: string;
  trial_status: TrialStatus;
  is_subscribed: boolean;
  data_retention_until?: string;
  created_at: string;
  updated_at: string;
}

// Helper functions for trial management
export const checkTrialStatus = (trialEndsAt: string): TrialStatus => {
  const now = new Date();
  const trialEnd = new Date(trialEndsAt);
  
  if (now > trialEnd) {
    return 'expired';
  }
  return 'active';
};

export const getDaysRemaining = (trialEndsAt: string): number => {
  const now = new Date();
  const trialEnd = new Date(trialEndsAt);
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};