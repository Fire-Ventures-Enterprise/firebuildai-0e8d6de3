/**
 * Intelligent Estimate Parser
 * Automatically identifies and separates line items from content using keywords and patterns
 */

interface ParsedLineItem {
  description: string;
  quantity: number;
  rate: number;
  unit?: string;
  category?: 'material' | 'labor' | 'equipment' | 'other';
}

interface ParseResult {
  lineItems: ParsedLineItem[];
  scopeOfWork: string;
  notes: string;
  suggestions?: string[];
}

// Keywords that indicate line items
const LINE_ITEM_KEYWORDS = {
  materials: [
    'drywall', 'lumber', 'concrete', 'paint', 'tile', 'flooring', 'carpet',
    'shingles', 'siding', 'insulation', 'plywood', 'studs', 'nails', 'screws',
    'wire', 'pipe', 'fitting', 'fixture', 'cabinet', 'countertop', 'door', 'window',
    'brick', 'stone', 'gravel', 'sand', 'cement', 'rebar', 'mesh', 'primer',
    'caulk', 'adhesive', 'grout', 'mortar', 'panels', 'boards', 'sheets'
  ],
  labor: [
    'install', 'installation', 'remove', 'removal', 'demolition', 'demo',
    'frame', 'framing', 'pour', 'pouring', 'lay', 'laying', 'paint', 'painting',
    'repair', 'replace', 'build', 'construct', 'excavate', 'grade', 'level',
    'mount', 'hang', 'wire', 'wiring', 'plumb', 'plumbing', 'finish', 'sand',
    'prep', 'preparation', 'clean', 'cleanup', 'haul', 'dispose', 'labor hours'
  ],
  equipment: [
    'crane', 'excavator', 'bulldozer', 'loader', 'compactor', 'generator',
    'compressor', 'scaffold', 'scaffolding', 'lift', 'saw', 'drill', 'mixer',
    'pump', 'rental', 'equipment'
  ],
  units: [
    'sq ft', 'sqft', 'sf', 'square feet', 'square foot',
    'lin ft', 'lf', 'linear feet', 'linear foot',
    'cubic yard', 'cy', 'yard', 'yards',
    'ton', 'tons', 'pound', 'pounds', 'lbs',
    'gallon', 'gal', 'quart', 'qt',
    'piece', 'pcs', 'each', 'ea', 'unit', 'units',
    'hour', 'hours', 'hr', 'hrs', 'day', 'days',
    'sheet', 'sheets', 'roll', 'rolls', 'box', 'boxes',
    'bag', 'bags', 'bundle', 'bundles', 'pack', 'packs'
  ]
};

