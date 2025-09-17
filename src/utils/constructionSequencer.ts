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
  // Pre-construction phases
  planning: 10,
  permits: 15,
  
  // Site work
  site_prep: 20,
  demolition: 25,
  excavation: 30,
  
  // Foundation & Structure
  foundation: 35,
  waterproofing: 40,
  backfill: 45,
  
  // Framing & Exterior
  framing: 50,
  sheathing: 55,
  roofing: 60,
  siding: 65,
  windows_doors: 70,
  exterior_finishes: 75,
  
  // Rough-ins (MEP)
  plumbing_rough: 80,
  electrical_rough: 85,
  hvac_rough: 90,
  
  // Insulation & Drywall
  insulation: 95,
  vapor_barrier: 100,
  drywall: 105,
  
  // Flooring
  subfloor: 110,
  flooring_prep: 115,
  flooring: 120,
  
  // Interior Finishes
  interior_trim: 125,
  interior_doors: 130,
  cabinets: 135,
  countertops: 140,
  backsplash: 145,
  
  // Final MEP
  plumbing_finish: 150,
  electrical_finish: 155,
  hvac_finish: 160,
  appliances: 165,
  
  // Final Finishes
  painting: 170,
  final_trim: 175,
  hardware: 180,
  
  // Completion
  cleanup: 185,
  final_inspection: 190,
  walkthrough: 195
} as const;

