export enum IndustryType {
  GENERAL_CONTRACTOR = 'general_contractor',
  FLOORING = 'flooring',
  PAINTING = 'painting',
  HVAC = 'hvac',
  ELECTRICAL = 'electrical',
  PLUMBING = 'plumbing',
  ROOFING = 'roofing',
  LANDSCAPING = 'landscaping',
  KITCHEN_BATH = 'kitchen_bath',
  CUSTOM = 'custom'
}

export interface ServicePhase {
  id: string;
  name: string;
  duration: string;
  duration_days?: number;
  type?: 'work' | 'waiting_period' | 'vendor_process';
  dependencies?: string[];
  description?: string;
  offset?: string;
  canStartWhen?: string;
  materials?: string[];
}

export interface ProductSelection {
  required: boolean;
  categories: string[];
  leadTime: string;
  leadTimeDays?: number;
  suppliers?: string[];
  orderingProcess?: {
    steps: string[];
  };
}

export interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  industryTypes: IndustryType[];
  estimatedDuration?: string;
  totalDuration?: string;
  duration_days?: number;
  phases?: ServicePhase[];
  dependencies?: {
    required?: string[];
    optional?: string[];
    timing?: 'after_completion' | 'can_overlap';
  };
  materials?: string[];
  productSelection?: ProductSelection;
  sequencingKeywords?: string[];
  isCustom?: boolean;
  userId?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  primaryIndustry: IndustryType;
  secondaryIndustries?: IndustryType[];
  servicesEnabled: {
    useIndustryDefaults: boolean;
    customCategories?: string[];
    hiddenServices?: string[];
  };
  workingHours?: {
    [key: number]: { start: string; end: string }[];
  };
  holidays?: string[];
  bufferDaysPerTask?: number;
}

