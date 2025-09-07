// Xactimate Integration Service
import { supabase } from '@/lib/supabase';
import { 
  XactimateEstimate, 
  XactimateLineItem, 
  XactimatePhotoLink,
  XactimateImportData,
  XactimateProgressUpdate,
  XactimateTradeCategory,
  XactimateCompletionReport
} from '@/types/xactimate';
import { toast } from '@/hooks/use-toast';
import { XactimateParser } from './xactimateParser';

// Trade mapping for categorization
const TRADE_MAPPING: Record<string, string> = {
  // Electrical
  'ELE': 'electrical',
  'ELEC': 'electrical',
  'WIR': 'electrical',
  // Plumbing
  'PLB': 'plumbing',
  'PLUMB': 'plumbing',
  'PIPE': 'plumbing',
  // Flooring
  'FLR': 'flooring',
  'FLOOR': 'flooring',
  'CARPET': 'flooring',
  'TILE': 'flooring',
  'VINYL': 'flooring',
  // Painting
  'PNT': 'painting',
  'PAINT': 'painting',
  // Drywall
  'DRY': 'drywall',
  'DRYWALL': 'drywall',
  'SHEETROCK': 'drywall',
  // Roofing
  'RFG': 'roofing',
  'ROOF': 'roofing',
  'SHINGLE': 'roofing',
  // HVAC
  'HVC': 'hvac',
  'HVAC': 'hvac',
  'HEAT': 'hvac',
  'COOL': 'hvac',
  // Mitigation
  'WTR': 'mitigation',
  'WATER': 'mitigation',
  'MITI': 'mitigation',
  'DEMO': 'demolition',
  // Framing
  'FRM': 'framing',
  'FRAME': 'framing',
  'STUD': 'framing',
  // General/Other
  'GEN': 'general',
  'MISC': 'general',
  'CLN': 'cleaning'
};

export class XactimateService {
  // Parse and import Xactimate estimate
  static async importEstimate(file: File, userId: string): Promise<XactimateEstimate> {
    try {
      // Use the enhanced parser
      const estimateData = await XactimateParser.parseFile(file);
      
      // Create estimate record
      const { data: estimate, error: estimateError } = await supabase
        .from('xactimate_estimates')
        .insert({
          user_id: userId,
          claim_number: estimateData.claim_number,
          insured_name: estimateData.insured_name,
          property_address: estimateData.property_address,
          date_of_loss: estimateData.date_of_loss,
          total_rcv: estimateData.total_rcv,
          total_acv: estimateData.total_acv,
          deductible: estimateData.deductible,
          original_file_name: file.name,
          estimate_data: estimateData,
          import_status: 'processing'
        })
        .select()
        .single();

      if (estimateError) throw estimateError;

      // Import line items
      if (estimateData.line_items && estimateData.line_items.length > 0) {
        const lineItems = estimateData.line_items.map((item: any, index: number) => ({
          estimate_id: estimate.id,
          xactimate_code: item.code,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          total_price: item.total_price,
          category: item.category,
          trade: this.detectTrade(item.code, item.description),
          room_name: item.room,
          status: 'not_started',
          sort_order: index
        }));

        const { error: lineItemsError } = await supabase
          .from('xactimate_line_items')
          .insert(lineItems);

        if (lineItemsError) throw lineItemsError;
      }

      // Update import status
      await supabase
        .from('xactimate_estimates')
        .update({ 
          import_status: 'completed',
          imported_at: new Date().toISOString()
        })
        .eq('id', estimate.id);

      // Log the import
      await this.logSync(userId, estimate.id, 'import', 'success', { 
        file_name: file.name,
        line_items_count: estimateData.line_items?.length || 0
      });

      toast({
        title: "Estimate imported successfully",
        description: `Imported ${estimateData.line_items?.length || 0} line items`,
      });

      return estimate;
    } catch (error) {
      console.error('Error importing estimate:', error);
      toast({
        title: "Import failed",
        description: "Failed to import Xactimate estimate",
        variant: "destructive"
      });
      throw error;
    }
  }