// Patterns for extracting quantities and prices
const QUANTITY_PATTERN = /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(sq ft|sqft|sf|lin ft|lf|cubic yard|cy|yard|ton|pound|lbs|gallon|gal|piece|pcs|each|ea|unit|hour|hr|sheet|roll|box|bag|bundle|pack)/gi;
const PRICE_PATTERN = /\$?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:per|\/|@)?\s*(sq ft|sqft|sf|lin ft|lf|hour|hr|each|ea|unit)?/gi;
const MEASUREMENT_PATTERN = /(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/gi;

export class EstimateParser {
  /**
   * Main parsing function that takes raw text and extracts structured data
   */
  static parse(rawText: string): ParseResult {
    const lines = rawText.split('\n').filter(line => line.trim());
    const lineItems: ParsedLineItem[] = [];
    const scopeLines: string[] = [];
    const noteLines: string[] = [];
    const suggestions: string[] = [];

    // Process each line
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      // Check if line contains line item indicators
      if (this.isLineItem(trimmedLine)) {
        const item = this.parseLineItem(trimmedLine);
        if (item) {
          lineItems.push(item);
        }
      } else if (this.isScopeDescription(trimmedLine)) {
        scopeLines.push(trimmedLine);
      } else {
        noteLines.push(trimmedLine);
      }
    });

    // Generate suggestions for common missing items
    suggestions.push(...this.generateSuggestions(lineItems));

    return {
      lineItems,
      scopeOfWork: scopeLines.join('\n'),
      notes: noteLines.join('\n'),
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  }

  /**
   * Quick parse for real-time suggestions as user types
   */
  static quickParse(text: string): ParsedLineItem[] {
    const items: ParsedLineItem[] = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      if (this.hasLineItemKeywords(line)) {
        const item = this.parseLineItem(line);
        if (item) {
          items.push(item);
        }
      }
    });

    return items;
  }

  /**
   * Determines if a line is likely a line item
   */
  private static isLineItem(line: string): boolean {
    const lowerLine = line.toLowerCase();
    
    // Check for quantity indicators
    if (QUANTITY_PATTERN.test(line)) return true;
    
    // Check for price indicators
    if (PRICE_PATTERN.test(line)) return true;
    
    // Check for measurement patterns (e.g., "10x12")
    if (MEASUREMENT_PATTERN.test(line)) return true;
    
    // Check for line item keywords
    return this.hasLineItemKeywords(lowerLine);
  }

  /**
   * Checks if line contains keywords that indicate a line item
   */
  private static hasLineItemKeywords(line: string): boolean {
    const lowerLine = line.toLowerCase();
    
    // Check material keywords
    if (LINE_ITEM_KEYWORDS.materials.some(keyword => lowerLine.includes(keyword))) {
      return true;
    }
    
    // Check labor keywords
    if (LINE_ITEM_KEYWORDS.labor.some(keyword => lowerLine.includes(keyword))) {
      return true;
    }
    
    // Check equipment keywords
    if (LINE_ITEM_KEYWORDS.equipment.some(keyword => lowerLine.includes(keyword))) {
      return true;
    }
    
    return false;
  }

  /**
   * Parses a single line item
   */
  private static parseLineItem(line: string): ParsedLineItem | null {
    const item: ParsedLineItem = {
      description: line,
      quantity: 1,
      rate: 0
    };

    // Extract quantity
    const quantityMatch = line.match(/(\d+(?:\.\d+)?)\s*(sq ft|sqft|sf|lin ft|lf|hour|hr|each|ea|unit)?/i);
    if (quantityMatch) {
      item.quantity = parseFloat(quantityMatch[1]);
      item.unit = quantityMatch[2] || undefined;
    }

    // Extract price/rate
    const priceMatch = line.match(/\$?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (priceMatch) {
      item.rate = parseFloat(priceMatch[1].replace(/,/g, ''));
    }

    // Clean up description
    item.description = this.cleanDescription(line);

    // Categorize the item
    item.category = this.categorizeItem(line);

    // If we couldn't extract meaningful data, try to be smarter
    if (item.rate === 0) {
      const estimatedRate = this.estimateRate(item.description, item.category);
      if (estimatedRate > 0) {
        item.rate = estimatedRate;
      }
    }

    return item;
  }

  /**
   * Cleans up the description by removing quantity and price information
   */
  private static cleanDescription(line: string): string {
    let cleaned = line;
    
    // Remove price patterns
    cleaned = cleaned.replace(/\$?\s*\d+(?:,\d{3})*(?:\.\d{2})?/g, '');
    
    // Remove quantity patterns but keep the item name
    cleaned = cleaned.replace(/^\d+(?:\.\d+)?\s*(x|×)?\s*/i, '');
    
    // Remove common separators
    cleaned = cleaned.replace(/\s*[-–—]\s*$/, '');
    
    return cleaned.trim();
  }

  /**
   * Categorizes an item based on keywords
   */
  private static categorizeItem(line: string): 'material' | 'labor' | 'equipment' | 'other' {
    const lowerLine = line.toLowerCase();
    
    if (LINE_ITEM_KEYWORDS.labor.some(keyword => lowerLine.includes(keyword))) {
      return 'labor';
    }
    
    if (LINE_ITEM_KEYWORDS.equipment.some(keyword => lowerLine.includes(keyword))) {
      return 'equipment';
    }
    
    if (LINE_ITEM_KEYWORDS.materials.some(keyword => lowerLine.includes(keyword))) {
      return 'material';
    }
    
    return 'other';
  }

  /**
   * Estimates a rate based on common construction prices
   */
  private static estimateRate(description: string, category?: string): number {
    const lower = description.toLowerCase();
    
    // Common material rates (per unit)
    if (category === 'material') {
      if (lower.includes('drywall')) return 12; // per sheet
      if (lower.includes('lumber') || lower.includes('2x4')) return 8; // per piece
      if (lower.includes('paint')) return 35; // per gallon
      if (lower.includes('concrete')) return 150; // per cubic yard
      if (lower.includes('tile')) return 3; // per sq ft
      if (lower.includes('flooring')) return 4; // per sq ft
    }
    
    // Common labor rates (per hour)
    if (category === 'labor') {
      if (lower.includes('electrician')) return 85;
      if (lower.includes('plumber')) return 75;
      if (lower.includes('carpenter')) return 65;
      if (lower.includes('painter')) return 45;
      if (lower.includes('general labor')) return 35;
      return 50; // default hourly rate
    }
    
    // Equipment rates (per day)
    if (category === 'equipment') {
      if (lower.includes('excavator')) return 800;
      if (lower.includes('crane')) return 1500;
      if (lower.includes('scaffold')) return 150;
      return 200; // default equipment rate
    }
    
    return 0;
  }

  /**
   * Checks if a line is likely scope description
   */
  private static isScopeDescription(line: string): boolean {
    const scopeKeywords = [
      'scope', 'work includes', 'project includes', 'will provide',
      'responsibilities', 'deliverables', 'phase', 'stage',
      'remove and replace', 'existing', 'new construction'
    ];
    
    const lower = line.toLowerCase();
    return scopeKeywords.some(keyword => lower.includes(keyword));
  }

  /**
   * Generates suggestions for commonly forgotten items
   */
  private static generateSuggestions(items: ParsedLineItem[]): string[] {
    const suggestions: string[] = [];
    const hasCategories = {
      material: false,
      labor: false,
      equipment: false,
      cleanup: false,
      permits: false
    };

    // Check what's already included
    items.forEach(item => {
      const lower = item.description.toLowerCase();
      if (item.category === 'material') hasCategories.material = true;
      if (item.category === 'labor') hasCategories.labor = true;
      if (item.category === 'equipment') hasCategories.equipment = true;
      if (lower.includes('clean') || lower.includes('disposal')) hasCategories.cleanup = true;
      if (lower.includes('permit')) hasCategories.permits = true;
    });

    // Suggest missing common items
    if (!hasCategories.cleanup) {
      suggestions.push('Consider adding: Site cleanup and debris disposal');
    }
    if (!hasCategories.permits) {
      suggestions.push('Consider adding: Permits and inspections');
    }
    if (hasCategories.material && !hasCategories.labor) {
      suggestions.push('Consider adding: Labor for installation');
    }

    return suggestions;
  }

  /**
   * Formats parsed items for display
   */
  static formatItems(items: ParsedLineItem[]): string[] {
    return items.map(item => {
      const unit = item.unit ? ` ${item.unit}` : '';
      const rate = item.rate > 0 ? ` @ $${item.rate.toFixed(2)}` : '';
      return `${item.quantity}${unit} - ${item.description}${rate}`;
    });
  }
}