// Industry-specific service definitions
export const ServiceCategories: Record<string, ServiceDefinition[]> = {
  kitchen_renovation: [
    {
      id: 'kitchen_demo',
      name: 'Kitchen Demolition',
      description: 'Complete kitchen demolition including cabinets, countertops, and appliances',
      category: 'Demolition',
      industryTypes: [IndustryType.GENERAL_CONTRACTOR, IndustryType.KITCHEN_BATH],
      duration_days: 1.5,
      estimatedDuration: '1-2 days',
      phases: [
        {
          id: 'permit_check',
          name: 'Permit Verification',
          duration: '1 hour',
          duration_days: 0.125,
          type: 'work'
        },
        {
          id: 'utility_disconnect',
          name: 'Utility Disconnection',
          duration: '2-3 hours',
          duration_days: 0.375,
          type: 'work'
        },
        {
          id: 'demolition',
          name: 'Demolition Work',
          duration: '1 day',
          duration_days: 1,
          type: 'work'
        },
        {
          id: 'debris_removal',
          name: 'Debris Removal',
          duration: '2-3 hours',
          duration_days: 0.375,
          type: 'work'
        }
      ],
      productSelection: {
        required: false,
        categories: ['dumpster_rental'],
        leadTime: '1 day',
        leadTimeDays: 1
      }
    },
    {
      id: 'cabinet_install',
      name: 'Cabinet Installation',
      description: 'Professional installation of kitchen cabinets',
      category: 'Cabinetry',
      industryTypes: [IndustryType.GENERAL_CONTRACTOR, IndustryType.KITCHEN_BATH],
      duration_days: 2.5,
      estimatedDuration: '2-3 days',
      dependencies: {
        required: ['kitchen_demo', 'electrical_rough', 'plumbing_rough'],
        timing: 'after_completion'
      },
      productSelection: {
        required: true,
        leadTime: '4-6 weeks',
        leadTimeDays: 35,
        categories: ['base_cabinets', 'wall_cabinets', 'tall_cabinets', 'hardware'],
        orderingProcess: {
          steps: ['measurement', 'selection', 'order_placement', 'delivery_scheduling']
        }
      }
    },
    {
      id: 'countertop_full_process',
      name: 'Countertop Complete Process',
      description: 'Complete countertop process from measurement to plumbing hookup',
      category: 'Countertops',
      industryTypes: [IndustryType.GENERAL_CONTRACTOR, IndustryType.KITCHEN_BATH],
      totalDuration: '8-10 days',
      duration_days: 9,
      phases: [
        {
          id: 'template_creation',
          name: 'Template Creation',
          duration: '2-4 hours',
          duration_days: 0.375,
          dependencies: ['cabinet_install'],
          description: 'Precise measurement after cabinet installation',
          type: 'work'
        },
        {
          id: 'fabrication_wait',
          name: 'Fabrication Period',
          duration: '5-7 days',
          duration_days: 6,
          type: 'waiting_period',
          description: 'Off-site fabrication by supplier'
        },
        {
          id: 'countertop_installation',
          name: 'Countertop Installation',
          duration: '4-6 hours',
          duration_days: 0.625,
          type: 'work',
          dependencies: ['fabrication_wait'],
          description: 'Professional installation of fabricated countertops'
        },
        {
          id: 'plumbing_completion',
          name: 'Plumbing Connections',
          duration: '2-3 hours',
          duration_days: 0.375,
          type: 'work',
          dependencies: ['countertop_installation'],
          offset: '+1 day',
          description: 'Sink, faucet, and disposal installation'
        }
      ],
      materials: ['countertop_material', 'sink', 'faucet', 'disposal'],
      productSelection: {
        required: true,
        leadTime: '5-7 days',
        leadTimeDays: 6,
        categories: ['granite', 'quartz', 'marble', 'quartzite', 'laminate', 'butcher_block']
      }
    },
    {
      id: 'tile_backsplash',
      name: 'Tile Backsplash Installation',
      description: 'Kitchen backsplash tile installation',
      category: 'Tile Work',
      industryTypes: [IndustryType.GENERAL_CONTRACTOR, IndustryType.KITCHEN_BATH],
      duration_days: 2,
      estimatedDuration: '2 days',
      dependencies: {
        required: ['countertop_full_process'],
        optional: ['electrical_outlets'],
        timing: 'after_completion'
      },
      phases: [
        {
          id: 'surface_prep',
          name: 'Surface Preparation',
          duration: '2-3 hours',
          duration_days: 0.375,
          canStartWhen: 'countertop_install.completed'
        },
        {
          id: 'tile_install',
          name: 'Tile Installation',
          duration: '1 day',
          duration_days: 1
        },
        {
          id: 'grouting',
          name: 'Grouting & Sealing',
          duration: '4-5 hours',
          duration_days: 0.625,
          offset: '+1 day'
        }
      ],
      productSelection: {
        required: true,
        categories: ['tile', 'grout', 'adhesive', 'sealer'],
        leadTime: '1 week',
        leadTimeDays: 7
      }
    }
  ],
  flooring: [
    {
      id: 'subfloor_prep',
      name: 'Subfloor Preparation',
      description: 'Level and prepare subfloor for new flooring installation',
      category: 'Preparation',
      industryTypes: [IndustryType.FLOORING, IndustryType.GENERAL_CONTRACTOR],
      duration_days: 1.5,
      estimatedDuration: '1-2 days',
      dependencies: {
        required: ['demolition'],
        timing: 'after_completion'
      },
      materials: ['plywood', 'leveling_compound', 'moisture_barrier'],
      productSelection: {
        required: true,
        categories: ['subfloor_materials'],
        leadTime: '2-3 days',
        leadTimeDays: 2.5
      }
    },
    {
      id: 'baseboard_removal_install',
      name: 'Baseboard Removal & Reinstallation',
      description: 'Remove existing baseboards, install flooring, reinstall and paint baseboards',
      category: 'Trim Work',
      industryTypes: [IndustryType.FLOORING, IndustryType.PAINTING],
      totalDuration: '3-4 days',
      duration_days: 3.5,
      phases: [
        {
          id: 'baseboard_removal',
          name: 'Baseboard Removal',
          duration: '2-4 hours',
          duration_days: 0.375
        },
        {
          id: 'flooring_installation',
          name: 'Flooring Installation',
          duration: '1-2 days',
          duration_days: 1.5
        },
        {
          id: 'baseboard_reinstall',
          name: 'Baseboard Reinstallation',
          duration: '4-6 hours',
          duration_days: 0.625
        },
        {
          id: 'baseboard_painting',
          name: 'Baseboard Painting',
          duration: '2-3 hours',
          duration_days: 0.375,
          offset: '+1 day'
        }
      ]
    },
    {
      id: 'transition_strips',
      name: 'Transition Strip Installation',
      description: 'Install transition strips between different flooring types',
      category: 'Finishing',
      industryTypes: [IndustryType.FLOORING],
      duration_days: 0.375,
      estimatedDuration: '2-4 hours',
      dependencies: {
        required: ['flooring_install'],
        timing: 'after_completion'
      },
      materials: ['transition_strips', 'adhesive', 'screws']
    },
    {
      id: 'hardwood_install',
      name: 'Hardwood Floor Installation',
      description: 'Professional hardwood flooring installation',
      category: 'Flooring',
      industryTypes: [IndustryType.FLOORING],
      duration_days: 3,
      estimatedDuration: '2-4 days',
      phases: [
        {
          id: 'acclimation',
          name: 'Wood Acclimation',
          duration: '48-72 hours',
          duration_days: 2.5,
          type: 'waiting_period',
          description: 'Allow wood to acclimate to room conditions'
        },
        {
          id: 'installation',
          name: 'Floor Installation',
          duration: '2-3 days',
          duration_days: 2.5,
          type: 'work'
        },
        {
          id: 'finishing',
          name: 'Sanding & Finishing',
          duration: '1-2 days',
          duration_days: 1.5,
          type: 'work'
        }
      ],
      productSelection: {
        required: true,
        categories: ['hardwood_type', 'stain', 'finish'],
        leadTime: '1-2 weeks',
        leadTimeDays: 10
      }
    }
  ],
  hvac: [
    {
      id: 'hvac_system_replacement',
      name: 'HVAC System Replacement',
      description: 'Complete HVAC system replacement',
      category: 'HVAC',
      industryTypes: [IndustryType.HVAC],
      duration_days: 2,
      estimatedDuration: '1-2 days',
      phases: [
        {
          id: 'removal',
          name: 'Old System Removal',
          duration: '4-6 hours',
          duration_days: 0.625
        },
        {
          id: 'installation',
          name: 'New System Installation',
          duration: '6-8 hours',
          duration_days: 0.875
        },
        {
          id: 'testing',
          name: 'System Testing & Commissioning',
          duration: '2-3 hours',
          duration_days: 0.375
        }
      ],
      productSelection: {
        required: true,
        categories: ['furnace', 'air_conditioner', 'thermostat'],
        leadTime: '3-5 days',
        leadTimeDays: 4
      }
    }
  ]
};

