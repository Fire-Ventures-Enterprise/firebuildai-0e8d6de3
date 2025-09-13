import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, FolderPlus, UserPlus, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: FolderPlus,
      label: 'New Project',
      description: 'Start a new project',
      action: () => navigate('/mvp/projects/new'),
      color: 'bg-primary/10 text-primary hover:bg-primary/20'
    },
    {
      icon: UserPlus,
      label: 'Add Contractor',
      description: 'Add to database',
      action: () => navigate('/mvp/contractors/new'),
      color: 'bg-success/10 text-success hover:bg-success/20'
    },
    {
      icon: CheckSquare,
      label: 'Create Task',
      description: 'Add work item',
      action: () => navigate('/mvp/work-items/new'),
      color: 'bg-warning/10 text-warning hover:bg-warning/20'
    },
    {
      icon: Plus,
      label: 'Quick Note',
      description: 'Add project note',
      action: () => console.log('Add note'),
      color: 'bg-secondary/10 text-secondary-foreground hover:bg-secondary/20'
    }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`h-auto flex-col p-4 ${action.color} transition-all duration-200`}
            onClick={action.action}
          >
            <action.icon className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">{action.label}</span>
            <span className="text-xs text-muted-foreground mt-1">
              {action.description}
            </span>
          </Button>
        ))}
      </div>
    </Card>
  );
}