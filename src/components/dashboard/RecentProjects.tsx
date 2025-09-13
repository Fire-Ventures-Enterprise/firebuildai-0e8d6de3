import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  progress: number;
  dueDate: string;
  contractorCount: number;
}

interface RecentProjectsProps {
  projects: Project[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'on-hold':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'completed':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Projects</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/mvp/projects')}
          className="text-primary hover:text-primary/80"
        >
          View all
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No projects yet</p>
          <Button onClick={() => navigate('/mvp/projects/new')}>
            Create Your First Project
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => navigate(`/mvp/projects/${project.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{project.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{project.contractorCount} contractors</span>
                    <span>•</span>
                    <span>Due {project.dueDate}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}