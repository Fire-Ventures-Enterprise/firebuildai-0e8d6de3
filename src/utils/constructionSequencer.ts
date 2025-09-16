/**
 * Construction Sequencer
 * Defines the correct order of construction tasks for different project types
 */

export interface SequenceItem {
  phase: string;
  order: number;
  keywords: string[];
}

/**
 * Project-specific construction sequences
 * Each project type has its own specific order of operations
 */
export const PROJECT_SEQUENCES: Record<string, SequenceItem[]> = {
  'garage': [
    // Phase 1: Planning & Prep
    { phase: 'Planning', order: 10, keywords: ['permit', 'approval', 'planning', 'design'] },
    { phase: 'Site Prep', order: 20, keywords: ['site', 'clear', 'demolition', 'demo', 'removal'] },
    { phase: 'Utilities', order: 30, keywords: ['portable toilet', 'portable potty', 'porta potty', 'facilities'] },
    { phase: 'Site Setup', order: 40, keywords: ['garbage bin', 'dumpster', 'waste container', 'disposal bin'] },
    
    // Phase 2: Foundation
    { phase: 'Excavation', order: 50, keywords: ['excavat', 'dig', 'grade', 'grading', 'level'] },
    { phase: 'Footings', order: 60, keywords: ['footing', 'footer', 'foundation prep'] },
    { phase: 'Foundation', order: 70, keywords: ['foundation wall', 'foundation', 'stem wall'] },
    { phase: 'Concrete Slab', order: 80, keywords: ['concrete floor', 'slab', 'pour concrete', 'concrete pad'] },
    
    // Phase 3: Structure
    { phase: 'Framing', order: 90, keywords: ['fram', 'stud', 'wall frame', 'lumber', '2x4', '2x6'] },
    { phase: 'Roof Structure', order: 100, keywords: ['truss', 'rafter', 'roof frame', 'ridge'] },
    { phase: 'Sheathing', order: 110, keywords: ['sheath', 'osb', 'plywood', 'decking'] },
    { phase: 'Roofing', order: 120, keywords: ['roofing', 'shingle', 'underlayment', 'roof material'] },
    
    // Phase 4: Exterior Details
    { phase: 'Soffit/Fascia', order: 130, keywords: ['soffit', 'fascia', 'fascia board'] },
    { phase: 'Eaves/Vents', order: 140, keywords: ['eave', 'ventilation', 'vent', 'ridge vent'] },
    { phase: 'Gutters', order: 150, keywords: ['gutter', 'downspout', 'rain gutter'] },
    
    // Phase 5: Exterior Finish
    { phase: 'Windows/Doors', order: 160, keywords: ['window', 'service door', 'entry door', 'man door'] },
    { phase: 'Garage Doors', order: 170, keywords: ['garage door', 'overhead door'] },
    { phase: 'Siding', order: 180, keywords: ['siding', 'exterior cladding', 'vinyl', 'fiber cement'] },
    
    // Phase 6: Interior Systems
    { phase: 'Electrical Rough', order: 190, keywords: ['electrical rough', 'rough-in electric', 'rough wiring'] },
    { phase: 'Insulation', order: 200, keywords: ['insulation', 'insulate', 'vapor barrier'] },
    { phase: 'Drywall', order: 210, keywords: ['drywall', 'sheetrock', 'gypsum', 'tape', 'mud'] },
    { phase: 'Electrical Finish', order: 220, keywords: ['electrical finish', 'outlet', 'switch', 'fixture'] },
    { phase: 'Lighting', order: 230, keywords: ['light', 'lighting', 'lamp', 'bulb'] },
    
    // Phase 7: Final Work
    { phase: 'Garage Door Openers', order: 240, keywords: ['garage door opener', 'opener', 'automatic'] },
    { phase: 'Painting', order: 250, keywords: ['paint', 'primer', 'stain', 'finish'] },
    { phase: 'Final Grade', order: 260, keywords: ['final grade', 'landscape', 'seed', 'sod'] },
    { phase: 'Driveway', order: 270, keywords: ['driveway', 'approach', 'apron'] },
    
    // Phase 8: Cleanup
    { phase: 'Cleanup', order: 280, keywords: ['cleanup', 'clean up', 'final clean', 'post construction'] },
    { phase: 'Inspection', order: 290, keywords: ['inspection', 'final inspection', 'sign-off'] }
  ],
  
  'bathroom': [
    { phase: 'Planning', order: 10, keywords: ['permit', 'approval', 'planning'] },
    { phase: 'Setup', order: 20, keywords: ['garbage', 'disposal', 'dumpster', 'protection'] },
    { phase: 'Demo', order: 30, keywords: ['demo', 'removal', 'tear out'] },
    { phase: 'Plumbing Rough', order: 40, keywords: ['plumbing rough', 'rough plumb', 'drain', 'supply'] },
    { phase: 'Electrical Rough', order: 50, keywords: ['electrical rough', 'rough electric', 'gfci'] },
    { phase: 'HVAC', order: 60, keywords: ['hvac', 'vent', 'exhaust fan', 'ventilation'] },
    { phase: 'Framing', order: 70, keywords: ['fram', 'stud', 'blocking'] },
    { phase: 'Insulation', order: 80, keywords: ['insulation', 'vapor barrier'] },
    { phase: 'Waterproofing', order: 90, keywords: ['waterproof', 'membrane', 'redguard', 'schluter'] },
    { phase: 'Drywall', order: 100, keywords: ['drywall', 'greenboard', 'cement board'] },
    { phase: 'Tile Prep', order: 110, keywords: ['tile prep', 'mortar bed', 'level'] },
    { phase: 'Tile Work', order: 120, keywords: ['tile', 'grout', 'caulk'] },
    { phase: 'Vanity Install', order: 130, keywords: ['vanity', 'cabinet', 'countertop'] },
    { phase: 'Plumbing Fixtures', order: 140, keywords: ['toilet', 'sink', 'faucet', 'shower', 'tub'] },
    { phase: 'Electrical Finish', order: 150, keywords: ['electrical finish', 'light', 'switch', 'outlet'] },
    { phase: 'Accessories', order: 160, keywords: ['mirror', 'towel bar', 'toilet paper', 'accessories'] },
    { phase: 'Painting', order: 170, keywords: ['paint', 'primer'] },
    { phase: 'Cleanup', order: 180, keywords: ['cleanup', 'clean', 'final'] }
  ],
  
  'kitchen': [
    { phase: 'Planning', order: 10, keywords: ['permit', 'approval', 'planning', 'design'] },
    { phase: 'Setup', order: 20, keywords: ['garbage', 'disposal', 'dumpster', 'protection'] },
    { phase: 'Demo', order: 30, keywords: ['demo', 'removal', 'tear out', 'gut'] },
    { phase: 'Structural', order: 40, keywords: ['wall removal', 'beam', 'header', 'structural'] },
    { phase: 'Plumbing Rough', order: 50, keywords: ['plumbing rough', 'rough plumb', 'drain', 'supply'] },
    { phase: 'Electrical Rough', order: 60, keywords: ['electrical rough', 'rough electric', '220', 'circuits'] },
    { phase: 'HVAC', order: 70, keywords: ['hvac', 'duct', 'vent', 'exhaust'] },
    { phase: 'Framing', order: 80, keywords: ['fram', 'stud', 'soffit', 'bulk head'] },
    { phase: 'Insulation', order: 90, keywords: ['insulation', 'sound proof'] },
    { phase: 'Drywall', order: 100, keywords: ['drywall', 'mud', 'tape', 'texture'] },
    { phase: 'Flooring', order: 110, keywords: ['floor', 'tile', 'hardwood', 'vinyl', 'lvp'] },
    { phase: 'Painting', order: 120, keywords: ['paint', 'primer', 'ceiling'] },
    { phase: 'Cabinets', order: 130, keywords: ['cabinet', 'upper', 'lower', 'pantry'] },
    { phase: 'Countertops', order: 140, keywords: ['countertop', 'quartz', 'granite', 'laminate'] },
    { phase: 'Backsplash', order: 150, keywords: ['backsplash', 'tile', 'subway'] },
    { phase: 'Appliances', order: 160, keywords: ['appliance', 'refrigerator', 'stove', 'dishwasher', 'microwave'] },
    { phase: 'Plumbing Fixtures', order: 170, keywords: ['sink', 'faucet', 'disposal', 'instant hot'] },
    { phase: 'Electrical Finish', order: 180, keywords: ['electrical finish', 'light', 'pendant', 'under cabinet'] },
    { phase: 'Trim', order: 190, keywords: ['trim', 'molding', 'crown'] },
    { phase: 'Cleanup', order: 200, keywords: ['cleanup', 'clean', 'final'] }
  ],
  
  'roof': [
    { phase: 'Planning', order: 10, keywords: ['permit', 'approval'] },
    { phase: 'Setup', order: 20, keywords: ['dumpster', 'garbage', 'protection', 'tarp'] },
    { phase: 'Safety', order: 30, keywords: ['scaffold', 'safety', 'harness'] },
    { phase: 'Tear Off', order: 40, keywords: ['tear off', 'strip', 'removal', 'demo'] },
    { phase: 'Deck Repair', order: 50, keywords: ['deck repair', 'sheath', 'plywood', 'osb'] },
    { phase: 'Drip Edge', order: 60, keywords: ['drip edge', 'edge metal'] },
    { phase: 'Underlayment', order: 70, keywords: ['underlayment', 'felt', 'synthetic', 'ice shield'] },
    { phase: 'Shingles', order: 80, keywords: ['shingle', 'tile', 'metal', 'material'] },
    { phase: 'Ridge', order: 90, keywords: ['ridge', 'cap', 'hip'] },
    { phase: 'Flashing', order: 100, keywords: ['flash', 'chimney', 'valley', 'step'] },
    { phase: 'Vents', order: 110, keywords: ['vent', 'exhaust', 'intake', 'ridge vent'] },
    { phase: 'Soffit/Fascia', order: 120, keywords: ['soffit', 'fascia'] },
    { phase: 'Eaves', order: 130, keywords: ['eave', 'overhang'] },
    { phase: 'Gutters', order: 140, keywords: ['gutter', 'downspout'] },
    { phase: 'Cleanup', order: 150, keywords: ['cleanup', 'magnet', 'nail'] },
    { phase: 'Inspection', order: 160, keywords: ['inspection', 'final'] }
  ],
  
  'basement': [
    { phase: 'Planning', order: 10, keywords: ['permit', 'approval', 'egress'] },
    { phase: 'Setup', order: 20, keywords: ['dumpster', 'garbage'] },
    { phase: 'Waterproofing', order: 30, keywords: ['waterproof', 'moisture', 'vapor'] },
    { phase: 'Framing', order: 40, keywords: ['fram', 'stud', 'partition'] },
    { phase: 'Plumbing Rough', order: 50, keywords: ['plumbing', 'drain', 'ejector'] },
    { phase: 'Electrical Rough', order: 60, keywords: ['electrical rough', 'circuit', 'panel'] },
    { phase: 'HVAC', order: 70, keywords: ['hvac', 'heat', 'duct', 'vent'] },
    { phase: 'Insulation', order: 80, keywords: ['insulation', 'foam', 'batt'] },
    { phase: 'Drywall', order: 90, keywords: ['drywall', 'mud', 'tape'] },
    { phase: 'Ceiling', order: 100, keywords: ['ceiling', 'drop ceiling', 'suspended'] },
    { phase: 'Flooring', order: 110, keywords: ['floor', 'carpet', 'vinyl', 'tile'] },
    { phase: 'Trim', order: 120, keywords: ['trim', 'baseboard', 'casing'] },
    { phase: 'Doors', order: 130, keywords: ['door', 'prehung'] },
    { phase: 'Painting', order: 140, keywords: ['paint', 'primer'] },
    { phase: 'Electrical Finish', order: 150, keywords: ['outlet', 'switch', 'light'] },
    { phase: 'Plumbing Finish', order: 160, keywords: ['fixture', 'faucet'] },
    { phase: 'Cleanup', order: 170, keywords: ['cleanup', 'clean'] }
  ],
  
  'deck': [
    { phase: 'Planning', order: 10, keywords: ['permit', 'approval', 'design'] },
    { phase: 'Setup', order: 20, keywords: ['garbage', 'disposal'] },
    { phase: 'Demo', order: 30, keywords: ['demo', 'removal', 'old deck'] },
    { phase: 'Layout', order: 40, keywords: ['layout', 'mark', 'string line'] },
    { phase: 'Footings', order: 50, keywords: ['footing', 'pier', 'concrete', 'sono tube'] },
    { phase: 'Posts', order: 60, keywords: ['post', '6x6', '4x4'] },
    { phase: 'Beams', order: 70, keywords: ['beam', 'girder', 'carrier'] },
    { phase: 'Joists', order: 80, keywords: ['joist', 'rim', 'blocking'] },
    { phase: 'Decking', order: 90, keywords: ['decking', 'board', 'composite', 'trex'] },
    { phase: 'Stairs', order: 100, keywords: ['stair', 'stringer', 'tread', 'riser'] },
    { phase: 'Railing', order: 110, keywords: ['rail', 'baluster', 'spindle', 'post cap'] },
    { phase: 'Skirting', order: 120, keywords: ['skirt', 'lattice'] },
    { phase: 'Electrical', order: 130, keywords: ['electrical', 'outlet', 'light'] },
    { phase: 'Stain/Seal', order: 140, keywords: ['stain', 'seal', 'finish', 'waterproof'] },
    { phase: 'Cleanup', order: 150, keywords: ['cleanup', 'clean'] }
  ],
  
  'addition': [
    { phase: 'Planning', order: 10, keywords: ['permit', 'approval', 'architect'] },
    { phase: 'Site Setup', order: 20, keywords: ['portable toilet', 'garbage', 'fence'] },
    { phase: 'Demo', order: 30, keywords: ['demo', 'removal'] },
    { phase: 'Excavation', order: 40, keywords: ['excavat', 'dig'] },
    { phase: 'Foundation', order: 50, keywords: ['footing', 'foundation', 'concrete'] },
    { phase: 'Framing', order: 60, keywords: ['fram', 'wall', 'floor', 'ceiling'] },
    { phase: 'Roofing', order: 70, keywords: ['roof', 'shingle', 'tie-in'] },
    { phase: 'Exterior', order: 80, keywords: ['siding', 'window', 'door'] },
    { phase: 'Rough MEP', order: 90, keywords: ['plumbing rough', 'electrical rough', 'hvac rough'] },
    { phase: 'Insulation', order: 100, keywords: ['insulation'] },
    { phase: 'Drywall', order: 110, keywords: ['drywall', 'mud', 'tape'] },
    { phase: 'Flooring', order: 120, keywords: ['floor', 'carpet', 'hardwood'] },
    { phase: 'Finish MEP', order: 130, keywords: ['plumbing finish', 'electrical finish', 'hvac finish'] },
    { phase: 'Trim', order: 140, keywords: ['trim', 'molding'] },
    { phase: 'Painting', order: 150, keywords: ['paint', 'primer'] },
    { phase: 'Landscaping', order: 160, keywords: ['landscape', 'grade', 'seed'] },
    { phase: 'Cleanup', order: 170, keywords: ['cleanup', 'clean'] }
  ]
};

