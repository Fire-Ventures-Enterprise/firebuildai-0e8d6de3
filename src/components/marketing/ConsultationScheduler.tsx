import { useState, useEffect } from 'react';
import { format, addDays, isWeekend, isBefore, startOfDay } from 'date-fns';
import { Calendar, Clock, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ConsultationSchedulerProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export const ConsultationScheduler = ({ onClose, onSuccess }: ConsultationSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'calendar' | 'form' | 'success'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    message: ''
  });

  // Generate calendar days for the current month view
  const generateCalendarDays = () => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const days = [];
    
    // Add padding days from previous month
    const startDay = start.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(start);
      date.setDate(date.getDate() - (i + 1));
      days.push({ date, isCurrentMonth: false, isSelectable: false });
    }
    
    // Add current month days
    for (let i = 1; i <= end.getDate(); i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const isSelectable = !isWeekend(date) && !isBefore(date, startOfDay(new Date()));
      days.push({ date, isCurrentMonth: true, isSelectable });
    }
    
    // Add padding days from next month
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(end);
      date.setDate(date.getDate() + i);
      days.push({ date, isCurrentMonth: false, isSelectable: false });
    }
    
    return days;
  };

  // Fetch available slots for selected date
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultation_slots')
        .select('*')
        .eq('slot_date', format(selectedDate, 'yyyy-MM-dd'))
        .eq('is_available', true)
        .order('slot_time');

      if (error) throw error;
      setAvailableSlots(data || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot || !formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .insert({
          slot_id: selectedSlot.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.company_name,
          message: formData.message,
          status: 'confirmed'
        });

      if (error) throw error;
      
      setStep('success');
      toast.success('Your consultation has been booked!');
      
      // Reset after success
      setTimeout(() => {
        onSuccess?.();
      }, 3000);
    } catch (error) {
      console.error('Error booking consultation:', error);
      toast.error('Failed to book consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {step === 'calendar' && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Schedule Your Free Consultation</h2>
            <p className="text-muted-foreground">Select a date and time that works for you</p>
          </div>

          {/* Calendar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <Button
                  key={index}
                  variant={selectedDate?.toDateString() === day.date.toDateString() ? 'default' : 'ghost'}
                  className={`h-10 p-0 ${!day.isCurrentMonth ? 'opacity-30' : ''} ${!day.isSelectable ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={!day.isSelectable}
                  onClick={() => day.isSelectable && handleDateSelect(day.date)}
                >
                  {day.date.getDate()}
                </Button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  Available times for {format(selectedDate, 'MMMM d, yyyy')}
                </span>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant="outline"
                      onClick={() => handleSlotSelect(slot)}
                      className="hover:bg-primary hover:text-primary-foreground"
                    >
                      {format(new Date(`2000-01-01T${slot.slot_time}`), 'h:mm a')}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No available slots for this date
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {step === 'form' && selectedSlot && (
        <div>
          <Button
            variant="ghost"
            onClick={() => setStep('calendar')}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to calendar
          </Button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Complete Your Booking</h2>
            <p className="text-muted-foreground">
              {format(selectedDate!, 'MMMM d, yyyy')} at {format(new Date(`2000-01-01T${selectedSlot.slot_time}`), 'h:mm a')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="ABC Construction Inc."
              />
            </div>

            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your project..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </form>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-12">
          <div className="inline-flex p-3 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Consultation Booked!</h2>
          <p className="text-muted-foreground mb-6">
            We've sent a confirmation email to {formData.email}
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      )}
    </div>
  );
};