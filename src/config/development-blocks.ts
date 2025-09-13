// Development Blocks System - Sequential Execution with Completion Tracking
// Each block must be 100% completed before moving to the next

export interface DevelopmentTask {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  verificationCriteria?: string[];
}

export interface DevelopmentBlock {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'locked' | 'current' | 'completed';
  description: string;
  prerequisites: string[];
  deliverables: string[];
  tasks: DevelopmentTask[];
  completionPercentage: number;
  blockedBy?: string;
}

export const DEVELOPMENT_BLOCKS: DevelopmentBlock[] = [
  {
    id: 'block-1',
    name: 'Block 1: Foundation & Company Setup',
    startDate: '2025-09-13',
    endDate: '2025-09-14',
    status: 'current',
    description: 'Authentication, database, and company profile setup',
    prerequisites: [],
    deliverables: [
      'Supabase authentication working',
      'Company profile setup (logo, name, contact)',
      'Basic dashboard structure',
      'Mobile-responsive foundation'
    ],
    tasks: [
      { id: 'b1-t1', description: 'Supabase auth configured', completed: true, completedAt: '2025-09-13T10:00:00Z' },
      { id: 'b1-t2', description: 'Login/signup pages', completed: true, completedAt: '2025-09-13T11:00:00Z' },
      { id: 'b1-t3', description: 'Company profile table & form', completed: false },
      { id: 'b1-t4', description: 'Company branding upload (logo)', completed: false },
      { id: 'b1-t5', description: 'Dashboard skeleton with navigation', completed: true, completedAt: '2025-09-13T14:00:00Z' },
      { id: 'b1-t6', description: 'Settings page for company details', completed: false }
    ],
    completionPercentage: 50
  },
  {
    id: 'block-2',
    name: 'Block 2: Estimates & Invoices Core',
    startDate: '2025-09-15',
    endDate: '2025-09-16',
    status: 'locked',
    description: 'Build the core estimate/invoice creation and management system',
    prerequisites: ['Block 1 completed'],
    deliverables: [
      'Estimates/Invoices tables with RLS',
      'Line items builder with auto-calc',
      'Tax calculation',
      'Company branding on documents',
      'Save as draft functionality'
    ],
    tasks: [
      { id: 'b2-t1', description: 'Create estimates table with RLS', completed: false },
      { id: 'b2-t2', description: 'Create invoices table with RLS', completed: false },
      { id: 'b2-t3', description: 'Build estimate/invoice form', completed: false },
      { id: 'b2-t4', description: 'Line items component with calculations', completed: false },
      { id: 'b2-t5', description: 'Add tax & total auto-calculation', completed: false },
      { id: 'b2-t6', description: 'Company branding header/footer', completed: false },
      { id: 'b2-t7', description: 'Save/edit draft functionality', completed: false }
    ],
    completionPercentage: 0,
    blockedBy: 'block-1'
  },
  {
    id: 'block-3',
    name: 'Block 3: PDF Export & Email',
    startDate: '2025-09-17',
    endDate: '2025-09-17',
    status: 'locked',
    description: 'PDF generation and email sending capabilities',
    prerequisites: ['Block 2 completed'],
    deliverables: [
      'PDF export with branding',
      'Email service configuration',
      'Send estimate/invoice via email',
      'Unique client links generation',
      'Email templates'
    ],
    tasks: [
      { id: 'b3-t1', description: 'Setup react-pdf or similar', completed: false },
      { id: 'b3-t2', description: 'Create PDF template with branding', completed: false },
      { id: 'b3-t3', description: 'Configure email service (Resend/Postmark)', completed: false },
      { id: 'b3-t4', description: 'Generate unique client tokens', completed: false },
      { id: 'b3-t5', description: 'Build email templates', completed: false },
      { id: 'b3-t6', description: 'Send functionality with tracking', completed: false }
    ],
    completionPercentage: 0,
    blockedBy: 'block-2'
  },
  {
    id: 'block-4',
    name: 'Block 4: Jobs & Status Tracking',
    startDate: '2025-09-18',
    endDate: '2025-09-19',
    status: 'locked',
    description: 'Job management system linked to estimates/invoices',
    prerequisites: ['Block 3 completed'],
    deliverables: [
      'Jobs table with RLS',
      'Job status workflow',
      'Link estimates/invoices to jobs',
      'Job dashboard view',
      'Status change tracking'
    ],
    tasks: [
      { id: 'b4-t1', description: 'Create jobs table with RLS', completed: false },
      { id: 'b4-t2', description: 'Job status enum (Draft→Sent→Approved→In Progress→Completed)', completed: false },
      { id: 'b4-t3', description: 'Link jobs to estimates/invoices', completed: false },
      { id: 'b4-t4', description: 'Build jobs list view', completed: false },
      { id: 'b4-t5', description: 'Job detail page', completed: false },
      { id: 'b4-t6', description: 'Status update workflow', completed: false },
      { id: 'b4-t7', description: 'Job progress tracking', completed: false }
    ],
    completionPercentage: 0,
    blockedBy: 'block-3'
  },
  {
    id: 'block-5',
    name: 'Block 5: Basic Scheduling',
    startDate: '2025-09-20',
    endDate: '2025-09-20',
    status: 'locked',
    description: 'Simple calendar view and job scheduling',
    prerequisites: ['Block 4 completed'],
    deliverables: [
      'Calendar component',
      'Job scheduling table',
      'Date picker for jobs',
      'Drag-drop or click to schedule',
      'Calendar view of scheduled jobs'
    ],
    tasks: [
      { id: 'b5-t1', description: 'Add scheduling fields to jobs', completed: false },
      { id: 'b5-t2', description: 'Integrate calendar component', completed: false },
      { id: 'b5-t3', description: 'Date/time picker for scheduling', completed: false },
      { id: 'b5-t4', description: 'Calendar view with jobs', completed: false },
      { id: 'b5-t5', description: 'Basic drag-drop scheduling', completed: false }
    ],
    completionPercentage: 0,
    blockedBy: 'block-4'
  },
  {
    id: 'block-6',
    name: 'Block 6: Client Portal',
    startDate: '2025-09-21',
    endDate: '2025-09-22',
    status: 'locked',
    description: 'Public client portal for viewing and approving estimates/invoices',
    prerequisites: ['Block 5 completed'],
    deliverables: [
      'Token-based client access (no login)',
      'Client view for estimates/invoices',
      'Digital approval/signature',
      'Deposit payment simulation',
      'Client approval tracking'
    ],
    tasks: [
      { id: 'b6-t1', description: 'Create client portal routes', completed: false },
      { id: 'b6-t2', description: 'Token validation middleware', completed: false },
      { id: 'b6-t3', description: 'Client view templates', completed: false },
      { id: 'b6-t4', description: 'Digital signature component', completed: false },
      { id: 'b6-t5', description: 'Approval workflow', completed: false },
      { id: 'b6-t6', description: 'Simulated payment button', completed: false },
      { id: 'b6-t7', description: 'Update job status on approval', completed: false }
    ],
    completionPercentage: 0,
    blockedBy: 'block-5'
  },
  {
    id: 'block-7',
    name: 'Block 7: Email Notifications',
    startDate: '2025-09-23',
    endDate: '2025-09-23',
    status: 'locked',
    description: 'Automated email notifications for key events',
    prerequisites: ['Block 6 completed'],
    deliverables: [
      'Email notification system',
      'Estimate sent notification',
      'Client approval notification',
      'Payment received notification',
      'Status change alerts'
    ],
    tasks: [
      { id: 'b7-t1', description: 'Create notification preferences', completed: false },
      { id: 'b7-t2', description: 'Estimate sent email to client', completed: false },
      { id: 'b7-t3', description: 'Approval notification to contractor', completed: false },
      { id: 'b7-t4', description: 'Payment confirmation emails', completed: false },
      { id: 'b7-t5', description: 'Status change notifications', completed: false }
    ],
    completionPercentage: 0,
    blockedBy: 'block-6'
  },
  {
    id: 'block-8',
    name: 'Block 8: Testing & Launch',
    startDate: '2025-09-24',
    endDate: '2025-09-25',
    status: 'locked',
    description: 'Final testing, bug fixes, and production deployment',
    prerequisites: ['Block 7 completed'],
    deliverables: [
      'Complete user flow testing',
      'Mobile responsiveness check',
      'Performance optimization',
      'Security review',
      'Production deployment',
      'Contractor feedback system'
    ],
    tasks: [
      { id: 'b8-t1', description: 'End-to-end flow testing', completed: false },
      { id: 'b8-t2', description: 'Mobile device testing', completed: false },
      { id: 'b8-t3', description: 'Performance optimization', completed: false },
      { id: 'b8-t4', description: 'Security audit', completed: false },
      { id: 'b8-t5', description: 'Bug fixes from testing', completed: false },
      { id: 'b8-t6', description: 'Deploy to production', completed: false },
      { id: 'b8-t7', description: 'Setup feedback collection', completed: false }
    ],
    completionPercentage: 0,
    blockedBy: 'block-7'
  }
];

