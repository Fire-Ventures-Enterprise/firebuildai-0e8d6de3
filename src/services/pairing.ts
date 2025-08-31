import { supabase } from "@/integrations/supabase/client";

export interface PairingLinkResponse {
  pairUrl: string;
  token: string;
  expiresAt: string;
}

export async function getMobilePairingLink(): Promise<PairingLinkResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("No active session");
  }

  const response = await supabase.functions.invoke('create-pairing-link', {
    body: {},
  });

  if (response.error) {
    throw response.error;
  }

  return response.data as PairingLinkResponse;
}

export async function markPairingUsed(token: string): Promise<void> {
  const { error } = await supabase
    .from('device_pairings')
    .update({ used_at: new Date().toISOString() })
    .eq('pairing_token', token);
  
  if (error) {
    console.error("Error marking pairing as used:", error);
  }
}