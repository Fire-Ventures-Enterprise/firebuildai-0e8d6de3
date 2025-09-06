// Contractor Workflow Engine
// This handles the complete estimate → invoice → work order → completion flow

import { EnhancedEstimate } from '@/types/enhanced-estimate';
import { EnhancedInvoice } from '@/types/enhanced-invoice';
import { 
  WorkOrder, 
  WorkOrderItem, 
  ConstructionPhase, 
  WorkflowStatus,
  CONSTRUCTION_SEQUENCE_RULES,
  FieldReport,
  WorkflowNotification
} from '@/types/workflow';
import { EnhancedInvoiceWithWorkflow } from '@/types/enhanced-invoice';
import { supabase } from '@/integrations/supabase/client';

export class ContractorWorkflowEngine {
  
  /**
   * Step 1: Auto-convert estimate to invoice when deposit is paid
   */
  static async convertEstimateToInvoice(
    estimateId: string, 
    depositAmount: number,
    paymentDate: Date
  ): Promise<EnhancedInvoiceWithWorkflow> {
    
    // Get the estimate from existing table with customer
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .select('*, estimate_items(*)')
      .eq('id', estimateId)
      .single();
    
    if (estimateError || !estimate) {
      throw new Error('Estimate not found');
    }
    
    // Get customer separately
    let customerName = '';
    let customerData: any = {};
    if (estimate.customer_id) {
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', estimate.customer_id)
        .single();
      
      if (customer) {
        customerData = customer;
        customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
      }
    }
    
    // Generate invoice number
    const { count } = await supabase
      .from('invoices_enhanced')
      .select('*', { count: 'exact' });
    
    const invoiceNumber = `INV-${String((count || 0) + 1).padStart(5, '0')}`;
    
    // Create invoice from estimate (using existing schema)
    const invoice: any = {
      invoice_number: invoiceNumber,
      status: 'sent',
      
      // Copy all estimate data
      issue_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      customer_id: estimate.customer_id,
      customer_name: customerName,
      customer_email: customerData.email || null,
      customer_phone: customerData.phone || null,
      customer_address: customerData.address || null,
      customer_city: customerData.city || null,
      customer_province: customerData.province || null,
      customer_postal_code: customerData.postal_code || null,
      service_address: estimate.service_address,
      service_city: estimate.service_city,
      service_province: estimate.service_province,
      service_postal_code: estimate.service_postal_code,
      
      // Financial data
      subtotal: estimate.subtotal,
      tax_rate: estimate.tax_rate,
      tax_amount: estimate.tax_amount,
      total: estimate.total,
      
      // Payment tracking
      paid_amount: depositAmount,
      balance: estimate.total - depositAmount,
      deposit_amount: depositAmount,
      deposit_paid_at: paymentDate.toISOString(),
      
      // Notes
      notes: estimate.notes,
      
      // User
      user_id: estimate.user_id
    };
    
    // Save invoice to database
    const { data: savedInvoice, error: invoiceError } = await supabase
      .from('invoices_enhanced')
      .insert(invoice)
      .select()
      .single();
    
    if (invoiceError) {
      throw new Error('Failed to create invoice: ' + invoiceError.message);
    }
    
    // Copy estimate items to invoice items
    if (estimate.estimate_items && estimate.estimate_items.length > 0) {
      const invoiceItems = estimate.estimate_items.map((item: any) => ({
        invoice_id: savedInvoice.id,
        item_name: item.description,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
        tax: estimate.tax_rate > 0,
        sort_order: item.sort_order
      }));
      
      await supabase
        .from('invoice_items_enhanced')
        .insert(invoiceItems);
    }
    
    // Update estimate status
    await supabase
      .from('estimates')
      .update({ 
        status: 'accepted',
        converted_to_invoice: true,
        converted_invoice_id: savedInvoice.id,
        accepted_at: new Date().toISOString()
      })
      .eq('id', estimateId);
    
    // Convert to EnhancedInvoiceWithWorkflow format for return
    return {
      ...this.convertToEnhancedInvoice(savedInvoice),
      workflowStatus: 'deposit_paid',
      depositPaidDate: paymentDate,
      officeNotifications: [{
        type: 'deposit_received',
        message: `Deposit of $${depositAmount.toFixed(2)} received. Invoice created and ready for scheduling.`,
        sentAt: new Date(),
        actionRequired: true
      }],
      clientNotifications: [{
        type: 'deposit_received',
        message: `Thank you! Your deposit has been received. We'll contact you shortly to schedule your project.`,
        sentAt: new Date(),
        actionRequired: false
      }]
    };
  }
  
