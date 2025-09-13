import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, User, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MVPSettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    company_name: '',
    phone: '',
    email: '',
    website: '',
    logo_url: ''
  });
  const [profileData, setProfileData] = useState({
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      loadCompanyDetails();
    }
  }, [user]);

  const loadCompanyDetails = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('company_details')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setCompanyData({
          company_name: data.company_name || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          logo_url: data.logo_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading company details:', error);
    }
  };

  const handleCompanySave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('company_details')
        .upsert({
          user_id: user.id,
          ...companyData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company profile updated successfully"
      });
    } catch (error) {
      console.error('Error saving company details:', error);
      toast({
        title: "Error",
        description: "Failed to save company details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (profileData.password !== profileData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: profileData.password
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully"
      });
      
      setProfileData({
        ...profileData,
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company">
            <Building2 className="h-4 w-4 mr-2" />
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            User Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                Update your company information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={companyData.company_name}
                  onChange={(e) => setCompanyData(prev => ({ 
                    ...prev, 
                    company_name: e.target.value 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData(prev => ({ 
                    ...prev, 
                    phone: e.target.value 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_email">Email</Label>
                <Input
                  id="company_email"
                  type="email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData(prev => ({ 
                    ...prev, 
                    email: e.target.value 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={companyData.website}
                  onChange={(e) => setCompanyData(prev => ({ 
                    ...prev, 
                    website: e.target.value 
                  }))}
                />
              </div>

              <Button 
                onClick={handleCompanySave}
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Company Profile
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>User Account</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={profileData.password}
                  onChange={(e) => setProfileData(prev => ({ 
                    ...prev, 
                    password: e.target.value 
                  }))}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData(prev => ({ 
                    ...prev, 
                    confirmPassword: e.target.value 
                  }))}
                  placeholder="Confirm new password"
                />
              </div>

              <Button 
                onClick={handlePasswordChange}
                className="w-full" 
                disabled={loading || !profileData.password}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}