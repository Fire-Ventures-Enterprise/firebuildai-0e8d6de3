import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInvoiceSchedule, upsertInvoiceSchedule, deleteInvoiceSchedule } from "@/services/scheduling";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { R } from "@/routes/routeMap";
import { EnhancedInvoice } from "@/types/enhanced-invoice";
import { Calendar, Clock, Trash2, ExternalLink, CheckCircle, XCircle, Clipboard, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: string;
  name: string;
}

interface InvoiceSchedulingTabProps {
  invoice: EnhancedInvoice;
}

export function InvoiceSchedulingTab({ invoice }: InvoiceSchedulingTabProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [teamId, setTeamId] = useState<string | undefined>();
  const [status, setStatus] = useState<"scheduled" | "rescheduled" | "completed" | "cancelled">("scheduled");
  const [notes, setNotes] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [hasSchedule, setHasSchedule] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [invoice.id]);

  async function loadData() {
    setLoading(true);
    try {
      // TODO: Load teams when the teams table is available
      // For now, teams functionality is disabled
      
      // Load existing schedule
      const schedule = await getInvoiceSchedule(invoice.id!);
      if (schedule) {
        setHasSchedule(true);
        setStartsAt(new Date(schedule.starts_at).toISOString().slice(0, 16));
        setEndsAt(new Date(schedule.ends_at).toISOString().slice(0, 16));
        setTeamId(schedule.team_id || undefined);
        setStatus(schedule.status);
        setNotes(schedule.notes || "");
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!startsAt || !endsAt) {
      toast({
        title: "Error",
        description: "Start and end times are required",
        variant: "destructive"
      });
      return;
    }

    if (new Date(startsAt) >= new Date(endsAt)) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await upsertInvoiceSchedule({
        invoice_id: invoice.id!,
        starts_at: new Date(startsAt).toISOString(),
        ends_at: new Date(endsAt).toISOString(),
        team_id: teamId || null,
        status,
        notes
      });
      
      setHasSchedule(true);
      toast({
        title: "Success",
        description: "Schedule saved and synced to calendar"
      });
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: "Error",
        description: "Failed to save schedule",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }

  async function removeSchedule() {
    if (!confirm("Are you sure you want to remove this schedule?")) return;
    
    setSaving(true);
    try {
      await deleteInvoiceSchedule(invoice.id!);
      setHasSchedule(false);
      setStartsAt("");
      setEndsAt("");
      setTeamId(undefined);
      setStatus("scheduled");
      setNotes("");
      
      toast({
        title: "Success",
        description: "Schedule removed from calendar"
      });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Error",
        description: "Failed to remove schedule",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }

  function openCalendar() {
    const date = startsAt ? startsAt.slice(0, 10) : new Date().toISOString().slice(0, 10);
    navigate(`${R.scheduling}?date=${date}&focus=invoice:${invoice.id}`);
  }

  async function handleGenerateWorkOrder() {
    if (!hasSchedule) {
      toast({
        title: "Schedule Required",
        description: "Please save a schedule before generating a work order",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase.rpc('create_work_order_from_invoice', {
        p_invoice_id: invoice.id
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Work order created successfully"
      });
      
      // Navigate to the work order detail page
      navigate(`/app/work-orders/${data}`);
    } catch (error: any) {
      console.error('Error creating work order:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create work order",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }

  const statusVariants = {
    scheduled: { color: "default", icon: <Clock className="w-3 h-3" /> },
    rescheduled: { color: "warning", icon: <Clock className="w-3 h-3" /> },
    completed: { color: "success", icon: <CheckCircle className="w-3 h-3" /> },
    cancelled: { color: "destructive", icon: <XCircle className="w-3 h-3" /> }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Loading schedule...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Schedule Work</CardTitle>
              <CardDescription>
                Set when this invoice work will be performed
              </CardDescription>
            </div>
            {hasSchedule && (
              <Badge variant={statusVariants[status].color as any}>
                <span className="flex items-center gap-1">
                  {statusVariants[status].icon}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start">Start Date & Time</Label>
              <Input
                id="start"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end">End Date & Time</Label>
              <Input
                id="end"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {teams.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="team">Assign Team/Crew</Label>
              <Select value={teamId} onValueChange={setTeamId}>
                <SelectTrigger id="team">
                  <SelectValue placeholder="Select team (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No team assigned</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any scheduling notes or special instructions..."
              rows={3}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={save} disabled={saving}>
              <Calendar className="w-4 h-4 mr-2" />
              {hasSchedule ? 'Update Schedule' : 'Save & Sync'}
            </Button>
            
            {startsAt && (
              <Button variant="outline" onClick={openCalendar}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View in Calendar
              </Button>
            )}
            
            {hasSchedule && (
              <>
                <Button
                  variant="secondary"
                  onClick={handleGenerateWorkOrder}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Clipboard className="w-4 h-4 mr-2" />
                  )}
                  Generate Work Order
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={removeSchedule} 
                  disabled={saving}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Schedule
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {startsAt && endsAt && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  {format(new Date(startsAt), "PPP 'at' p")} — {format(new Date(endsAt), "p")}
                </span>
              </div>
              {teamId && teams.find(t => t.id === teamId) && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Team:</span>
                  <span>{teams.find(t => t.id === teamId)?.name}</span>
                </div>
              )}
              {notes && (
                <div className="pt-2">
                  <span className="text-muted-foreground">Notes:</span>
                  <p className="mt-1 text-muted-foreground">{notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}