  /**
   * Step 2: Generate work order with intelligent construction sequencing
   */
  static async generateWorkOrder(invoiceId: string): Promise<WorkOrder> {
    
    // Get the invoice with items
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices_enhanced')
      .select('*, invoice_items:invoice_items_enhanced(*)')
      .eq('id', invoiceId)
      .single();
    
    if (invoiceError || !invoice) {
      throw new Error('Invoice not found');
    }
    
    // Generate work order number  
    const { count } = await supabase
      .from('work_orders')
      .select('*', { count: 'exact' });
    
    const workOrderNumber = `WO-${String((count || 0) + 1).padStart(5, '0')}`;
    
    // Generate crew access token
    const crewAccessToken = this.generateSecureToken();
    
    // Analyze invoice items and create sequenced work order items
    const workOrderItems = this.analyzeAndSequenceItems(invoice.invoice_items || []);
    
    // Create work order with required fields
    const now = new Date().toISOString();
    const workOrderData = {
      user_id: invoice.user_id,
      invoice_id: invoiceId,
      title: `${invoice.customer_name} - ${invoice.service_address}`,
      service_address: invoice.service_address || '',
      status: 'draft',
      created_by: invoice.user_id,
      starts_at: now,
      ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days default
    };
    
    // Save work order to database
    const { data: savedWorkOrder, error: workOrderError } = await supabase
      .from('work_orders')
      .insert(workOrderData)
      .select()
      .single();
    
    if (workOrderError) {
      throw new Error('Failed to create work order: ' + workOrderError.message);
    }
    
    // Save work order items
    if (workOrderItems.length > 0) {
      const itemsToInsert = workOrderItems.map(item => ({
        work_order_id: savedWorkOrder.id,
        description: item.description,
        kind: 'task',
        quantity: item.quantity,
        sort_order: item.sequenceOrder
      }));
      
      await supabase
        .from('work_order_items')
        .insert(itemsToInsert);
    }
    
    // Generate crew token
    const { data: token } = await supabase.rpc('create_work_order_token', {
      p_work_order_id: savedWorkOrder.id,
      p_ttl_hours: 168 // 7 days
    });
    
    // Return work order object
    return {
      id: savedWorkOrder.id,
      invoiceId,
      workOrderNumber,
      status: 'draft',
      jobTitle: `${invoice.customer_name} - ${invoice.service_address}`,
      serviceAddress: invoice.service_address || '',
      serviceCity: invoice.service_city || '',
      serviceProvince: invoice.service_province || '',
      servicePostalCode: invoice.service_postal_code || '',
      items: workOrderItems,
      crewAccessToken: token || crewAccessToken,
      currentPhase: 'prep_demo',
      overallProgress: 0,
      fieldReports: [],
      createdAt: new Date(savedWorkOrder.created_at),
      userId: savedWorkOrder.user_id
    };
  }
  
  /**
   * Core AI: Analyze invoice items and sequence them by construction logic
   */
  private static analyzeAndSequenceItems(invoiceItems: any[]): WorkOrderItem[] {
    const workOrderItems: WorkOrderItem[] = [];
    let sequenceCounter = 1;
    
    // Group items by construction phase
    const phaseGroups: { [key in ConstructionPhase]?: any[] } = {};
    
    invoiceItems.forEach(item => {
      const matchedRule = this.matchItemToConstructionPhase(item);
      
      if (matchedRule) {
        if (!phaseGroups[matchedRule.phase]) {
          phaseGroups[matchedRule.phase] = [];
        }
        
        phaseGroups[matchedRule.phase]!.push({
          ...item,
          rule: matchedRule
        });
      } else {
        // Default to finish work if no match
        if (!phaseGroups['finish_work']) {
          phaseGroups['finish_work'] = [];
        }
        phaseGroups['finish_work']!.push({
          ...item,
          rule: {
            phase: 'finish_work',
            sequenceOrder: 60,
            dependencies: ['flooring_prep'],
            estimatedDurationMultiplier: 1.0
          }
        });
      }
    });
    
    // Sort phases by sequence order and create work order items
    const sortedPhases = Object.entries(phaseGroups).sort(
      ([, itemsA], [, itemsB]) => {
        const orderA = itemsA[0]?.rule?.sequenceOrder || 999;
        const orderB = itemsB[0]?.rule?.sequenceOrder || 999;
        return orderA - orderB;
      }
    );
    
    sortedPhases.forEach(([phase, items]) => {
      items.forEach((item: any) => {
        const estimatedDuration = (item.quantity || 1) * (item.rule.estimatedDurationMultiplier || 1.0) * 8; // 8 hours base
        
        workOrderItems.push({
          id: item.id,
          itemName: item.item_name || item.description,
          description: item.description,
          quantity: item.quantity || 1,
          phase: phase as ConstructionPhase,
          sequenceOrder: sequenceCounter++,
          dependencies: this.calculateDependencies(phase as ConstructionPhase, workOrderItems),
          estimatedDuration: Math.max(estimatedDuration, 2), // Minimum 2 hours
          status: 'pending'
        });
      });
    });
    
    return workOrderItems;
  }
  
