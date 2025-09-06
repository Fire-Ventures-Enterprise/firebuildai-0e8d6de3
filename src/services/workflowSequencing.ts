/**
 * AI-Powered Workflow Sequencing System
 * Automatically sequences construction tasks into proper phases
 */

export interface ConstructionTask {
  id?: string;
  description: string;
  originalDescription?: string; // Preserve original as written
  phase?: number;
  phaseLabel?: string;
  dependencies?: string[];
  duration?: number; // in days
  materials?: string[];
  trade?: string;
  inspectionRequired?: boolean;
  sequence?: number;
}

export interface WorkflowPhase {
  number: number;
  label: string;
  description: string;
  tasks: ConstructionTask[];
  dependencies: number[]; // phases that must complete before this one
  estimatedDuration: number; // total days
  materials: string[];
  inspectionsRequired: string[];
}

export interface SequencedWorkflow {
  projectName: string;
  phases: WorkflowPhase[];
  totalDuration: number;
  criticalPath: number[]; // phase numbers
  notifications: WorkflowNotification[];
}

export interface WorkflowNotification {
  type: 'crew' | 'client' | 'material' | 'inspection';
  phase: number;
  message: string;
  timing: 'before' | 'during' | 'after';
}

// Construction task patterns and their typical sequencing
const TASK_PATTERNS = {
  // Demolition & Prep
  demolition: {
    keywords: ['demo', 'demolition', 'remove', 'removal', 'tear out', 'strip', 'existing', 'take down', 'dismantle'],
    phase: 1,
    phaseLabel: 'Demo & Prep',
    trade: 'General',
    baseDuration: 1
  },
  containment: {
    keywords: ['containment', 'protection', 'setup', 'prep', 'plastic', 'dust', 'site prep'],
    phase: 1,
    phaseLabel: 'Demo & Prep',
    trade: 'General',
    baseDuration: 0.5
  },
  cleanup: {
    keywords: ['cleanup', 'debris', 'disposal', 'haul', 'dump', 'clean'],
    phase: 1,
    phaseLabel: 'Demo & Prep',
    trade: 'General',
    baseDuration: 0.5
  },

  // Rough-in Work
  electricalRough: {
    keywords: ['electrical rough', 'wire', 'wiring', 'outlet rough', 'panel', 'circuit', 'electrical', 'power source', 'switches', 'plugs', 'pot lights'],
    phase: 2,
    phaseLabel: 'Rough-In Work',
    trade: 'Electrical',
    baseDuration: 1,
    inspectionRequired: true
  },
  plumbingRough: {
    keywords: ['plumbing rough', 'pipe', 'water line', 'drain', 'vent', 'pex', 'plumbing', 're-route plumbing', 'new water line'],
    phase: 2,
    phaseLabel: 'Rough-In Work',
    trade: 'Plumbing',
    baseDuration: 1,
    inspectionRequired: true
  },
  hvacRough: {
    keywords: ['hvac', 'duct', 'ductwork', 'air handler', 'furnace rough', 'hood vent', 'venting'],
    phase: 2,
    phaseLabel: 'Rough-In Work',
    trade: 'HVAC',
    baseDuration: 1.5,
    inspectionRequired: true
  },
  framing: {
    keywords: ['framing', 'stud', 'joist', 'beam', 'structural', 'wall frame', 'window', 'door', 'new window', 'new door', 'framing adjustments'],
    phase: 2,
    phaseLabel: 'Rough-In Work',
    trade: 'Framing',
    baseDuration: 2,
    inspectionRequired: true
  },

  // Insulation & Drywall
  insulation: {
    keywords: ['insulation', 'batt', 'foam', 'r-value', 'seal', 'sealing'],
    phase: 3,
    phaseLabel: 'Insulation & Drywall',
    trade: 'Insulation',
    baseDuration: 1,
    inspectionRequired: true
  },
  drywall: {
    keywords: ['drywall', 'sheetrock', 'gypsum', 'board', 'patch', 'new 1/2" drywall', 'repair', 'patching', 'ceiling'],
    phase: 3,
    phaseLabel: 'Drywall & Paint',
    trade: 'Drywall',
    baseDuration: 2
  },
  mudding: {
    keywords: ['mud', 'tape', 'compound', 'finish drywall', 'smooth', 'scrape', 'flat finish'],
    phase: 3,
    phaseLabel: 'Drywall & Paint',
    trade: 'Drywall',
    baseDuration: 2
  },

  // Paint & Finishes
  primer: {
    keywords: ['prime', 'primer', 'seal'],
    phase: 4,
    phaseLabel: 'Paint & Finishes',
    trade: 'Painting',
    baseDuration: 1
  },
  paint: {
    keywords: ['paint', 'coat', 'finish coat', 'color'],
    phase: 4,
    phaseLabel: 'Paint & Finishes',
    trade: 'Painting',
    baseDuration: 2
  },

  // Major Installations
  cabinets: {
    keywords: ['cabinet', 'cupboard', 'vanity', 'storage', 'cabinetry', 'shaker', 'kitchen island', 'millwork', 'soft-close', 'drawer slides', 'spice rack'],
    phase: 5,
    phaseLabel: 'Major Installations',
    trade: 'Carpentry',
    baseDuration: 1.5
  },
  countertops: {
    keywords: ['counter', 'countertop', 'granite', 'quartz', 'marble', 'laminate', 'level 1', 'level 2', 'countertop installation'],
    phase: 5,
    phaseLabel: 'Major Installations',
    trade: 'Countertops',
    baseDuration: 1
  },
  flooring: {
    keywords: ['floor', 'tile floor', 'hardwood', 'laminate floor', 'vinyl', 'carpet', 'plank flooring', 'sqft', 'square feet', 'subfloor'],
    phase: 5,
    phaseLabel: 'Major Installations',
    trade: 'Flooring',
    baseDuration: 2
  },
  appliances: {
    keywords: ['appliance', 'refrigerator', 'stove', 'dishwasher', 'microwave', 'oven', 'fridge', 'appliance hookup'],
    phase: 5,
    phaseLabel: 'Major Installations',
    trade: 'Appliances',
    baseDuration: 0.5
  },

  // Finish Work
  backsplash: {
    keywords: ['backsplash', 'tile back', 'wall tile', 'backsplash tiles', 'full-height backsplash', 'stove wall'],
    phase: 6,
    phaseLabel: 'Finish Work',
    trade: 'Tile',
    baseDuration: 1
  },
  plumbingFinish: {
    keywords: ['sink', 'faucet', 'toilet', 'fixture', 'plumbing finish', 'undermount', '60/40', 'stainless steel sink'],
    phase: 6,
    phaseLabel: 'Finish Work',
    trade: 'Plumbing',
    baseDuration: 1
  },
  electricalFinish: {
    keywords: ['light fixture', 'switch', 'outlet install', 'electrical finish', 'led', 'under cabinet light', 'pendant lights', 'usb charger', 'island plug'],
    phase: 6,
    phaseLabel: 'Finish Work',
    trade: 'Electrical',
    baseDuration: 1
  },
  trim: {
    keywords: ['trim', 'baseboard', 'crown', 'molding', 'casing', 'square flat baseboards', 'beveled edge', 'window casing', 'door casing'],
    phase: 6,
    phaseLabel: 'Finish Work',
    trade: 'Carpentry',
    baseDuration: 1.5
  },

  // Final Phase
  touchUp: {
    keywords: ['touch up', 'final paint', 'correction'],
    phase: 7,
    phaseLabel: 'Final & Cleanup',
    trade: 'General',
    baseDuration: 0.5
  },
  finalClean: {
    keywords: ['final clean', 'detail clean', 'construction clean'],
    phase: 7,
    phaseLabel: 'Final & Cleanup',
    trade: 'Cleaning',
    baseDuration: 0.5
  },
  punchList: {
    keywords: ['punch', 'walkthrough', 'inspection', 'final check'],
    phase: 7,
    phaseLabel: 'Final & Cleanup',
    trade: 'General',
    baseDuration: 0.5
  }
};

