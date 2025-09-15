import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Manage your schedule and appointments</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The calendar feature is currently under development. You'll be able to:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Schedule appointments and meetings</li>
            <li>• View project timelines</li>
            <li>• Set reminders for important dates</li>
            <li>• Sync with Google Calendar</li>
            <li>• Manage team availability</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}