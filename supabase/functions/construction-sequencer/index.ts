import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

// Construction phases with proper ordering
const CONSTRUCTION_PHASES = {
  'PLANNING': 0,
  'PERMITS': 1,
  'SITE_PREP': 2,
  'FOUNDATION': 3,
  'FRAMING': 4,
  'ROOFING': 5,
  'MECHANICAL': 6,
  'ELECTRICAL': 7,
  'PLUMBING': 8,
  'INSULATION': 9,
  'DRYWALL': 10,
  'FLOORING': 11,
  'PAINTING': 12,
  'FINISHING': 13,
  'LANDSCAPING': 14,
  'INSPECTION': 15,
  'CLEANUP': 16
};

// Building code requirements and dependencies
const BUILDING_CODE_RULES = {
  'electrical': {
    requires: ['framing', 'permit'],
    mustCompleteBefore: ['insulation', 'drywall'],
    inspectionRequired: true,
    inspectionType: 'electrical_rough_in'
  },
  'plumbing': {
    requires: ['foundation', 'permit'],
    mustCompleteBefore: ['insulation', 'drywall'],
    inspectionRequired: true,
    inspectionType: 'plumbing_rough_in'
  },
  'insulation': {
    requires: ['electrical', 'plumbing', 'mechanical'],
    mustCompleteBefore: ['drywall'],
    inspectionRequired: true,
    inspectionType: 'insulation_inspection'
  },
  'foundation': {
    requires: ['site_prep', 'permit'],
    mustCompleteBefore: ['framing'],
    inspectionRequired: true,
    inspectionType: 'foundation_inspection'
  },
  'framing': {
    requires: ['foundation'],
    mustCompleteBefore: ['roofing', 'mechanical', 'electrical', 'plumbing'],
    inspectionRequired: true,
    inspectionType: 'framing_inspection'
  }
};

interface ProjectRequest {
  projectDescription: string;
  squareFootage?: number;
  projectType?: string;
  location?: string;
  estimatedBudget?: number;
  includePermits?: boolean;
  includeInspections?: boolean;
}

interface SequencedTask {
  id: string;
  name: string;
  description: string;
  phase: string;
  duration: number; // in days
  dependencies: string[];
  trade?: string;
  criticalPath: boolean;
  startDay: number;
  endDay: number;
  inspectionRequired?: boolean;
  permitRequired?: boolean;
}

interface APIResponse {
  success: boolean;
  data?: {
    project: {
      name: string;
      type: string;
      squareFootage: number;
      estimatedDuration: number;
      phases: Array<{
        name: string;
        duration: number;
        taskCount: number;
      }>;
    };
    tasks: SequencedTask[];
    criticalPath: string[];
    totalDuration: number;
    inspections: Array<{
      type: string;
      afterTask: string;
      estimatedDay: number;
    }>;
    permits: Array<{
      type: string;
      requiredBefore: string;
    }>;
  };
  error?: string;
  requestId?: string;
  timestamp?: string;
}

