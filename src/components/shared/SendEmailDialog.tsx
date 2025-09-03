import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Eye, FileText } from "lucide-react";

interface SendEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: 'estimate' | 'invoice' | 'po';
  documentData: {
    id: string;
    number: string;
    token: string;
    customerName: string;
    customerEmail: string;
    subtotal: number;
    tax: number;
    total: number;
    deposit?: number;
    balance?: number;
    issueDate: string;
    dueDate?: string;
    expiryDate?: string;
    serviceAddress?: string;
  };
  companyData?: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
  };
  onSent?: () => void;
}

export function SendEmailDialog({
  open,
  onOpenChange,
  template,
  documentData,
  companyData,
  onSent
}: SendEmailDialogProps) {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [toEmail, setToEmail] = useState(documentData.customerEmail);
  const [ccEmail, setCcEmail] = useState("");
  const [bccEmail, setBccEmail] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [includePdf, setIncludePdf] = useState(false);
  const [includePortalLink, setIncludePortalLink] = useState(true);

  const getDefaultSubject = () => {
    switch (template) {
      case 'estimate':
        return `Estimate ${documentData.number} from ${companyData?.name || 'FireBuild.ai'}`;
      case 'invoice':
        return `Invoice ${documentData.number} - Due ${documentData.dueDate || 'on receipt'}`;
      case 'po':
        return `Purchase Order ${documentData.number} from ${companyData?.name || 'FireBuild.ai'}`;
      default:
        return `Document ${documentData.number}`;
    }
  };

  const [subject, setSubject] = useState(getDefaultSubject());

  const handleSend = async () => {
    if (!toEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a recipient email address",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      const payload: any = {
        ...documentData,
        companyName: companyData?.name,
        companyEmail: companyData?.email,
        companyPhone: companyData?.phone,
        companyAddress: companyData?.address,
        logoUrl: companyData?.logoUrl,
        customMessage,
        qrPayEnabled: template === 'invoice' // Enable QR pay for invoices
      };

      // Add vendor-specific fields for PO
      if (template === 'po') {
        payload.vendorName = documentData.customerName;
        payload.vendorEmail = documentData.customerEmail;
        payload.poNumber = documentData.number;
      }

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          template,
          ref_id: documentData.id,
          to: toEmail,
          cc: ccEmail ? ccEmail.split(',').map(e => e.trim()) : [],
          bcc: bccEmail ? bccEmail.split(',').map(e => e.trim()) : [],
          subject,
          payload,
          skipQueue: false // Queue for batch processing
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: `${template === 'estimate' ? 'Estimate' : template === 'invoice' ? 'Invoice' : 'Purchase Order'} sent successfully to ${toEmail}`
      });

      onOpenChange(false);
      onSent?.();
    } catch (error: any) {
      console.error('Failed to send email:', error);
      toast({
        title: "Failed to Send",
        description: error.message || "An error occurred while sending the email",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Send {template === 'estimate' ? 'Estimate' : template === 'invoice' ? 'Invoice' : 'Purchase Order'}
          </DialogTitle>
          <DialogDescription>
            Send {documentData.number} via email with a secure portal link
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="to">To *</Label>
              <Input
                id="to"
                type="email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="customer@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="cc">CC</Label>
              <Input
                id="cc"
                type="text"
                value={ccEmail}
                onChange={(e) => setCcEmail(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
              />
            </div>

            <div>
              <Label htmlFor="bcc">BCC</Label>
              <Input
                id="bcc"
                type="text"
                value={bccEmail}
                onChange={(e) => setBccEmail(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add a personalized message to your customer..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="portal"
                checked={includePortalLink}
                onCheckedChange={(checked) => setIncludePortalLink(!!checked)}
              />
              <Label htmlFor="portal" className="cursor-pointer">
                Include secure portal link
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pdf"
                checked={includePdf}
                onCheckedChange={(checked) => setIncludePdf(!!checked)}
              />
              <Label htmlFor="pdf" className="cursor-pointer">
                Attach PDF (coming soon)
              </Label>
            </div>
          </div>

          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="text">
                <FileText className="mr-2 h-4 w-4" />
                Plain Text
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              <div className="rounded-lg border p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Email preview will render with your company branding, document details, and action buttons.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="text" className="mt-4">
              <div className="rounded-lg border p-4 bg-muted/30">
                <pre className="text-xs whitespace-pre-wrap">
{`${subject}

Hi ${documentData.customerName},

${customMessage || `Your ${template} is ready for review.`}

Document: ${documentData.number}
Amount: $${documentData.total.toFixed(2)}
${documentData.dueDate ? `Due: ${documentData.dueDate}` : ''}

View online: [Secure Portal Link]

${companyData?.name || 'FireBuild.ai'}
${companyData?.phone || ''}
${companyData?.email || ''}`}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending || !toEmail}>
            {sending ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}