import * as React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { R } from "@/routes/routeMap";
import { Link } from "react-router-dom";

const STORAGE_KEY = "hideWorkOrdersHint";

export function WorkOrdersHint() {
  const [hidden, setHidden] = React.useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === "1"
  );

  if (hidden) return null;

  return (
    <Alert
      className="mb-4"
      data-testid="jobs-wo-hint"
      aria-live="polite"
    >
      <Info className="h-4 w-4" />
      <AlertDescription className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <span className="font-medium">Tip:</span>{" "}
          Use <span className="font-medium">Work Orders</span> to dispatch crews
          (no pricing). Generate a work order from a scheduled invoice, then share
          the crew link/QR.
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button asChild size="sm" variant="secondary">
            <Link to={R.workOrders}>Open Work Orders</Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "1");
              setHidden(true);
            }}
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}