  /**
   * Match invoice item to construction phase using AI keyword matching
   */
  private static matchItemToConstructionPhase(item: any) {
    const itemText = `${item.item_name || ''} ${item.description || ''}`.toLowerCase();
    
    // Find the best matching rule
    let bestMatch = null;
    let bestScore = 0;
    
    CONSTRUCTION_SEQUENCE_RULES.forEach(rule => {
      const matchCount = rule.itemKeywords.filter(keyword => 
        itemText.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount > bestScore) {
        bestScore = matchCount;
        bestMatch = rule;
      }
    });
    
    return bestMatch;
  }
  
  /**
   * Calculate dependencies based on construction logic
   */
  private static calculateDependencies(phase: ConstructionPhase, existingItems: WorkOrderItem[]): string[] {
    const dependencies: string[] = [];
    
    // Find items from prerequisite phases
    const rule = CONSTRUCTION_SEQUENCE_RULES.find(r => r.phase === phase);
    if (rule && rule.dependencies) {
      rule.dependencies.forEach(depPhase => {
        const depItems = existingItems.filter(item => item.phase === depPhase);
        dependencies.push(...depItems.map(item => item.id!).filter(Boolean));
      });
    }
    
    return dependencies;
  }
  
  /**
   * Generate secure token for crew access
   */
  private static generateSecureToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * Convert database invoice to EnhancedInvoice format
   */
  private static convertToEnhancedInvoice(dbInvoice: any): EnhancedInvoice {
    return {
      id: dbInvoice.id,
      invoiceNumber: dbInvoice.invoice_number,
      poNumber: dbInvoice.po_number,
      status: dbInvoice.status,
      issueDate: new Date(dbInvoice.issue_date),
      dueDate: new Date(dbInvoice.due_date),
      customerId: dbInvoice.customer_id,
      customerName: dbInvoice.customer_name,
      customerEmail: dbInvoice.customer_email,
      customerPhone: dbInvoice.customer_phone,
      customerAddress: dbInvoice.customer_address,
      customerCity: dbInvoice.customer_city,
      customerProvince: dbInvoice.customer_province,
      customerPostalCode: dbInvoice.customer_postal_code,
      serviceAddress: dbInvoice.service_address,
      serviceCity: dbInvoice.service_city,
      serviceProvince: dbInvoice.service_province,
      servicePostalCode: dbInvoice.service_postal_code,
      items: [],
      subtotal: dbInvoice.subtotal,
      taxRate: dbInvoice.tax_rate,
      taxAmount: dbInvoice.tax_amount,
      total: dbInvoice.total,
      paidAmount: dbInvoice.paid_amount,
      balance: dbInvoice.balance,
      notes: dbInvoice.notes,
      privateNotes: dbInvoice.private_notes,
      createdAt: new Date(dbInvoice.created_at),
      updatedAt: new Date(dbInvoice.updated_at),
      userId: dbInvoice.user_id
    };
  }
  
  /**
   * Step 3: Update workflow status when work starts
   */
  static async startWork(workOrderId: string): Promise<void> {
    // Update work order
    await supabase
      .from('work_orders')
      .update({ 
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', workOrderId);
  }
  
  /**
   * Step 4: Complete workflow when job is done
   */
  static async completeWork(workOrderId: string): Promise<void> {
    // Update work order
    await supabase
      .from('work_orders')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', workOrderId);
  }
}