import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Globe, Facebook, MessageCircle, Save } from 'lucide-react';

export function ReviewPlatformSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [platforms, setPlatforms] = useState({
    google_business_url: '',
    facebook_page_url: '',
    yelp_business_url: '',
    custom_platform_name: '',
    custom_platform_url: '',
    default_message: '',
    auto_send_after_payment: false
  });

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('review_platforms')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setPlatforms(data);
      }
    } catch (error) {
      console.error('Error loading platforms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('review_platforms')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('review_platforms')
          .update({
            ...platforms,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('review_platforms')
          .insert({
            ...platforms,
            user_id: user.id
          });

        if (error) throw error;
      }

      toast({
        title: 'Settings Saved',
        description: 'Your review platform settings have been updated.',
      });
    } catch (error) {
      console.error('Error saving platforms:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Platform Settings</CardTitle>
        <CardDescription>
          Configure your business review links to automatically send to customers after completing work.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google">
              <Globe className="inline h-4 w-4 mr-2" />
              Google Business Review Link
            </Label>
            <Input
              id="google"
              placeholder="https://g.page/r/your-business/review"
              value={platforms.google_business_url}
              onChange={(e) => setPlatforms({ ...platforms, google_business_url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Find this in your Google Business Profile under "Get more reviews"
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">
              <Facebook className="inline h-4 w-4 mr-2" />
              Facebook Page Review Link
            </Label>
            <Input
              id="facebook"
              placeholder="https://facebook.com/your-page/reviews"
              value={platforms.facebook_page_url}
              onChange={(e) => setPlatforms({ ...platforms, facebook_page_url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yelp">
              <MessageCircle className="inline h-4 w-4 mr-2" />
              Yelp Business Review Link
            </Label>
            <Input
              id="yelp"
              placeholder="https://yelp.com/writeareview/biz/your-business"
              value={platforms.yelp_business_url}
              onChange={(e) => setPlatforms({ ...platforms, yelp_business_url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Custom Platform</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Platform name (e.g., HomeStars)"
                value={platforms.custom_platform_name}
                onChange={(e) => setPlatforms({ ...platforms, custom_platform_name: e.target.value })}
              />
              <Input
                placeholder="Review link"
                value={platforms.custom_platform_url}
                onChange={(e) => setPlatforms({ ...platforms, custom_platform_url: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Default Message Template</Label>
          <Textarea
            id="message"
            placeholder="Thank you for choosing us! We'd appreciate if you could take a moment to share your experience..."
            value={platforms.default_message}
            onChange={(e) => setPlatforms({ ...platforms, default_message: e.target.value })}
            rows={4}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-send" className="cursor-pointer">
              Auto-send after payment
            </Label>
            <p className="text-xs text-muted-foreground">
              Automatically send review requests when invoices are marked as paid
            </p>
          </div>
          <Switch
            id="auto-send"
            checked={platforms.auto_send_after_payment}
            onCheckedChange={(checked) => setPlatforms({ ...platforms, auto_send_after_payment: checked })}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
}