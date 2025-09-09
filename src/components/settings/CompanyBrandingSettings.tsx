import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Palette, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCompanySettings } from '@/hooks/useCompanySettings';

export function CompanyBrandingSettings() {
  const { user } = useAuth();
  const { settings, loading } = useCompanySettings();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState(settings?.company_name || '');

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // Create file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-logo.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
        });

      if (uploadError) {
        // If bucket doesn't exist, create it
        if (uploadError.message.includes('not found')) {
          const { error: bucketError } = await supabase.storage.createBucket('company-assets', {
            public: true,
          });
          
          if (!bucketError) {
            // Retry upload
            const { error: retryError } = await supabase.storage
              .from('company-assets')
              .upload(filePath, file, {
                upsert: true,
                cacheControl: '3600',
              });
              
            if (retryError) throw retryError;
          }
        } else {
          throw uploadError;
        }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(filePath);

      // Update company details with logo URL
      const { error: updateError } = await supabase
        .from('company_details')
        .upsert({
          user_id: user.id,
          logo_url: publicUrl,
        });

      if (updateError) throw updateError;

      setLogoPreview(publicUrl);
      
      toast({
        title: 'Success',
        description: 'Logo uploaded successfully',
      });

      // Reload page to update logo everywhere
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload logo',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCompanyName = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('company_details')
        .upsert({
          user_id: user.id,
          company_name: companyName,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Company name updated successfully',
      });

      // Reload to update company name everywhere
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error saving company name:', error);
      toast({
        title: 'Error',
        description: 'Failed to save company name',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('company_details')
        .upsert({
          user_id: user.id,
          logo_url: null,
        });

      if (error) throw error;

      setLogoPreview(null);
      
      toast({
        title: 'Success',
        description: 'Logo removed successfully',
      });

      // Reload page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error removing logo:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove logo',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Company Branding
          </CardTitle>
          <CardDescription>
            Customize your company's branding across the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <div className="flex gap-2">
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
                className="flex-1"
              />
              <Button 
                onClick={handleSaveCompanyName}
                disabled={saving || !companyName || companyName === settings?.company_name}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This name will appear on invoices, estimates, and other documents
            </p>
          </div>

          {/* Logo Upload */}
          <div className="space-y-4">
            <Label>Company Logo</Label>
            
            {/* Current Logo Preview */}
            {(logoPreview || settings?.logo_url) && (
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={logoPreview || settings?.logo_url}
                      alt="Company logo"
                      className="h-16 w-auto object-contain"
                    />
                    <div>
                      <p className="text-sm font-medium">Current Logo</p>
                      <p className="text-xs text-muted-foreground">
                        Displayed in header and documents
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveLogo}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="hidden"
                  id="logo-upload"
                />
                <Label
                  htmlFor="logo-upload"
                  className="cursor-pointer"
                >
                  <Button
                    asChild
                    disabled={uploading}
                    variant="outline"
                  >
                    <span>
                      {uploading ? (
                        <>Uploading...</>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </>
                      )}
                    </span>
                  </Button>
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Recommended: PNG or SVG, minimum 200x50px
              </p>
            </div>
          </div>

          {/* Theme Notice */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex gap-3">
              <Image className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Logo Display</p>
                <p className="text-sm text-muted-foreground">
                  Your logo will automatically adapt to light and dark themes. 
                  For best results, upload a logo with transparent background.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}