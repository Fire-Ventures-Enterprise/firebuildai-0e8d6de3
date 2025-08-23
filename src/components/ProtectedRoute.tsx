import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireActive?: boolean; // Require active trial or subscription
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireActive = true 
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireActive && profile) {
    // Check if trial is expired and user is not subscribed
    if (profile.trial_status === 'expired' && !profile.is_subscribed) {
      // Allow access to upgrade page
      if (location.pathname === '/upgrade') {
        return <>{children}</>;
      }
      // Redirect to upgrade page
      return <Navigate to="/upgrade" replace />;
    }
  }

  return <>{children}</>;
};