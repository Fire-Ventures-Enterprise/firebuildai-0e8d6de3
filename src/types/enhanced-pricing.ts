// Enhanced Pricing System Types
// Supports both bulk pricing and itemized pricing with overrides

export type PricingMode = 'itemized' | 'bulk';

export type LineItemType = 
  | 'material'
  | 'labor' 
  | 'equipment'
  | 'subcontractor'
  | 'fee'        // Management fee, permit fee, etc.
  | 'override';   // Custom pricing override

export interface EnhancedEstimateItem {
  id?: string;
  itemName: string;
  description: string;
  quantity: number;
  unit?: string; // sq ft, linear ft, each, hours, etc.
  
  // Itemized pricing fields
  rate?: number;
  markup?: number;
  markupType?: 'percentage' | 'fixed';
  markupAmount?: number;
  tax?: boolean;
  amount?: number;
  
  // Bulk pricing fields
  bulkPriceAllocated?: number; // Portion of bulk price allocated to this item
  bulkPricePercentage?: number; // What % of bulk price this item represents
  
  // Override pricing
  priceOverride?: number; // Override the calculated price
  overrideReason?: string; // Why this was overridden
  
  // Item categorization for AI sequencing
  itemType: LineItemType;
  constructionPhase?: string; // For AI sequencing
  sequencingKeywords?: string[]; // Additional keywords for AI
  
  // Metadata
  sortOrder?: number;
  isHidden?: boolean; // Hide from client view but use for sequencing
  notes?: string;
}

export interface PricingConfiguration {
  mode: PricingMode;
  
  // Bulk pricing settings
  bulkTotalPrice?: number;
  bulkPriceDescription?: string; // "Complete kitchen renovation"
  
  // Automatic fee calculations
  managementFeePercentage?: number; // % of subtotal
  managementFeeFixed?: number; // Fixed management fee
  permitFeeAmount?: number;
  
  // Pricing display options
  showIndividualPrices: boolean; // Show line item prices to client
  showBulkBreakdown: boolean; // Show how bulk price is allocated
  allowClientPriceView: boolean; // Client can see detailed pricing
}

export interface EnhancedEstimateWithPricing {
  id?: string;
  estimateNumber: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
  
  // Customer info
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  customerProvince?: string;
  customerPostalCode?: string;
  
  // Service location
  serviceAddress?: string;
  serviceCity?: string;
  serviceProvince?: string;
  servicePostalCode?: string;
  
  // Enhanced items with pricing options
  items: EnhancedEstimateItem[];
  
  // Pricing configuration
  pricingConfig: PricingConfiguration;
  
  // Calculated totals
  itemizedSubtotal?: number; // Sum of individual items
  bulkPrice?: number; // Total bulk price
  managementFee?: number; // Calculated management fee
  permitFees?: number; // Total permit fees
  otherFees?: number; // Other miscellaneous fees
  
  // Override totals
  subtotalOverride?: number; // Override calculated subtotal
  overrideReason?: string;
  
  // Final calculations
  subtotal: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  discountAmount?: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  
  // Deposit
  depositAmount?: number;
  depositPercentage?: number;
  depositDue?: Date;
  
  // Dates
  issueDate: Date;
  expirationDate?: Date;
  
  // Additional
  notes?: string;
  privateNotes?: string;
  scopeOfWork?: string;
  contractRequired?: boolean;
  contractAttached?: boolean;
  contractText?: string;
  signatureRequired?: boolean;
  
  createdAt?: Date;
  updatedAt?: Date;
}

// Pricing calculation utilities
export class PricingCalculator {
  
  /**
   * Calculate totals for itemized pricing
   */
  static calculateItemizedPricing(items: EnhancedEstimateItem[]): {
    subtotal: number;
    itemTotals: { [itemId: string]: number };
  } {
    let subtotal = 0;
    const itemTotals: { [itemId: string]: number } = {};
    
    items.forEach(item => {
      let itemTotal = 0;
      
      if (item.priceOverride !== undefined) {
        // Use override price
        itemTotal = item.priceOverride;
      } else if (item.rate !== undefined) {
        // Calculate from rate and quantity
        itemTotal = item.quantity * item.rate;
        
        // Apply markup
        if (item.markup && item.markupType) {
          if (item.markupType === 'percentage') {
            itemTotal += itemTotal * (item.markup / 100);
          } else {
            itemTotal += item.markup;
          }
        }
      }
      
      itemTotals[item.id!] = itemTotal;
      subtotal += itemTotal;
    });
    
    return { subtotal, itemTotals };
  }
  
