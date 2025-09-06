import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SalesPublic } from "@/services/salesPublic";
import { EstimatePrint, BaseDoc } from "@/components/print/DocumentPrint";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { downloadPdfFromNode } from "@/lib/pdf";
import EnhancedSignaturePad from "@/components/estimates/EnhancedSignaturePad";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileSignature, CreditCard, Loader2 } from "lucide-react";

export default function EstimatePortalPage() {
  const { token } = useParams<{ token: string }>();
  const [est, setEst] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);

  const deposit = useMemo(() => est?.deposit_required ?? 0, [est]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const e = await SalesPublic.getEstimateByToken(token);
        setEst(e);
        await SalesPublic.markViewedEstimate(token);
      } catch (error) {
        console.error("Failed to load estimate:", error);
        toast.error("Failed to load estimate");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!est) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Estimate not found</p>
      </div>
    );
  }

  const handleSignatureSave = async (signatureData: string, agreedToTerms: boolean) => {
    try {
      // Get the customer name and email from the estimate
      const customerName = est.customer?.company_name || 
                          `${est.customer?.first_name || ''} ${est.customer?.last_name || ''}`.trim() ||
                          'Customer';
      const customerEmail = est.customer?.email || '';
      
      await SalesPublic.acceptEstimate(token!, { 
        name: customerName, 
        email: customerEmail,
        signature: signatureData,
        agreedToTerms 
      });
      
      toast.success("Estimate accepted and signed successfully!");
      setShowSignatureDialog(false);
      
      // Update local state to reflect acceptance
      setEst({ ...est, status: "accepted", signed_at: new Date().toISOString() });
    } catch (e) {
      console.error("Failed to accept estimate:", e);
      toast.error("Failed to accept estimate");
    }
  };

  const payDeposit = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('process-deposit', {
        body: {
          estimateToken: token,
          depositAmount: deposit,
          customerEmail: est.client?.email || est.customer?.email,
          estimateNumber: est.estimate_number
        }
      });

      if (error) throw error;
      
      // Redirect to Stripe checkout
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error processing deposit:', error);
      toast.error("Failed to process deposit payment");
    }
  };

  const getTermsText = () => {
    const contractName = est.contract_title || "Service Agreement";
    return `I have read and agree to all terms and conditions outlined in this estimate and the attached ${contractName}. I understand that by signing, I am authorizing the work to proceed as described.`;
  };

  // Transform estimate data to BaseDoc format
  const estimateDoc: Omit<BaseDoc, "kind"> = {
    number: est.estimate_number,
    date: format(new Date(est.issue_date), "MMM dd, yyyy"),
    dueDate: est.expiry_date ? format(new Date(est.expiry_date), "MMM dd, yyyy") : undefined,
    statusLabel: est.status?.toUpperCase() === "ACCEPTED" ? "ACCEPTED" : est.status?.toUpperCase() || "DRAFT",
    org: {
      name: est.company?.name || "Your Company",
      logoUrl: est.company?.logo_url,
      address: est.company?.address ? 
        `${est.company.address}${est.company.city ? `\n${est.company.city}, ${est.company.province || ""} ${est.company.postal_code || ""}` : ""}`.trim() : 
        undefined,
      phone: est.company?.phone,
      email: est.company?.email,
    },
    billTo: {
      name: est.customer?.company_name || `${est.customer?.first_name || ''} ${est.customer?.last_name || ''}`.trim() || "Customer",
      address: est.customer?.address ? 
        `${est.customer.address}${est.customer.city ? `\n${est.customer.city}, ${est.customer.state || ""} ${est.customer.zip_code || ""}` : ""}`.trim() :
        undefined,
      email: est.customer?.email,
      phone: est.customer?.phone,
    },
    items: (est.items || []).map((item: any, idx: number) => ({
      id: item.id || `item-${idx}`,
      title: item.item_name || item.description || "Item",
      description: item.description !== item.item_name ? item.description : undefined,
      quantity: item.quantity || 1,
      unit: item.unit,
      rate: item.rate || 0,
      total: item.amount || 0,
    })),
    subtotal: { currency: "USD", value: est.subtotal || 0 },
    discount: est.discount_amount ? { currency: "USD", value: est.discount_amount } : undefined,
    tax: est.tax_amount ? { currency: "USD", value: est.tax_amount } : undefined,
    total: { currency: "USD", value: est.total || 0 },
    notes: est.notes,
    terms: est.terms_conditions || est.terms || "Valid for 30 days. Deposit required to schedule. This document does not constitute a contract until accepted.",
    signatureLine: est.status !== "accepted",
  };

  const downloadPdf = async () => {
    try {
      await downloadPdfFromNode("estimate-print", `Estimate-${est.estimate_number}.pdf`);
      toast.success("Estimate downloaded successfully");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to download estimate");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Estimate #{est.estimate_number}</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={downloadPdf}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {est.status !== "accepted" ? (
              <Button onClick={() => setShowSignatureDialog(true)}>
                <FileSignature className="h-4 w-4 mr-2" />
                Review & Sign
              </Button>
            ) : deposit > 0 ? (
              <Button onClick={payDeposit}>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Deposit
              </Button>
            ) : null}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm" id="estimate-print">
          <EstimatePrint doc={estimateDoc} />
        </div>
      </div>

      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sign Estimate #{est.estimate_number}</DialogTitle>
            <DialogDescription>
              Please review the estimate details and provide your signature to accept the terms and conditions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Amount:</span>
                <span className="font-semibold">${est.total?.toFixed(2) || '0.00'}</span>
              </div>
              {deposit > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Deposit Required:</span>
                  <span className="font-semibold text-blue-600">${deposit.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium">Customer:</span>
                <span>{est.customer?.company_name || `${est.customer?.first_name || ''} ${est.customer?.last_name || ''}`.trim() || 'Customer'}</span>
              </div>
            </div>
            
            <EnhancedSignaturePad
              onSave={handleSignatureSave}
              requireTerms={true}
              termsText={getTermsText()}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>

      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sign Estimate #{est.estimate_number}</DialogTitle>
            <DialogDescription>
              Please review the estimate details and provide your signature to accept the terms and conditions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Amount:</span>
                <span className="font-semibold">${est.total?.toFixed(2) || '0.00'}</span>
              </div>
              {deposit > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Deposit Required:</span>
                  <span className="font-semibold text-blue-600">${deposit.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium">Customer:</span>
                <span>{est.customer?.company_name || `${est.customer?.first_name || ''} ${est.customer?.last_name || ''}`.trim() || 'Customer'}</span>
              </div>
            </div>
            
            <EnhancedSignaturePad
              onSave={handleSignatureSave}
              requireTerms={true}
              termsText={getTermsText()}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}