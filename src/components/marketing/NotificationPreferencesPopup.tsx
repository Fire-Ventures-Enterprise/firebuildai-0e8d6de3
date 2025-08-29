import { useState, useEffect } from 'react';
import { X, Bell, Mail, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const NotificationPreferencesPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [emailReminder, setEmailReminder] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user has already set preferences
    const hasSetPreferences = localStorage.getItem('notificationPreferencesSet');
    const hasClosedPopup = sessionStorage.getItem('notificationPopupClosed');
    
    // Show popup after 3 seconds if not set and not closed in this session
    if (!hasSetPreferences && !hasClosedPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Get user's browser info
      const userAgent = navigator.userAgent;
      
      // Request browser notifications permission if enabled
      if (browserNotifications && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          setBrowserNotifications(false);
          toast.info('Browser notifications were not enabled');
        }
      }
      
      const { error } = await supabase
        .from('notification_preferences')
        .insert({
          email_reminders: emailReminder,
          browser_notifications: browserNotifications,
          sms_notifications: smsNotifications,
          source_page: 'homepage',
          user_agent: userAgent
        });

      if (error && error.code !== '23505') {
        throw error;
      }
      
      localStorage.setItem('notificationPreferencesSet', 'true');
      toast.success('Your notification preferences have been saved!');
      setIsVisible(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    sessionStorage.setItem('notificationPopupClosed', 'true');
    setIsVisible(false);
  };

  const handleBannerAction = () => {
    // Open calendar scheduling link or modal
    window.open('https://calendly.com/firebuildai/consultation', '_blank');
    setShowBanner(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-lg">
        {/* Top Banner */}
        {showBanner && (
          <div className="mb-4 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-lg p-3 flex items-center justify-between animate-in slide-in-from-top-5">
            <span className="text-sm font-medium">
              Hey there, you're eligible for a free consultation!
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleBannerAction}
                className="bg-background text-foreground hover:bg-background/90"
              >
                <Calendar className="w-3 h-3 mr-1" />
                Pick a time!
              </Button>
              <button
                onClick={() => setShowBanner(false)}
                className="p-1 hover:bg-primary-foreground/10 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Popup */}
        <div className="bg-card border border-border rounded-xl shadow-2xl animate-in slide-in-from-bottom-5">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Get notifications about your trial!</h2>
              <p className="text-muted-foreground">
                Receive clear trial reminders, helpful updates, and relevant offers.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {/* Email Reminder */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      5th-Day Reminder Email
                      <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                        Required
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get reminded before your trial ends
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailReminder}
                  onCheckedChange={setEmailReminder}
                  disabled
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {/* Browser Notifications */}
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Browser Notifications</div>
                    <p className="text-sm text-muted-foreground">
                      Real-time updates in your browser
                    </p>
                  </div>
                </div>
                <Switch
                  checked={browserNotifications}
                  onCheckedChange={setBrowserNotifications}
                  disabled={isSubmitting}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      SMS
                      <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Text updates to your phone
                    </p>
                  </div>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                  disabled={isSubmitting}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save and Continue'}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Your trust matters to us. We'll only send trial updates and offers worth your time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};