import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Lock,
  Users,
  Filter,
  Settings,
  Download,
  Plus,
  Workflow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, isSameDay, isWithinInterval, differenceInDays } from 'date-fns';
import {
  getWorkingHours,
  getHolidays,
  getTeams,
  getProjectTasks,
  getBlackoutWindows,
  getFrozenZoneSettings,
  isInFrozenZone,
  isWorkingDay,
  calculateRippleEffect,
  updateTaskSchedule,
  checkCapacityConflicts,
  type Team,
  type WorkingHours as WorkingHoursType,
  type CompanyHoliday,
  type BlackoutWindow
} from '@/services/workflow';
import { cn } from '@/lib/utils';

interface TaskWithTeam {
  id: string;
  code: string;
  label: string;
  trade: string;
  team_id?: string;
  duration_days: number;
  scheduled_start?: string;
  scheduled_end?: string;
  depends_on_codes?: string[];
  status: string;
  invoice_id?: string;
  estimate_id?: string;
  work_order_id?: string;
  teams?: {
    id: string;
    name: string;
    color?: string;
    trade?: string;
  };
}

interface DragState {
  taskId: string;
  originalStart: Date;
  currentStart: Date;
  ripplePreview: Map<string, { newStart: Date; newEnd: Date }>;
}

export default function WorkflowCalendarPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [tasks, setTasks] = useState<TaskWithTeam[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHoursType[]>([]);
  const [holidays, setHolidays] = useState<CompanyHoliday[]>([]);
  const [blackouts, setBlackouts] = useState<BlackoutWindow[]>([]);
  const [frozenDays, setFrozenDays] = useState(3);
  const [whatIfMode, setWhatIfMode] = useState(false);
  const [showDependencies, setShowDependencies] = useState(true);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [selectedTradeFilter, setSelectedTradeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  // Load initial data
  useEffect(() => {
    loadData();
  }, [currentWeekStart]);

  async function loadData() {
    setLoading(true);
    try {
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
      
      const [
        tasksData,
        teamsData,
        workingHoursData,
        holidaysData,
        blackoutsData,
        frozenSettings
      ] = await Promise.all([
        getProjectTasks(currentWeekStart, weekEnd),
        getTeams(),
        getWorkingHours(),
        getHolidays(currentWeekStart, weekEnd),
        getBlackoutWindows(currentWeekStart, weekEnd),
        getFrozenZoneSettings()
      ]);

      setTasks(tasksData);
      setTeams(teamsData);
      setWorkingHours(workingHoursData);
      setHolidays(holidaysData);
      setBlackouts(blackoutsData);
      setFrozenDays(frozenSettings);
    } catch (error) {
      console.error('Error loading workflow data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workflow data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  // Handle task drag start
  const handleDragStart = useCallback(async (e: React.DragEvent, task: TaskWithTeam, dayDate: Date) => {
    if (!task.scheduled_start) return;
    
    const taskStart = new Date(task.scheduled_start);
    
    // Check frozen zone
    if (isInFrozenZone(dayDate, frozenDays) && !whatIfMode) {
      toast({
        title: 'Frozen Zone',
        description: `Tasks within ${frozenDays} days cannot be moved without override`,
        variant: 'destructive'
      });
      e.preventDefault();
      return;
    }

    // Calculate ripple effect preview
    const ripple = await calculateRippleEffect(
      task as any,
      dayDate,
      tasks as any,
      workingHours,
      holidays
    );

    setDragState({
      taskId: task.id,
      originalStart: taskStart,
      currentStart: dayDate,
      ripplePreview: ripple
    });

    e.dataTransfer.effectAllowed = 'move';
  }, [tasks, workingHours, holidays, frozenDays, whatIfMode, toast]);

  // Handle task drop
  const handleDrop = useCallback(async (e: React.DragEvent, dayDate: Date, teamId?: string) => {
    e.preventDefault();
    
    if (!dragState) return;

    const task = tasks.find(t => t.id === dragState.taskId);
    if (!task) return;

    // Check if it's a working day
    if (!isWorkingDay(dayDate, workingHours, holidays)) {
      toast({
        title: 'Invalid Day',
        description: 'Cannot schedule tasks on non-working days',
        variant: 'destructive'
      });
      return;
    }

    // Check team capacity if changing teams
    if (teamId && teamId !== task.team_id) {
      const { hasConflict, availableSlots } = await checkCapacityConflicts(teamId, dayDate);
      if (hasConflict) {
        toast({
          title: 'Capacity Conflict',
          description: `Team is at full capacity. ${availableSlots} slots available.`,
          variant: 'destructive'
        });
        return;
      }
    }

    if (whatIfMode) {
      // In what-if mode, just update local state
      const updatedTasks = tasks.map(t => {
        const update = dragState.ripplePreview.get(t.id);
        if (update) {
          return {
            ...t,
            scheduled_start: update.newStart.toISOString(),
            scheduled_end: update.newEnd.toISOString(),
            team_id: t.id === dragState.taskId && teamId ? teamId : t.team_id
          };
        }
        return t;
      });
      setTasks(updatedTasks);
    } else {
      // Apply changes to database
      try {
        for (const [taskId, update] of dragState.ripplePreview.entries()) {
          const targetTeam = taskId === dragState.taskId && teamId ? teamId : undefined;
          await updateTaskSchedule(taskId, update.newStart, update.newEnd, targetTeam);
        }
        
        toast({
          title: 'Schedule Updated',
          description: `${dragState.ripplePreview.size} task(s) rescheduled`
        });
        
        await loadData();
      } catch (error) {
        console.error('Error updating schedule:', error);
        toast({
          title: 'Error',
          description: 'Failed to update schedule',
          variant: 'destructive'
        });
      }
    }

    setDragState(null);
  }, [dragState, tasks, workingHours, holidays, whatIfMode, toast]);

  // Render task bar
  const renderTaskBar = (task: TaskWithTeam, startDate: Date, endDate: Date, lane: 'team' | 'trade') => {
    const taskStart = new Date(task.scheduled_start!);
    const taskEnd = new Date(task.scheduled_end!);
    
    // Calculate position and width
    const startDiff = differenceInDays(taskStart, currentWeekStart);
    const duration = differenceInDays(taskEnd, taskStart) + 1;
    const left = Math.max(0, startDiff) * (100 / 7);
    const width = Math.min(duration, 7 - Math.max(0, startDiff)) * (100 / 7);
    
    const isInFrozen = isInFrozenZone(taskStart, frozenDays);
    const isDragging = dragState?.taskId === task.id;
    const isRippled = dragState?.ripplePreview.has(task.id);
    
    return (
      <div
        key={task.id}
        className={cn(
          "absolute h-8 rounded-md px-2 py-1 text-xs font-medium cursor-move transition-all",
          "hover:shadow-lg hover:z-20",
          isInFrozen && "opacity-75",
          isDragging && "opacity-50",
          isRippled && !isDragging && "ring-2 ring-primary ring-opacity-50"
        )}
        style={{
          left: `${left}%`,
          width: `${width}%`,
          backgroundColor: task.teams?.color || '#6B7280',
          color: 'white'
        }}
        draggable={!isInFrozen || whatIfMode}
        onDragStart={(e) => handleDragStart(e, task, taskStart)}
        onMouseEnter={() => setHoveredTask(task.id)}
        onMouseLeave={() => setHoveredTask(null)}
      >
        <div className="flex items-center justify-between h-full">
          <span className="truncate">{task.label}</span>
          {isInFrozen && <Lock className="h-3 w-3 ml-1 flex-shrink-0" />}
        </div>
        
        {/* Tooltip */}
        {hoveredTask === task.id && (
          <div className="absolute z-30 top-full mt-1 left-0 bg-popover text-popover-foreground p-2 rounded-md shadow-lg border min-w-[200px]">
            <div className="space-y-1 text-xs">
              <div><strong>Task:</strong> {task.label}</div>
              <div><strong>Trade:</strong> {task.trade}</div>
              <div><strong>Duration:</strong> {task.duration_days} days</div>
              <div><strong>Status:</strong> <Badge variant="outline" className="text-xs">{task.status}</Badge></div>
              {task.depends_on_codes?.length > 0 && (
                <div><strong>Dependencies:</strong> {task.depends_on_codes.join(', ')}</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Get filtered tasks
  const filteredTasks = tasks.filter(task => {
    if (selectedTeamFilter !== 'all' && task.team_id !== selectedTeamFilter) return false;
    if (selectedTradeFilter !== 'all' && task.trade !== selectedTradeFilter) return false;
    return task.scheduled_start && task.scheduled_end;
  });

  // Group tasks by team or trade
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const key = task.team_id || 'unassigned';
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {} as Record<string, TaskWithTeam[]>);

  const trades = Array.from(new Set(tasks.map(t => t.trade).filter(Boolean)));

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Workflow className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Workflow Calendar</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* What-if Mode */}
          <div className="flex items-center gap-2">
            <Switch
              id="whatif"
              checked={whatIfMode}
              onCheckedChange={setWhatIfMode}
            />
            <Label htmlFor="whatif" className="text-sm">
              What-if Mode
            </Label>
          </div>
          
          {/* Show Dependencies */}
          <div className="flex items-center gap-2">
            <Switch
              id="deps"
              checked={showDependencies}
              onCheckedChange={setShowDependencies}
            />
            <Label htmlFor="deps" className="text-sm">
              Dependencies
            </Label>
          </div>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export ICS
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Filters</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={selectedTeamFilter} onValueChange={setSelectedTeamFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedTradeFilter} onValueChange={setSelectedTradeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Trades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  {trades.map(trade => (
                    <SelectItem key={trade} value={trade}>
                      {trade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold">
          {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="w-full" ref={scrollRef}>
            <div className="min-w-[1200px]">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b">
                {weekDays.map(day => {
                  const isHoliday = holidays.some(h => h.holiday_date === format(day, 'yyyy-MM-dd'));
                  const isWorking = isWorkingDay(day, workingHours, holidays);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "p-3 text-center border-r last:border-r-0",
                        !isWorking && "bg-muted/50",
                        isToday && "bg-primary/5",
                        isHoliday && "bg-destructive/5"
                      )}
                    >
                      <div className="font-medium">{format(day, 'EEE')}</div>
                      <div className="text-2xl">{format(day, 'd')}</div>
                      {isHoliday && <Badge variant="destructive" className="text-xs mt-1">Holiday</Badge>}
                    </div>
                  );
                })}
              </div>

              {/* Team/Trade Lanes */}
              <div className="divide-y">
                {Object.entries(groupedTasks).map(([groupKey, groupTasks]) => {
                  const team = teams.find(t => t.id === groupKey);
                  
                  return (
                    <div key={groupKey} className="relative h-12">
                      {/* Lane Label */}
                      <div className="absolute left-0 top-0 bottom-0 w-32 bg-muted/30 border-r px-3 flex items-center">
                        <div className="flex items-center gap-2">
                          {team?.color && (
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: team.color }}
                            />
                          )}
                          <span className="text-sm font-medium truncate">
                            {team?.name || 'Unassigned'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Task Bars */}
                      <div className="relative h-full ml-32">
                        {groupTasks.map(task => {
                          if (!task.scheduled_start || !task.scheduled_end) return null;
                          
                          const taskStart = new Date(task.scheduled_start);
                          const taskEnd = new Date(task.scheduled_end);
                          const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
                          
                          // Check if task is visible in current week
                          if (taskEnd < currentWeekStart || taskStart > weekEnd) return null;
                          
                          return renderTaskBar(task, taskStart, taskEnd, 'team');
                        })}
                      </div>
                      
                      {/* Drop zones for each day */}
                      <div className="absolute top-0 left-32 right-0 h-full grid grid-cols-7">
                        {weekDays.map(day => (
                          <div
                            key={day.toISOString()}
                            className="border-r last:border-r-0 hover:bg-primary/5"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, day, groupKey !== 'unassigned' ? groupKey : undefined)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* What-if Mode Alert */}
      {whatIfMode && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            What-if mode is active. Changes are not saved until you apply them.
            <Button size="sm" className="ml-4" onClick={() => setWhatIfMode(false)}>
              Apply Changes
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Frozen Zone Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frozen Zone</CardTitle>
          <CardDescription>
            Tasks within {frozenDays} days from today are locked and cannot be moved without override.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}