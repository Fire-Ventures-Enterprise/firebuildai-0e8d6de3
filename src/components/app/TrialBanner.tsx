import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrialBanner = () => {
  const { profile, isTrialActive, daysRemaining } = useAuth();

  if (!profile || profile.is_subscribed) {
    return null; // Don't show banner if subscribed
  }

  const isWarning = daysRemaining <= 7;
  const isDanger = daysRemaining <= 3;

  return (
    <Alert 
      className={`mb-4 ${
        isDanger ? 'border-destructive bg-destructive/10' : 
        isWarning ? 'border-yellow-500 bg-yellow-500/10' : 
        'border-primary bg-primary/10'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isDanger ? (
            <AlertTriangle className="w-5 h-5 text-destructive" />
          ) : (
            <Clock className="w-5 h-5 text-primary" />
          )}
          <AlertDescription className="text-sm font-medium">
            {isTrialActive ? (
              <>
                {isDanger ? 'Your trial expires in' : 'Free trial:'}{' '}
                <span className={isDanger ? 'text-destructive font-bold' : 'font-semibold'}>
                  {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                </span>
              </>
            ) : (
              <span className="text-destructive font-semibold">
                Your free trial has expired
              </span>
            )}
          </AlertDescription>
        </div>
        <Link to="/upgrade">
          <Button 
            size="sm" 
            variant={isDanger ? 'destructive' : isWarning ? 'default' : 'outline'}
          >
            Upgrade Now
          </Button>
        </Link>
      </div>
    </Alert>
  );
};