/**
 * Analyzes a task description and determines its construction phase
 */
function analyzeTask(description: string): ConstructionTask {
  const lowerDesc = description.toLowerCase();
  
  // Find matching pattern
  for (const [key, pattern] of Object.entries(TASK_PATTERNS)) {
    const hasKeyword = pattern.keywords.some(keyword => 
      lowerDesc.includes(keyword.toLowerCase())
    );
    
    if (hasKeyword) {
      return {
        description,
        originalDescription: description,
        phase: pattern.phase,
        phaseLabel: pattern.phaseLabel,
        trade: pattern.trade,
        duration: pattern.baseDuration,
        inspectionRequired: 'inspectionRequired' in pattern ? pattern.inspectionRequired : false
      };
    }
  }
  
  // Default to general phase 5 if no pattern matches
  return {
    description,
    originalDescription: description,
    phase: 5,
    phaseLabel: 'Major Installations',
    trade: 'General',
    duration: 1
  };
}

/**
 * Extract materials from task descriptions
 */
function extractMaterials(description: string): string[] {
  const materials: string[] = [];
  const lowerDesc = description.toLowerCase();
  
  // Common material patterns
  const materialPatterns = [
    { pattern: /\d+[-x]\d+\s+\w+/g, label: 'Lumber' }, // 2x4, 2-4, etc
    { pattern: /pvc|pex|copper/gi, label: 'Plumbing' },
    { pattern: /\d+\s*gauge|\d+[-\/]\d+\s*wire/gi, label: 'Electrical' },
    { pattern: /granite|quartz|marble|laminate/gi, label: 'Countertop' },
    { pattern: /hardwood|vinyl|tile|carpet/gi, label: 'Flooring' },
    { pattern: /drywall|sheetrock|gypsum/gi, label: 'Drywall' },
    { pattern: /paint|primer|stain/gi, label: 'Paint' }
  ];
  
  materialPatterns.forEach(({ pattern }) => {
    const matches = lowerDesc.match(pattern);
    if (matches) {
      materials.push(...matches);
    }
  });
  
  return [...new Set(materials)]; // Remove duplicates
}

