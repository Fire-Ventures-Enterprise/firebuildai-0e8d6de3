export enum EstimateStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED'
}

export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  status: EstimateStatus;
  issueDate: Date;
  expirationDate: Date;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  termsConditions?: string;
  customerId: string;
  customer?: Customer;
  companyId: string;
  company?: Company;
  items: EstimateItem[];
  createdAt: Date;
  updatedAt: Date;
  lastSync?: Date;
  convertedToJob: boolean;
  jobId?: string;
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

export interface CreateEstimateRequest {
  estimateNumber?: string;
  customerId: string;
  issueDate: Date;
  expirationDate: Date;
  items: Omit<EstimateItem, 'id'>[];
  taxRate?: number;
  notes?: string;
  termsConditions?: string;
}

export interface UpdateEstimateRequest extends Partial<CreateEstimateRequest> {
  status?: EstimateStatus;
}

export interface EstimateTemplate {
  id: string;
  name: string;
  description?: string;
  items: Omit<EstimateItem, 'id'>[];
  notes?: string;
  termsConditions?: string;
  createdAt: Date;
  updatedAt: Date;
}