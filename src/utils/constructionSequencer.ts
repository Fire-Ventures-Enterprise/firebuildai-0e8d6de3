// src/utils/constructionSequencer.ts

export interface SequencedLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
  category?: string;
  phase: string;
  phaseOrder: number;
  sequenceOrder: number;
}

const CONSTRUCTION_PHASES = {
  planning: 10,
  permits: 15,
  site_prep: 20,
  excavation: 25,
  foundation: 30,
  waterproofing: 35,
  backfill: 40,
  framing: 50,
  sheathing: 55,
  roofing: 60,
  windows_doors: 65,
  plumbing_rough: 70,
  electrical_rough: 75,
  hvac_rough: 80,
  insulation: 90,
  drywall: 95,
  subfloor: 100,
  flooring: 105,
  interior_trim: 110,
  cabinets: 115,
  countertops: 120,
  plumbing_finish: 130,
  electrical_finish: 135,
  hvac_finish: 140,
  painting: 150,
  final_trim: 155,
  cleanup: 160,
  final_inspection: 170
} as const;

const PHASE_KEYWORDS = {
  planning: ['plan', 'design', 'permit', 'survey', 'engineering'],
  permits: ['permit', 'approval', 'inspection fee'],
  site_prep: ['clear', 'grade', 'excavat', 'demo', 'tear down', 'remove', 'demolition'],
  excavation: ['excavat', 'dig', 'trench', 'grade'],
  foundation: ['foundation', 'concrete', 'footing', 'slab', 'basement', 'crawl space'],
  waterproofing: ['waterproof', 'membrane', 'sealant', 'vapor barrier'],
  backfill: ['backfill', 'fill', 'compact'],
  framing: ['fram', 'lumber', 'stud', 'joist', 'beam', 'header', 'rafter', 'wall frame'],
  sheathing: ['sheath', 'plywood', 'osb', 'subfloor'],
  roofing: ['roof', 'shingle', 'membrane', 'underlayment', 'ridge', 'hip'],
  windows_doors: ['window', 'door', 'entry', 'sliding', 'french door'],
  plumbing_rough: ['plumb rough', 'rough plumb', 'pipe', 'drain', 'water line', 'supply line'],
  electrical_rough: ['electric rough', 'rough electric', 'wire', 'outlet', 'switch', 'panel'],
  hvac_rough: ['hvac rough', 'duct', 'furnace', 'air condition', 'heating'],
  insulation: ['insulation', 'insulate', 'batt', 'blown'],
  drywall: ['drywall', 'sheetrock', 'gypsum', 'mud', 'tape', 'texture'],
  subfloor: ['subfloor', 'underlayment', 'floor prep'],
  flooring: ['floor', 'hardwood', 'tile', 'carpet', 'vinyl', 'laminate', 'ceramic'],
  interior_trim: ['trim', 'baseboard', 'casing', 'crown molding'],
  cabinets: ['cabinet', 'vanity', 'cupboard', 'kitchen cabinet'],
  countertops: ['counter', 'granite', 'quartz', 'marble', 'laminate counter'],
  plumbing_finish: ['plumb finish', 'finish plumb', 'faucet', 'toilet', 'sink'],
  electrical_finish: ['electric finish', 'finish electric', 'light fixture', 'ceiling fan'],
  hvac_finish: ['hvac finish', 'register', 'grille', 'thermostat'],
  painting: ['paint', 'primer', 'stain', 'finish', 'color'],
  final_trim: ['final trim', 'touch up', 'caulk'],
  cleanup: ['clean', 'final clean', 'debris removal', 'sweep'],
  final_inspection: ['final inspection', 'certificate', 'occupancy']
} as const;

const detectProjectType = (lineItems: any[]): string => {
  const allText = lineItems.map(item => 
    `${item.description || ''} ${item.category || ''}`
  ).join(' ').toLowerCase();
  
  if (allText.includes('kitchen') || allText.includes('cabinet') || allText.includes('countertop')) {
    return 'kitchen';
  }
  if (allText.includes('bathroom') || allText.includes('toilet') || allText.includes('shower')) {
    return 'bathroom';
  }
  if (allText.includes('roof') || allText.includes('shingle') || allText.includes('gutter')) {
    return 'roofing';
  }
  if (allText.includes('addition') || allText.includes('extension')) {
    return 'addition';
  }
  
  return 'renovation';
};

const matchItemToPhase = (description: string): keyof typeof CONSTRUCTION_PHASES => {
  const lowerDesc = description.toLowerCase();
  
  for (const [phase, keywords] of Object.entries(PHASE_KEYWORDS)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword))) {
      return phase as keyof typeof CONSTRUCTION_PHASES;
    }
  }
  
  return 'planning'; // Default phase
};