/**
 * Main function to sequence estimate items into a workflow
 */
export function sequenceWorkflow(
  projectName: string,
  estimateItems: Array<{ description: string; quantity?: number; rate?: number }>
): SequencedWorkflow {
  // Analyze all tasks
  const analyzedTasks = estimateItems.map(item => analyzeTask(item.description));
  
  // Group by phase
  const phaseMap = new Map<number, ConstructionTask[]>();
  analyzedTasks.forEach(task => {
    const phase = task.phase || 5;
    if (!phaseMap.has(phase)) {
      phaseMap.set(phase, []);
    }
    phaseMap.get(phase)!.push(task);
  });
  
  // Sort phases and create WorkflowPhase objects
  const phases: WorkflowPhase[] = [];
  const sortedPhases = Array.from(phaseMap.keys()).sort((a, b) => a - b);
  
  sortedPhases.forEach((phaseNum, index) => {
    const tasks = phaseMap.get(phaseNum)!;
    const phaseLabel = tasks[0].phaseLabel || `Phase ${phaseNum}`;
    
    // Extract all materials from phase tasks
    const phaseMaterials = tasks.flatMap(t => extractMaterials(t.description));
    
    // Check for inspections - group by trade to avoid duplicates
    const uniqueTrades = new Set<string>();
    tasks.forEach(t => {
      if (t.inspectionRequired && t.trade) {
        uniqueTrades.add(t.trade);
      }
    });
    const inspections = Array.from(uniqueTrades).map(trade => `${trade} inspection`);
    
    // Calculate phase duration (max of parallel tasks + buffer)
    const maxDuration = Math.max(...tasks.map(t => t.duration || 1));
    const totalDuration = maxDuration + 0.5; // Add half day buffer
    
    phases.push({
      number: phaseNum,
      label: phaseLabel,
      description: `${phaseLabel} - ${tasks.length} tasks`,
      tasks: tasks.map((t, i) => ({ ...t, sequence: i + 1 })),
      dependencies: index > 0 ? [sortedPhases[index - 1]] : [],
      estimatedDuration: totalDuration,
      materials: [...new Set(phaseMaterials)],
      inspectionsRequired: inspections
    });
  });
  
  // Generate notifications
  const notifications: WorkflowNotification[] = [];
  
  phases.forEach((phase, index) => {
    // Crew notifications
    notifications.push({
      type: 'crew',
      phase: phase.number,
      message: `Phase ${phase.number} ready to start - ${phase.label}`,
      timing: 'before'
    });
    
    // Material notifications
    if (phase.materials.length > 0) {
      notifications.push({
        type: 'material',
        phase: phase.number,
        message: `Material delivery scheduled for ${phase.label}`,
        timing: 'before'
      });
    }
    
    // Inspection notifications
    if (phase.inspectionsRequired.length > 0) {
      phase.inspectionsRequired.forEach(inspection => {
        notifications.push({
          type: 'inspection',
          phase: phase.number,
          message: `Schedule ${inspection} for ${phase.label}`,
          timing: 'during'
        });
      });
    }
    
    // Client updates
    notifications.push({
      type: 'client',
      phase: phase.number,
      message: `${phase.label} completed - photos attached`,
      timing: 'after'
    });
    
    // Dependency notifications
    if (index < phases.length - 1) {
      const nextPhase = phases[index + 1];
      if (phase.inspectionsRequired.length > 0) {
        notifications.push({
          type: 'crew',
          phase: nextPhase.number,
          message: `Phase ${nextPhase.number} cannot start until Phase ${phase.number} complete and inspections passed`,
          timing: 'before'
        });
      }
    }
  });
  
  // Calculate total duration and critical path
  const totalDuration = phases.reduce((sum, phase) => sum + phase.estimatedDuration, 0);
  const criticalPath = sortedPhases; // For now, all phases are critical
  
  return {
    projectName,
    phases,
    totalDuration,
    criticalPath,
    notifications
  };
}