// Helper functions for block management
export function getCurrentBlock(): DevelopmentBlock | null {
  return DEVELOPMENT_BLOCKS.find(block => block.status === 'current') || null;
}

export function getNextBlock(): DevelopmentBlock | null {
  const currentIndex = DEVELOPMENT_BLOCKS.findIndex(block => block.status === 'current');
  if (currentIndex >= 0 && currentIndex < DEVELOPMENT_BLOCKS.length - 1) {
    return DEVELOPMENT_BLOCKS[currentIndex + 1];
  }
  return null;
}

export function canMoveToNextBlock(blockId: string): boolean {
  const block = DEVELOPMENT_BLOCKS.find(b => b.id === blockId);
  if (!block) return false;
  return block.completionPercentage === 100;
}

export function updateTaskCompletion(blockId: string, taskId: string, completed: boolean): void {
  const block = DEVELOPMENT_BLOCKS.find(b => b.id === blockId);
  if (!block) return;
  
  const task = block.tasks.find(t => t.id === taskId);
  if (!task) return;
  
  task.completed = completed;
  if (completed) {
    task.completedAt = new Date().toISOString();
  } else {
    delete task.completedAt;
  }
  
  // Recalculate completion percentage
  const completedTasks = block.tasks.filter(t => t.completed).length;
  block.completionPercentage = Math.round((completedTasks / block.tasks.length) * 100);
  
  // Check if block is complete and unlock next
  if (block.completionPercentage === 100) {
    block.status = 'completed';
    const nextBlock = getNextBlock();
    if (nextBlock) {
      nextBlock.status = 'current';
      delete nextBlock.blockedBy;
    }
  }
}

export function getBlockProgress(): {
  totalBlocks: number;
  completedBlocks: number;
  currentBlock: string | null;
  overallProgress: number;
} {
  const totalBlocks = DEVELOPMENT_BLOCKS.length;
  const completedBlocks = DEVELOPMENT_BLOCKS.filter(b => b.status === 'completed').length;
  const currentBlock = getCurrentBlock()?.name || null;
  const overallProgress = Math.round((completedBlocks / totalBlocks) * 100);
  
  return {
    totalBlocks,
    completedBlocks,
    currentBlock,
    overallProgress
  };
}

// Validation function to ensure sequential completion
export function validateBlockProgression(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  let previousCompleted = true;
  
  for (const block of DEVELOPMENT_BLOCKS) {
    if (block.status === 'current' && !previousCompleted) {
      errors.push(`Block "${block.name}" cannot be current - previous blocks not completed`);
    }
    if (block.status === 'completed') {
      const incompleteTask = block.tasks.find(t => !t.completed);
      if (incompleteTask) {
        errors.push(`Block "${block.name}" marked complete but task "${incompleteTask.description}" is incomplete`);
      }
    }
    previousCompleted = block.status === 'completed';
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}