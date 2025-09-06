// Enhanced Contractor Workflow Types

export type WorkflowStatus = 
  | 'estimate_sent'
  | 'deposit_paid'
  | 'invoice_created'
  | 'work_scheduled'
  | 'work_order_generated'
  | 'in_progress'
  | 'completed'
  | 'final_payment_received';

export type ConstructionPhase = 
  | 'prep_demo'
  | 'structural'
  | 'rough_in'
  | 'insulation'
  | 'drywall'
  | 'flooring_prep'
  | 'finish_work'
  | 'final_electrical'
  | 'final_plumbing'
  | 'paint'
  | 'cleanup';

export interface WorkOrderItem {
  id?: string;
  itemName: string;
  description: string;
  quantity: number;
  phase: ConstructionPhase;
  sequenceOrder: number;
  dependencies: string[]; // IDs of items that must complete first
  estimatedDuration: number; // in hours
  assignedCrewId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  startDate?: Date;
  completedDate?: Date;
  notes?: string;
}

export interface WorkOrder {
  id?: string;
  invoiceId: string;
  workOrderNumber: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  
  // Job Info (no pricing for crew)
  jobTitle: string;
  serviceAddress: string;
  serviceCity: string;
  serviceProvince: string;
  servicePostalCode: string;
  
  // Sequenced work items
  items: WorkOrderItem[];
  
  // Crew access
  crewAccessToken: string;
  qrCodeUrl?: string;
  
  // Scheduling
  scheduledStartDate?: Date;
  scheduledEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  
  // Progress tracking
  currentPhase?: ConstructionPhase;
  overallProgress: number; // 0-100
  
  // Field reports
  fieldReports?: FieldReport[];
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

export interface FieldReport {
  id?: string;
  workOrderId: string;
  reportDate: Date;
  submittedBy: string; // crew member name
  
  // Progress updates
  completedItems: string[]; // WorkOrderItem IDs
  hoursWorked: number;
  crewMembers: string[];
  
  // Issues and changes
  issues?: string;
  materialShortages?: string;
  changeRequests?: string;
  
  // Media
  photos?: FieldReportPhoto[];
  
  // Client interaction
  clientSignature?: string;
  clientNotes?: string;
  
