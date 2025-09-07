import { AppLayout } from '@/layouts/AppLayout';
import { BankIntegrationSettings } from '@/components/banking/BankIntegrationSettings';

export default function BankingSettingsPage() {
  return (
    <AppLayout>
      <BankIntegrationSettings />
    </AppLayout>
  );
}