export const sequenceLineItems = (lineItems: any[]): SequencedLineItem[] => {
  const projectType = detectProjectType(lineItems);
  
  const sequencedItems = lineItems.map((item, index) => {
    const phase = matchItemToPhase(item.description || '');
    const phaseOrder = CONSTRUCTION_PHASES[phase];
    
    return {
      id: item.id || `item-${index}`,
      description: item.description || '',
      quantity: item.quantity || 0,
      unit: item.unit || 'ea',
      rate: item.rate || 0,
      total: item.total || (item.quantity * item.rate),
      category: item.category,
      phase,
      phaseOrder,
      sequenceOrder: phaseOrder * 100 + index // Ensure unique ordering
    };
  });
  
  // Sort by phase order, then by original order within phase
  return sequencedItems.sort((a, b) => a.sequenceOrder - b.sequenceOrder);
};

export const getPhaseGroups = (sequencedItems: SequencedLineItem[]) => {
  const groups = new Map<string, SequencedLineItem[]>();
  
  sequencedItems.forEach(item => {
    const phase = item.phase;
    if (!groups.has(phase)) {
      groups.set(phase, []);
    }
    groups.get(phase)!.push(item);
  });
  
  return Array.from(groups.entries()).map(([phase, items]) => ({
    phase,
    phaseOrder: CONSTRUCTION_PHASES[phase as keyof typeof CONSTRUCTION_PHASES],
    items,
    total: items.reduce((sum, item) => sum + item.total, 0)
  })).sort((a, b) => a.phaseOrder - b.phaseOrder);
};

// Backward compatibility exports
export { detectProjectType };

// Legacy function mappings for compatibility
export function getSequencePosition(
  description: string, 
  projectType: string = 'general'
): number {
  const phase = matchItemToPhase(description);
  return CONSTRUCTION_PHASES[phase];
}

export function sortByProjectSequence(
  items: any[], 
  projectType: string = 'general'
): any[] {
  const sequenced = sequenceLineItems(items);
  return sequenced;
}

export function insertItemsInSequence(
  existingItems: any[], 
  newItems: any[], 
  projectType: string = 'general'
): any[] {
  const allItems = [...existingItems, ...newItems];
  return sequenceLineItems(allItems);
}

export function getPhaseForPosition(position: number, projectType: string = 'general'): string {
  // Find the phase that matches this position
  for (const [phase, order] of Object.entries(CONSTRUCTION_PHASES)) {
    if (order === position) {
      return phase;
    }
  }
  
  // Find the closest phase
  let closestPhase = 'planning';
  let closestDiff = Math.abs(position - CONSTRUCTION_PHASES.planning);
  
  for (const [phase, order] of Object.entries(CONSTRUCTION_PHASES)) {
    const diff = Math.abs(position - order);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestPhase = phase;
    }
  }
  
  return closestPhase;
}

// Export project sequences for backward compatibility
export const PROJECT_SEQUENCES = {
  garage: Object.entries(CONSTRUCTION_PHASES).map(([phase, order]) => ({
    phase,
    order,
    keywords: PHASE_KEYWORDS[phase as keyof typeof PHASE_KEYWORDS] || []
  })),
  bathroom: Object.entries(CONSTRUCTION_PHASES).map(([phase, order]) => ({
    phase,
    order,
    keywords: PHASE_KEYWORDS[phase as keyof typeof PHASE_KEYWORDS] || []
  })),
  kitchen: Object.entries(CONSTRUCTION_PHASES).map(([phase, order]) => ({
    phase,
    order,
    keywords: PHASE_KEYWORDS[phase as keyof typeof PHASE_KEYWORDS] || []
  })),
  roof: Object.entries(CONSTRUCTION_PHASES).map(([phase, order]) => ({
    phase,
    order,
    keywords: PHASE_KEYWORDS[phase as keyof typeof PHASE_KEYWORDS] || []
  })),
  basement: Object.entries(CONSTRUCTION_PHASES).map(([phase, order]) => ({
    phase,
    order,
    keywords: PHASE_KEYWORDS[phase as keyof typeof PHASE_KEYWORDS] || []
  })),
  deck: Object.entries(CONSTRUCTION_PHASES).map(([phase, order]) => ({
    phase,
    order,
    keywords: PHASE_KEYWORDS[phase as keyof typeof PHASE_KEYWORDS] || []
  })),
  addition: Object.entries(CONSTRUCTION_PHASES).map(([phase, order]) => ({
    phase,
    order,
    keywords: PHASE_KEYWORDS[phase as keyof typeof PHASE_KEYWORDS] || []
  }))
};