// Simple in-memory rate limiting (for demo - use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || record.resetTime < now) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  
  // Get API key from header (for future authentication)
  const apiKey = req.headers.get('x-api-key') || 'public-beta';
  
  console.log(`[${requestId}] Processing request from API key: ${apiKey.substring(0, 8)}...`);

  // Rate limiting
  if (!checkRateLimit(apiKey)) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Rate limit exceeded. Please try again later.',
      requestId,
      timestamp
    }), {
      status: 429,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
        'X-Request-ID': requestId 
      },
    });
  }

  try {
    const request: ProjectRequest = await req.json();
    
    // Validate request
    if (!request.projectDescription) {
      throw new Error('Project description is required');
    }

    if (request.projectDescription.length > 5000) {
      throw new Error('Project description must be less than 5000 characters');
    }

    // Use OpenAI to parse the project description
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a construction project analyzer. Extract tasks and phases from project descriptions.
            Return a JSON array of tasks with this structure:
            {
              "projectName": "string",
              "projectType": "residential|commercial|renovation|addition",
              "tasks": [
                {
                  "name": "Task name",
                  "description": "Detailed description",
                  "phase": "PLANNING|PERMITS|SITE_PREP|FOUNDATION|FRAMING|ROOFING|MECHANICAL|ELECTRICAL|PLUMBING|INSULATION|DRYWALL|FLOORING|PAINTING|FINISHING|LANDSCAPING|INSPECTION|CLEANUP",
                  "estimatedDuration": "number (in days)",
                  "trade": "general|electrical|plumbing|hvac|carpentry|masonry|painting|roofing|landscaping",
                  "dependencies": ["array of task names this depends on"]
                }
              ]
            }
            Consider building codes and proper construction sequencing.`
          },
          {
            role: 'user',
            content: `Project: ${request.projectDescription}
            Square footage: ${request.squareFootage || 'Not specified'}
            Type: ${request.projectType || 'Not specified'}
            Location: ${request.location || 'Not specified'}
            Extract all construction tasks with proper dependencies and durations.`
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const error = await aiResponse.text();
      console.error(`[${requestId}] OpenAI API error:`, error);
      throw new Error('Failed to analyze project');
    }

    const aiData = await aiResponse.json();
    const parsedProject = JSON.parse(aiData.choices[0].message.content);
    
    // Process and sequence the tasks
    const tasks = parsedProject.tasks || [];
    const sequencedTasks: SequencedTask[] = [];
    const criticalPath: string[] = [];
    
    // Sort tasks by phase order
    tasks.sort((a: any, b: any) => {
      const phaseA = CONSTRUCTION_PHASES[a.phase] || 999;
      const phaseB = CONSTRUCTION_PHASES[b.phase] || 999;
      return phaseA - phaseB;
    });
    
    // Calculate start and end days based on dependencies
    let currentDay = 0;
    const taskMap = new Map<string, SequencedTask>();
    
    tasks.forEach((task: any, index: number) => {
      const taskId = `task-${index + 1}`;
      
      // Calculate start day based on dependencies
      let startDay = currentDay;
      if (task.dependencies && task.dependencies.length > 0) {
        task.dependencies.forEach((dep: string) => {
          const depTask = Array.from(taskMap.values()).find(t => t.name === dep);
          if (depTask) {
            startDay = Math.max(startDay, depTask.endDay);
          }
        });
      }
      
      const endDay = startDay + (task.estimatedDuration || 1);
      
      const sequencedTask: SequencedTask = {
        id: taskId,
        name: task.name,
        description: task.description || task.name,
        phase: task.phase,
        duration: task.estimatedDuration || 1,
        dependencies: task.dependencies || [],
        trade: task.trade,
        criticalPath: false,
        startDay,
        endDay,
        inspectionRequired: task.phase === 'ELECTRICAL' || task.phase === 'PLUMBING' || task.phase === 'FOUNDATION' || task.phase === 'FRAMING',
        permitRequired: task.phase === 'PERMITS'
      };
      
      sequencedTasks.push(sequencedTask);
      taskMap.set(task.name, sequencedTask);
      
      currentDay = Math.max(currentDay, endDay);
    });
    
    // Identify critical path (simplified - tasks with no slack time)
    const totalDuration = Math.max(...sequencedTasks.map(t => t.endDay));
    sequencedTasks.forEach(task => {
      // Tasks that if delayed would delay the project
      const dependentTasks = sequencedTasks.filter(t => 
        t.dependencies.includes(task.name)
      );
      
      if (dependentTasks.length > 0 || task.endDay === totalDuration) {
        task.criticalPath = true;
        criticalPath.push(task.name);
      }
    });
    
    // Extract inspections
    const inspections = sequencedTasks
      .filter(t => t.inspectionRequired)
      .map(t => ({
        type: `${t.phase.toLowerCase()}_inspection`,
        afterTask: t.name,
        estimatedDay: t.endDay
      }));
    
    // Extract permits
    const permits = request.includePermits ? [
      { type: 'Building Permit', requiredBefore: 'Site Preparation' },
      { type: 'Electrical Permit', requiredBefore: 'Electrical Rough-In' },
      { type: 'Plumbing Permit', requiredBefore: 'Plumbing Rough-In' },
      { type: 'Mechanical Permit', requiredBefore: 'HVAC Installation' }
    ] : [];
    
    // Group tasks by phase for summary
    const phases = Object.keys(CONSTRUCTION_PHASES).map(phase => {
      const phaseTasks = sequencedTasks.filter(t => t.phase === phase);
      return {
        name: phase,
        duration: phaseTasks.reduce((sum, t) => sum + t.duration, 0),
        taskCount: phaseTasks.length
      };
    }).filter(p => p.taskCount > 0);
    
    const response: APIResponse = {
      success: true,
      data: {
        project: {
          name: parsedProject.projectName || 'Construction Project',
          type: parsedProject.projectType || request.projectType || 'general',
          squareFootage: request.squareFootage || 0,
          estimatedDuration: totalDuration,
          phases
        },
        tasks: sequencedTasks,
        criticalPath,
        totalDuration,
        inspections: request.includeInspections !== false ? inspections : [],
        permits
      },
      requestId,
      timestamp
    };
    
    console.log(`[${requestId}] Successfully processed project with ${sequencedTasks.length} tasks in ${totalDuration} days`);
    
    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        'X-Processing-Time': `${Date.now() - new Date(timestamp).getTime()}ms`
      },
    });
  } catch (error) {
    console.error(`[${requestId}] Error in construction sequencer:`, error);
    
    const errorResponse: APIResponse = {
      success: false,
      error: error.message || 'Internal server error',
      requestId,
      timestamp
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: error.message?.includes('required') ? 400 : 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Request-ID': requestId 
      },
    });
  }
});