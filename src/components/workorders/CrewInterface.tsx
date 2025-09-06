import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  Camera, 
  Upload,
  AlertTriangle,
  Users,
  Clipboard,
  Phone,
  Package,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { WorkOrderItem } from '@/types/workflow';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CrewInterfaceProps {
  accessToken: string; // From QR code or URL
}

export default function CrewInterface({ accessToken }: CrewInterfaceProps) {
  const [workOrder, setWorkOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentReport, setCurrentReport] = useState<any>({
    completedAt: new Date(),
    notes: '',
    laborHours: 0,
    materialsUsed: [],
    photos: [],
    signatures: []
  });
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [crewMembers, setCrewMembers] = useState<string[]>([]);
  const [crewMemberName, setCrewMemberName] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkOrder();
  }, [accessToken]);

  const fetchWorkOrder = async () => {
    try {
      setLoading(true);
      
      // Call the database function to get work order by token
      const { data, error } = await supabase
        .rpc('get_work_order_by_token', { p_token: accessToken });

      if (error || !data) {
        throw new Error('Invalid or expired token');
      }
      
      const workOrderData = data as any;
      setWorkOrder(workOrderData.work_order);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching work order:', error);
      toast({
        title: "Access Error",
        description: "Invalid or expired crew link. Please contact the office.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const toggleItemCompletion = (itemId: string) => {
    setCompletedItems(prev => {
      const isCompleted = prev.includes(itemId);
      return isCompleted 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
    });
  };

  const addCrewMember = () => {
    if (crewMemberName.trim()) {
      setCrewMembers(prev => [...prev, crewMemberName.trim()]);
      setCrewMemberName('');
    }
  };

  const removeCrewMember = (index: number) => {
    setCrewMembers(prev => prev.filter((_, i) => i !== index));
  };

  const submitFieldReport = async () => {
    if (!workOrder || !submitterName) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and complete required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Build the materials used array from crew report
      const materialsUsed = completedItems.map(itemId => ({
        item_id: itemId,
        quantity_used: 1,
        notes: ''
      }));

      // Build signatures array
      const signatures = submitterName ? [{
        name: submitterName,
        role: 'crew_lead',
        signed_at: new Date().toISOString()
      }] : [];

      // Submit the report using the database function
      const { data, error } = await supabase.rpc('submit_work_order_report', {
        p_token: accessToken,
        p_notes: `Crew: ${crewMembers.join(', ')}\n${currentReport.notes}`,
        p_labor_hours: currentReport.laborHours || 0,
        p_materials_used: materialsUsed,
        p_photos: currentReport.photos || [],
        p_signatures: signatures
      });

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "Your field report has been sent to the office for review."
      });

      // Reset form
      setCurrentReport({
        completedAt: new Date(),
        notes: '',
        laborHours: 0,
        materialsUsed: [],
        photos: [],
        signatures: []
      });
      setCompletedItems([]);
      setCrewMembers([]);
      setSubmitterName('');

      // Refresh work order
      fetchWorkOrder();

    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading work order...</p>
        </div>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              Invalid or expired crew link. Please contact the office for a new link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Parse work order items if they exist
  const workOrderItems = workOrder.items || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{workOrder.title}</h1>
            <p className="text-primary-foreground/80 text-sm flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {workOrder.service_address}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary-foreground/80">Work Order</p>
            <p className="font-semibold">#{workOrder.id?.slice(0, 8)}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-4xl mx-auto">
        {/* Work Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Tasks to Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workOrderItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No tasks have been assigned yet.
              </p>
            ) : (
              workOrderItems.map((item: any) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={completedItems.includes(item.id)}
                      onCheckedChange={() => toggleItemCompletion(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.description}</h4>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Qty: {item.quantity || 1}</span>
                        {item.unit && <span>Unit: {item.unit}</span>}
                        <Badge variant="outline" className="text-xs">
                          {item.kind || 'task'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Field Report Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clipboard className="h-5 w-5" />
              Daily Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Crew Leader Name */}
            <div>
              <Label htmlFor="submittedBy">Your Name (Crew Leader) *</Label>
              <Input
                id="submittedBy"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Hours Worked */}
            <div>
              <Label htmlFor="laborHours">Hours Worked Today</Label>
              <Input
                id="laborHours"
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={currentReport.laborHours || ''}
                onChange={(e) => setCurrentReport((prev: any) => ({ 
                  ...prev, 
                  laborHours: parseFloat(e.target.value) || 0 
                }))}
                placeholder="8.0"
              />
            </div>

            {/* Crew Members */}
            <div>
              <Label>Crew Members Today</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={crewMemberName}
                  onChange={(e) => setCrewMemberName(e.target.value)}
                  placeholder="Add crew member name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCrewMember();
                    }
                  }}
                />
                <Button type="button" onClick={addCrewMember} size="sm">
                  Add
                </Button>
              </div>
              {crewMembers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {crewMembers.map((member, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer" 
                      onClick={() => removeCrewMember(index)}
                    >
                      {member} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes, Issues, or Requests</Label>
              <Textarea
                id="notes"
                value={currentReport.notes || ''}
                onChange={(e) => setCurrentReport((prev: any) => ({ 
                  ...prev, 
                  notes: e.target.value 
                }))}
                placeholder="Any problems, delays, material shortages, or change requests..."
                rows={4}
              />
            </div>

            {/* Progress Summary */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tasks Completed Today</span>
                <Badge variant={completedItems.length > 0 ? "default" : "secondary"}>
                  {completedItems.length} of {workOrderItems.length}
                </Badge>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={submitFieldReport} 
              className="w-full"
              disabled={!submitterName || completedItems.length === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Daily Report
            </Button>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-destructive">
              <Phone className="h-5 w-5" />
              <div>
                <p className="font-medium">Office Contact</p>
                <p className="text-sm">For emergencies or questions: (613) 123-4567</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}