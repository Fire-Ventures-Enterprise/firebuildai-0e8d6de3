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

interface PaymentScheduleItem {
  description: string;
  percentage?: number;
  amount?: number;
  timing?: string;
}

interface ParseResult {
  lineItems: ParsedLineItem[];
  scopeOfWork: string;
  notes: string;
  paymentSchedule?: PaymentScheduleItem[];
  termsAndConditions?: string;
  suggestions?: string[];
}

// Keywords that indicate line items
const LINE_ITEM_KEYWORDS = {
  materials: [
    'drywall', 'lumber', 'concrete', 'paint', 'tile', 'flooring', 'carpet',
    'shingles', 'siding', 'insulation', 'plywood', 'studs', 'nails', 'screws',
    'wire', 'pipe', 'fitting', 'fixture', 'cabinet', 'countertop', 'door', 'window',
    'brick', 'stone', 'gravel', 'sand', 'cement', 'rebar', 'mesh', 'primer',
    'caulk', 'adhesive', 'grout', 'mortar', 'panels', 'boards', 'sheets',
    'quartz', 'granite', 'marble', 'laminate', 'vinyl', 'hardwood', 'sink', 'faucet',
    'hardware', 'handles', 'hinges', 'appliance', 'light', 'switch', 'outlet'
  ],
  labor: [
    'install', 'installation', 'remove', 'removal', 'demolition', 'demo',
    'frame', 'framing', 'pour', 'pouring', 'lay', 'laying', 'paint', 'painting',
    'repair', 'replace', 'build', 'construct', 'excavate', 'grade', 'level',
    'mount', 'hang', 'wire', 'wiring', 'plumb', 'plumbing', 'finish', 'sand',
    'prep', 'preparation', 'clean', 'cleanup', 'haul', 'dispose', 'labor hours',
    'supply and install', 'provide', 'connect', 'hook up', 'set up'
  ],
  equipment: [
    'crane', 'excavator', 'bulldozer', 'loader', 'compactor', 'generator',
    'compressor', 'scaffold', 'scaffolding', 'lift', 'saw', 'drill', 'mixer',
    'pump', 'rental', 'equipment', 'tools'
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
    'bag', 'bags', 'bundle', 'bundles', 'pack', 'packs',
    'lot', 'ls', 'lump sum', 'allowance'
  ]
};

// Common pricing database for realistic estimates
const PRICING_DATABASE = {
  // Kitchen specific
  'kitchen remodel': { min: 15000, max: 50000, unit: 'project' },
  'kitchen demolition': { min: 800, max: 2500, unit: 'project' },
  'cabinet': { min: 100, max: 500, unit: 'lf' },
  'cabinetry': { min: 3000, max: 15000, unit: 'project' },
  'upper cabinet': { min: 150, max: 400, unit: 'each' },
  'lower cabinet': { min: 200, max: 500, unit: 'each' },
  'countertop': { min: 40, max: 150, unit: 'sf' },
  'quartz countertop': { min: 60, max: 120, unit: 'sf' },
  'granite countertop': { min: 50, max: 100, unit: 'sf' },
  'backsplash': { min: 10, max: 30, unit: 'sf' },
  'tile backsplash': { min: 15, max: 40, unit: 'sf' },
  'sink': { min: 200, max: 800, unit: 'each' },
  'faucet': { min: 150, max: 600, unit: 'each' },
  'dishwasher installation': { min: 150, max: 300, unit: 'each' },
  'microwave installation': { min: 100, max: 200, unit: 'each' },
  
  // Plumbing
  'plumbing': { min: 500, max: 2000, unit: 'project' },
  'rough plumbing': { min: 2000, max: 5000, unit: 'project' },
  'plumbing fixture': { min: 150, max: 500, unit: 'each' },
  'shut-off valve': { min: 50, max: 150, unit: 'each' },
  
  // Electrical
  'electrical': { min: 500, max: 2000, unit: 'project' },
  'pot light': { min: 100, max: 200, unit: 'each' },
  'led light': { min: 100, max: 200, unit: 'each' },
  'undercabinet lighting': { min: 500, max: 1500, unit: 'project' },
  'dimmer switch': { min: 50, max: 150, unit: 'each' },
  'dedicated power': { min: 200, max: 400, unit: 'each' },
  'outlet': { min: 100, max: 200, unit: 'each' },
  
  // General construction
  'demolition': { min: 500, max: 3000, unit: 'project' },
  'drywall': { min: 2, max: 4, unit: 'sf' },
  'painting': { min: 2, max: 5, unit: 'sf' },
  'flooring': { min: 3, max: 15, unit: 'sf' },
  'tile': { min: 5, max: 20, unit: 'sf' },
  
  // Labor rates
  'labor': { min: 50, max: 150, unit: 'hour' },
  'electrician': { min: 75, max: 150, unit: 'hour' },
  'plumber': { min: 75, max: 150, unit: 'hour' },
  'carpenter': { min: 50, max: 100, unit: 'hour' },
  
  // Management and fees
  'management fee': { min: 5, max: 15, unit: 'percent' },
  'project management': { min: 5, max: 15, unit: 'percent' },
  'permit': { min: 200, max: 1500, unit: 'project' },
  'disposal': { min: 200, max: 800, unit: 'project' }
};

