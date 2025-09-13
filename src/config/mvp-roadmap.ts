// FireBuild.ai MVP Roadmap - Following Idea2MVP Methodology
// Based on 8-10 day rapid development approach

export const MVP_ROADMAP = {
  // Phase 1: Discovery & Specification (Complete)
  discovery: {
    status: 'completed',
    deliverables: {
      coreIdea: 'Contractor project management platform',
      targetUsers: [
        'General Contractors (residential/commercial)',
        'Restoration Contractors (insurance work)',
        'Project Managers',
        'Small Construction Companies (2-50 employees)',
        'Independent Contractors',
        'Property Management Companies'
      ],
      userPersonas: {
        mike: {
          name: 'Mike the General Contractor',
          needs: 'Mobile-first user',
          priority: 'high'
        },
        sarah: {
          name: 'Sarah the Project Manager',
          needs: 'Desktop + mobile',
          priority: 'high'
        },
        tom: {
          name: 'Tom the Restoration Specialist',
          needs: 'Insurance integration',
          priority: 'medium'
        },
        lisa: {
          name: 'Lisa the Property Manager',
          needs: 'Multi-project oversight',
          priority: 'medium'
        }
      }
    }
  },

  // Phase 2: Specification Review
  specification: {
    features: {
      authentication: {
        priority: 1,
        status: 'complete',
        items: [
          'Email/password registration',
          'Profile management',
          'Password reset',
          'Session management'
        ]
      },
      projectManagement: {
        priority: 2,
        status: 'in-progress',
        items: [
          'Create new projects',
          'Project details (name, address, type, budget)',
          'Project status tracking',
          'Project timeline view',
          'Project archive/delete'
        ]
      },
      contractorManagement: {
        priority: 3,
        status: 'in-progress',
        items: [
          'Add contractors to database',
          'Assign contractors to projects',
          'Contractor contact information',
          'Trade specialization tracking',
          'Contractor performance notes'
        ]
      },
      workItemTracking: {
        priority: 4,
        status: 'pending',
        items: [
          'Create work items/tasks',
          'Assign tasks to contractors',
          'Set due dates and priorities',
          'Mark tasks complete',
          'Progress tracking'
        ]
      },
      communicationSystem: {
        priority: 5,
        status: 'pending',
        items: [
          'Project notes and comments',
          'Photo attachments',
          'Timeline view of updates',
          'Basic notifications',
          'Contractor mentions'
        ]
      },
      mobileInterface: {
        priority: 6,
        status: 'in-progress',
        items: [
          'Responsive design (mobile-first)',
          'Touch-friendly interactions',
          'Offline viewing capabilities',
          'Camera integration',
          'Quick actions'
        ]
      }
    },
    techStack: {
      frontend: 'React 18 + TypeScript + Tailwind CSS',
      backend: 'Supabase (PostgreSQL + Auth + Storage)',
      hosting: 'Vercel (automatic deployments)',
      mobile: 'Progressive Web App (PWA)',
      stateManagement: 'React Query + Context',
      forms: 'React Hook Form',
      icons: 'Lucide React',
      buildTool: 'Vite'
    }
  },

  // Phase 3: Development Timeline (8-10 days)
  development: {
    timeline: {
      day1_2: {
        name: 'Foundation Setup',
        tasks: [
          '✅ Initialize React + TypeScript project',
          '✅ Configure Tailwind CSS and design system',
          '✅ Set up Supabase backend',
          '✅ Implement authentication flow',
          '✅ Create basic routing structure',
          '✅ Deploy initial version to Vercel'
        ],
        status: 'complete'
      },
      day3_4: {
        name: 'Core Features',
        tasks: [
          '⏳ Build project management components',
          '⏳ Implement contractor management',
          '⏳ Create mobile-responsive layouts',
          '⏳ Add basic CRUD operations',
          '⏳ Implement data persistence',
          '⏳ Add form validation'
        ],
        status: 'in-progress'
      },
      day5_6: {
        name: 'Advanced Features',
        tasks: [
          'Build work item tracking system',
          'Implement notes and communication',
          'Add file upload functionality',
          'Create progress tracking',
          'Implement search and filtering',
          'Add mobile optimizations'
        ],
        status: 'pending'
      },
      day7_8: {
        name: 'Polish & Testing',
        tasks: [
          'Performance optimization',
          'Cross-browser testing',
          'Mobile device testing',
          'Bug fixes and refinements',
          'User experience improvements',
          'Production deployment'
        ],
        status: 'pending'
      },
      day9_10: {
        name: 'Quality Assurance',
        tasks: [
          'Comprehensive testing',
          'Security audit',
          'Performance monitoring setup',
          'Documentation creation',
          'User onboarding flow',
          'Launch preparation'
        ],
        status: 'pending'
      }
    }
  },

  // Success Metrics
  metrics: {
    development: {
      deliveryTime: '10 days maximum',
      codeQuality: 'TypeScript strict mode, ESLint',
      performance: 'Lighthouse score >90',
      mobileOptimization: 'Perfect responsive design',
      testingCoverage: '>80% test coverage',
      bugRate: '<5 critical bugs post-launch',
      userSatisfaction: '>4.5/5 rating'
    },
    business: {
      userRegistration: '100+ users in first month',
      projectCreation: '500+ projects created',
      userRetention: '60%+ 30-day retention',
      dailyActiveUsers: '30+ DAU after 30 days',
      customerFeedback: 'NPS score >50',
      revenue: '$5K MRR in 3 months'
    }
  },

  // Key Screens to Build
  screens: {
    authentication: ['Login', 'Registration', 'Password Reset'],
    dashboard: ['Project Overview', 'Quick Actions', 'Stats'],
    projects: ['Project List', 'Project Details', 'Add/Edit Project'],
    contractors: ['Contractor List', 'Add/Edit Contractor', 'Assign to Project'],
    workItems: ['Task List', 'Task Details', 'Create Task'],
    communication: ['Project Notes', 'Photo Gallery', 'Timeline'],
    settings: ['User Profile', 'Company Settings', 'Preferences']
  }
} as const;

// Export function to check current development status
export function getCurrentPhase() {
  const { development } = MVP_ROADMAP;
  for (const [key, phase] of Object.entries(development.timeline)) {
    if (phase.status === 'in-progress') {
      return { key, ...phase };
    }
  }
  return null;
}

// Export function to get pending features
export function getPendingFeatures() {
  const { specification } = MVP_ROADMAP;
  return Object.entries(specification.features)
    .filter(([_, feature]) => feature.status === 'pending')
    .map(([key, feature]) => ({ key, ...feature }));
}