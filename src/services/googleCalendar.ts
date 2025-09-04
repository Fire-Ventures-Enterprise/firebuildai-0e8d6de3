import { supabase } from "@/integrations/supabase/client";

export interface GoogleAccount {
  connected: boolean;
  account?: {
    email: string;
    id: string;
  };
  calendars?: Array<{
    id: string;
    account_id: string;
    calendar_id: string;
    summary: string;
    is_primary: boolean;
    is_selected: boolean;
  }>;
}

export async function startGoogleOAuth(): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('google-oauth-start');
    
    if (error) {
      console.error('Error starting OAuth:', error);
      return null;
    }
    
    return data.authUrl;
  } catch (error) {
    console.error('Error starting OAuth:', error);
    return null;
  }
}

export async function getGoogleAccount(): Promise<GoogleAccount> {
  try {
    const { data, error } = await supabase.functions.invoke('google-list-calendars');
    
    if (error) {
      console.error('Error fetching Google account:', error);
      return { connected: false };
    }
    
    return data as GoogleAccount;
  } catch (error) {
    console.error('Error fetching Google account:', error);
    return { connected: false };
  }
}

export async function disconnectGoogleAccount(): Promise<boolean> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return false;
    
    const { error } = await supabase
      .from('google_accounts')
      .delete()
      .eq('user_id', user.user.id);
    
    if (error) {
      console.error('Error disconnecting Google account:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error disconnecting Google account:', error);
    return false;
  }
}

export async function selectGoogleCalendar(calendarId: string): Promise<boolean> {
  try {
    const { data: account } = await supabase.functions.invoke('google-list-calendars');
    if (!account?.account?.id) return false;
    
    // First, deselect all calendars
    await supabase
      .from('google_calendars')
      .update({ is_selected: false })
      .eq('account_id', account.account.id);
    
    // Then select the chosen one
    const { error } = await supabase
      .from('google_calendars')
      .update({ is_selected: true })
      .eq('account_id', account.account.id)
      .eq('calendar_id', calendarId);
    
    if (error) {
      console.error('Error selecting calendar:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error selecting calendar:', error);
    return false;
  }
}

export async function syncEventToGoogle(eventId: string): Promise<{
  success: boolean;
  googleEventId?: string;
  htmlLink?: string;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('google-upsert-event', {
      body: { event_id: eventId }
    });
    
    if (error) {
      console.error('Error syncing to Google:', error);
      return { success: false };
    }
    
    return data;
  } catch (error) {
    console.error('Error syncing to Google:', error);
    return { success: false };
  }
}

export async function deleteGoogleEvent(eventId: string): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('google-delete-event', {
      body: { event_id: eventId }
    });
    
    if (error) {
      console.error('Error deleting from Google:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting from Google:', error);
    return false;
  }
}