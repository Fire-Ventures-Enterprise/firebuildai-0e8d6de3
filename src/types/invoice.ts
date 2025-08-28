export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CHECK = 'CHECK',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE'
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  paidAmount: number;
  balance: number;
  discount?: number;
  notes?: string;
  termsConditions?: string;
  customerId: string;
  customer?: Customer;
  companyId: string;
  company?: Company;
  jobId?: string;
  items: InvoiceItem[];
  payments?: Payment[];
  createdAt: Date;
  updatedAt: Date;
  lastSync?: Date;
}

export interface Payment {
  id: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  reference?: string;
  notes?: string;
  invoiceId: string;
  stripePaymentId?: string;
  createdAt: Date;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  company?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  taxId?: string;
  licenseNumber?: string;
}

export interface CreateInvoiceRequest {
  invoiceNumber?: string;
  customerId: string;
  issueDate: Date;
  dueDate: Date;
  items: Omit<InvoiceItem, 'id'>[];
  taxRate?: number;
  notes?: string;
  termsConditions?: string;
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
  status?: InvoiceStatus;
}