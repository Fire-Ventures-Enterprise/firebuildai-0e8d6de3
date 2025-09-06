import { supabase } from "@/integrations/supabase/client";
import { EnhancedEstimateItem, PricingConfiguration } from "@/types/enhanced-pricing";

// Construction phases in proper order
export enum ConstructionPhase {
  PERMITS = 'permits',
  SITE_PREP = 'site_prep',
  PREP_DEMO = 'prep_demo',
  ROUGH_IN = 'rough_in',
  DRYWALL = 'drywall',
  FINISH_WORK = 'finish_work',
  FINAL_PLUMBING = 'final_plumbing',
  FINAL_ELECTRICAL = 'final_electrical',
  INSPECTION = 'inspection',
  CLEANUP = 'cleanup'
}

// Phase sequence order
const PHASE_ORDER: { [key: string]: number } = {
  permits: 1,
  site_prep: 2,
  prep_demo: 3,
  rough_in: 4,
  drywall: 5,
  finish_work: 6,
  final_plumbing: 7,
  final_electrical: 8,
  inspection: 9,
  cleanup: 10
};

// AI Sequencing rules
interface SequencingRule {
  keywords: string[];
  phase: ConstructionPhase;
  priority: number;
  dependencies?: string[];
}

const SEQUENCING_RULES: SequencingRule[] = [
  {
    keywords: ['permit', 'permits', 'approval'],
    phase: ConstructionPhase.PERMITS,
    priority: 100
  },
  {
    keywords: ['site preparation', 'site prep', 'protection'],
    phase: ConstructionPhase.SITE_PREP,
    priority: 90
  },
  {
    keywords: ['demolition', 'demo', 'removal', 'tear out'],
    phase: ConstructionPhase.PREP_DEMO,
    priority: 80
  },
  {
    keywords: ['rough-in', 'rough in', 'electrical rough', 'plumbing rough', 'framing'],
    phase: ConstructionPhase.ROUGH_IN,
    priority: 70,
    dependencies: ['prep_demo']
  },
  {
    keywords: ['drywall', 'sheetrock', 'gypsum', 'insulation', 'vapor barrier'],
    phase: ConstructionPhase.DRYWALL,
    priority: 60,
    dependencies: ['rough_in']
  },
  {
    keywords: ['cabinetry', 'cabinets', 'countertop', 'backsplash', 'tile', 'island', 'sink', 'finish'],
    phase: ConstructionPhase.FINISH_WORK,
    priority: 50,
    dependencies: ['drywall']
  },
  {
    keywords: ['final plumbing', 'faucet', 'dishwasher connection'],
    phase: ConstructionPhase.FINAL_PLUMBING,
    priority: 30,
    dependencies: ['finish_work']
  },
  {
    keywords: ['final electrical', 'lighting', 'appliance connection'],
    phase: ConstructionPhase.FINAL_ELECTRICAL,
    priority: 20,
    dependencies: ['finish_work']
  },
  {
    keywords: ['inspection', 'final inspection', 'walkthrough'],
    phase: ConstructionPhase.INSPECTION,
    priority: 10,
    dependencies: ['final_plumbing', 'final_electrical']
  },
  {
    keywords: ['cleanup', 'cleaning', 'final clean'],
    phase: ConstructionPhase.CLEANUP,
    priority: 5,
    dependencies: ['inspection']
  }
];

export class EnhancedWorkflowEngine {
  
  /**
   * Sequence items based on construction logic
   */
  static sequenceItemsByConstructionPhase(items: EnhancedEstimateItem[]): EnhancedEstimateItem[] {
    console.log('🤖 AI Construction Sequencing Starting...');
    
    // Assign phases to items based on keywords
    const itemsWithPhases = items.map(item => {
      const phase = this.detectConstructionPhase(item);
      return {
        ...item,
        constructionPhase: phase || item.constructionPhase || 'finish_work'
      };
    });
    
    // Sort by phase order, then by priority within phase
    const sequenced = itemsWithPhases.sort((a, b) => {
      const phaseA = PHASE_ORDER[a.constructionPhase!] || 999;
      const phaseB = PHASE_ORDER[b.constructionPhase!] || 999;
      
      if (phaseA !== phaseB) {
        return phaseA - phaseB;
      }
      
      // Within same phase, sort by item type priority
      const typeOrder: { [key: string]: number } = {
        labor: 1,
        subcontractor: 2,
        material: 3,
        equipment: 4,
        fee: 5,
        override: 6
      };
      
      const orderA = typeOrder[a.itemType] || 999;
      const orderB = typeOrder[b.itemType] || 999;
      
      return orderA - orderB;
    });
    
    // Update sort orders
    return sequenced.map((item, index) => ({
      ...item,
      sortOrder: index + 1
    }));
  }
  
