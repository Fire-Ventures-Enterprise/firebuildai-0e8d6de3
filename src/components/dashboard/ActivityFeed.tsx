import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, UserPlus, FolderOpen, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'task_completed' | 'contractor_added' | 'project_created' | 'note_added';
  description: string;
  timestamp: Date;
  user?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'contractor_added':
        return <UserPlus className="h-4 w-4 text-primary" />;
      case 'project_created':
        return <FolderOpen className="h-4 w-4 text-warning" />;
      case 'note_added':
        return <MessageSquare className="h-4 w-4 text-secondary-foreground" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      
      {activities.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No recent activity
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="p-2 rounded-full bg-secondary">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}