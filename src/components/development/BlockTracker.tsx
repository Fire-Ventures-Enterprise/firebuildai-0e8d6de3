import React from 'react';
import { CheckCircle2, Lock, Circle, AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DEVELOPMENT_BLOCKS, 
  getCurrentBlock, 
  getBlockProgress,
  updateTaskCompletion,
  validateBlockProgression,
  type DevelopmentBlock,
  type DevelopmentTask 
} from '@/config/development-blocks';
import { cn } from '@/lib/utils';

export function BlockTracker() {
  const [blocks, setBlocks] = React.useState(DEVELOPMENT_BLOCKS);
  const currentBlock = getCurrentBlock();
  const progress = getBlockProgress();
  const validation = validateBlockProgression();

  const handleTaskToggle = (blockId: string, taskId: string, checked: boolean) => {
    updateTaskCompletion(blockId, taskId, checked);
    // Force re-render
    setBlocks([...DEVELOPMENT_BLOCKS]);
  };

  const getStatusIcon = (status: DevelopmentBlock['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Circle className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: DevelopmentBlock['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800';
      case 'current':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800';
      case 'locked':
        return 'bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>MVP Development Progress</CardTitle>
          <CardDescription>
            Block {progress.completedBlocks} of {progress.totalBlocks} completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">{progress.overallProgress}%</span>
            </div>
            <Progress value={progress.overallProgress} className="h-2" />
            {currentBlock && (
              <p className="text-sm text-muted-foreground mt-2">
                Currently working on: <span className="font-medium">{currentBlock.name}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {!validation.valid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {validation.errors.map((error, i) => (
                <div key={i}>{error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Blocks */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <Card 
            key={block.id} 
            className={cn(
              "transition-all duration-200",
              getStatusColor(block.status),
              block.status === 'current' && "ring-2 ring-blue-500 ring-offset-2"
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(block.status)}
                  <div>
                    <CardTitle className="text-lg">{block.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      {block.startDate} to {block.endDate}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={block.status === 'completed' ? 'default' : 'secondary'}>
                    {block.completionPercentage}%
                  </Badge>
                  {block.blockedBy && (
                    <Badge variant="destructive" className="text-xs">
                      Blocked
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{block.description}</p>

              {/* Prerequisites */}
              {block.prerequisites.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium mb-1">Prerequisites:</p>
                  <div className="flex flex-wrap gap-1">
                    {block.prerequisites.map((prereq, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <Progress value={block.completionPercentage} className="h-1 mb-4" />

              {/* Tasks (show for current block only) */}
              {block.status === 'current' && (
                <div className="space-y-2">
                  <p className="text-xs font-medium mb-2">Tasks:</p>
                  {block.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2 pl-2">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => 
                          handleTaskToggle(block.id, task.id, checked as boolean)
                        }
                        disabled={block.status === 'locked'}
                      />
                      <label 
                        className={cn(
                          "text-sm cursor-pointer select-none",
                          task.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {task.description}
                      </label>
                      {task.completedAt && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          ✓ {new Date(task.completedAt).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Deliverables (show for completed blocks) */}
              {block.status === 'completed' && (
                <div className="space-y-1">
                  <p className="text-xs font-medium mb-1">Delivered:</p>
                  {block.deliverables.map((deliverable, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {deliverable}
                    </div>
                  ))}
                </div>
              )}

              {/* Next Block Indicator */}
              {index < blocks.length - 1 && (
                <div className="flex justify-center mt-4 -mb-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}