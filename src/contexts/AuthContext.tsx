import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { checkTrialStatus, UserProfile } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { R } from '@/routes/routeMap';

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
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }

      console.log('Profile data:', data);

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
          console.log('Trial expired, redirecting to upgrade');
          toast.error('Your free trial has expired. Please upgrade to continue.');
          navigate(R.upgrade);
        }
      }

      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Don't block login if profile fetch fails
      setProfile(null);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Clear any stale session first
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            // Verify session is still valid
            const { data: { user: validUser } } = await supabase.auth.getUser();
            if (validUser) {
              setUser(session.user);
              await fetchProfile(session.user.id);
            } else {
              // Session is invalid, clear it
              await supabase.auth.signOut();
              setUser(null);
              setProfile(null);
            }
          } else {
            setUser(null);
            setProfile(null);
          }
          // Always set loading to false after checking session
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        setUser(session.user);
        // Use setTimeout to avoid potential deadlock
        setTimeout(() => {
          if (mounted) fetchProfile(session.user.id);
        }, 0);
      } else {
        setUser(null);
        setProfile(null);
      }
      // Ensure loading is false after auth state change
      if (mounted) setLoading(false);
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

      if (error) {
        // Check if the error is because user already exists
        if (error.message?.toLowerCase().includes('already registered') || 
            error.message?.toLowerCase().includes('already exists') ||
            error.message?.toLowerCase().includes('user already registered')) {
          toast.error('You already have an account. Please sign in instead.');
          // Redirect to login page after a short delay
          setTimeout(() => navigate(R.login), 1500);
          throw new Error('User already exists');
        }
        throw error;
      }

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

        if (profileError) {
          // Check if profile already exists
          if (profileError.code === '23505') { // Duplicate key error
            toast.info('Welcome back! Redirecting to dashboard...');
            navigate(R.dashboard);
            return;
          }
          throw profileError;
        }

        toast.success('Welcome to FireBuild! Your 30-day free trial has started.');
        navigate(R.dashboard);
      }
    } catch (error: any) {
      if (error.message !== 'User already exists') {
        toast.error(error.message || 'Failed to sign up');
      }
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
      navigate(R.dashboard);
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
      navigate(R.home);
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