const PHASE_KEYWORDS = {
  // Pre-construction
  planning: ['plan', 'design', 'survey', 'engineering', 'architect', 'drawing', 'blueprint'],
  permits: ['permit', 'approval', 'inspection fee', 'license', 'zoning'],
  
  // Site work  
  site_prep: ['site prep', 'site preparation', 'protection', 'clear', 'grade', 'level', 'access', 'temporary', 'floor protection', 'dust barrier'],
  demolition: ['demo', 'tear down', 'remove existing', 'remove old', 'demolition', 'disposal', 'strip', 'gut', 'existing backsplash', 'remove backsplash'],
  excavation: ['excavat', 'dig', 'trench', 'grade', 'cut', 'earth'],
  
  // Foundation & Structure
  foundation: ['foundation', 'concrete', 'footing', 'slab', 'basement', 'crawl space', 'pier', 'pour'],
  waterproofing: ['waterproof', 'membrane', 'sealant', 'moisture', 'damp proof'],
  backfill: ['backfill', 'fill', 'compact', 'grade'],
  
  // Framing & Exterior
  framing: ['fram', 'lumber', 'stud', 'joist', 'beam', 'header', 'rafter', 'wall frame', 'truss', 'structural', 'prepare walls'],
  sheathing: ['sheath', 'plywood', 'osb', 'wrap', 'house wrap', 'tyvek'],
  roofing: ['roof', 'shingle', 'membrane', 'underlayment', 'ridge', 'hip', 'gutter', 'fascia', 'soffit'],
  siding: ['siding', 'exterior', 'cladding', 'brick', 'stone', 'stucco', 'vinyl siding'],
  windows_doors: ['window', 'door', 'entry', 'sliding', 'french door', 'exterior door', 'skylight'],
  exterior_finishes: ['exterior trim', 'shutters', 'exterior paint', 'deck', 'porch', 'railing'],
  
  // Rough-ins (MEP)
  plumbing_rough: ['plumb rough', 'rough plumb', 'pipe', 'drain', 'water line', 'supply line', 'waste', 'vent', 'stack'],
  electrical_rough: ['electric rough', 'rough electric', 'electrical inspection', 'electrical report', 'wire', 'outlet box', 'switch box', 'panel', 'circuit', 'conduit'],
  hvac_rough: ['hvac rough', 'duct', 'furnace', 'air condition', 'heating', 'ventilation', 'air handler'],
  
  // Insulation & Drywall
  insulation: ['insulation', 'insulate', 'batt', 'blown', 'spray foam', 'r-value', 'thermal'],
  vapor_barrier: ['vapor barrier', 'moisture barrier', 'plastic', 'seal'],
  drywall: ['drywall', 'sheetrock', 'gypsum', 'mud', 'tape', 'texture', 'plaster', 'board', 'hang', 'finish'],
  
  // Flooring
  subfloor: ['subfloor', 'underlayment', 'floor prep', 'leveling'],
  flooring_prep: ['floor prep', 'sand', 'level', 'moisture test'],
  flooring: ['floor', 'hardwood', 'tile', 'carpet', 'vinyl', 'laminate', 'ceramic', 'lvp', 'lvt'],
  
  // Interior Finishes
  interior_trim: ['trim', 'baseboard', 'casing', 'crown', 'molding', 'millwork', 'wainscot'],
  interior_doors: ['interior door', 'closet door', 'pocket door', 'barn door', 'bi-fold'],
  cabinets: ['cabinet delivery', 'palletizing', 'upper cabinet', 'base cabinet', 'cabinet', 'vanity', 'cupboard', 'kitchen cabinet', 'cabinetry', 'storage', 'pantry', 'white shaker', 'soft-close'],
  countertops: ['counter', 'granite', 'quartz', 'marble', 'laminate counter', 'solid surface', 'butcher block', 'countertop'],
  backsplash: ['install backsplash', 'tile backsplash', 'subway tile', 'mosaic', 'splash'],
  
  // Final MEP
  plumbing_finish: ['plumb finish', 'finish plumb', 'faucet', 'toilet', 'sink', 'shower', 'tub', 'fixture'],
  electrical_finish: ['electric finish', 'finish electric', 'light fixture', 'ceiling fan', 'switch', 'outlet', 'dimmer', 'chandelier'],
  hvac_finish: ['hvac finish', 'register', 'grille', 'thermostat', 'vent cover'],
  appliances: ['appliance', 'dishwasher', 'range', 'oven', 'microwave', 'refrigerator', 'hood', 'disposal'],
  
  // Final Finishes
  painting: ['paint', 'primer', 'stain', 'finish', 'color', 'coat', 'interior paint'],
  final_trim: ['final trim', 'touch up', 'caulk', 'adjustment', 'detail'],
  hardware: ['hardware', 'knob', 'pull', 'handle', 'towel bar', 'accessories'],
  
  // Completion
  cleanup: ['final clean', 'deep clean', 'debris', 'sweep', 'disposal', 'haul away', 'dumpster', 'cleaning of kitchen'],
  final_inspection: ['final inspection', 'certificate', 'occupancy', 'sign off', 'approval'],
  walkthrough: ['walkthrough', 'punch list', 'review', 'client approval', 'handover']
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
  
  // Special case handlers for specific descriptions
  if (lowerDesc.includes('site preparation') || lowerDesc.includes('site protection') || lowerDesc.includes('floor protection')) {
    return 'site_prep';
  }
  if (lowerDesc.includes('remove existing') || lowerDesc.includes('remove backsplash') || lowerDesc.includes('remove old')) {
    return 'demolition';
  }
  if (lowerDesc.includes('electrical inspection') || lowerDesc.includes('electrical report')) {
    return 'electrical_rough';
  }
  if (lowerDesc.includes('cabinet delivery') || lowerDesc.includes('palletizing')) {
    return 'cabinets';
  }
  if (lowerDesc.includes('upper cabinet') || lowerDesc.includes('base cabinet') || lowerDesc.includes('white shaker')) {
    return 'cabinets';
  }
  if (lowerDesc.includes('granite') || lowerDesc.includes('quartz') || lowerDesc.includes('countertop')) {
    return 'countertops';
  }
  if (lowerDesc.includes('final clean') || lowerDesc.includes('deep clean') || lowerDesc.includes('cleaning of kitchen')) {
    return 'cleanup';
  }
  
  // Priority matching for more specific phases first
  const phaseOrder = Object.keys(CONSTRUCTION_PHASES) as (keyof typeof CONSTRUCTION_PHASES)[];
  
  // Check for exact phase matches
  for (const phase of phaseOrder) {
    const keywords = PHASE_KEYWORDS[phase];
    if (keywords.some(keyword => {
      const keywordLower = keyword.toLowerCase();
      // For multi-word keywords, check exact phrase match
      if (keywordLower.includes(' ')) {
        return lowerDesc.includes(keywordLower);
      }
      // For single words, check word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${keywordLower}\\b`);
      return regex.test(lowerDesc);
    })) {
      return phase;
    }
  }
  
  // Fallback based on common terms
  if (lowerDesc.includes('supply') || lowerDesc.includes('deliver')) {
    return 'site_prep'; // Materials delivery early in project
  }
  if (lowerDesc.includes('install') && !lowerDesc.includes('cabinet')) {
    return 'framing'; // General installation
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