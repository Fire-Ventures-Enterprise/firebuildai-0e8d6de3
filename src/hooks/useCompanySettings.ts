import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentSettings {
  allow_admin_collect_card: boolean;
  allow_admin_qr_pay: boolean;
}

interface CompanySettings {
  payments: PaymentSettings;
  company_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
}

export function useCompanySettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CompanySettings>({
    payments: {
      allow_admin_collect_card: false,
      allow_admin_qr_pay: false,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("company_details")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          const paymentSettings = data.payment_settings as any;
          setSettings({
            payments: (paymentSettings && typeof paymentSettings === 'object') 
              ? paymentSettings 
              : {
                  allow_admin_collect_card: false,
                  allow_admin_qr_pay: false,
                },
            company_name: data.company_name,
            address: data.address,
            phone: data.phone,
            email: data.email,
            logo_url: data.logo_url,
          });
        }
      } catch (error) {
        console.error("Error fetching company settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const updatePaymentSettings = async (newSettings: Partial<PaymentSettings>) => {
    if (!user) return;

    const updatedPaymentSettings = {
      ...settings.payments,
      ...newSettings,
    };

    try {
      const { error } = await supabase
        .from("company_details")
        .upsert({
          user_id: user.id,
          payment_settings: updatedPaymentSettings,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings((prev) => ({
        ...prev,
        payments: updatedPaymentSettings,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error updating payment settings:", error);
      return { success: false, error };
    }
  };

  return {
    settings,
    loading,
    updatePaymentSettings,
  };
}