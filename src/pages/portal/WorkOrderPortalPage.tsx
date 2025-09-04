import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  MapPin, 
  Clock, 
  CheckCircle,
  FileText,
  Camera,
  Loader2,
  AlertCircle,
  Plus,
  X
} from "lucide-react";
import { format } from "date-fns";

interface WorkOrderData {
  work_order: {
    id: string;
    title: string;
    service_address?: string;
    starts_at: string;
    ends_at: string;
    instructions?: string;
    status: string;
  };
  items: Array<{
    id: string;
    kind: string;
    description: string;
    quantity: number;
    unit?: string;
  }>;
}

interface MaterialUsed {
  item: string;
  quantity: number;
  unit: string;
}

export default function WorkOrderPortalPage() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [workOrder, setWorkOrder] = useState<WorkOrderData | null>(null);
  
  // Form fields
  const [notes, setNotes] = useState("");
  const [laborHours, setLaborHours] = useState("");
  const [materialsUsed, setMaterialsUsed] = useState<MaterialUsed[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [signature, setSignature] = useState("");
  const [signatureName, setSignatureName] = useState("");

  useEffect(() => {
    if (token) {
      loadWorkOrder();
    }
  }, [token]);

  async function loadWorkOrder() {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_work_order_by_token' as any, {
        p_token: token
      });

      if (error || !data) {
        console.error('Error loading work order:', error);
        setWorkOrder(null);
      } else {
        setWorkOrder(data as WorkOrderData);
      }
    } catch (error) {
      console.error('Error:', error);
      setWorkOrder(null);
    } finally {
      setLoading(false);
    }
  }

  function addMaterial() {
    setMaterialsUsed([...materialsUsed, { item: "", quantity: 1, unit: "" }]);
  }

  function removeMaterial(index: number) {
    setMaterialsUsed(materialsUsed.filter((_, i) => i !== index));
  }

  function updateMaterial(index: number, field: keyof MaterialUsed, value: string | number) {
    const updated = [...materialsUsed];
    updated[index] = { ...updated[index], [field]: value };
    setMaterialsUsed(updated);
  }

  async function handleSubmit() {
    if (!workOrder || !token) return;

    if (!signatureName) {
      toast({
        title: "Signature Required",
        description: "Please provide your name for the signature",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      // Upload photos if any
      const photoUrls: string[] = [];
      for (const photo of photos) {
        // In production, upload to storage
        // For now, we'll skip actual upload
        photoUrls.push(URL.createObjectURL(photo));
      }

      // Submit report
      const { data, error } = await supabase.rpc('submit_work_order_report' as any, {
        p_token: token,
        p_notes: notes || null,
        p_labor_hours: laborHours ? parseFloat(laborHours) : 0,
        p_materials_used: materialsUsed.filter(m => m.item),
        p_photos: photoUrls.map(url => ({ url, label: "Field photo" })),
        p_signatures: [{
          name: signatureName,
          role: "Field Technician",
          image_url: signature || null,
          timestamp: new Date().toISOString()
        }]
      });

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "Thank you for submitting the field report"
      });

      // Show success state
      setWorkOrder(null);
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Work Order Not Found</h1>
        <p className="text-muted-foreground text-center">
          This link may have expired or the work order has already been completed.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{workOrder.work_order.title}</CardTitle>
            <CardDescription>Complete the work and submit your field report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workOrder.work_order.service_address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Service Address</p>
                  <p className="text-sm text-muted-foreground">{workOrder.work_order.service_address}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Schedule</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(workOrder.work_order.starts_at), 'PPP p')} - 
                  {format(new Date(workOrder.work_order.ends_at), 'p')}
                </p>
              </div>
            </div>
            {workOrder.work_order.instructions && (
              <div>
                <p className="text-sm font-medium mb-1">Instructions</p>
                <p className="text-sm text-muted-foreground">{workOrder.work_order.instructions}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks & Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks & Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workOrder.items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                  <Badge variant="outline" className="mt-0.5">
                    {item.kind}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} {item.unit || ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion Form */}
        <Card>
          <CardHeader>
            <CardTitle>Field Report</CardTitle>
            <CardDescription>Document the work completed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Completion Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe the work completed, any issues encountered, or additional notes..."
                rows={4}
              />
            </div>

            {/* Labor Hours */}
            <div className="space-y-2">
              <Label htmlFor="labor">Labor Hours</Label>
              <Input
                id="labor"
                type="number"
                step="0.5"
                min="0"
                value={laborHours}
                onChange={(e) => setLaborHours(e.target.value)}
                placeholder="0.0"
              />
            </div>

            {/* Materials Used */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Materials Used</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMaterial}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Material
                </Button>
              </div>
              <div className="space-y-2">
                {materialsUsed.map((material, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Material name"
                      value={material.item}
                      onChange={(e) => updateMaterial(index, 'item', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={material.quantity}
                      onChange={(e) => updateMaterial(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-20"
                    />
                    <Input
                      placeholder="Unit"
                      value={material.unit}
                      onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMaterial(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <Label htmlFor="photos">Photos</Label>
              <Input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setPhotos(Array.from(e.target.files || []))}
              />
              {photos.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {photos.length} photo(s) selected
                </p>
              )}
            </div>

            <Separator />

            {/* Signature */}
            <div className="space-y-2">
              <Label htmlFor="signature-name">Your Name (for signature)</Label>
              <Input
                id="signature-name"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
              <p className="text-xs text-muted-foreground">
                By providing your name, you confirm that the work has been completed as described.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={submitting || !signatureName}
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Field Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}