import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface WorkOrderPrintSheetProps {
  workOrder: any;
  items: any[];
  crewUrl: string;
}

export function WorkOrderPrintSheet({ workOrder, items, crewUrl }: WorkOrderPrintSheetProps) {
  const [qr, setQr] = useState<string>();
  
  useEffect(() => {
    (async () => {
      const qrCode = await QRCode.toDataURL(crewUrl, { width: 128, margin: 1 });
      setQr(qrCode);
    })();
  }, [crewUrl]);

  return (
    <div id="wo-sheet" className="wo-surface bg-white text-slate-900 p-8 max-w-[900px] mx-auto">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          #wo-sheet {
            page-break-inside: avoid;
          }
        }
        #wo-sheet.wo-surface {
          --background: 0 0% 100%;
          --foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96.1%;
          --muted-foreground: 215 16.3% 46.9%;
          --border: 214.3 31.8% 91.4%;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        #wo-sheet .table {
          width: 100%;
          border-collapse: collapse;
        }
        #wo-sheet .table th,
        #wo-sheet .table td {
          border: 1px solid hsl(var(--border));
          padding: 8px;
          text-align: left;
        }
        #wo-sheet .table th {
          background: hsl(var(--muted));
          font-weight: 600;
        }
      `,
        }}
      />
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Work Order</h1>
          <div className="space-y-1">
            <div className="text-lg font-medium">{workOrder.title}</div>
            {workOrder.starts_at && (
              <div className="text-sm text-slate-600">
                <strong>Schedule:</strong> {format(new Date(workOrder.starts_at), "PPP p")} - 
                {format(new Date(workOrder.ends_at), "p")}
              </div>
            )}
            {workOrder.service_address && (
              <div className="text-sm">
                <strong>Location:</strong> {workOrder.service_address}
              </div>
            )}
            {workOrder.team_id && (
              <div className="text-sm">
                <strong>Team:</strong> {workOrder.team_id}
              </div>
            )}
          </div>
        </div>
        
        {/* QR Code */}
        <div className="text-center">
          <div className="text-sm font-medium mb-1">Crew Access</div>
          {qr && <img src={qr} alt="Crew QR Code" className="inline-block border rounded" />}
          <div className="text-[10px] mt-1 max-w-[128px] break-all text-slate-600">{crewUrl}</div>
        </div>
      </div>

      {/* Scope Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Scope of Work</h3>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "100px" }}>Type</th>
              <th>Description</th>
              <th style={{ width: "80px" }}>Qty</th>
              <th style={{ width: "80px" }}>Unit</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td className="capitalize">{item.kind || "task"}</td>
                <td>{item.description}</td>
                <td className="text-center">{item.quantity || "-"}</td>
                <td>{item.unit || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Instructions */}
      {workOrder.instructions && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <div className="text-sm whitespace-pre-wrap p-3 bg-slate-50 rounded border border-slate-200">
            {workOrder.instructions}
          </div>
        </div>
      )}

      {/* Completion Section */}
      <div className="border-t pt-6 mt-8">
        <h3 className="text-lg font-semibold mb-3">Completion Report</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium mb-1">Labor Hours:</div>
            <div className="border border-slate-300 h-10 rounded"></div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Completed Date:</div>
            <div className="border border-slate-300 h-10 rounded"></div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm font-medium mb-1">Completion Notes:</div>
          <div className="border border-slate-300 h-24 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <div className="text-sm font-medium mb-1">Crew Signature:</div>
            <div className="border-b-2 border-slate-400 h-12"></div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Date:</div>
            <div className="border-b-2 border-slate-400 h-12"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 mt-8">
        Generated: {format(new Date(), "PPP p")} | No pricing information included
      </div>
    </div>
  );
}