export class EstimateParser {
  static parse(rawText: string): ParseResult {
    const lines = rawText.split('\n');
    const lineItems: ParsedLineItem[] = [];
    const scopeLines: string[] = [];
    const noteLines: string[] = [];
    const paymentSchedule: PaymentScheduleItem[] = [];
    const termsAndConditions: string[] = [];
    const suggestions: string[] = [];
    
    // Keywords that indicate payment schedule items (THESE GO TO PAYMENT TAB!)
    const paymentKeywords = [
      'deposit', 'down payment', 'initial payment', 'retainer',
      'progress payment', 'milestone payment', 'interim payment',
      'final payment', 'balance', 'completion payment', 'final balance',
      'upon signing', 'upon completion', 'upon delivery',
      'at start', 'at completion', 'at delivery',
      'payment schedule', 'payment terms', 'payment due',
      'net 30', 'net 15', 'net 60', 'due on receipt',
      '% deposit', '% down', '% upon', '% at', '% on completion'
    ];
    
    // Keywords for terms & conditions (legal/business rules)
    const termsKeywords = [
      'warranty', 'guarantee', 'liability', 'insurance',
      'cancellation policy', 'refund policy', 'return policy',
      'work hours', 'working hours', 'hours of operation',
      'owner responsibilit', 'client responsibilit', 'customer responsibilit',
      'exclusions', 'not included', 'does not include',
      'valid until', 'expires', 'expiration', 'valid for',
      'change order', 'additional work', 'extra work',
      'acceptance', 'agreement', 'contract terms'
    ];
    
    // Keywords that indicate totals (should be ignored)
    const totalKeywords = [
      'total project', 'grand total', 'subtotal', 'total amount',
      'total due', 'total cost', 'project total', 'sum total',
      'total estimate', 'estimated total'
    ];
    
    // Enhanced price pattern to match various formats
    const pricePatterns = [
      /@\s*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/,  // @ $1,234.56 or @ 1234.56
      /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*$/,  // ends with $1,234.56
      /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*$/  // ends with 1234.56
    ];
    
    let currentSection = '';
    let projectSubtotal = 0;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      const lowerLine = trimmedLine.toLowerCase();
      
      // Check for section headers
      if (lowerLine.includes('payment schedule') || lowerLine === 'payment' || lowerLine === 'payments') {
        currentSection = 'payment';
        return;
      }
      
      if ((lowerLine.includes('terms') && lowerLine.includes('condition')) || 
          lowerLine === 'terms' || lowerLine === 'conditions') {
        currentSection = 'terms';
        return;
      }
      
      if (lowerLine.includes('scope of work') || lowerLine === 'scope') {
        currentSection = 'scope';
        return;
      }
      
      if (lowerLine.includes('line items') || lowerLine === 'items') {
        currentSection = 'items';
        return;
      }
      
      // Skip total lines
      if (totalKeywords.some(keyword => lowerLine.includes(keyword))) {
        return;
      }
      
      // Check if this is a payment schedule item
      const isPaymentItem = paymentKeywords.some(keyword => lowerLine.includes(keyword));
      if (isPaymentItem || currentSection === 'payment') {
        // Extract payment details
        let amount = 0;
        let percentage = 0;
        let description = trimmedLine;
        
        // Check for percentage
        const percentMatch = trimmedLine.match(/(\d+(?:\.\d+)?)\s*%/);
        if (percentMatch) {
          percentage = parseFloat(percentMatch[1]);
        }
        
        // Check for dollar amount
        for (const pattern of pricePatterns) {
          const match = trimmedLine.match(pattern);
          if (match) {
            amount = parseFloat(match[1].replace(/[,$]/g, ''));
            description = trimmedLine.replace(match[0], '').trim();
            break;
          }
        }
        
        // Determine timing from description
        let timing = '';
        if (lowerLine.includes('upon signing') || lowerLine.includes('deposit')) {
          timing = 'Upon signing';
        } else if (lowerLine.includes('completion') || lowerLine.includes('final')) {
          timing = 'Upon completion';
        } else if (lowerLine.includes('progress') || lowerLine.includes('milestone')) {
          timing = 'Progress payment';
        }
        
        if (percentage > 0 || amount > 0 || isPaymentItem) {
          paymentSchedule.push({
            description: description.replace(/[@$,]/g, '').trim(),
            percentage: percentage || undefined,
            amount: amount || undefined,
            timing: timing || description
          });
        }
        return;
      }
      
      // Check if this is a terms & conditions item
      const isTermsItem = termsKeywords.some(keyword => lowerLine.includes(keyword));
      if (isTermsItem || currentSection === 'terms') {
        termsAndConditions.push(trimmedLine);
        return;
      }
      
      // Check for actual line items with prices
      let foundPrice = false;
      let price = 0;
      let description = trimmedLine;
      
      // Try to extract price
      for (const pattern of pricePatterns) {
        const match = trimmedLine.match(pattern);
        if (match) {
          price = parseFloat(match[1].replace(/[,$]/g, ''));
          // Get description (everything before the @)
          if (trimmedLine.includes('@')) {
            description = trimmedLine.substring(0, trimmedLine.indexOf('@')).trim();
          } else {
            description = trimmedLine.replace(match[0], '').trim();
          }
          foundPrice = true;
          break;
        }
      }
      
      // Handle management/admin fees as special case
      if (lowerLine.includes('management fee') || lowerLine.includes('admin fee') || 
          lowerLine.includes('project management')) {
        const percentMatch = trimmedLine.match(/(\d+(?:\.\d+)?)\s*%/);
        if (percentMatch) {
          const percent = parseFloat(percentMatch[1]);
          lineItems.push({
            description: `Project Management Fee (${percent}%)`,
            quantity: 1,
            rate: 0, // Will calculate after getting subtotal
            unit: 'percent',
            category: 'other'
          });
          return;
        }
      }
      
      // If we found a price and it's not a payment item, add as line item
      if (foundPrice && price > 0 && !isPaymentItem) {
        // Clean up description
        description = description
          .replace(/^\*\s*/, '')
          .replace(/^-\s*/, '')
          .replace(/^•\s*/, '')
          .replace(/\.$/, '')
          .trim();
        
        // Skip empty descriptions
        if (!description || description.length < 3) {
          return;
        }
        
        // Determine category
        let category: 'material' | 'labor' | 'equipment' | 'other' = 'other';
        
        const laborKeywords = ['demo', 'install', 'remove', 'paint', 'plumb', 'rough-in', 
                              'apply', 'labor', 'work', 'service'];
        const materialKeywords = ['supply', 'toilet', 'vanity', 'tile', 'door', 'fan', 
                                 'light', 'faucet', 'cabinet', 'countertop', 'sink'];
        
        if (laborKeywords.some(kw => description.toLowerCase().includes(kw))) {
          category = 'labor';
        } else if (materialKeywords.some(kw => description.toLowerCase().includes(kw))) {
          category = 'material';
        }
        
        lineItems.push({
          description: description.charAt(0).toUpperCase() + description.slice(1),
          quantity: 1,
          rate: price,
          unit: 'project',
          category: category
        });
        
        projectSubtotal += price;
      } else if (currentSection === 'scope' || 
                (trimmedLine.startsWith('*') || trimmedLine.startsWith('-') || trimmedLine.startsWith('•'))) {
        // Add to scope
        scopeLines.push(trimmedLine);
      } else if (!foundPrice && !isPaymentItem && !isTermsItem) {
        // Default to scope
        scopeLines.push(trimmedLine);
      }
    });
    
    // Calculate management fee percentage based on subtotal
    const mgmtFeeItem = lineItems.find(item => item.unit === 'percent');
    if (mgmtFeeItem) {
      const subtotal = lineItems
        .filter(item => item !== mgmtFeeItem)
        .reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      
      // Extract percentage from description
      const percentMatch = mgmtFeeItem.description.match(/(\d+(?:\.\d+)?)\s*%/);
      if (percentMatch) {
        const percent = parseFloat(percentMatch[1]);
        mgmtFeeItem.rate = (subtotal * percent) / 100;
        mgmtFeeItem.unit = 'project';
      }
    }
    
    // If we have payment percentages but no amounts, calculate them
    if (paymentSchedule.length > 0 && projectSubtotal > 0) {
      paymentSchedule.forEach(payment => {
        if (payment.percentage && !payment.amount) {
          payment.amount = (projectSubtotal * payment.percentage) / 100;
        }
      });
    }
    
    // Generate suggestions
    if (lineItems.length === 0) {
      suggestions.push('No line items found - make sure to use @ symbol before prices');
    }
    if (paymentSchedule.length === 0) {
      suggestions.push('Consider adding: Payment schedule with deposit requirements');
    }
    if (termsAndConditions.length === 0) {
      suggestions.push('Consider adding: Terms and conditions for the project');
    }
    
    const hasPermits = lineItems.some(item => 
      item.description.toLowerCase().includes('permit')
    );
    if (!hasPermits) {
      suggestions.push('Consider adding: Building permits if required');
    }
    
    return {
      lineItems,
      scopeOfWork: scopeLines.join('\n'),
      notes: noteLines.join('\n'),
      paymentSchedule: paymentSchedule.length > 0 ? paymentSchedule : undefined,
      termsAndConditions: termsAndConditions.length > 0 ? termsAndConditions.join('\n') : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  }

  /**
   * Check if line is a major work item/category
   */
  private static isMajorWorkItem(line: string): boolean {
    const lower = line.toLowerCase();
    
    // Common major categories in construction estimates
    const majorCategories = [
      'demolition', 'cabinetry', 'cabinet', 'countertop', 'backsplash',
      'hardware', 'appliance', 'electrical', 'plumbing', 'hvac',
      'flooring', 'painting', 'drywall', 'framing', 'roofing',
      'windows', 'doors', 'siding', 'insulation', 'tile',
      'management fee', 'project management', 'permit', 'inspection'
    ];
    
    // Check if line starts with or contains a major category
    return majorCategories.some(cat => {
      // Check if it's a header (category name alone or with a dash/colon)
      const isHeader = lower === cat || 
                      lower.startsWith(cat + ' ') || 
                      lower.startsWith(cat + ':') ||
                      lower.startsWith(cat + ' -') ||
                      lower.startsWith(cat + ' –');
      
      // Also check for "Supply and install [category]"
      const isSupplyInstall = lower.includes('supply and install') && lower.includes(cat);
      
      return isHeader || isSupplyInstall;
    });
  }

  /**
   * Check if line is a detailed work description (not a line item)
   */
  private static isDetailedWorkDescription(line: string): boolean {
    const lower = line.toLowerCase();
    
    // Patterns that indicate descriptive text rather than line items
    const descriptivePatterns = [
      'will be', 'to be', 'must be', 'should be',
      'as per', 'according to', 'based on',
      'includes', 'including', 'consists of',
      'prior to', 'after', 'before', 'during',
      'client', 'customer', 'owner',
      'existing', 'new', 'current'
    ];
    
    return descriptivePatterns.some(pattern => lower.includes(pattern));
  }

  /**
   * Parse a work item and estimate pricing
   */
  private static parseWorkItem(line: string, projectTotal: number): ParsedLineItem | null {
    const lower = line.toLowerCase();
    let description = line;
    let quantity = 1;
    let rate = 0;
    let unit = 'lot';
    let category: 'material' | 'labor' | 'equipment' | 'other' = 'other';

    // Clean up the description
    description = description.replace(/[:\-–—]$/, '').trim();

    // Try to find a specific price in the line
    const priceMatch = line.match(/\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    if (priceMatch) {
      rate = parseFloat(priceMatch[1].replace(/,/g, ''));
      description = description.replace(priceMatch[0], '').trim();
    }

    // Check for percentage-based fees
    const percentMatch = line.match(/(\d+(?:\.\d+)?)\s*%/);
    if (percentMatch && projectTotal > 0) {
      const percent = parseFloat(percentMatch[1]);
      rate = (projectTotal * percent) / 100;
      unit = 'project';
    }

    // If no price found, estimate based on the type of work
    if (rate === 0) {
      rate = this.estimatePriceForWork(lower, projectTotal);
      
      // Determine the unit based on the work type
      if (lower.includes('cabinet')) {
        unit = 'project';
      } else if (lower.includes('countertop') || lower.includes('backsplash')) {
        unit = 'project';
      } else if (lower.includes('electrical') || lower.includes('plumbing')) {
        unit = 'project';
      }
    }

    // Categorize the item
    if (LINE_ITEM_KEYWORDS.labor.some(keyword => lower.includes(keyword))) {
      category = 'labor';
    } else if (LINE_ITEM_KEYWORDS.materials.some(keyword => lower.includes(keyword))) {
      category = 'material';
    } else if (LINE_ITEM_KEYWORDS.equipment.some(keyword => lower.includes(keyword))) {
      category = 'equipment';
    }

    // Only return if we have a meaningful rate
    if (rate > 0) {
      return {
        description,
        quantity,
        rate,
        unit,
        category
      };
    }

    return null;
  }

  /**
   * Estimate price for a work item based on industry standards
   */
  private static estimatePriceForWork(description: string, projectTotal: number): number {
    const lower = description.toLowerCase();
    
    // Try to find a match in our pricing database
    for (const [key, pricing] of Object.entries(PRICING_DATABASE)) {
      if (lower.includes(key)) {
        // Use a reasonable estimate within the range
        const midPoint = (pricing.min + pricing.max) / 2;
        
        // For project-based items, return the midpoint
        if (pricing.unit === 'project') {
          return midPoint;
        }
        
        // For percentage-based items, calculate based on project total
        if (pricing.unit === 'percent' && projectTotal > 0) {
          return (projectTotal * midPoint) / 100;
        }
        
        // For unit-based items, estimate quantity and multiply
        return midPoint;
      }
    }
    
    // If no match found, estimate based on project total
    if (projectTotal > 0) {
      // Major categories typically represent 10-30% of project cost
      if (lower.includes('cabinet') || lower.includes('countertop')) {
        return projectTotal * 0.25; // 25% for major items
      } else if (lower.includes('electrical') || lower.includes('plumbing')) {
        return projectTotal * 0.10; // 10% for systems
      } else if (lower.includes('demolition') || lower.includes('disposal')) {
        return projectTotal * 0.05; // 5% for demo/cleanup
      }
    }
    
    return 0;
  }

  /**
   * Quick parse for real-time suggestions as user types
   */
  static quickParse(text: string): ParsedLineItem[] {
    const items: ParsedLineItem[] = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      if (this.isMajorWorkItem(line)) {
        const item = this.parseWorkItem(line, 0);
        if (item) {
          items.push(item);
        }
      }
    });

    return items;
  }

  /**
   * Checks if a line is likely scope description
   */
  private static isScopeDescription(line: string): boolean {
    const scopeKeywords = [
      'scope', 'work includes', 'project includes', 'will provide',
      'responsibilities', 'deliverables', 'phase', 'stage',
      'estimated start', 'estimated completion', 'schedule',
      'warranty', 'guarantee', 'next steps'
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
      permits: false,
      cleanup: false,
      inspection: false,
      warranty: false
    };

    // Check what's already included
    items.forEach(item => {
      const lower = item.description.toLowerCase();
      if (lower.includes('permit')) hasCategories.permits = true;
      if (lower.includes('clean') || lower.includes('disposal')) hasCategories.cleanup = true;
      if (lower.includes('inspection')) hasCategories.inspection = true;
      if (lower.includes('warranty')) hasCategories.warranty = true;
    });

    // Suggest missing common items
    if (!hasCategories.permits) {
      suggestions.push('Consider adding: Building permits and approvals');
    }
    if (!hasCategories.cleanup) {
      suggestions.push('Consider adding: Final cleanup and debris disposal');
    }
    if (!hasCategories.inspection) {
      suggestions.push('Consider adding: Final inspection and sign-off');
    }
    if (!hasCategories.warranty) {
      suggestions.push('Consider adding: Warranty terms and duration');
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