  /**
   * Detect construction phase from item details
   */
  static detectConstructionPhase(item: EnhancedEstimateItem): string | null {
    const searchText = `${item.itemName} ${item.description} ${(item.sequencingKeywords || []).join(' ')}`.toLowerCase();
    
    for (const rule of SEQUENCING_RULES) {
      for (const keyword of rule.keywords) {
        if (searchText.includes(keyword.toLowerCase())) {
          return rule.phase;
        }
      }
    }
    
    return null;
  }
  
  /**
   * Convert estimate to invoice when deposit is paid
   */
  static async convertEstimateToInvoice(estimateId: string, depositAmount: number) {
    console.log('🔄 Converting estimate to invoice...');
    
    const { data: estimate, error: fetchError } = await supabase
      .from('enhanced_estimates_pricing')
      .select('*, enhanced_estimate_items_pricing(*)')
      .eq('id', estimateId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Create invoice from estimate
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices_enhanced')
      .insert({
        user_id: estimate.user_id,
        customer_id: estimate.customer_id,
        customer_name: estimate.customer_name,
        customer_email: estimate.customer_email,
        customer_phone: estimate.customer_phone,
        customer_address: estimate.customer_address,
        customer_city: estimate.customer_city,
        customer_postal_code: estimate.customer_postal_code,
        customer_province: estimate.customer_province,
        service_address: estimate.service_address,
        service_city: estimate.service_city,
        service_postal_code: estimate.service_postal_code,
        service_province: estimate.service_province,
        estimate_id: estimateId,
        deposit_amount: depositAmount,
        deposit_paid_at: new Date().toISOString(),
        status: 'partially_paid',
        scheduling_status: 'proposed',
        subtotal: estimate.subtotal,
        tax_rate: estimate.tax_rate,
        tax_amount: estimate.tax_amount,
        total: estimate.total,
        notes: estimate.notes,
        private_notes: estimate.private_notes,
        invoice_number: `INV-${Date.now()}`,
        issue_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();
    
    if (invoiceError) throw invoiceError;
    
    // Copy line items
    if (estimate.enhanced_estimate_items_pricing) {
      const items = estimate.enhanced_estimate_items_pricing.map((item: any) => ({
        invoice_id: invoice.id,
        item_name: item.item_name,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate || 0,
        amount: item.amount || item.bulk_price_allocated || 0,
        tax: item.tax,
        sort_order: item.sort_order
      }));
      
      await supabase.from('invoice_items_enhanced').insert(items);
    }
    
    // Update estimate status
    await supabase
      .from('enhanced_estimates_pricing')
      .update({ 
        status: 'accepted',
        converted_to_invoice: true 
      })
      .eq('id', estimateId);
    
    console.log('✅ Invoice created:', invoice.invoice_number);
    
    // Send notifications
    await this.sendNotifications(invoice.id, 'invoice_created', {
      invoiceNumber: invoice.invoice_number,
      depositAmount,
      balance: invoice.total - depositAmount
    });
    
    return invoice;
  }
  
  /**
   * Generate work order from invoice
   */
  static async generateWorkOrder(invoiceId: string) {
    console.log('📋 Generating work order...');
    
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices_enhanced')
      .select('*, invoice_items_enhanced(*)')
      .eq('id', invoiceId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Sequence the items for construction
    const sequencedItems = this.sequenceItemsByConstructionPhase(
      invoice.invoice_items_enhanced.map((item: any) => ({
        ...item,
        itemType: this.detectItemType(item.item_name, item.description)
      }))
    );
    
    // Create work order
    const { data: workOrder, error: woError } = await supabase
      .from('work_orders')
      .insert({
        user_id: invoice.user_id,
        invoice_id: invoiceId,
        title: `WO: ${invoice.customer_name} - ${invoice.service_address}`,
        service_address: invoice.service_address,
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks
        instructions: invoice.notes,
        status: 'pending',
        created_by: invoice.user_id
      })
      .select()
      .single();
    
    if (woError) throw woError;
    
    // Create work order items (tasks) - NO PRICING
    const tasks = sequencedItems.map((item, index) => ({
      work_order_id: workOrder.id,
      source_invoice_item_id: item.id,
      kind: 'task',
      description: `${item.itemName}: ${item.description}`,
      quantity: item.quantity,
      unit: item.unit,
      sort_order: index + 1,
      phase: item.constructionPhase,
      status: index === 0 ? 'ready' : 'pending' // First task is ready
    }));
    
    await supabase.from('work_order_items').insert(tasks);
    
    // Generate crew access token
    const { data: token } = await supabase.rpc('create_work_order_token', {
      p_work_order_id: workOrder.id,
      p_ttl_hours: 168 // 7 days
    });
    
    console.log('✅ Work order created:', workOrder.id);
    console.log('📱 Crew access token generated');
    
    return { workOrder, token };
  }
  
  /**
   * Detect item type from name and description
   */
  static detectItemType(name: string, description: string): string {
    const text = `${name} ${description}`.toLowerCase();
    
    if (text.includes('electrical') || text.includes('plumbing')) {
      return 'subcontractor';
    }
    if (text.includes('cabinet') || text.includes('countertop') || text.includes('sink') || text.includes('tile')) {
      return 'material';
    }
    if (text.includes('demo') || text.includes('install') || text.includes('prep')) {
      return 'labor';
    }
    if (text.includes('fee') || text.includes('shipping') || text.includes('management')) {
      return 'fee';
    }
    
    return 'material';
  }
  
  /**
   * Send workflow notifications
   */
  static async sendNotifications(
    entityId: string, 
    type: string, 
    data: any
  ) {
    // Queue email notification
    await supabase.from('email_outbox').insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      template: type,
      to_email: data.customerEmail || 'customer@example.com',
      subject: this.getNotificationSubject(type, data),
      payload: data,
      ref_id: entityId
    });
    
    console.log(`📧 Notification queued: ${type}`);
  }
  
  static getNotificationSubject(type: string, data: any): string {
    switch (type) {
      case 'invoice_created':
        return `Invoice ${data.invoiceNumber} - Deposit Received`;
      case 'work_order_ready':
        return `Work Order Ready for Scheduling`;
      case 'phase_complete':
        return `Project Update: ${data.phase} Complete`;
      default:
        return 'Project Update';
    }
  }
  
  /**
   * Complete kitchen remodel workflow test
   */
  static async testKitchenRemodelWorkflow() {
    console.log('🏠 TESTING KITCHEN REMODEL WORKFLOW');
    console.log('=====================================\n');
    
    // Sample items from the estimate
    const items: EnhancedEstimateItem[] = [
      {
        id: 'item-001',
        itemName: 'Site Preparation & Cleanup',
        description: 'Thorough site preparation, debris removal',
        quantity: 1,
        unit: 'job',
        itemType: 'labor',
        constructionPhase: 'site_prep',
        sequencingKeywords: ['site preparation', 'cleanup'],
        bulkPriceAllocated: 1500,
        bulkPricePercentage: 5.13,
        sortOrder: 1
      },
      {
        id: 'item-002',
        itemName: 'Demolition & Backsplash Removal',
        description: 'Remove existing backsplash, prepare walls',
        quantity: 1,
        unit: 'job',
        itemType: 'labor',
        constructionPhase: 'prep_demo',
        sequencingKeywords: ['demolition', 'backsplash removal'],
        bulkPriceAllocated: 800,
        bulkPricePercentage: 2.74,
        sortOrder: 2
      },
      {
        id: 'item-003',
        itemName: 'Electrical Rough-in Work',
        description: 'Install dishwasher power source',
        quantity: 1,
        unit: 'job',
        itemType: 'subcontractor',
        constructionPhase: 'rough_in',
        sequencingKeywords: ['electrical', 'rough-in'],
        bulkPriceAllocated: 1200,
        bulkPricePercentage: 4.10,
        sortOrder: 3
      },
      {
        id: 'item-006',
        itemName: 'White Shaker Kitchen Cabinetry',
        description: 'White Shaker wood cabinetry with soft-close',
        quantity: 1,
        unit: 'kitchen',
        itemType: 'material',
        constructionPhase: 'finish_work',
        sequencingKeywords: ['cabinetry', 'kitchen cabinets'],
        bulkPriceAllocated: 12000,
        bulkPricePercentage: 41.03,
        sortOrder: 6
      }
    ];
    
    console.log('📝 Original contractor order:');
    items.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.itemName}`);
    });
    
    console.log('\n🤖 AI sequenced order:');
    const sequenced = this.sequenceItemsByConstructionPhase(items);
    sequenced.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.itemName} (${item.constructionPhase})`);
    });
    
    console.log('\n✅ Workflow test complete!');
    return sequenced;
  }
}

// Export for use in components
export default EnhancedWorkflowEngine;