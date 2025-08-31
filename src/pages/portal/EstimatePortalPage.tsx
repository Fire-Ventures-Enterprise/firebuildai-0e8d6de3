import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SalesPublic } from "@/services/salesPublic";
import { EstimatePrintExport } from "@/components/sales/EstimatePrintExport";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notify";
import EnhancedSignaturePad from "@/components/estimates/EnhancedSignaturePad";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
        notify.error("Failed to load estimate", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
  if (!est) return <div className="flex items-center justify-center min-h-screen">Estimate not found</div>;

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
      
      notify.success("Estimate accepted and signed successfully!");
      setShowSignatureDialog(false);
      
      // Update local state to reflect acceptance
      setEst({ ...est, status: "accepted", signed_at: new Date().toISOString() });
    } catch (e) {
      notify.error("Failed to accept estimate", e);
    }
  };

  const payDeposit = async () => {
    notify.info("Deposit payment feature coming soon. Please contact us to arrange payment.");
  };

  const getTermsText = () => {
    const contractName = est.contract_title || "Service Agreement";
    return `I have read and agree to all terms and conditions outlined in this estimate and the attached ${contractName}. I understand that by signing, I am authorizing the work to proceed as described.`;
  };

  return (
    <div className="max-w-[950px] mx-auto p-4 space-y-4">
      <EstimatePrintExport
        estimate={est}
        items={est.items ?? []}
        company={{ name: "FireBuildAI" }}
        contractTitle={est.contract_title ?? "Service Agreement"}
        watermarkText={est.status?.toUpperCase() === "ACCEPTED" ? "ACCEPTED" : "ESTIMATE"}
      />

      <div className="no-print border rounded p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Estimate #{est.estimate_number}</div>
            <div className="text-sm text-muted-foreground">
              Status: <span className="font-medium capitalize">{est.status}</span>
              {est.signed_at && (
                <span className="ml-2">• Signed on {new Date(est.signed_at).toLocaleDateString()}</span>
              )}
            </div>
          </div>
          <div>
            {est.status !== "accepted" ? (
              <Button 
                onClick={() => setShowSignatureDialog(true)}
                size="lg"
              >
                Review & Sign Estimate
              </Button>
            ) : (
              <div className="text-green-600 font-medium">✓ Estimate Accepted</div>
            )}
          </div>
        </div>

        {deposit > 0 && (
          <div className="flex items-center justify-between p-3 border rounded bg-muted/30">
            <div>
              <div className="font-medium">Deposit Required</div>
              <div className="text-sm text-muted-foreground">
                Amount due to secure scheduling: ${deposit.toFixed(2)}
              </div>
            </div>
            <Button 
              onClick={payDeposit}
              variant={est.status === "accepted" ? "default" : "secondary"}
              disabled={est.status !== "accepted"}
            >
              {est.status === "accepted" ? "Pay Deposit" : "Sign First"}
            </Button>
          </div>
        )}
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