  // Parse file content (PDF or XMO)
  private static async parseFile(file: File): Promise<any> {
    // This is a simplified parser - in production, you'd use a proper PDF/XMO parser
    const text = await file.text();
    
    // Mock parsing for demonstration
    // In production, integrate with PDF parsing library or XMO parser
    return {
      claim_number: this.extractValue(text, 'Claim #:', 'CLM-2024-001'),
      insured_name: this.extractValue(text, 'Insured:', 'John Doe'),
      property_address: this.extractValue(text, 'Property:', '123 Main St'),
      date_of_loss: new Date('2024-01-15'),
      total_rcv: this.extractNumber(text, 'RCV:', 125000),
      total_acv: this.extractNumber(text, 'ACV:', 100000),
      deductible: this.extractNumber(text, 'Deductible:', 2500),
      line_items: this.extractLineItems(text)
    };
  }

  // Helper to extract values from text
  private static extractValue(text: string, key: string, defaultValue: string): string {
    const regex = new RegExp(`${key}\\s*([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : defaultValue;
  }

  // Helper to extract numbers
  private static extractNumber(text: string, key: string, defaultValue: number): number {
    const value = this.extractValue(text, key, defaultValue.toString());
    return parseFloat(value.replace(/[$,]/g, '')) || defaultValue;
  }

  // Extract line items from text
  private static extractLineItems(text: string): any[] {
    // Mock line items for demonstration
    return [
      { code: 'DRY-001', description: 'Remove & Replace Drywall', quantity: 250, unit: 'SF', unit_price: 4.50, total_price: 1125, category: 'Structural', room: 'Living Room' },
      { code: 'PNT-001', description: 'Paint Walls - 2 Coats', quantity: 250, unit: 'SF', unit_price: 2.25, total_price: 562.50, category: 'Finishes', room: 'Living Room' },
      { code: 'FLR-001', description: 'Install Luxury Vinyl Plank', quantity: 180, unit: 'SF', unit_price: 6.75, total_price: 1215, category: 'Flooring', room: 'Living Room' },
      { code: 'ELE-001', description: 'Replace Electrical Outlets', quantity: 4, unit: 'EA', unit_price: 85, total_price: 340, category: 'Electrical', room: 'Living Room' },
      { code: 'PLB-001', description: 'Replace Supply Lines', quantity: 2, unit: 'EA', unit_price: 125, total_price: 250, category: 'Plumbing', room: 'Kitchen' }
    ];
  }

  // Extract estimate data for structured import
  private static extractEstimateData(parsedContent: any): XactimateImportData {
    return {
      claim_number: parsedContent.claim_number,
      insured_name: parsedContent.insured_name,
      property_address: parsedContent.property_address,
      date_of_loss: parsedContent.date_of_loss,
      total_rcv: parsedContent.total_rcv,
      total_acv: parsedContent.total_acv,
      deductible: parsedContent.deductible,
      line_items: parsedContent.line_items
    };
  }

  // Detect trade based on code and description
  private static detectTrade(code: string, description: string): string {
    // Check code prefix
    const codePrefix = code.split('-')[0].toUpperCase();
    if (TRADE_MAPPING[codePrefix]) {
      return TRADE_MAPPING[codePrefix];
    }

    // Check description keywords
    const descUpper = description.toUpperCase();
    for (const [key, trade] of Object.entries(TRADE_MAPPING)) {
      if (descUpper.includes(key)) {
        return trade;
      }
    }

    return 'general';
  }

  // Get estimates for user
  static async getEstimates(userId: string): Promise<XactimateEstimate[]> {
    const { data, error } = await supabase
      .from('xactimate_estimates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get estimate with line items
  static async getEstimateWithLineItems(estimateId: string): Promise<{
    estimate: XactimateEstimate;
    lineItems: XactimateLineItem[];
    tradeCategories: XactimateTradeCategory[];
  }> {
    const { data: estimate, error: estimateError } = await supabase
      .from('xactimate_estimates')
      .select('*')
      .eq('id', estimateId)
      .single();

    if (estimateError) throw estimateError;

    const { data: lineItems, error: lineItemsError } = await supabase
      .from('xactimate_line_items')
      .select('*')
      .eq('estimate_id', estimateId)
      .order('sort_order');

    if (lineItemsError) throw lineItemsError;

    // Group by trade
    const tradeCategories = this.groupLineItemsByTrade(lineItems || []);

    return {
      estimate,
      lineItems: lineItems || [],
      tradeCategories
    };
  }

  // Group line items by trade
  private static groupLineItemsByTrade(lineItems: XactimateLineItem[]): XactimateTradeCategory[] {
    const trades = new Map<string, XactimateTradeCategory>();

    lineItems.forEach(item => {
      const trade = item.trade || 'general';
      if (!trades.has(trade)) {
        trades.set(trade, {
          trade,
          line_items: [],
          total_estimate: 0,
          completion_percentage: 0
        });
      }

      const category = trades.get(trade)!;
      category.line_items.push(item);
      category.total_estimate += item.total_price || 0;
    });

    // Calculate completion percentage for each trade
    trades.forEach(category => {
      const completed = category.line_items.filter(item => item.status === 'completed').length;
      const total = category.line_items.length;
      category.completion_percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    });

    return Array.from(trades.values());
  }

  // Update line item progress
  static async updateLineItemProgress(update: XactimateProgressUpdate): Promise<void> {
    const { error } = await supabase
      .from('xactimate_line_items')
      .update({
        status: update.status,
        completion_percentage: update.completion_percentage,
        actual_cost: update.actual_cost,
        notes: update.notes,
        completion_date: update.status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', update.line_item_id);

    if (error) throw error;

    toast({
      title: "Progress updated",
      description: "Line item progress has been updated",
    });
  }

  // Upload photo for line item
  static async uploadLineItemPhoto(
    lineItemId: string, 
    file: File, 
    stage: 'before' | 'during' | 'after' | 'documentation',
    caption?: string
  ): Promise<void> {
    try {
      // Upload to storage
      const fileName = `xactimate/${lineItemId}/${stage}_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-photos')
        .getPublicUrl(fileName);

      // Create photo link record
      const { error: linkError } = await supabase
        .from('xactimate_photo_links')
        .insert({
          line_item_id: lineItemId,
          photo_url: publicUrl,
          photo_caption: caption,
          stage,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (linkError) throw linkError;

      toast({
        title: "Photo uploaded",
        description: `${stage} photo uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo",
        variant: "destructive"
      });
      throw error;
    }
  }

  // Get photos for line item
  static async getLineItemPhotos(lineItemId: string): Promise<XactimatePhotoLink[]> {
    const { data, error } = await supabase
      .from('xactimate_photo_links')
      .select('*')
      .eq('line_item_id', lineItemId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  }

  // Generate completion report
  static async generateCompletionReport(estimateId: string): Promise<XactimateCompletionReport> {
    const { estimate, lineItems, tradeCategories } = await this.getEstimateWithLineItems(estimateId);
    
    // Get all photos
    const photoPromises = lineItems.map(item => this.getLineItemPhotos(item.id));
    const photosArrays = await Promise.all(photoPromises);
    const allPhotos = photosArrays.flat();

    // Calculate statistics
    const totalEstimate = lineItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
    const totalActual = lineItems.reduce((sum, item) => sum + (item.actual_cost || 0), 0);
    const completedItems = lineItems.filter(item => item.status === 'completed').length;
    const inProgressItems = lineItems.filter(item => item.status === 'in_progress').length;
    const notStartedItems = lineItems.filter(item => item.status === 'not_started').length;
    
    const beforePhotos = allPhotos.filter(p => p.stage === 'before').length;
    const duringPhotos = allPhotos.filter(p => p.stage === 'during').length;
    const afterPhotos = allPhotos.filter(p => p.stage === 'after').length;

    const overallCompletion = lineItems.length > 0 
      ? Math.round((completedItems / lineItems.length) * 100) 
      : 0;

    const report: XactimateCompletionReport = {
      estimate_id: estimateId,
      claim_number: estimate.claim_number || '',
      overall_completion: overallCompletion,
      cost_summary: {
        estimated_total: totalEstimate,
        actual_total: totalActual,
        variance: totalActual - totalEstimate,
        variance_percentage: totalEstimate > 0 
          ? ((totalActual - totalEstimate) / totalEstimate) * 100 
          : 0
      },
      trades_summary: tradeCategories,
      photos_summary: {
        total_photos: allPhotos.length,
        before_photos: beforePhotos,
        during_photos: duringPhotos,
        after_photos: afterPhotos
      },
      line_items_summary: {
        total_items: lineItems.length,
        completed_items: completedItems,
        in_progress_items: inProgressItems,
        not_started_items: notStartedItems
      },
      generated_at: new Date()
    };

    // Save report to database
    await supabase
      .from('xactimate_progress_reports')
      .insert({
        estimate_id: estimateId,
        report_date: new Date().toISOString(),
        overall_completion_percentage: overallCompletion,
        trades_progress: tradeCategories,
        cost_variance: report.cost_summary.variance,
        photos_count: allPhotos.length,
        generated_by: (await supabase.auth.getUser()).data.user?.id
      });

    return report;
  }

  // Log sync activity
  private static async logSync(
    userId: string, 
    estimateId: string | null,
    syncType: string,
    status: string,
    details?: any
  ): Promise<void> {
    await supabase
      .from('xactimate_sync_log')
      .insert({
        user_id: userId,
        estimate_id: estimateId,
        sync_type: syncType,
        sync_direction: 'inbound',
        status,
        details,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      });
  }

  // Create project from estimate
  static async createProjectFromEstimate(estimateId: string): Promise<string> {
    try {
      const { estimate, lineItems, tradeCategories } = await this.getEstimateWithLineItems(estimateId);
      const userId = (await supabase.auth.getUser()).data.user?.id;

      // Create job/project
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
          user_id: userId,
          name: `Insurance Restoration - ${estimate.claim_number}`,
          description: `Restoration project for claim ${estimate.claim_number}`,
          customer_name: estimate.insured_name,
          address: estimate.property_address,
          city: estimate.property_city,
          state: estimate.property_state,
          postal_code: estimate.property_postal_code,
          status: 'pending',
          estimated_budget: estimate.total_rcv,
          metadata: {
            xactimate_estimate_id: estimateId,
            claim_number: estimate.claim_number,
            carrier: estimate.carrier_name
          }
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // Update estimate with project ID
      await supabase
        .from('xactimate_estimates')
        .update({ project_id: job.id })
        .eq('id', estimateId);

      // Create work orders for each trade
      for (const trade of tradeCategories) {
        const { error: woError } = await supabase
          .from('work_orders')
          .insert({
            user_id: userId,
            title: `${trade.trade.charAt(0).toUpperCase() + trade.trade.slice(1)} Work`,
            service_address: estimate.property_address,
            starts_at: new Date().toISOString(),
            ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            status: 'pending',
            instructions: `Complete ${trade.trade} work for claim ${estimate.claim_number}`,
            metadata: {
              xactimate_trade: trade.trade,
              estimated_cost: trade.total_estimate,
              line_items_count: trade.line_items.length
            }
          });

        if (woError) console.error('Error creating work order:', woError);
      }

      toast({
        title: "Project created",
        description: `Project created from estimate ${estimate.claim_number}`,
      });

      return job.id;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project from estimate",
        variant: "destructive"
      });
      throw error;
    }
  }
}