/**
 * Get the sequence position for an item based on project type and description
 */
export function getSequencePosition(
  description: string, 
  projectType: string = 'general'
): number {
  const lowerDesc = description.toLowerCase();
  
  // Get the sequence for this project type, or fall back to garage as general construction
  const sequence = PROJECT_SEQUENCES[projectType] || PROJECT_SEQUENCES['garage'];
  
  // Find matching phase
  for (const phase of sequence) {
    for (const keyword of phase.keywords) {
      if (lowerDesc.includes(keyword)) {
        return phase.order;
      }
    }
  }
  
  // If no match found, put at the end
  return 999;
}

/**
 * Sort items by construction sequence for a specific project type
 */
export function sortByProjectSequence(
  items: any[], 
  projectType: string = 'general'
): any[] {
  return [...items].sort((a, b) => {
    const aPos = getSequencePosition(a.description, projectType);
    const bPos = getSequencePosition(b.description, projectType);
    return aPos - bPos;
  });
}

/**
 * Insert new items into existing items maintaining construction sequence
 */
export function insertItemsInSequence(
  existingItems: any[], 
  newItems: any[], 
  projectType: string = 'general'
): any[] {
  const result = [...existingItems];
  
  // Sort new items by sequence
  const sortedNewItems = sortByProjectSequence(newItems, projectType);
  
  // Insert each new item in the appropriate position
  for (const newItem of sortedNewItems) {
    const newItemPosition = getSequencePosition(newItem.description, projectType);
    
    // Find the right insertion point
    let insertIndex = result.length;
    for (let i = 0; i < result.length; i++) {
      const existingPosition = getSequencePosition(result[i].description, projectType);
      if (existingPosition > newItemPosition) {
        insertIndex = i;
        break;
      }
    }
    
    result.splice(insertIndex, 0, newItem);
  }
  
  return result;
}

