import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewPlatformSettings } from '@/components/reviews/ReviewPlatformSettings';
import { MobilePairingQRCode } from '@/components/account/MobilePairingQRCode';
import { Settings, Star, Bell, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">Manage your application settings and preferences</p>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <ReviewPlatformSettings />
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Device Pairing</CardTitle>
              <CardDescription>
                Scan this QR code with your phone to sign in instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MobilePairingQRCode />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}