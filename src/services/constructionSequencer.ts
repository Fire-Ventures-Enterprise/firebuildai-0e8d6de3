/**
 * Construction Sequencer Service
 * Integrates with the Construction Sequencer API for intelligent project type detection
 * and automatic work sequence generation based on trade specialization
 */

export interface Trade {
  id: string;
  name: string;
  description: string;
  icon: string;
  project_types_count?: number;
}

export interface ProjectType {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  estimated_duration?: string;
  trade_id?: string;
  trade_name?: string;
  sequence?: SequenceItem[];
}

export interface SequenceItem {
  order: number;
  phase: string;
  description: string;
  unit?: string;
  rate_min?: number;
  rate_max?: number;
  estimated_duration_hours?: number;
}

export interface LineItem {
  id?: string;
  description: string;
  sequence_order: number;
  phase: string;
  unit_of_measure: string;
  base_rate?: number;
  rate_range_min?: number;
  rate_range_max?: number;
  depends_on?: string[];
  keywords?: string[];
  estimated_duration_hours?: number;
}

// Trade-specific project types database (embedded for now, can be replaced with API calls)
export const TRADE_PROJECT_TYPES: Record<string, ProjectType[]> = {
  plumbing: [
    {
      id: 'bathtub-install',
      name: 'Bathtub Installation',
      description: 'Complete bathtub installation with plumbing',
      keywords: ['bathtub', 'tub install', 'bathtub replacement', 'tub', 'bath installation'],
      estimated_duration: '2-3 days',
      sequence: [
        { order: 1, phase: 'demo', description: 'Remove old tub', unit: 'LS', rate_min: 150, rate_max: 300 },
        { order: 2, phase: 'rough', description: 'Rough in plumbing', unit: 'LS', rate_min: 300, rate_max: 500 },
        { order: 3, phase: 'install', description: 'Install new tub', unit: 'EA', rate_min: 250, rate_max: 450 },
        { order: 4, phase: 'finish', description: 'Connect supply lines', unit: 'LS', rate_min: 100, rate_max: 200 },
        { order: 5, phase: 'finish', description: 'Connect drain', unit: 'LS', rate_min: 75, rate_max: 150 },
        { order: 6, phase: 'test', description: 'Test and inspect', unit: 'LS', rate_min: 50, rate_max: 100 }
      ]
    },
    {
      id: 'bathroom-plumbing',
      name: 'Bathroom Plumbing Renovation',
      description: 'Complete bathroom plumbing rough and finish',
      keywords: ['bathroom plumb', 'bathroom renovation', 'plumbing rough', 'bathroom remodel'],
      estimated_duration: '3-5 days',
      sequence: [
        { order: 1, phase: 'demo', description: 'Demo existing plumbing', unit: 'LS', rate_min: 200, rate_max: 400 },
        { order: 2, phase: 'rough', description: 'Rough in supply lines', unit: 'LS', rate_min: 400, rate_max: 600 },
        { order: 3, phase: 'rough', description: 'Rough in drain lines', unit: 'LS', rate_min: 300, rate_max: 500 },
        { order: 4, phase: 'install', description: 'Install fixtures', unit: 'LS', rate_min: 500, rate_max: 800 },
        { order: 5, phase: 'test', description: 'Connect and test', unit: 'LS', rate_min: 150, rate_max: 250 }
      ]
    },
    {
      id: 'kitchen-plumbing',
      name: 'Kitchen Plumbing',
      description: 'Kitchen sink and dishwasher plumbing',
      keywords: ['kitchen plumb', 'sink install', 'dishwasher plumb', 'kitchen sink'],
      estimated_duration: '1-2 days',
      sequence: [
        { order: 1, phase: 'rough', description: 'Rough in kitchen plumbing', unit: 'LS', rate_min: 300, rate_max: 500 },
        { order: 2, phase: 'install', description: 'Install kitchen sink', unit: 'EA', rate_min: 200, rate_max: 350 },
        { order: 3, phase: 'install', description: 'Connect dishwasher', unit: 'EA', rate_min: 100, rate_max: 200 },
        { order: 4, phase: 'finish', description: 'Install shut-off valves', unit: 'EA', rate_min: 50, rate_max: 100 },
        { order: 5, phase: 'test', description: 'Test all connections', unit: 'LS', rate_min: 50, rate_max: 100 }
      ]
    }
  ],
  hvac: [
    {
      id: 'furnace-install',
      name: 'Furnace Installation',
      description: 'Complete furnace replacement',
      keywords: ['furnace', 'heating install', 'furnace replacement', 'heater'],
      estimated_duration: '1-2 days',
      sequence: [
        { order: 1, phase: 'demo', description: 'Remove old furnace', unit: 'EA', rate_min: 200, rate_max: 400 },
        { order: 2, phase: 'install', description: 'Install new furnace', unit: 'EA', rate_min: 800, rate_max: 1500 },
        { order: 3, phase: 'install', description: 'Connect gas line', unit: 'LS', rate_min: 150, rate_max: 300 },
        { order: 4, phase: 'install', description: 'Connect electrical', unit: 'LS', rate_min: 100, rate_max: 200 },
        { order: 5, phase: 'install', description: 'Install venting', unit: 'LF', rate_min: 25, rate_max: 50 },
        { order: 6, phase: 'test', description: 'Test and commission', unit: 'LS', rate_min: 150, rate_max: 250 }
      ]
    },
    {
      id: 'ac-install',
      name: 'Air Conditioning Installation',
      description: 'Central AC system installation',
      keywords: ['ac install', 'air conditioning', 'cooling system', 'central air'],
      estimated_duration: '2-3 days',
      sequence: [
        { order: 1, phase: 'demo', description: 'Remove old AC unit', unit: 'EA', rate_min: 150, rate_max: 300 },
        { order: 2, phase: 'install', description: 'Install condenser unit', unit: 'EA', rate_min: 600, rate_max: 1200 },
        { order: 3, phase: 'install', description: 'Install evaporator coil', unit: 'EA', rate_min: 400, rate_max: 800 },
        { order: 4, phase: 'install', description: 'Run refrigerant lines', unit: 'LS', rate_min: 300, rate_max: 500 },
        { order: 5, phase: 'install', description: 'Electrical connections', unit: 'LS', rate_min: 150, rate_max: 300 },
        { order: 6, phase: 'test', description: 'Charge and test system', unit: 'LS', rate_min: 200, rate_max: 350 }
      ]
    }
  ],
  electrical: [
    {
      id: 'panel-upgrade',
      name: 'Electrical Panel Upgrade',
      description: '200A panel upgrade',
      keywords: ['panel upgrade', 'electrical panel', 'breaker box', '200 amp'],
      estimated_duration: '1-2 days',
      sequence: [
        { order: 1, phase: 'demo', description: 'Remove old panel', unit: 'EA', rate_min: 200, rate_max: 400 },
        { order: 2, phase: 'install', description: 'Install new 200A panel', unit: 'EA', rate_min: 800, rate_max: 1500 },
        { order: 3, phase: 'install', description: 'Install breakers', unit: 'EA', rate_min: 30, rate_max: 60 },
        { order: 4, phase: 'install', description: 'Reconnect circuits', unit: 'LS', rate_min: 400, rate_max: 800 },
        { order: 5, phase: 'test', description: 'Test and label', unit: 'LS', rate_min: 100, rate_max: 200 },
        { order: 6, phase: 'inspect', description: 'Inspection', unit: 'LS', rate_min: 0, rate_max: 0 }
      ]
    },
    {
      id: 'kitchen-rewire',
      name: 'Kitchen Rewiring',
      description: 'Complete kitchen electrical renovation',
      keywords: ['kitchen electric', 'kitchen rewire', 'kitchen outlets'],
      estimated_duration: '2-3 days',
      sequence: [
        { order: 1, phase: 'rough', description: 'Run new circuits', unit: 'EA', rate_min: 150, rate_max: 300 },
        { order: 2, phase: 'rough', description: 'Install outlet boxes', unit: 'EA', rate_min: 20, rate_max: 40 },
        { order: 3, phase: 'finish', description: 'Install GFCI outlets', unit: 'EA', rate_min: 40, rate_max: 80 },
        { order: 4, phase: 'finish', description: 'Install under-cabinet lighting', unit: 'LF', rate_min: 25, rate_max: 50 },
        { order: 5, phase: 'finish', description: 'Install switches and dimmers', unit: 'EA', rate_min: 30, rate_max: 60 }
      ]
    }
  ],
  general: [
    {
      id: 'kitchen-renovation',
      name: 'Kitchen Renovation',
      description: 'Complete kitchen remodel',
      keywords: ['kitchen reno', 'kitchen remodel', 'kitchen renovation', 'kitchen upgrade'],
      estimated_duration: '4-6 weeks',
      sequence: [
        { order: 1, phase: 'demo', description: 'Demo existing kitchen', unit: 'LS', rate_min: 800, rate_max: 1500 },
        { order: 2, phase: 'rough', description: 'Electrical rough-in', unit: 'LS', rate_min: 600, rate_max: 1000 },
        { order: 3, phase: 'rough', description: 'Plumbing rough-in', unit: 'LS', rate_min: 500, rate_max: 800 },
        { order: 4, phase: 'install', description: 'Drywall installation', unit: 'SF', rate_min: 3, rate_max: 5 },
        { order: 5, phase: 'finish', description: 'Paint walls', unit: 'SF', rate_min: 2, rate_max: 4 },
        { order: 6, phase: 'install', description: 'Install flooring', unit: 'SF', rate_min: 8, rate_max: 15 },
        { order: 7, phase: 'install', description: 'Install cabinets', unit: 'LF', rate_min: 150, rate_max: 300 },
        { order: 8, phase: 'install', description: 'Install countertops', unit: 'SF', rate_min: 60, rate_max: 120 },
        { order: 9, phase: 'finish', description: 'Install fixtures', unit: 'LS', rate_min: 400, rate_max: 600 },
        { order: 10, phase: 'finish', description: 'Install appliances', unit: 'LS', rate_min: 300, rate_max: 500 }
      ]
    },
    {
      id: 'bathroom-renovation',
      name: 'Bathroom Renovation',
      description: 'Complete bathroom remodel',
      keywords: ['bathroom reno', 'bathroom remodel', 'bathroom renovation', 'bath upgrade'],
      estimated_duration: '2-3 weeks',
      sequence: [
        { order: 1, phase: 'demo', description: 'Demo existing bathroom', unit: 'LS', rate_min: 500, rate_max: 1000 },
        { order: 2, phase: 'rough', description: 'Plumbing rough-in', unit: 'LS', rate_min: 400, rate_max: 700 },
        { order: 3, phase: 'rough', description: 'Electrical rough-in', unit: 'LS', rate_min: 300, rate_max: 500 },
        { order: 4, phase: 'install', description: 'Install drywall', unit: 'SF', rate_min: 3, rate_max: 5 },
        { order: 5, phase: 'install', description: 'Install tile flooring', unit: 'SF', rate_min: 10, rate_max: 20 },
        { order: 6, phase: 'install', description: 'Install shower/tub', unit: 'EA', rate_min: 400, rate_max: 800 },
        { order: 7, phase: 'install', description: 'Install vanity', unit: 'EA', rate_min: 200, rate_max: 400 },
        { order: 8, phase: 'finish', description: 'Install fixtures', unit: 'LS', rate_min: 300, rate_max: 500 },
        { order: 9, phase: 'finish', description: 'Paint and finish', unit: 'SF', rate_min: 2, rate_max: 4 }
      ]
    }
  ]
};

