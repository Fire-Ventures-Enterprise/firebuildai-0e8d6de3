// Xactimate Integration Types

export interface XactimateEstimate {
  id: string;
  user_id: string;
  project_id?: string;
  claim_number?: string;
  insured_name?: string;
  adjuster_id?: string;
  adjuster_email?: string;
  adjuster_phone?: string;
  carrier_name?: string;
  date_of_loss?: Date;
  cause_of_loss?: string;
  property_address?: string;
  property_city?: string;
  property_state?: string;
  property_postal_code?: string;
  total_rcv?: number;
  total_acv?: number;
  deductible?: number;
  depreciation?: number;
  overhead_profit?: number;
  original_file_url?: string;
  original_file_name?: string;
  estimate_data?: any;
  import_status?: 'pending' | 'processing' | 'completed' | 'failed';
  imported_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface XactimateLineItem {
  id: string;
  estimate_id: string;
  work_order_id?: string;
  xactimate_code?: string;
  category?: string;
  selector?: string;
  description?: string;
  long_description?: string;
  quantity?: number;
  unit?: string;
  unit_price?: number;
  total_price?: number;
  tax_amount?: number;
  rcv_total?: number;
  acv_total?: number;
  depreciation_amount?: number;
  line_item_type?: string;
  trade?: string;
  room_name?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  actual_cost?: number;
  completion_percentage?: number;
  completion_date?: Date;
  assigned_contractor_id?: string;
  notes?: string;
  sort_order?: number;
  created_at: Date;
  updated_at: Date;
}

export interface XactimatePhotoLink {
  id: string;
  line_item_id: string;
  photo_url: string;
  photo_caption?: string;
  stage: 'before' | 'during' | 'after' | 'documentation';
  uploaded_by?: string;
  uploaded_at: Date;
  metadata?: any;
  created_at: Date;
}

export interface XactimateSyncLog {
  id: string;
  user_id: string;
  estimate_id?: string;
  sync_type?: 'import' | 'export' | 'progress_update' | 'photo_sync';
  sync_direction?: 'inbound' | 'outbound';
  status?: 'success' | 'failed' | 'pending' | 'partial';
  details?: any;
  error_message?: string;
  items_synced?: number;
  started_at?: Date;
  completed_at?: Date;
  created_at: Date;
}

export interface XactimateChangeOrder {
  id: string;
  estimate_id: string;
  change_order_number?: string;
  description?: string;
  reason?: string;
  total_amount?: number;
  status?: 'pending' | 'submitted' | 'approved' | 'rejected';
  submitted_date?: Date;
  approved_date?: Date;
  approved_by?: string;
  line_items?: any;
  created_at: Date;
  updated_at: Date;
}

export interface XactimateTradeAssignment {
  id: string;
  estimate_id: string;
  trade_name: string;
  contractor_id?: string;
  estimated_cost?: number;
  actual_cost?: number;
  assigned_line_items?: number;
  completed_line_items?: number;
  status?: 'not_assigned' | 'assigned' | 'in_progress' | 'completed';
  assigned_at?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface XactimateProgressReport {
  id: string;
  estimate_id: string;
  report_date: Date;
  overall_completion_percentage?: number;
  trades_progress?: any;
  cost_variance?: number;
  notes?: string;
  photos_count?: number;
  generated_by?: string;
  sent_to_adjuster?: boolean;
  sent_at?: Date;
  created_at: Date;
}

// Import/Export Interfaces
export interface XactimateImportData {
  claim_number: string;
  insured_name: string;
  property_address: string;
  date_of_loss: Date;
  total_rcv: number;
  total_acv: number;
  deductible: number;
  line_items: XactimateLineItemImport[];
}

export interface XactimateLineItemImport {
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  category?: string;
  trade?: string;
  room?: string;
}

// Trade Categories
export interface XactimateTradeCategory {
  trade: string;
  line_items: XactimateLineItem[];
  total_estimate: number;
  assigned_contractor?: {
    id: string;
    name: string;
    email: string;
  };
  completion_percentage: number;
}

// Photo Management
export interface XactimatePhotoUpload {
  line_item_id: string;
  stage: 'before' | 'during' | 'after' | 'documentation';
  file: File;
  caption?: string;
}

// Progress Tracking
export interface XactimateProgressUpdate {
  line_item_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completion_percentage: number;
  actual_cost?: number;
  notes?: string;
  photos?: XactimatePhotoUpload[];
}

// Reporting
export interface XactimateCompletionReport {
  estimate_id: string;
  claim_number: string;
  overall_completion: number;
  cost_summary: {
    estimated_total: number;
    actual_total: number;
    variance: number;
    variance_percentage: number;
  };
  trades_summary: XactimateTradeCategory[];
  photos_summary: {
    total_photos: number;
    before_photos: number;
    during_photos: number;
    after_photos: number;
  };
  line_items_summary: {
    total_items: number;
    completed_items: number;
    in_progress_items: number;
    not_started_items: number;
  };
  generated_at: Date;
}