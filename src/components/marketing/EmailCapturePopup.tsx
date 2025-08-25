import { useState, useEffect } from 'react';
import { X, Shield, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const EmailCapturePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if user has already accepted terms
    const hasAccepted = localStorage.getItem('termsAccepted');
    const hasClosedPopup = sessionStorage.getItem('emailPopupClosed');
    
    // Show popup after 2 seconds if not accepted and not closed in this session
    if (!hasAccepted && !hasClosedPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user's browser info (no IP collection for privacy)
      const userAgent = navigator.userAgent;
      
      const { error } = await supabase
        .from('email_leads')
        .insert({
          email,
          accepted_terms: true,
          marketing_consent: marketingConsent,
          source_page: 'homepage',
          user_agent: userAgent
        });

      if (error) {
        if (error.code === '23505') {
          // Email already exists
          toast.info('You have already signed up!');
          localStorage.setItem('termsAccepted', 'true');
          setIsVisible(false);
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        localStorage.setItem('termsAccepted', 'true');
        toast.success('Welcome! Thank you for joining us.');
        
        // Close popup after success animation
        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving email:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    sessionStorage.setItem('emailPopupClosed', 'true');
    setIsVisible(false);
  };

  const handleAcceptWithoutEmail = () => {
    localStorage.setItem('termsAccepted', 'true');
    setIsVisible(false);
    toast.success('Terms accepted. Welcome!');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-md bg-card border border-border rounded-lg shadow-xl animate-in slide-in-from-bottom-5">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {!isSuccess ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">Welcome to FireBuildAI</h2>
              </div>

              <p className="text-muted-foreground mb-6">
                By continuing, you agree to our Terms of Service and Privacy Policy. 
                Stay updated with our latest features and exclusive offers!
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address (Optional)
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={marketingConsent}
                    onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="marketing"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Send me updates about new features and special offers
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Accept & Continue'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAcceptWithoutEmail}
                    disabled={isSubmitting}
                  >
                    Skip
                  </Button>
                </div>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                We respect your privacy and will never share your information.
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
              <p className="text-muted-foreground">
                Welcome to the FireBuildAI community!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};