  /**
   * Allocate bulk pricing across line items
   */
  static allocateBulkPricing(
    items: EnhancedEstimateItem[], 
    bulkPrice: number
  ): EnhancedEstimateItem[] {
    
    // Calculate total "weight" for allocation
    let totalWeight = 0;
    const itemWeights: { [itemId: string]: number } = {};
    
    items.forEach(item => {
      let weight = 1; // Default weight
      
      // Weight based on item type
      switch (item.itemType) {
        case 'material':
          weight = item.quantity * 2; // Materials get higher weight
          break;
        case 'labor':
          weight = item.quantity * 3; // Labor gets highest weight
          break;
        case 'equipment':
          weight = item.quantity * 1.5;
          break;
        case 'subcontractor':
          weight = item.quantity * 2.5;
          break;
        case 'fee':
          weight = 0.5; // Fees get minimal allocation
          break;
        case 'override':
          weight = 0; // Override items don't get bulk allocation
          break;
      }
      
      // If item has estimated rate, use that for weighting
      if (item.rate) {
        weight = item.quantity * item.rate;
      }
      
      itemWeights[item.id!] = weight;
      totalWeight += weight;
    });
    
    // Allocate bulk price proportionally
    return items.map(item => {
      if (item.itemType === 'override' || item.priceOverride !== undefined) {
        // Don't allocate bulk price to override items
        return item;
      }
      
      const itemWeight = itemWeights[item.id!] || 0;
      const allocation = totalWeight > 0 ? (itemWeight / totalWeight) * bulkPrice : 0;
      const percentage = totalWeight > 0 ? (itemWeight / totalWeight) * 100 : 0;
      
      return {
        ...item,
        bulkPriceAllocated: allocation,
        bulkPricePercentage: percentage
      };
    });
  }
  
  /**
   * Calculate management and other fees
   */
  static calculateFees(
    subtotal: number, 
    config: PricingConfiguration
  ): {
    managementFee: number;
    permitFees: number;
    totalFees: number;
  } {
    let managementFee = 0;
    
    if (config.managementFeePercentage) {
      managementFee = subtotal * (config.managementFeePercentage / 100);
    } else if (config.managementFeeFixed) {
      managementFee = config.managementFeeFixed;
    }
    
    const permitFees = config.permitFeeAmount || 0;
    const totalFees = managementFee + permitFees;
    
    return { managementFee, permitFees, totalFees };
  }
  
  /**
   * Generate final estimate with all calculations
   */
  static calculateFinalPricing(estimate: EnhancedEstimateWithPricing): EnhancedEstimateWithPricing {
    let subtotal = 0;
    let updatedItems = [...estimate.items];
    
    if (estimate.pricingConfig.mode === 'bulk' && estimate.pricingConfig.bulkTotalPrice) {
      // Bulk pricing mode
      updatedItems = this.allocateBulkPricing(updatedItems, estimate.pricingConfig.bulkTotalPrice);
      subtotal = estimate.pricingConfig.bulkTotalPrice;
      
      // Add any override items to subtotal
      updatedItems.forEach(item => {
        if (item.priceOverride !== undefined && item.itemType === 'override') {
          subtotal += item.priceOverride;
        }
      });
      
    } else {
      // Itemized pricing mode
      const { subtotal: calculatedSubtotal } = this.calculateItemizedPricing(updatedItems);
      subtotal = calculatedSubtotal;
    }
    
    // Calculate fees
    const { managementFee, permitFees, totalFees } = this.calculateFees(subtotal, estimate.pricingConfig);
    
    // Apply subtotal override if specified
    if (estimate.subtotalOverride !== undefined) {
      subtotal = estimate.subtotalOverride;
    }
    
    // Add fees to subtotal
    const finalSubtotal = subtotal + totalFees;
    
    // Calculate discount
    let discountAmount = 0;
    if (estimate.discount) {
      if (estimate.discountType === 'percentage') {
        discountAmount = finalSubtotal * (estimate.discount / 100);
      } else {
        discountAmount = estimate.discount;
      }
    }
    
    const afterDiscount = finalSubtotal - discountAmount;
    
    // Calculate tax
    const taxAmount = afterDiscount * (estimate.taxRate / 100);
    const total = afterDiscount + taxAmount;
    
    return {
      ...estimate,
      items: updatedItems,
      itemizedSubtotal: estimate.pricingConfig.mode === 'itemized' ? subtotal : undefined,
      bulkPrice: estimate.pricingConfig.mode === 'bulk' ? estimate.pricingConfig.bulkTotalPrice : undefined,
      managementFee,
      permitFees,
      otherFees: totalFees - managementFee - permitFees,
      subtotal: finalSubtotal,
      discountAmount,
      taxAmount,
      total
    };
  }
}

// Example usage interfaces for the UI
export interface PricingModeSelector {
  mode: PricingMode;
  onModeChange: (mode: PricingMode) => void;
  bulkPrice?: number;
  onBulkPriceChange: (price: number) => void;
}

export interface LineItemPricingProps {
  item: EnhancedEstimateItem;
  pricingMode: PricingMode;
  onItemUpdate: (item: EnhancedEstimateItem) => void;
  showPricing: boolean;
}

export interface FeeConfigurationProps {
  config: PricingConfiguration;
  subtotal: number;
  onConfigUpdate: (config: PricingConfiguration) => void;
}