// Default company profiles
export const DefaultCompanyProfiles: Record<string, CompanyProfile> = {
  general_contractor: {
    id: 'general_contractor',
    name: 'General Contractor',
    primaryIndustry: IndustryType.GENERAL_CONTRACTOR,
    secondaryIndustries: [],
    servicesEnabled: {
      useIndustryDefaults: true
    },
    workingHours: {
      1: [{ start: '08:00', end: '17:00' }],
      2: [{ start: '08:00', end: '17:00' }],
      3: [{ start: '08:00', end: '17:00' }],
      4: [{ start: '08:00', end: '17:00' }],
      5: [{ start: '08:00', end: '17:00' }]
    },
    bufferDaysPerTask: 0.1
  },
  flooring_specialist: {
    id: 'flooring_specialist',
    name: 'Flooring Specialist',
    primaryIndustry: IndustryType.FLOORING,
    secondaryIndustries: [IndustryType.PAINTING],
    servicesEnabled: {
      useIndustryDefaults: true,
      customCategories: ['demolition', 'subfloor_work']
    },
    workingHours: {
      1: [{ start: '08:00', end: '17:00' }],
      2: [{ start: '08:00', end: '17:00' }],
      3: [{ start: '08:00', end: '17:00' }],
      4: [{ start: '08:00', end: '17:00' }],
      5: [{ start: '08:00', end: '17:00' }]
    },
    bufferDaysPerTask: 0.1
  },
  kitchen_bath_specialist: {
    id: 'kitchen_bath_specialist',
    name: 'Kitchen & Bath Remodeler',
    primaryIndustry: IndustryType.KITCHEN_BATH,
    secondaryIndustries: [IndustryType.PLUMBING, IndustryType.ELECTRICAL],
    servicesEnabled: {
      useIndustryDefaults: true
    },
    workingHours: {
      1: [{ start: '08:00', end: '17:00' }],
      2: [{ start: '08:00', end: '17:00' }],
      3: [{ start: '08:00', end: '17:00' }],
      4: [{ start: '08:00', end: '17:00' }],
      5: [{ start: '08:00', end: '17:00' }]
    },
    bufferDaysPerTask: 0.15
  }
};

// Helper function to get services for a company profile
export function getServicesForProfile(profile: CompanyProfile): ServiceDefinition[] {
  const services: ServiceDefinition[] = [];
  const allCategories = Object.values(ServiceCategories).flat();
  
  // Filter services based on company's industries
  const relevantIndustries = [
    profile.primaryIndustry,
    ...(profile.secondaryIndustries || [])
  ];
  
  for (const service of allCategories) {
    const hasMatchingIndustry = service.industryTypes.some(
      type => relevantIndustries.includes(type)
    );
    
    if (hasMatchingIndustry) {
      // Check if service is hidden
      if (profile.servicesEnabled.hiddenServices?.includes(service.id)) {
        continue;
      }
      services.push(service);
    }
  }
  
  return services;
}