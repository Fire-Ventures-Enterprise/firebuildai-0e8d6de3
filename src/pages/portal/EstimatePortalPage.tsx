import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SalesPublic } from "@/services/salesPublic";
import { EstimatePrintExport } from "@/components/sales/EstimatePrintExport";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notify } from "@/lib/notify";

export default function EstimatePortalPage() {
  const { token } = useParams<{ token: string }>();
  const [est, setEst] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

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

  const onAccept = async () => {
    try {
      await SalesPublic.acceptEstimate(token!, { name, email });
      notify.success("Estimate accepted");
      // Update local flag
      setEst({ ...est, status: "accepted" });
    } catch (e) {
      notify.error("Failed to accept", e);
    }
  };

  const payDeposit = async () => {
    notify.info("Deposit payment feature coming soon. Please contact us to arrange payment.");
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
        <div className="text-sm opacity-70">
          Status: <span className="font-medium capitalize">{est.status}</span>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2 grid grid-cols-2 gap-2">
            <div>
              <Label>Your Name</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Smith" 
              />
            </div>
            <div>
              <Label>Your Email</Label>
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="john@example.com" 
              />
            </div>
          </div>
          <div className="flex items-end">
            <Button 
              className="w-full" 
              onClick={onAccept} 
              disabled={est.status === "accepted"}
            >
              Accept Estimate
            </Button>
          </div>
        </div>

        {deposit > 0 && (
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <div className="font-medium">Deposit Required</div>
              <div className="opacity-70 text-sm">
                Amount due to secure scheduling: ${deposit.toFixed(2)}
              </div>
            </div>
            <Button onClick={payDeposit}>Pay Deposit</Button>
          </div>
        )}
      </div>
    </div>
  );
}