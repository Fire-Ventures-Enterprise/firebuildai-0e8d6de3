import { useEffect, useRef } from 'react';
import { format, differenceInDays, addDays, startOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { ProjectTask } from '@/services/templates';

interface TaskGanttChartProps {
  tasks: ProjectTask[];
  startDate?: Date;
  endDate?: Date;
}

const TRADE_COLORS: Record<string, string> = {
  'General': 'bg-slate-500',
  'Demo': 'bg-red-500',
  'Plumbing': 'bg-blue-500',
  'Electrical': 'bg-yellow-500',
  'Carpentry': 'bg-amber-600',
  'Drywall': 'bg-gray-500',
  'Paint': 'bg-green-500',
  'Flooring': 'bg-purple-500',
  'Install': 'bg-indigo-500',
  'Counters': 'bg-pink-500',
  'Tile': 'bg-teal-500',
  'Inspection': 'bg-orange-500'
};

export function TaskGanttChart({ tasks, startDate, endDate }: TaskGanttChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Calculate date range
  const scheduledTasks = tasks.filter(t => t.scheduled_start && t.scheduled_end);
  const projectStart = startDate || (scheduledTasks.length > 0 
    ? new Date(Math.min(...scheduledTasks.map(t => new Date(t.scheduled_start!).getTime())))
    : new Date());
  const projectEnd = endDate || (scheduledTasks.length > 0
    ? new Date(Math.max(...scheduledTasks.map(t => new Date(t.scheduled_end!).getTime())))
    : addDays(new Date(), 30));
  
  const totalDays = differenceInDays(projectEnd, projectStart) + 1;
  const dayWidth = 30; // pixels per day
  const rowHeight = 40; // pixels per row
  
  // Generate date headers
  const dateHeaders = [];
  for (let i = 0; i < totalDays; i++) {
    const date = addDays(projectStart, i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    dateHeaders.push({
      date,
      isWeekend,
      label: format(date, 'd'),
      month: format(date, 'MMM')
    });
  }
  
  // Calculate task positions
  const getTaskPosition = (task: ProjectTask) => {
    if (!task.scheduled_start || !task.scheduled_end) return null;
    
    const start = startOfDay(new Date(task.scheduled_start));
    const end = startOfDay(new Date(task.scheduled_end));
    const startOffset = differenceInDays(start, projectStart);
    const duration = differenceInDays(end, start) + 1;
    
    return {
      left: startOffset * dayWidth,
      width: duration * dayWidth,
      color: TRADE_COLORS[task.trade] || 'bg-gray-400'
    };
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <div className="relative" style={{ width: `${totalDays * dayWidth}px` }}>
            {/* Date headers */}
            <div className="sticky top-0 z-10 bg-background border-b">
              <div className="flex">
                {dateHeaders.map((header, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center justify-center border-r ${
                      header.isWeekend ? 'bg-muted' : ''
                    }`}
                    style={{ width: `${dayWidth}px`, height: '60px' }}
                  >
                    <div className="text-xs text-muted-foreground">
                      {i === 0 || header.date.getDate() === 1 ? header.month : ''}
                    </div>
                    <div className="text-sm font-medium">{header.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(header.date, 'EEE')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Task rows */}
            <div className="relative">
              {scheduledTasks.map((task, index) => {
                const position = getTaskPosition(task);
                if (!position) return null;
                
                return (
                  <div
                    key={task.id}
                    className="relative flex items-center"
                    style={{ height: `${rowHeight}px` }}
                  >
                    {/* Task bar */}
                    <div
                      className={`absolute rounded-md ${position.color} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                      style={{
                        left: `${position.left}px`,
                        width: `${position.width}px`,
                        height: '32px',
                        top: '4px'
                      }}
                    >
                      <div className="flex items-center h-full px-2">
                        <span className="text-xs text-white font-medium truncate">
                          {task.label}
                        </span>
                      </div>
                    </div>
                    
                    {/* Dependencies lines */}
                    {task.depends_on_codes && task.depends_on_codes.length > 0 && (
                      <svg
                        className="absolute pointer-events-none"
                        style={{
                          left: 0,
                          top: 0,
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        {task.depends_on_codes.map(depCode => {
                          const depTask = scheduledTasks.find(t => t.code === depCode);
                          if (!depTask) return null;
                          const depPosition = getTaskPosition(depTask);
                          if (!depPosition) return null;
                          
                          const depIndex = scheduledTasks.indexOf(depTask);
                          const startX = depPosition.left + depPosition.width;
                          const startY = depIndex * rowHeight + rowHeight / 2;
                          const endX = position.left;
                          const endY = index * rowHeight + rowHeight / 2;
                          
                          return (
                            <line
                              key={depCode}
                              x1={startX}
                              y1={startY}
                              x2={endX}
                              y2={endY}
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeDasharray="3,3"
                              className="text-muted-foreground/30"
                            />
                          );
                        })}
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              {dateHeaders.map((header, i) => (
                <div
                  key={i}
                  className={`absolute top-0 bottom-0 border-r ${
                    header.isWeekend ? 'bg-muted/20' : ''
                  }`}
                  style={{ left: `${i * dayWidth}px`, width: `${dayWidth}px` }}
                />
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        
        {/* Legend */}
        <div className="p-4 border-t">
          <div className="flex flex-wrap gap-2">
            {Object.entries(TRADE_COLORS).map(([trade, color]) => {
              const hasTask = scheduledTasks.some(t => t.trade === trade);
              if (!hasTask) return null;
              
              return (
                <Badge key={trade} variant="secondary" className="gap-1">
                  <div className={`w-3 h-3 rounded ${color}`} />
                  {trade}
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}