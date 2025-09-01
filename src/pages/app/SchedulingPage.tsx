import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const localizer = momentLocalizer(moment);

interface Schedule {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
  job_id?: string;
  assigned_to?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  color: string;
}

export default function SchedulingPage() {
  const [events, setEvents] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    all_day: false,
    location: '',
    status: 'scheduled' as Schedule['status'],
    color: '#3B82F6'
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedules' as any)
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;

      const formattedEvents = (data || []).map((schedule: any) => ({
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
        start: new Date(schedule.start_time),
        end: new Date(schedule.end_time),
        allDay: schedule.all_day,
        location: schedule.location,
        job_id: schedule.job_id,
        assigned_to: schedule.assigned_to,
        status: schedule.status,
        color: schedule.color
      }));

      setEvents(formattedEvents);
    } catch (error: any) {
      toast.error("Failed to load schedules");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setFormData({
      ...formData,
      start_time: moment(start).format('YYYY-MM-DDTHH:mm'),
      end_time: moment(start).add(1, 'hour').format('YYYY-MM-DDTHH:mm')
    });
    setIsOpen(true);
  };

  const handleCreateSchedule = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('schedules' as any)
        .insert({
          title: formData.title,
          description: formData.description,
          start_time: formData.start_time,
          end_time: formData.end_time,
          all_day: formData.all_day,
          location: formData.location,
          status: formData.status,
          color: formData.color,
          user_id: userData.user.id
        });

      if (error) throw error;

      toast.success("Schedule created successfully");
      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        all_day: false,
        location: '',
        status: 'scheduled',
        color: '#3B82F6'
      });
      fetchSchedules();
    } catch (error: any) {
      toast.error(error.message || "Failed to create schedule");
      console.error(error);
    }
  };

  const eventStyleGetter = (event: Schedule) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '5px',
        opacity: event.status === 'cancelled' ? 0.5 : 1,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-muted-foreground">Loading schedules...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Scheduling</h1>
          <p className="text-muted-foreground mt-2">Manage your work schedules and appointments</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Schedule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Job site visit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="all-day"
                  checked={formData.all_day}
                  onCheckedChange={(checked) => setFormData({ ...formData, all_day: checked })}
                />
                <Label htmlFor="all-day">All day event</Label>
              </div>
              {!formData.all_day && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="start">Start Time</Label>
                    <Input
                      id="start"
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end">End Time</Label>
                    <Input
                      id="end"
                      type="datetime-local"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="123 Main St"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Schedule['status']) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateSchedule} className="w-full">
                Create Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
              style={{ height: '100%' }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {events
                .filter(event => moment(event.start).isSame(moment(), 'day'))
                .map(event => (
                  <div key={event.id} className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{moment(event.start).format('HH:mm')}</span>
                    <span className="font-medium">{event.title}</span>
                    {event.location && (
                      <>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{event.location}</span>
                      </>
                    )}
                  </div>
                ))}
              {events.filter(event => moment(event.start).isSame(moment(), 'day')).length === 0 && (
                <p className="text-muted-foreground text-sm">No schedules for today</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {events
                .filter(event => moment(event.start).isAfter(moment()))
                .slice(0, 5)
                .map(event => (
                  <div key={event.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{event.title}</span>
                    <span className="text-muted-foreground">
                      {moment(event.start).format('MMM DD')}
                    </span>
                  </div>
                ))}
              {events.filter(event => moment(event.start).isAfter(moment())).length === 0 && (
                <p className="text-muted-foreground text-sm">No upcoming schedules</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Schedule Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Scheduled</span>
                <span className="font-medium">{events.filter(e => e.status === 'scheduled').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">In Progress</span>
                <span className="font-medium">{events.filter(e => e.status === 'in_progress').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">{events.filter(e => e.status === 'completed').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}