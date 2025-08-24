import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { checkTrialStatus, UserProfile } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string, companyName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isTrialActive: boolean;
  daysRemaining: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      // Check trial status and update if needed
      if (data) {
        const status = checkTrialStatus(data.trial_ends_at);
        if (status !== data.trial_status) {
          // Update trial status in database
          await supabase
            .from('profiles')
            .update({ trial_status: status })
            .eq('id', userId);
          data.trial_status = status;
        }

        // If trial expired and not subscribed, redirect to upgrade
        if (status === 'expired' && !data.is_subscribed) {
          toast.error('Your free trial has expired. Please upgrade to continue.');
          navigate('/upgrade');
        }
      }

      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Sign up with 30-day free trial
  const signUp = async (email: string, password: string, fullName?: string, companyName?: string) => {
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile with trial information
        const trialStartDate = new Date();
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 30); // 30-day trial
        
        const dataRetentionDate = new Date();
        dataRetentionDate.setDate(dataRetentionDate.getDate() + 120); // 90 days after trial ends

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            company_name: companyName,
            trial_starts_at: trialStartDate.toISOString(),
            trial_ends_at: trialEndDate.toISOString(),
            trial_status: 'active',
            is_subscribed: false,
            data_retention_until: dataRetentionDate.toISOString(),
          });

        if (profileError) throw profileError;

        toast.success('Welcome to FireBuild! Your 30-day free trial has started.');
        navigate('/app/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  };

  // Sign in
  const signIn = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }

    if (data.user) {
      toast.success('Welcome back!');
      // The auth state listener will handle the rest
    }
  };

  // Sign out
  const signOut = async () => {
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  // Calculate days remaining in trial
  const daysRemaining = profile ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const isTrialActive = profile ? profile.trial_status === 'active' : false;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      isTrialActive,
      daysRemaining,
    }}>
      {children}
    </AuthContext.Provider>
  );
};