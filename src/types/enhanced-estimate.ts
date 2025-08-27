export interface EnhancedEstimateItem {
  id?: string;
  itemName: string;
  description: string;
  quantity: number;
  rate: number;
  markup?: number;
  markupType?: 'percentage' | 'fixed';
  markupAmount?: number;
  tax?: boolean;
  amount: number;
  sortOrder?: number;
}

export interface EstimatePaymentScheduleItem {
  id?: string;
  description: string;
  amount: number;
  percentage?: number;
  dueDate?: Date;
  milestone?: string;
}

export interface EstimatePhoto {
  id?: string;
  url: string;
  caption?: string;
  uploadedAt?: Date;
}

export interface EstimateAttachment {
  id?: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt?: Date;
}

export interface EstimateSignature {
  id?: string;
  type: 'client' | 'company';
  name: string;
  signatureData?: string;
  signedAt?: Date;
  ipAddress?: string;
}

export interface EnhancedEstimate {
  // Basic Info
  id?: string;
  estimateNumber: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  
  // Dates
  issueDate: Date;
  expirationDate?: Date;
  validForDays?: number;
  
  // Customer Info
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  customerProvince?: string;
  customerPostalCode?: string;
  
  // Items
  items: EnhancedEstimateItem[];
  
  // Financial
  subtotal: number;
  markupTotal?: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  discountAmount?: number;
  depositRequest?: number;
  depositType?: 'percentage' | 'fixed';
  depositAmount?: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  
  // Payment
  paymentSchedule?: EstimatePaymentScheduleItem[];
  acceptOnlinePayments?: boolean;
  
  // Contract & Signatures
  contractRequired?: boolean;
  contractUrl?: string;
  contractText?: string;
  scopeOfWork?: string;
  signatures?: EstimateSignature[];
  
  // Notes & Media
  notes?: string;
  privateNotes?: string;
  termsConditions?: string;
  photos?: EstimatePhoto[];
  attachments?: EstimateAttachment[];
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
  convertedToInvoice?: boolean;
  invoiceId?: string;
}

export interface CreateEnhancedEstimateRequest extends Omit<EnhancedEstimate, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateEnhancedEstimateRequest extends Partial<CreateEnhancedEstimateRequest> {}