  // Status
  requiresOfficeReview: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  
  createdAt?: Date;
}

export interface FieldReportPhoto {
  id?: string;
  url: string;
  caption?: string;
  location?: string; // which room/area
  beforeAfter?: 'before' | 'after' | 'progress';
  uploadedAt?: Date;
}

// Construction Sequencing Intelligence
export interface ConstructionSequenceRule {
  itemKeywords: string[]; // keywords to match in item names
  phase: ConstructionPhase;
  sequenceOrder: number;
  dependencies: ConstructionPhase[];
  estimatedDurationMultiplier: number; // multiply by quantity for duration
}

export interface WorkflowNotification {
  id?: string;
  type: 'deposit_received' | 'work_scheduled' | 'work_started' | 'work_completed' | 'field_report_submitted' | 'payment_due';
  message: string;
  sentAt: Date;
  readAt?: Date;
  actionRequired?: boolean;
}

// Construction Sequencing Rules Database
export const CONSTRUCTION_SEQUENCE_RULES: ConstructionSequenceRule[] = [
  // Phase 1: Prep & Demo
  {
    itemKeywords: ['demo', 'demolition', 'remove', 'tear out', 'strip', 'containment', 'protection'],
    phase: 'prep_demo',
    sequenceOrder: 1,
    dependencies: [],
    estimatedDurationMultiplier: 0.5
  },
  {
    itemKeywords: ['cap plumbing', 'disconnect', 'shut off', 'permit'],
    phase: 'prep_demo',
    sequenceOrder: 2,
    dependencies: [],
    estimatedDurationMultiplier: 0.25
  },
  
  // Phase 2: Structural
  {
    itemKeywords: ['framing', 'frame', 'structural', 'beam', 'joist', 'stud', 'header'],
    phase: 'structural',
    sequenceOrder: 10,
    dependencies: ['prep_demo'],
    estimatedDurationMultiplier: 1.0
  },
  
  // Phase 3: Rough-in
  {
    itemKeywords: ['electrical rough', 'rough electrical', 'wire', 'outlet', 'switch', 'panel'],
    phase: 'rough_in',
    sequenceOrder: 20,
    dependencies: ['structural'],
    estimatedDurationMultiplier: 0.75
  },
  {
    itemKeywords: ['plumbing rough', 'rough plumbing', 'pipe', 'drain', 'supply line'],
    phase: 'rough_in',
    sequenceOrder: 21,
    dependencies: ['structural'],
    estimatedDurationMultiplier: 0.75
  },
  {
    itemKeywords: ['hvac', 'duct', 'heating', 'cooling', 'ventilation'],
    phase: 'rough_in',
    sequenceOrder: 22,
    dependencies: ['structural'],
    estimatedDurationMultiplier: 1.0
  },
  
  // Phase 4: Insulation
  {
    itemKeywords: ['insulation', 'insulate', 'vapor barrier'],
    phase: 'insulation',
    sequenceOrder: 30,
    dependencies: ['rough_in'],
    estimatedDurationMultiplier: 0.5
  },
  
  // Phase 5: Drywall
  {
    itemKeywords: ['drywall', 'sheetrock', 'gypsum', 'tape', 'mud', 'sand', 'texture'],
    phase: 'drywall',
    sequenceOrder: 40,
    dependencies: ['insulation'],
    estimatedDurationMultiplier: 1.5
  },
  
  // Phase 6: Flooring Prep
  {
    itemKeywords: ['subfloor', 'underlayment', 'floor prep'],
    phase: 'flooring_prep',
    sequenceOrder: 50,
    dependencies: ['drywall'],
    estimatedDurationMultiplier: 0.5
  },
  
  // Phase 7: Finish Work
  {
    itemKeywords: ['flooring', 'tile', 'hardwood', 'carpet', 'vinyl', 'laminate'],
    phase: 'finish_work',
    sequenceOrder: 60,
    dependencies: ['flooring_prep'],
    estimatedDurationMultiplier: 1.0
  },
  {
    itemKeywords: ['cabinet', 'countertop', 'vanity', 'millwork'],
    phase: 'finish_work',
    sequenceOrder: 61,
    dependencies: ['flooring_prep'],
    estimatedDurationMultiplier: 1.0
  },
  {
    itemKeywords: ['trim', 'baseboard', 'casing', 'crown molding'],
    phase: 'finish_work',
    sequenceOrder: 62,
    dependencies: ['finish_work'],
    estimatedDurationMultiplier: 0.75
  },
  
  // Phase 8: Final Electrical
  {
    itemKeywords: ['light fixture', 'ceiling fan', 'outlet cover', 'switch plate', 'final electrical'],
    phase: 'final_electrical',
    sequenceOrder: 70,
    dependencies: ['finish_work'],
    estimatedDurationMultiplier: 0.5
  },
  
  // Phase 9: Final Plumbing
  {
    itemKeywords: ['faucet', 'toilet', 'sink', 'shower', 'tub', 'final plumbing'],
    phase: 'final_plumbing',
    sequenceOrder: 71,
    dependencies: ['finish_work'],
    estimatedDurationMultiplier: 0.5
  },
  
  // Phase 10: Paint
  {
    itemKeywords: ['paint', 'primer', 'stain', 'finish coat'],
    phase: 'paint',
    sequenceOrder: 80,
    dependencies: ['final_electrical', 'final_plumbing'],
    estimatedDurationMultiplier: 1.0
  },
  
  // Phase 11: Cleanup
  {
    itemKeywords: ['cleanup', 'clean up', 'final clean', 'debris removal', 'touch up'],
    phase: 'cleanup',
    sequenceOrder: 90,
    dependencies: ['paint'],
    estimatedDurationMultiplier: 0.25
  }
];