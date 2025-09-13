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
    name: 'Block 1: Foundation & Authentication',
    startDate: '2025-09-13',
    endDate: '2025-09-14',
    status: 'completed',
    description: 'Core infrastructure setup with authentication and database',
    prerequisites: [],
    deliverables: [
      'Supabase database configured',
      'Authentication system working',
      'Basic routing structure',
      'Initial deployment'
    ],
    tasks: [
      { id: 'b1-t1', description: 'Initialize React + TypeScript project', completed: true, completedAt: '2025-09-13T10:00:00Z' },
      { id: 'b1-t2', description: 'Configure Tailwind CSS and design system', completed: true, completedAt: '2025-09-13T11:00:00Z' },
      { id: 'b1-t3', description: 'Set up Supabase backend', completed: true, completedAt: '2025-09-13T12:00:00Z' },
      { id: 'b1-t4', description: 'Implement authentication flow', completed: true, completedAt: '2025-09-13T14:00:00Z' },
      { id: 'b1-t5', description: 'Create basic routing structure', completed: true, completedAt: '2025-09-13T15:00:00Z' },
      { id: 'b1-t6', description: 'Deploy initial version to Vercel', completed: true, completedAt: '2025-09-13T16:00:00Z' }
    ],
    completionPercentage: 100
  },
  {
    id: 'block-2',
    name: 'Block 2: Project Management Core',
    startDate: '2025-09-15',
    endDate: '2025-09-16',
    status: 'current',
    description: 'Complete project CRUD operations with mobile-responsive UI',
    prerequisites: ['Block 1 completed'],
    deliverables: [
      'Projects table with RLS',
      'Project create/edit/delete functionality',
      'Project list view',
      'Project detail view',
      'Mobile-responsive layouts'
    ],
    tasks: [
      { id: 'b2-t1', description: 'Create projects table with RLS policies', completed: true, completedAt: '2025-09-13T17:00:00Z' },
      { id: 'b2-t2', description: 'Build project list component', completed: true, completedAt: '2025-09-13T18:00:00Z' },
      { id: 'b2-t3', description: 'Build project detail view', completed: false },
      { id: 'b2-t4', description: 'Implement project create/edit forms', completed: false },
      { id: 'b2-t5', description: 'Add project delete with confirmation', completed: false },
      { id: 'b2-t6', description: 'Test all CRUD operations', completed: false },
      { id: 'b2-t7', description: 'Verify mobile responsiveness', completed: false }
    ],
    completionPercentage: 28
  },
  {
    id: 'block-3',
    name: 'Block 3: Contractor Management',
    startDate: '2025-09-17',
    endDate: '2025-09-18',
    status: 'locked',
    description: 'Complete contractor management system with project assignments',
    prerequisites: ['Block 2 completed'],
    deliverables: [
      'Contractors table with RLS',
      'Contractor CRUD operations',
      'Contractor-to-project assignment',
      'Trade specialization tracking',
      'Performance notes system'
    ],
    tasks: [
      { id: 'b3-t1', description: 'Create contractors table with RLS', completed: false },
      { id: 'b3-t2', description: 'Build contractor list view', completed: false },
      { id: 'b3-t3', description: 'Build contractor detail/edit form', completed: false },
      { id: 'b3-t4', description: 'Implement project assignment UI', completed: false },
      { id: 'b3-t5', description: 'Add trade specialization tags', completed: false },
      { id: 'b3-t6', description: 'Create performance notes system', completed: false },
      { id: 'b3-t7', description: 'Test contractor-project relationships', completed: false }
    ],
    completionPercentage: 0,
    blockedBy: 'block-2'
  },
  {
    id: 'block-4',
    name: 'Block 4: Work Items & Tasks',
    startDate: '2025-09-19',
    endDate: '2025-09-20',
    status: 'locked',
    description: 'Task management system with assignments and progress tracking',
    prerequisites: ['Block 3 completed'],
    deliverables: [
      'Work items table with RLS',
      'Task creation and assignment',
      'Due date management',
      'Priority system',
      'Progress tracking',
      'Task completion workflow'
    ],
    tasks: [
      { id: 'b4-t1', description: 'Create work_items table with RLS', completed: false },
      { id: 'b4-t2', description: 'Build task list component', completed: false },
      { id: 'b4-t3', description: 'Build task creation form', completed: false },
      { id: 'b4-t4', description: 'Implement contractor assignment', completed: false },
      { id: 'b4-t5', description: 'Add due date and priority fields', completed: false },
      { id: 'b4-t6', description: 'Create progress tracking UI', completed: false },
      { id: 'b4-t7', description: 'Implement task completion workflow', completed: false },
      { id: 'b4-t8', description: 'Test task lifecycle', completed: false }
    ],
    completionPercentage: 0,
    blockedBy: 'block-3'
  },
  {
    id: 'block-5',
    name: 'Block 5: Communication System',
    startDate: '2025-09-21',
    endDate: '2025-09-22',
    status: 'locked',
    description: 'Notes, photos, and project communication features',
    prerequisites: ['Block 4 completed'],
    deliverables: [
      'Project notes table',
      'Photo upload to Supabase Storage',
      'Timeline view of updates',
      'Basic notifications',
      'Contractor mentions'
    ],
    tasks: [
      { id: 'b5-t1', description: 'Create project_notes table', completed: false },
      { id: 'b5-t2', description: 'Set up Supabase Storage bucket', completed: false },
      { id: 'b5-t3', description: 'Build notes/comments UI', completed: false },
      { id: 'b5-t4', description: 'Implement photo upload', completed: false },
      { id: 'b5-t5', description: 'Create timeline view', completed: false },
      { id: 'b5-t6', description: 'Add basic notifications', completed: false },
      { id: 'b5-t7', description: 'Implement @mentions', completed: false }
    ],
    completionPercentage: 0,
    blockedBy: 'block-4'
  },
  {
    id: 'block-6',
    name: 'Block 6: Mobile Optimization',
    startDate: '2025-09-23',
    endDate: '2025-09-23',
    status: 'locked',
    description: 'PWA features and mobile-specific optimizations',
    prerequisites: ['Block 5 completed'],
    deliverables: [
      'PWA configuration',
      'Offline viewing',
      'Camera integration',
      'Touch gestures',
      'Mobile performance optimization'
    ],
    tasks: [
      { id: 'b6-t1', description: 'Configure PWA manifest', completed: false },
      { id: 'b6-t2', description: 'Implement service worker', completed: false },
      { id: 'b6-t3', description: 'Add offline data caching', completed: false },
      { id: 'b6-t4', description: 'Integrate camera for photos', completed: false },
      { id: 'b6-t5', description: 'Optimize touch interactions', completed: false },
      { id: 'b6-t6', description: 'Performance audit and fixes', completed: false }
    ],
    completionPercentage: 0,
    blockedBy: 'block-5'
  },
  {
    id: 'block-7',
    name: 'Block 7: Testing & Polish',
    startDate: '2025-09-24',
    endDate: '2025-09-24',
    status: 'locked',
    description: 'Comprehensive testing and bug fixes',
    prerequisites: ['Block 6 completed'],
    deliverables: [
      'Unit tests for critical functions',
      'Integration tests',
      'Cross-browser testing',
      'Mobile device testing',
      'Bug fixes',
      'Performance optimization'
    ],
    tasks: [
      { id: 'b7-t1', description: 'Write unit tests', completed: false },
      { id: 'b7-t2', description: 'Create integration tests', completed: false },
      { id: 'b7-t3', description: 'Test on Chrome, Firefox, Safari', completed: false },
      { id: 'b7-t4', description: 'Test on iOS and Android', completed: false },
      { id: 'b7-t5', description: 'Fix identified bugs', completed: false },
      { id: 'b7-t6', description: 'Optimize performance', completed: false }
    ],
    completionPercentage: 0,
    blockedBy: 'block-6'
  },
  {
    id: 'block-8',
    name: 'Block 8: Launch Preparation',
    startDate: '2025-09-25',
    endDate: '2025-09-25',
    status: 'locked',
    description: 'Final preparations for production launch',
    prerequisites: ['Block 7 completed'],
    deliverables: [
      'Production environment setup',
      'Security audit',
      'Documentation',
      'User onboarding flow',
      'Monitoring setup',
      'Launch checklist'
    ],
    tasks: [
      { id: 'b8-t1', description: 'Configure production environment', completed: false },
      { id: 'b8-t2', description: 'Run security audit', completed: false },
      { id: 'b8-t3', description: 'Write user documentation', completed: false },
      { id: 'b8-t4', description: 'Create onboarding flow', completed: false },
      { id: 'b8-t5', description: 'Set up monitoring/analytics', completed: false },
      { id: 'b8-t6', description: 'Complete launch checklist', completed: false },
      { id: 'b8-t7', description: 'Deploy to production', completed: false }
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