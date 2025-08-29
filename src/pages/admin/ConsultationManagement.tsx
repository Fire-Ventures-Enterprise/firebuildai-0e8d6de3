import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { Calendar, Clock, Users, Mail, Phone, Building2, ChevronLeft, ChevronRight, Plus, Edit, Trash, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ConsultationBooking {
  id: string;
  slot_id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  message?: string;
  status: string;
  created_at: string;
  consultation_slots?: {
    slot_date: string;
    slot_time: string;
  };
}

interface ConsultationSlot {
  id: string;
  slot_date: string;
  slot_time: string;
  duration_minutes: number;
  max_bookings: number;
  current_bookings: number;
  is_available: boolean;
}

export const ConsultationManagement = () => {
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ConsultationBooking | null>(null);
  const [showSlotDialog, setShowSlotDialog] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    duration: 30,
    maxBookings: 1
  });

  useEffect(() => {
    fetchBookings();
    fetchSlots();
  }, [currentMonth]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('consultation_bookings')
        .select(`
          *,
          consultation_slots (
            slot_date,
            slot_time
          )
        `)
        .gte('consultation_slots.slot_date', startDate)
        .lte('consultation_slots.slot_date', endDate)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('consultation_slots')
        .select('*')
        .gte('slot_date', startDate)
        .lte('slot_date', endDate)
        .order('slot_date')
        .order('slot_time');

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
      
      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const createSlot = async () => {
    try {
      const { error } = await supabase
        .from('consultation_slots')
        .insert({
          slot_date: newSlot.date,
          slot_time: newSlot.time + ':00',
          duration_minutes: newSlot.duration,
          max_bookings: newSlot.maxBookings,
          current_bookings: 0,
          is_available: true
        });

      if (error) throw error;
      
      toast.success('Slot created successfully');
      setShowSlotDialog(false);
      fetchSlots();
    } catch (error) {
      console.error('Error creating slot:', error);
      toast.error('Failed to create slot');
    }
  };

  const deleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    
    try {
      const { error } = await supabase
        .from('consultation_slots')
        .delete()
        .eq('id', slotId);

      if (error) throw error;
      
      toast.success('Slot deleted');
      fetchSlots();
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast.error('Failed to delete slot');
    }
  };

  const calendarDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.filter(b => b.consultation_slots?.slot_date === dateStr);
  };

  const getSlotsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return slots.filter(s => s.slot_date === dateStr);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Consultation Management</h1>
        <p className="text-muted-foreground mt-2">Manage consultation bookings and availability</p>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="slots">Time Slots</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Consultation Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold">
                    {format(currentMonth, 'MMMM yyyy')}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {calendarDays.map(date => {
                  const dayBookings = getBookingsForDate(date);
                  const daySlots = getSlotsForDate(date);
                  
                  return (
                    <div
                      key={date.toISOString()}
                      className={`
                        min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors
                        ${isToday(date) ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'}
                        ${isSameDay(date, selectedDate) ? 'ring-2 ring-primary' : ''}
                      `}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="text-sm font-medium mb-1">
                        {format(date, 'd')}
                      </div>
                      {dayBookings.length > 0 && (
                        <Badge variant="default" className="text-xs">
                          {dayBookings.length} booking{dayBookings.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                      {daySlots.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {daySlots.length} slot{daySlots.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selected Date Details */}
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="font-semibold mb-3">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Bookings</h4>
                    {getBookingsForDate(selectedDate).length > 0 ? (
                      <div className="space-y-2">
                        {getBookingsForDate(selectedDate).map(booking => (
                          <div key={booking.id} className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{booking.name}</span>
                              <Badge variant={
                                booking.status === 'confirmed' ? 'default' :
                                booking.status === 'cancelled' ? 'destructive' : 'secondary'
                              }>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {format(new Date(`2000-01-01T${booking.consultation_slots?.slot_time}`), 'h:mm a')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <Mail className="w-3 h-3 inline mr-1" />
                              {booking.email}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No bookings for this date</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Available Slots</h4>
                    {getSlotsForDate(selectedDate).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {getSlotsForDate(selectedDate).map(slot => (
                          <Badge
                            key={slot.id}
                            variant={slot.is_available ? 'outline' : 'secondary'}
                          >
                            {format(new Date(`2000-01-01T${slot.slot_time}`), 'h:mm a')}
                            {slot.current_bookings > 0 && ` (${slot.current_bookings}/${slot.max_bookings})`}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No slots configured for this date</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>All Consultation Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{booking.name}</span>
                          <Badge variant={
                            booking.status === 'confirmed' ? 'default' :
                            booking.status === 'cancelled' ? 'destructive' : 'secondary'
                          }>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {booking.consultation_slots && format(new Date(booking.consultation_slots.slot_date), 'MMM d, yyyy')}
                            {' at '}
                            {booking.consultation_slots && format(new Date(`2000-01-01T${booking.consultation_slots.slot_time}`), 'h:mm a')}
                          </div>
                          <div>
                            <Mail className="w-3 h-3 inline mr-1" />
                            {booking.email}
                          </div>
                          {booking.phone && (
                            <div>
                              <Phone className="w-3 h-3 inline mr-1" />
                              {booking.phone}
                            </div>
                          )}
                          {booking.company_name && (
                            <div>
                              <Building2 className="w-3 h-3 inline mr-1" />
                              {booking.company_name}
                            </div>
                          )}
                        </div>
                        
                        {booking.message && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            {booking.message}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {bookings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No bookings found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slots">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manage Time Slots</CardTitle>
                <Dialog open={showSlotDialog} onOpenChange={setShowSlotDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Slot
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Time Slot</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="slot-date">Date</Label>
                        <Input
                          id="slot-date"
                          type="date"
                          value={newSlot.date}
                          onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="slot-time">Time</Label>
                        <Input
                          id="slot-time"
                          type="time"
                          value={newSlot.time}
                          onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="slot-duration">Duration (minutes)</Label>
                        <Input
                          id="slot-duration"
                          type="number"
                          value={newSlot.duration}
                          onChange={(e) => setNewSlot({ ...newSlot, duration: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="slot-max">Max Bookings</Label>
                        <Input
                          id="slot-max"
                          type="number"
                          value={newSlot.maxBookings}
                          onChange={(e) => setNewSlot({ ...newSlot, maxBookings: parseInt(e.target.value) })}
                        />
                      </div>
                      <Button onClick={createSlot} className="w-full">
                        Create Slot
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {slots.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">
                        {format(new Date(slot.slot_date), 'MMM d, yyyy')}
                      </span>
                      {' at '}
                      <span className="font-medium">
                        {format(new Date(`2000-01-01T${slot.slot_time}`), 'h:mm a')}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        {slot.current_bookings}/{slot.max_bookings} booked
                        {' • '}
                        {slot.duration_minutes} minutes
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={slot.is_available ? 'default' : 'secondary'}>
                        {slot.is_available ? 'Available' : 'Full'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteSlot(slot.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {slots.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No time slots configured. Add slots to allow bookings.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};