export class ConstructionSequencerService {
  /**
   * Get project types for a specific trade
   */
  static getProjectTypesForTrade(tradeType: string): ProjectType[] {
    return TRADE_PROJECT_TYPES[tradeType.toLowerCase()] || [];
  }

  /**
   * Search for project types based on keywords
   */
  static searchProjectTypes(query: string, tradeType?: string): ProjectType[] {
    const searchTerm = query.toLowerCase();
    let projectTypes: ProjectType[] = [];

    // If trade type is specified, search only within that trade
    if (tradeType) {
      projectTypes = TRADE_PROJECT_TYPES[tradeType.toLowerCase()] || [];
    } else {
      // Search across all trades
      projectTypes = Object.values(TRADE_PROJECT_TYPES).flat();
    }

    // Filter by keywords and name
    return projectTypes.filter(project => 
      project.name.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get a specific project type by ID
   */
  static getProjectType(projectId: string, tradeType?: string): ProjectType | undefined {
    if (tradeType) {
      const projects = TRADE_PROJECT_TYPES[tradeType.toLowerCase()] || [];
      return projects.find(p => p.id === projectId);
    }

    // Search across all trades
    for (const projects of Object.values(TRADE_PROJECT_TYPES)) {
      const project = projects.find(p => p.id === projectId);
      if (project) return project;
    }

    return undefined;
  }

  /**
   * Generate estimate line items from a project type
   */
  static generateLineItems(projectType: ProjectType, defaultRate?: number): any[] {
    if (!projectType.sequence) return [];

    return projectType.sequence.map((item, index) => ({
      description: item.description,
      quantity: 1,
      rate: defaultRate || item.rate_min || 0,
      amount: defaultRate || item.rate_min || 0,
      unit: item.unit || 'LS',
      phase: item.phase,
      sort_order: index
    }));
  }

  /**
   * Detect project type from text description
   */
  static detectProjectType(text: string, tradeType?: string): ProjectType | undefined {
    const normalizedText = text.toLowerCase();
    let projectTypes: ProjectType[] = [];

    if (tradeType) {
      projectTypes = TRADE_PROJECT_TYPES[tradeType.toLowerCase()] || [];
    } else {
      projectTypes = Object.values(TRADE_PROJECT_TYPES).flat();
    }

    // Score each project type based on keyword matches
    const scoredProjects = projectTypes.map(project => {
      let score = 0;
      
      // Check name match
      if (normalizedText.includes(project.name.toLowerCase())) {
        score += 10;
      }

      // Check keyword matches
      project.keywords.forEach(keyword => {
        if (normalizedText.includes(keyword.toLowerCase())) {
          score += 5;
        }
      });

      return { project, score };
    });

    // Sort by score and return the best match
    const sorted = scoredProjects.sort((a, b) => b.score - a.score);
    return sorted[0]?.score > 0 ? sorted[0].project : undefined;
  }

  /**
   * Get all available trades
   */
  static getAllTrades(): Trade[] {
    return [
      { id: 'general', name: 'General Contractor', description: 'Full-service construction and renovation', icon: '🏗️' },
      { id: 'plumbing', name: 'Plumbing', description: 'Residential and commercial plumbing services', icon: '🔧' },
      { id: 'hvac', name: 'HVAC', description: 'Heating, ventilation, and air conditioning', icon: '❄️' },
      { id: 'electrical', name: 'Electrical', description: 'Electrical installation and repair', icon: '⚡' },
      { id: 'flooring', name: 'Flooring', description: 'Flooring installation and refinishing', icon: '🏠' },
      { id: 'roofing', name: 'Roofing', description: 'Roof installation and repair', icon: '🏚️' },
      { id: 'painting', name: 'Painting', description: 'Interior and exterior painting', icon: '🎨' },
      { id: 'landscaping', name: 'Landscaping', description: 'Landscape design and maintenance', icon: '🌳' }
    ];
  }
}