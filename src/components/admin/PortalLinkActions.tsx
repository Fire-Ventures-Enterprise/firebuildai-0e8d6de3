import { Button } from '@/components/ui/button';
import { Send, Copy, Mail, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { downloadPdfFromNode } from '@/lib/pdf';
import { useAuth } from '@/contexts/AuthContext';

interface PortalLinkActionsProps {
  kind: 'estimate' | 'invoice';
  token: string;
  toEmail?: string;
  number: string;
  recordId?: string;
}

export function PortalLinkActions({ kind, token, toEmail, number, recordId }: PortalLinkActionsProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const portalUrl = `${window.location.origin}/portal/${kind}/${token}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portalUrl);
    toast({
      title: "Link Copied",
      description: `Portal link copied to clipboard`,
    });
  };

  const handleSendEmail = async () => {
    if (!recordId) {
      toast({
        title: "Error",
        description: "Cannot send email - record ID missing",
        variant: "destructive"
      });
      return;
    }

    try {
      // Update sent metadata
      const table = kind === 'estimate' ? 'estimates' : 'invoices_enhanced';
      
      // First get current sent_count
      const { data: currentData } = await supabase
        .from(table)
        .select('sent_count')
        .eq('id', recordId)
        .single();
      
      const currentSentCount = currentData?.sent_count || 0;
      
      const { error: updateError } = await supabase
        .from(table)
        .update({
          sent_at: new Date().toISOString(),
          sent_by: user?.id,
          last_sent_to: toEmail,
          sent_count: currentSentCount + 1,
          status: 'sent'
        })
        .eq('id', recordId);

      if (updateError) throw updateError;

      // Send email via edge function
      const functionName = kind === 'estimate' ? 'send-estimate-email' : 'send-invoice-notification';
      const { error: emailError } = await supabase.functions.invoke(functionName, {
        body: { 
          [`${kind}Id`]: recordId, 
          action: 'sent',
          recipientEmail: toEmail
        }
      });

      if (emailError) throw emailError;

      toast({
        title: "Email Sent",
        description: `${kind === 'estimate' ? 'Estimate' : 'Invoice'} #${number} sent to ${toEmail}`,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive"
      });
    }
  };

  const handleComposeEmail = () => {
    const subject = `${kind === 'estimate' ? 'Estimate' : 'Invoice'} #${number}`;
    const body = `Please review your ${kind} at the following link:\n\n${portalUrl}`;
    window.location.href = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleDownloadPDF = () => {
    const elementId = kind === 'estimate' ? 'estimate-print-root' : 'invoice-print-root';
    const filename = `${kind === 'estimate' ? 'Estimate' : 'Invoice'}_${number}.pdf`;
    downloadPdfFromNode(elementId, filename);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={handleSendEmail} variant="default" size="sm">
        <Send className="h-4 w-4 mr-2" />
        Send to Customer
      </Button>
      <Button onClick={handleCopyLink} variant="outline" size="sm">
        <Copy className="h-4 w-4 mr-2" />
        Copy Portal Link
      </Button>
      <Button onClick={handleComposeEmail} variant="outline" size="sm">
        <Mail className="h-4 w-4 mr-2" />
        Compose Email
      </Button>
      <Button onClick={handleDownloadPDF} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Download PDF
      </Button>
    </div>
  );
}