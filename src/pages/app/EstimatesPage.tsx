// Estimates Page - Manage estimates and quotes
import { useState } from "react";
import { EstimateBuilder } from "@/components/estimates/EstimateBuilder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, Clock, DollarSign } from "lucide-react";

export const EstimatesPage = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [estimates, setEstimates] = useState<any[]>([]);

  const handleSaveEstimate = (data: any) => {
    console.log("Estimate saved:", data);
    setEstimates([...estimates, { ...data, id: Date.now() }]);
    setShowBuilder(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estimates</h1>
          <p className="text-muted-foreground mt-1">Create and manage project estimates</p>
        </div>
        <Button onClick={() => setShowBuilder(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Estimate
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Estimates</p>
              <p className="text-2xl font-semibold">{estimates.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-semibold">$0</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Estimates List */}
      {estimates.length > 0 ? (
        <Card className="p-6">
          <div className="space-y-4">
            {estimates.map((estimate) => (
              <div key={estimate.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{estimate.customerName}</h3>
                    <p className="text-sm text-muted-foreground">{estimate.projectDescription}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${estimate.total}</p>
                    <p className="text-sm text-muted-foreground">{estimate.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No estimates yet</h3>
            <p className="text-muted-foreground mb-4">Create your first estimate to get started</p>
            <Button onClick={() => setShowBuilder(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Estimate
            </Button>
          </div>
        </Card>
      )}

      {/* Estimate Builder Modal */}
      {showBuilder && (
        <EstimateBuilder
          open={showBuilder}
          onOpenChange={setShowBuilder}
          mode="create"
          onSave={handleSaveEstimate}
        />
      )}
    </div>
  );
};