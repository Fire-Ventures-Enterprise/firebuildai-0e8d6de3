import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInvoiceSchedule, upsertInvoiceSchedule, deleteInvoiceSchedule } from "@/services/scheduling";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { R } from "@/routes/routeMap";
import { CalendarIcon, Clock, MapPin, FileText, Trash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface InvoiceSchedulingTabProps {
  invoice: any;
}

export function InvoiceSchedulingTab({ invoice }: InvoiceSchedulingTabProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [teamId, setTeamId] = useState<string | undefined>();
  const [status, setStatus] = useState<"scheduled" | "rescheduled" | "completed" | "cancelled">("scheduled");
  const [notes, setNotes] = useState("");
  const [hasExistingSchedule, setHasExistingSchedule] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSchedule();
  }, [invoice.id]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const schedule = await getInvoiceSchedule(invoice.id);
      if (schedule) {
        setStartsAt(new Date(schedule.starts_at).toISOString().slice(0, 16));
        setEndsAt(new Date(schedule.ends_at).toISOString().slice(0, 16));
        setTeamId(schedule.team_id ?? undefined);
        setStatus(schedule.status as any);
        setNotes(schedule.notes ?? "");
        setHasExistingSchedule(true);
      }
    } catch (error) {
      console.error("Error loading schedule:", error);
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!startsAt || !endsAt) {
      toast.error("Start and end times are required");
      return;
    }

    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);

    if (endDate <= startDate) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setSaving(true);
      await upsertInvoiceSchedule({
        invoice_id: invoice.id,
        starts_at: startDate.toISOString(),
        ends_at: endDate.toISOString(),
        team_id: teamId ?? null,
        status,
        notes
      });
      toast.success("Schedule saved & synced to calendar");
      setHasExistingSchedule(true);
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await deleteInvoiceSchedule(invoice.id);
      toast.success("Schedule removed");
      // Reset form
      setStartsAt("");
      setEndsAt("");
      setTeamId(undefined);
      setStatus("scheduled");
      setNotes("");
      setHasExistingSchedule(false);
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Failed to remove schedule");
    } finally {
      setSaving(false);
    }
  };

  const openCalendar = () => {
    const dateParam = startsAt ? startsAt.slice(0, 10) : new Date().toISOString().slice(0, 10);
    navigate(`${R.scheduling}?date=${dateParam}&focus=invoice:${invoice.id}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Schedule Work
          </CardTitle>
          <CardDescription>
            Set the scheduled date and time for this invoice. This will sync with your calendar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Date & Time</Label>
              <Input
                id="start-time"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Date & Time</Label>
              <Input
                id="end-time"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Scheduled
                  </div>
                </SelectItem>
                <SelectItem value="rescheduled">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    Rescheduled
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    Completed
                  </div>
                </SelectItem>
                <SelectItem value="cancelled">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    Cancelled
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or notes about this scheduled work..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : hasExistingSchedule ? "Update Schedule" : "Save & Sync"}
            </Button>
            <Button variant="outline" onClick={openCalendar} disabled={!startsAt}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              View in Calendar
            </Button>
            {hasExistingSchedule && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" disabled={saving}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Schedule?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the schedule from this invoice and delete the calendar event. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Remove Schedule</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Info Card */}
      {hasExistingSchedule && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Schedule Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span>{invoice.serviceAddress || invoice.customerAddress || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Invoice:</span>
                <span>{invoice.invoiceNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duration:</span>
                <span>
                  {startsAt && endsAt && (() => {
                    const start = new Date(startsAt);
                    const end = new Date(endsAt);
                    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                    return `${diff.toFixed(1)} hours`;
                  })()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}