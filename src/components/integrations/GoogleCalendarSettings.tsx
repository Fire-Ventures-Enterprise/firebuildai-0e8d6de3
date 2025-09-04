import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  startGoogleOAuth,
  getGoogleAccount,
  disconnectGoogleAccount,
  selectGoogleCalendar,
  GoogleAccount
} from "@/services/googleCalendar";

export function GoogleCalendarSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [googleAccount, setGoogleAccount] = useState<GoogleAccount>({ connected: false });
  const [selectedCalendar, setSelectedCalendar] = useState<string>("");

  useEffect(() => {
    loadGoogleAccount();
    
    // Check if we just connected
    const params = new URLSearchParams(window.location.search);
    if (params.get('google_connected') === 'true') {
      toast({
        title: "Success",
        description: "Google Calendar connected successfully!",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loadGoogleAccount = async () => {
    setLoading(true);
    const account = await getGoogleAccount();
    setGoogleAccount(account);
    
    // Find selected calendar
    const selected = account.calendars?.find(c => c.is_selected);
    if (selected) {
      setSelectedCalendar(selected.calendar_id);
    }
    
    setLoading(false);
  };

  const handleConnect = async () => {
    setConnecting(true);
    const authUrl = await startGoogleOAuth();
    
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      toast({
        title: "Error",
        description: "Failed to start Google authorization",
        variant: "destructive",
      });
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    const success = await disconnectGoogleAccount();
    
    if (success) {
      toast({
        title: "Disconnected",
        description: "Google Calendar has been disconnected",
      });
      setGoogleAccount({ connected: false });
      setSelectedCalendar("");
    } else {
      toast({
        title: "Error",
        description: "Failed to disconnect Google Calendar",
        variant: "destructive",
      });
    }
  };

  const handleCalendarSelect = async (calendarId: string) => {
    setSelectedCalendar(calendarId);
    const success = await selectGoogleCalendar(calendarId);
    
    if (success) {
      toast({
        title: "Calendar Updated",
        description: "Default calendar has been updated",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update default calendar",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Google Calendar Integration
        </CardTitle>
        <CardDescription>
          Connect your Google Calendar to sync schedules and send invites
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!googleAccount.connected ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Not connected</p>
                <p className="text-sm text-muted-foreground">
                  Connect your Google Calendar to sync events and send invitations to attendees
                </p>
              </div>
            </div>
            
            <Button onClick={handleConnect} disabled={connecting} className="w-full sm:w-auto">
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Connect Google Calendar
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Connected</p>
                <p className="text-sm text-muted-foreground">
                  {googleAccount.account?.email}
                </p>
              </div>
            </div>

            {googleAccount.calendars && googleAccount.calendars.length > 0 && (
              <div className="space-y-3">
                <Label>Default Calendar</Label>
                <RadioGroup value={selectedCalendar} onValueChange={handleCalendarSelect}>
                  {googleAccount.calendars.map((calendar) => (
                    <div key={calendar.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={calendar.calendar_id} />
                      <Label className="font-normal cursor-pointer">
                        {calendar.summary}
                        {calendar.is_primary && (
                          <span className="ml-2 text-xs text-muted-foreground">(Primary)</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <Button onClick={handleDisconnect} variant="outline" className="w-full sm:w-auto">
              Disconnect Google Calendar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}