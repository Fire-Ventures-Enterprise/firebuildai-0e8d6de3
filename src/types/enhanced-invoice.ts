export interface EnhancedInvoiceItem {
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

export interface PaymentScheduleItem {
  id?: string;
  description: string;
  amount: number;
  percentage?: number;
  dueDate?: Date;
  status?: 'pending' | 'paid';
  paidDate?: Date;
}

export interface InvoicePhoto {
  id?: string;
  url: string;
  caption?: string;
  uploadedAt?: Date;
}

export interface InvoiceAttachment {
  id?: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt?: Date;
}

export interface InvoiceSignature {
  id?: string;
  type: 'client' | 'company';
  name: string;
  signatureData?: string;
  signedAt?: Date;
  ipAddress?: string;
}

export interface EnhancedInvoice {
  // Basic Info
  id?: string;
  invoiceNumber: string;
  poNumber?: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  
  // Dates
  issueDate: Date;
  dueDate: Date;
  daysToPayment?: number;
  
  // Customer Info
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  customerProvince?: string;
  customerPostalCode?: string;
  
  // Service Address
  serviceAddress?: string;
  serviceCity?: string;
  serviceProvince?: string;
  servicePostalCode?: string;
  
  // Items
  items: EnhancedInvoiceItem[];
  
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
  paidAmount?: number;
  balance?: number;
  
  // Payment
  paymentSchedule?: PaymentScheduleItem[];
  acceptOnlinePayments?: boolean;
  coverProcessingFee?: boolean;
  
  // Contract & Signatures
  contractRequired?: boolean;
  contractUrl?: string;
  contractText?: string;
  signatures?: InvoiceSignature[];
  
  // Notes & Media
  notes?: string;
  privateNotes?: string;
  photos?: InvoicePhoto[];
  attachments?: InvoiceAttachment[];
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

export interface CreateEnhancedInvoiceRequest extends Omit<EnhancedInvoice, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateEnhancedInvoiceRequest extends Partial<CreateEnhancedInvoiceRequest> {}