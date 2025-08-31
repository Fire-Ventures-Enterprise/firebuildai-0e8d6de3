import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star, Globe, Facebook, MessageCircle } from 'lucide-react';

interface ReviewRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: any;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
}

export function ReviewRequestDialog({
  isOpen,
  onClose,
  invoice,
  customerId,
  customerName,
  customerEmail
}: ReviewRequestDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const [reviewPlatforms, setReviewPlatforms] = useState({
    google: '',
    facebook: '',
    yelp: '',
    custom: ''
  });
  const [customPlatformName, setCustomPlatformName] = useState('');

  useEffect(() => {
    loadReviewPlatforms();
  }, []);

  const loadReviewPlatforms = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('review_platforms')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setReviewPlatforms({
        google: data.google_business_url || '',
        facebook: data.facebook_page_url || '',
        yelp: data.yelp_business_url || '',
        custom: data.custom_platform_url || ''
      });
      setCustomPlatformName(data.custom_platform_name || '');
      setCustomMessage(data.default_message || '');
    }
  };

  const handleSendRequest = async () => {
    if (!customerEmail) {
      toast({
        title: 'Error',
        description: 'Customer email is required to send review request',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create review request record
      const { data: reviewRequest, error } = await supabase
        .from('review_requests')
        .insert({
          user_id: user.id,
          customer_id: customerId,
          invoice_id: invoice?.id,
          customer_name: customerName || 'Customer',
          customer_email: customerEmail,
          status: 'sent',
          sent_at: new Date().toISOString(),
          google_review_url: reviewPlatforms.google,
          facebook_review_url: reviewPlatforms.facebook,
          yelp_review_url: reviewPlatforms.yelp,
          custom_review_url: reviewPlatforms.custom
        })
        .select()
        .single();

      if (error) throw error;

      if (sendEmail) {
        // Send email via edge function
        const { error: emailError } = await supabase.functions.invoke('send-review-request', {
          body: {
            to: customerEmail,
            customerName: customerName || 'Valued Customer',
            reviewLinks: {
              google: reviewPlatforms.google,
              facebook: reviewPlatforms.facebook,
              yelp: reviewPlatforms.yelp,
              custom: reviewPlatforms.custom,
              customName: customPlatformName
            },
            customMessage,
            requestId: reviewRequest.id
          }
        });

        if (emailError) {
          console.error('Failed to send email:', emailError);
          toast({
            title: 'Review Request Created',
            description: 'Request saved but email notification failed. You can manually share the review links.',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Review Request Sent!',
            description: `Review request has been sent to ${customerEmail}`,
          });
        }
      } else {
        toast({
          title: 'Review Request Created',
          description: 'Review request has been saved. You can manually share the review links.',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error sending review request:', error);
      toast({
        title: 'Error',
        description: 'Failed to send review request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Customer Review</DialogTitle>
          <DialogDescription>
            Send a review request to {customerName || 'your customer'} to help build your online reputation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Customer Details</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{customerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{customerEmail || 'N/A'}</p>
              </div>
            </div>
          </div>

          {invoice && (
            <div className="space-y-2">
              <Label>Related Invoice</Label>
              <p className="text-sm">Invoice #{invoice.invoice_number} - ${invoice.total}</p>
            </div>
          )}

          <div className="space-y-4">
            <Label>Review Platforms</Label>
            <div className="space-y-3">
              {reviewPlatforms.google && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">Google Business</span>
                  <Star className="h-4 w-4 text-yellow-500 ml-auto" />
                </div>
              )}
              {reviewPlatforms.facebook && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Facebook className="h-4 w-4" />
                  <span className="text-sm font-medium">Facebook</span>
                  <Star className="h-4 w-4 text-yellow-500 ml-auto" />
                </div>
              )}
              {reviewPlatforms.yelp && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Yelp</span>
                  <Star className="h-4 w-4 text-yellow-500 ml-auto" />
                </div>
              )}
              {reviewPlatforms.custom && customPlatformName && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">{customPlatformName}</span>
                  <Star className="h-4 w-4 text-yellow-500 ml-auto" />
                </div>
              )}
            </div>
            {!reviewPlatforms.google && !reviewPlatforms.facebook && !reviewPlatforms.yelp && !reviewPlatforms.custom && (
              <p className="text-sm text-muted-foreground">
                No review platforms configured. Go to Settings → Review Platforms to set up your review links.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Custom Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message to include in the review request..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="send-email" className="cursor-pointer">
              Send email notification
            </Label>
            <Switch
              id="send-email"
              checked={sendEmail}
              onCheckedChange={setSendEmail}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendRequest} 
            disabled={isLoading || !customerEmail}
          >
            {isLoading ? 'Sending...' : 'Send Review Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}