/**
 * Detect project type from text and items
 */
export function detectProjectType(text: string, items: any[]): string {
  const lowerText = text.toLowerCase();
  const allDescriptions = items.map(item => item.description.toLowerCase()).join(' ');
  const combined = lowerText + ' ' + allDescriptions;
  
  // Check for specific project types
  if (combined.includes('garage') && (combined.includes('detached') || combined.includes('2 car') || combined.includes('2-car'))) {
    return 'garage';
  }
  if (combined.includes('bathroom') && (combined.includes('remodel') || combined.includes('renovation'))) {
    return 'bathroom';
  }
  if (combined.includes('kitchen') && (combined.includes('remodel') || combined.includes('renovation'))) {
    return 'kitchen';
  }
  if (combined.includes('deck') || combined.includes('patio')) {
    return 'deck';
  }
  if (combined.includes('roof') && (combined.includes('replace') || combined.includes('new') || combined.includes('shingle'))) {
    return 'roof';
  }
  if (combined.includes('addition') || combined.includes('extension')) {
    return 'addition';
  }
  if (combined.includes('basement') && (combined.includes('finish') || combined.includes('remodel'))) {
    return 'basement';
  }
  
  // Default to garage sequence as it's comprehensive
  return 'garage';
}

/**
 * Get a readable phase name for a given sequence position
 */
export function getPhaseForPosition(position: number, projectType: string = 'general'): string {
  const sequence = PROJECT_SEQUENCES[projectType] || PROJECT_SEQUENCES['garage'];
  
  for (const phase of sequence) {
    if (phase.order === position) {
      return phase.phase;
    }
  }
  
  // Find the closest phase
  let closestPhase = sequence[0];
  let closestDiff = Math.abs(position - sequence[0].order);
  
  for (const phase of sequence) {
    const diff = Math.abs(position - phase.order);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestPhase = phase;
    }
  }
  
  return closestPhase.phase;
}