/**
 * Generate a work order from a sequenced workflow
 */
export function generateWorkOrder(
  workflow: SequencedWorkflow,
  workOrderNumber: string
): string {
  let output = `${workflow.projectName} - Work Order #${workOrderNumber}\n\n`;
  output += `Total Duration: ${workflow.totalDuration} days\n\n`;
  
  workflow.phases.forEach((phase, index) => {
    const startDay = workflow.phases
      .slice(0, index)
      .reduce((sum, p) => sum + p.estimatedDuration, 1);
    const endDay = startDay + phase.estimatedDuration - 1;
    
    output += `Phase ${phase.number}: ${phase.label} (Days ${Math.ceil(startDay)}-${Math.ceil(endDay)})\n`;
    
    // Add tasks as checklist
    phase.tasks.forEach(task => {
      output += `□ ${task.description}\n`;
    });
    
    // Add materials if present
    if (phase.materials.length > 0) {
      output += `Materials: ${phase.materials.join(', ')}\n`;
    }
    
    // Add inspections if required
    if (phase.inspectionsRequired.length > 0) {
      phase.inspectionsRequired.forEach(inspection => {
        output += `□ Schedule ${inspection}\n`;
      });
    }
    
    output += '\n';
  });
  
  return output;
}

/**
 * Test the workflow sequencing with the Johnson Kitchen example
 */
export function testJohnsonKitchen() {
  const estimateItems = [
    { description: "Demolition of existing kitchen cabinets and countertops" },
    { description: "Remove and cap existing plumbing lines" },
    { description: "Electrical rough-in for under-cabinet lighting and new outlets" },
    { description: "Drywall repair and patching" },
    { description: "Install new kitchen cabinets" },
    { description: "Granite countertop installation" },
    { description: "Plumbing rough-in for new sink location" },
    { description: "Install new sink and faucet" },
    { description: "Tile backsplash installation" },
    { description: "Paint kitchen walls and ceiling" },
    { description: "Install under-cabinet LED lighting" },
    { description: "Final electrical connections" },
    { description: "Cleanup and debris removal" }
  ];
  
  const workflow = sequenceWorkflow("Johnson Kitchen Renovation", estimateItems);
  const workOrder = generateWorkOrder(workflow, "WO-2025-001");
  
  return { workflow, workOrder };
}