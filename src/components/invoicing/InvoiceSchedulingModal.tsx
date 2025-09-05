import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedInvoice } from "@/types/enhanced-invoice";
import { upsertInvoiceSchedule } from "@/services/scheduling";
import { format } from "date-fns";

interface Team {
  id: string;
  name: string;
}

interface InvoiceSchedulingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: EnhancedInvoice;
  onScheduleComplete?: () => void;
}

export function InvoiceSchedulingModal({ 
  open, 
  onOpenChange, 
  invoice,
  onScheduleComplete 
}: InvoiceSchedulingModalProps) {
  const [loading, setLoading] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [teamId, setTeamId] = useState<string | undefined>();
  const [notes, setNotes] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (open) {
      loadTeams();
      // Set default times (tomorrow 9 AM to 5 PM)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setStartsAt(format(tomorrow, "yyyy-MM-dd'T'HH:mm"));
      tomorrow.setHours(17, 0, 0, 0);
      setEndsAt(format(tomorrow, "yyyy-MM-dd'T'HH:mm"));
    }
  }, [open]);

  const loadTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("id, name")
        .eq("user_id", invoice.userId)
        .order("name");

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error("Error loading teams:", error);
    }
  };

  const handleSchedule = async () => {
    if (!startsAt || !endsAt) {
      toast.error("Please select start and end times");
      return;
    }

    setLoading(true);
    try {
      await upsertInvoiceSchedule({
        invoice_id: invoice.id,
        starts_at: new Date(startsAt).toISOString(),
        ends_at: new Date(endsAt).toISOString(),
        team_id: teamId || null,
        status: "scheduled",
        notes
      });

      toast.success("Job scheduled successfully!");
      onOpenChange(false);
      onScheduleComplete?.();
    } catch (error) {
      console.error("Error scheduling job:", error);
      toast.error("Failed to schedule job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule Job for Invoice #{invoice.invoiceNumber}</DialogTitle>
          <DialogDescription>
            Great! The deposit has been received. Let's schedule when this work will be performed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Deposit Payment Received</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Customer: {invoice.customerName}<br />
                  Service Address: {invoice.serviceAddress || invoice.customerAddress}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">
                <Calendar className="inline h-4 w-4 mr-2" />
                Start Date & Time
              </Label>
              <Input
                id="start-time"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">
                <Clock className="inline h-4 w-4 mr-2" />
                End Date & Time
              </Label>
              <Input
                id="end-time"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">
              <Users className="inline h-4 w-4 mr-2" />
              Assign Team (Optional)
            </Label>
            <Select value={teamId} onValueChange={setTeamId}>
              <SelectTrigger id="team">
                <SelectValue placeholder="Select a team..." />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes for Crew (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or notes for the crew..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Schedule Later
            </Button>
            <Button onClick={handleSchedule} disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Job"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}