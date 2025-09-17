import { ProjectType, TradeProjectTypes } from '@/types/industry';

// Trade-specific project types with auto-sequencing
export const TRADE_PROJECT_TYPES: TradeProjectTypes = {
  // PLUMBING CONTRACTOR
  plumbing: [
    {
      id: 'bathtub-install',
      name: 'Bathtub Installation',
      description: 'Complete bathtub installation with plumbing',
      keywords: ['bathtub', 'tub install', 'bathtub replacement', 'tub', 'bath'],
      autoSequence: [
        'Remove old tub @ $200',
        'Rough in plumbing @ $400', 
        'Install new tub @ $350',
        'Connect supply lines @ $150',
        'Connect drain @ $100',
        'Test and inspect @ $75'
      ],
      estimatedDuration: '2-3 days'
    },
    {
      id: 'bathroom-plumbing',
      name: 'Bathroom Plumbing Renovation',
      description: 'Complete bathroom plumbing rough and finish',
      keywords: ['bathroom plumb', 'bathroom renovation', 'plumbing rough', 'bathroom reno'],
      autoSequence: [
        'Demo existing plumbing @ $300',
        'Rough in supply lines @ $500',
        'Rough in drain lines @ $400',
        'Install fixtures @ $600',
        'Connect and test @ $200'
      ],
      estimatedDuration: '3-4 days'
    },
    {
      id: 'kitchen-plumbing',
      name: 'Kitchen Plumbing',
      description: 'Kitchen sink and dishwasher plumbing',
      keywords: ['kitchen plumb', 'sink install', 'dishwasher plumb', 'kitchen sink'],
      autoSequence: [
        'Rough in kitchen plumbing @ $400',
        'Install kitchen sink @ $250',
        'Connect dishwasher @ $150',
        'Install garbage disposal @ $200',
        'Test all connections @ $75'
      ],
      estimatedDuration: '1-2 days'
    },
    {
      id: 'water-heater',
      name: 'Water Heater Installation',
      description: 'Tank or tankless water heater replacement',
      keywords: ['water heater', 'hot water tank', 'tankless', 'heater'],
      autoSequence: [
        'Remove old water heater @ $150',
        'Install new water heater @ $500',
        'Connect water lines @ $200',
        'Install expansion tank @ $150',
        'Test and commission @ $100'
      ],
      estimatedDuration: '1 day'
    },
    {
      id: 'toilet-install',
      name: 'Toilet Installation',
      description: 'Complete toilet replacement',
      keywords: ['toilet', 'toilet install', 'toilet replacement'],
      autoSequence: [
        'Remove old toilet @ $75',
        'Inspect and repair flange @ $100',
        'Install new wax ring @ $25',
        'Install new toilet @ $150',
        'Test for leaks @ $50'
      ],
      estimatedDuration: '2-3 hours'
    }
  ],

  // HVAC CONTRACTOR
  hvac: [
    {
      id: 'furnace-install',
      name: 'Furnace Installation',
      description: 'Complete furnace replacement',
      keywords: ['furnace', 'furnace install', 'heating system', 'heater'],
      autoSequence: [
        'Remove old furnace @ $300',
        'Install new furnace @ $800',
        'Connect gas lines @ $200',
        'Connect electrical @ $150',
        'Test and commission @ $100'
      ],
      estimatedDuration: '1 day'
    },
    {
      id: 'ac-install',
      name: 'Air Conditioner Installation',
      description: 'Central AC system installation',
      keywords: ['ac', 'air conditioner', 'cooling', 'central air', 'a/c'],
      autoSequence: [
        'Remove old AC unit @ $200',
        'Install condenser unit @ $600',
        'Install evaporator coil @ $400',
        'Connect refrigerant lines @ $300',
        'Electrical connections @ $200',
        'System startup and test @ $150'
      ],
      estimatedDuration: '1-2 days'
    },
    {
      id: 'ductwork',
      name: 'Ductwork Installation',
      description: 'HVAC ductwork installation',
      keywords: ['ductwork', 'ducts', 'hvac ducts', 'air ducts'],
      autoSequence: [
        'Install supply ducts @ $12/LF',
        'Install return ducts @ $10/LF',
        'Install registers @ $25/ea',
        'Insulate ductwork @ $3/SF',
        'Balance system @ $200'
      ],
      estimatedDuration: '2-3 days'
    },
    {
      id: 'thermostat',
      name: 'Smart Thermostat Install',
      description: 'Smart thermostat installation and setup',
      keywords: ['thermostat', 'smart thermostat', 'nest', 'ecobee'],
      autoSequence: [
        'Remove old thermostat @ $50',
        'Install new thermostat @ $150',
        'Connect to HVAC system @ $100',
        'Program and test @ $75'
      ],
      estimatedDuration: '1-2 hours'
    }
  ],

  // GENERAL CONTRACTOR  
  general: [
    {
      id: 'kitchen-renovation',
      name: 'Kitchen Renovation',
      description: 'Complete kitchen remodel',
      keywords: ['kitchen', 'kitchen reno', 'kitchen remodel', 'kitchen renovation'],
      autoSequence: [
        'Demo existing kitchen @ $1200',
        'Electrical rough in @ $800',
        'Plumbing rough in @ $600',
        'HVAC modifications @ $400',
        'Insulation and vapor barrier @ $300',
        'Drywall installation @ $800',
        'Prime and paint @ $700',
        'Install flooring @ $6/SF',
        'Install cabinets @ $180/LF',
        'Install countertops @ $85/SF',
        'Install backsplash @ $12/SF',
        'Install appliances @ $400',
        'Final cleanup @ $200'
      ],
      estimatedDuration: '3-4 weeks'
    },
    {
      id: 'bathroom-renovation',
      name: 'Bathroom Renovation', 
      description: 'Complete bathroom remodel',
      keywords: ['bathroom', 'bathroom reno', 'bathroom remodel', 'bath renovation'],
      autoSequence: [
        'Demo bathroom @ $800',
        'Plumbing rough in @ $600',
        'Electrical rough in @ $400',
        'Install subfloor @ $4/SF',
        'Install cement board @ $3/SF',
        'Waterproofing @ $5/SF',
        'Install floor tile @ $8/SF',
        'Install wall tile @ $10/SF',
        'Install vanity @ $350',
        'Install toilet @ $200',
        'Install tub/shower @ $500',
        'Install fixtures @ $300',
        'Final cleanup @ $150'
      ],
      estimatedDuration: '2-3 weeks'
    },
    {
      id: 'basement-finishing',
      name: 'Basement Finishing',
      description: 'Complete basement renovation',
      keywords: ['basement', 'basement finish', 'basement reno'],
      autoSequence: [
        'Frame walls @ $5/SF',
        'Electrical rough in @ $4/SF',
        'Plumbing rough in @ $600',
        'Insulation @ $2/SF',
        'Vapor barrier @ $1/SF',
        'Drywall installation @ $3/SF',
        'Prime and paint @ $2/SF',
        'Install flooring @ $5/SF',
        'Install trim @ $4/LF',
        'Final cleanup @ $300'
      ],
      estimatedDuration: '3-4 weeks'
    },
    {
      id: 'deck-build',
      name: 'Deck Construction',
      description: 'New deck construction',
      keywords: ['deck', 'deck build', 'outdoor deck', 'patio deck'],
      autoSequence: [
        'Layout and excavation @ $300',
        'Install footings @ $150/ea',
        'Install posts and beams @ $25/LF',
        'Install joists @ $8/SF',
        'Install decking @ $12/SF',
        'Install railing @ $35/LF',
        'Install stairs @ $150/step',
        'Apply finish @ $2/SF'
      ],
      estimatedDuration: '1-2 weeks'
    }
  ],

  // FLOORING CONTRACTOR
  flooring: [
    {
      id: 'hardwood-install',
      name: 'Hardwood Flooring',
      description: 'Hardwood floor installation',
      keywords: ['hardwood', 'wood floor', 'oak floor', 'maple floor'],
      autoSequence: [
        'Remove existing flooring @ $2.50/SF',
        'Prep subfloor @ $1.25/SF',
        'Install moisture barrier @ $0.50/SF',
        'Install hardwood @ $8.50/SF',
        'Sand floors @ $2/SF',
        'Apply finish coats @ $2/SF',
        'Install transitions @ $15/LF'
      ],
      estimatedDuration: '3-5 days'
    },
    {
      id: 'laminate-install',
      name: 'Laminate Flooring',
      description: 'Laminate floor installation',
      keywords: ['laminate', 'laminate floor', 'floating floor'],
      autoSequence: [
        'Remove existing flooring @ $1.50/SF',
        'Level subfloor @ $1/SF',
        'Install underlayment @ $0.50/SF',
        'Install laminate @ $4.50/SF',
        'Install transitions @ $12/LF',
        'Install baseboards @ $3/LF'
      ],
      estimatedDuration: '2-3 days'
    },
    {
      id: 'tile-floor',
      name: 'Tile Floor Installation',
      description: 'Ceramic or porcelain tile flooring',
      keywords: ['tile floor', 'ceramic tile', 'porcelain tile', 'floor tile'],
      autoSequence: [
        'Remove existing flooring @ $2/SF',
        'Prep subfloor @ $1.50/SF',
        'Install cement board @ $2/SF',
        'Install tile @ $6/SF',
        'Grout tile @ $2/SF',
        'Seal grout @ $0.50/SF',
        'Install transitions @ $15/LF'
      ],
      estimatedDuration: '3-4 days'
    },
    {
      id: 'carpet-install',
      name: 'Carpet Installation',
      description: 'Wall-to-wall carpet installation',
      keywords: ['carpet', 'carpet install', 'carpeting'],
      autoSequence: [
        'Remove old carpet @ $1/SF',
        'Install tack strips @ $2/LF',
        'Install carpet pad @ $0.75/SF',
        'Install carpet @ $3.50/SF',
        'Install transitions @ $10/LF'
      ],
      estimatedDuration: '1-2 days'
    }
  ],

  // ELECTRICAL CONTRACTOR
  electrical: [
    {
      id: 'panel-upgrade',
      name: 'Electrical Panel Upgrade',
      description: '100A to 200A panel upgrade',
      keywords: ['panel upgrade', 'electrical panel', 'breaker panel', '200 amp'],
      autoSequence: [
        'Pull electrical permit @ $150',
        'Remove old panel @ $300',
        'Install new 200A panel @ $800',
        'Install breakers @ $50/ea',
        'Connect circuits @ $600',
        'ESA inspection @ $150'
      ],
      estimatedDuration: '1 day'
    },
    {
      id: 'kitchen-electrical',
      name: 'Kitchen Electrical',
      description: 'Kitchen electrical rough and finish',
      keywords: ['kitchen electrical', 'kitchen wiring', 'kitchen outlets'],
      autoSequence: [
        'Install dedicated appliance circuits @ $200/ea',
        'Install counter outlets @ $125/ea',
        'Install under-cabinet lighting @ $75/LF',
        'Install pot lights @ $100/ea',
        'Install switch wiring @ $150/ea',
        'Connect appliances @ $75/ea'
      ],
      estimatedDuration: '2 days'
    },
    {
      id: 'ev-charger',
      name: 'EV Charger Installation',
      description: 'Electric vehicle charger installation',
      keywords: ['ev charger', 'car charger', 'tesla charger', 'electric vehicle'],
      autoSequence: [
        'Run 240V circuit @ $500',
        'Install breaker @ $75',
        'Install outlet/hardwire @ $200',
        'Mount charger @ $150',
        'Test and commission @ $75'
      ],
      estimatedDuration: '4-6 hours'
    }
  ],

  // ROOFING CONTRACTOR
  roofing: [
    {
      id: 'shingle-roof',
      name: 'Asphalt Shingle Roof',
      description: 'Complete roof replacement with asphalt shingles',
      keywords: ['shingle roof', 'asphalt shingles', 'roof replacement', 'reroof'],
      autoSequence: [
        'Remove old shingles @ $1.50/SF',
        'Inspect and repair decking @ $3/SF',
        'Install ice and water shield @ $2/SF',
        'Install synthetic underlayment @ $0.50/SF',
        'Install starter strip @ $2/LF',
        'Install shingles @ $3.50/SF',
        'Install ridge cap @ $4/LF',
        'Install flashing @ $8/LF',
        'Cleanup and disposal @ $500'
      ],
      estimatedDuration: '2-3 days'
    },
    {
      id: 'flat-roof',
      name: 'Flat Roof Installation',
      description: 'EPDM or TPO flat roof installation',
      keywords: ['flat roof', 'epdm', 'tpo', 'membrane roof'],
      autoSequence: [
        'Remove old roofing @ $2/SF',
        'Install insulation @ $2.50/SF',
        'Install membrane @ $4/SF',
        'Install flashing @ $10/LF',
        'Install drains @ $200/ea',
        'Seal and inspect @ $0.50/SF'
      ],
      estimatedDuration: '3-4 days'
    }
  ],

  // PAINTING CONTRACTOR
  painting: [
    {
      id: 'interior-paint',
      name: 'Interior Painting',
      description: 'Complete interior painting',
      keywords: ['interior paint', 'paint rooms', 'wall paint', 'painting'],
      autoSequence: [
        'Protect floors and furniture @ $0.25/SF',
        'Patch and repair walls @ $1/SF',
        'Prime walls @ $1.50/SF',
        'Paint walls (2 coats) @ $2.50/SF',
        'Paint trim and doors @ $4/LF',
        'Paint ceilings @ $2/SF',
        'Final cleanup @ $200'
      ],
      estimatedDuration: '3-4 days'
    },
    {
      id: 'exterior-paint',
      name: 'Exterior Painting',
      description: 'Complete exterior painting',
      keywords: ['exterior paint', 'house painting', 'siding paint'],
      autoSequence: [
        'Power wash exterior @ $0.50/SF',
        'Scrape and sand @ $1.50/SF',
        'Prime bare wood @ $1/SF',
        'Caulk gaps @ $2/LF',
        'Paint siding (2 coats) @ $3/SF',
        'Paint trim @ $5/LF',
        'Cleanup @ $300'
      ],
      estimatedDuration: '4-5 days'
    }
  ],

  // DRYWALL CONTRACTOR
  drywall: [
    {
      id: 'drywall-install',
      name: 'Drywall Installation',
      description: 'Complete drywall installation and finishing',
      keywords: ['drywall', 'sheetrock', 'gypsum board', 'wall board'],
      autoSequence: [
        'Hang drywall sheets @ $1.50/SF',
        'Tape joints @ $0.75/SF',
        'Apply first coat mud @ $0.50/SF',
        'Apply second coat @ $0.50/SF',
        'Apply third coat @ $0.50/SF',
        'Sand smooth @ $0.25/SF',
        'Prime walls @ $0.75/SF'
      ],
      estimatedDuration: '3-5 days'
    },
    {
      id: 'drywall-repair',
      name: 'Drywall Repair',
      description: 'Patch and repair damaged drywall',
      keywords: ['drywall repair', 'patch walls', 'hole repair'],
      autoSequence: [
        'Cut out damaged area @ $50/hole',
        'Install backing @ $25/hole',
        'Install patch @ $35/hole',
        'Tape and mud @ $40/hole',
        'Sand and prime @ $25/hole'
      ],
      estimatedDuration: '1-2 days'
    }
  ]
};

// Helper function to get trade display name
export function getTradeDisplayName(trade: string): string {
  const tradeNames: Record<string, string> = {
    general: 'General Contractor',
    plumbing: 'Plumbing Contractor',
    hvac: 'HVAC Contractor',
    electrical: 'Electrical Contractor',
    flooring: 'Flooring Contractor',
    roofing: 'Roofing Contractor',
    drywall: 'Drywall Contractor',
    painting: 'Painting Contractor',
    tile: 'Tile Contractor',
    concrete: 'Concrete Contractor',
    landscaping: 'Landscaping Contractor',
    windows: 'Window & Door Contractor',
    restoration: 'Restoration Contractor'
  };
  return tradeNames[trade] || 'Contractor';
}

// Helper function to get trade icon
export function getTradeIcon(trade: string): string {
  const tradeIcons: Record<string, string> = {
    general: '🏗️',
    plumbing: '🔧',
    hvac: '❄️',
    electrical: '⚡',
    flooring: '🏠',
    roofing: '🏚️',
    drywall: '📐',
    painting: '🎨',
    tile: '◼',
    concrete: '🧱',
    landscaping: '🌳',
    windows: '🪟',
    restoration: '🔨'
  };
  return tradeIcons[trade] || '👷';
}