// Canadian & USA Bank Integration Types

export type Country = 'CA' | 'US';
export type Currency = 'CAD' | 'USD';

// Canadian Banks
export type CanadianBank = 'RBC' | 'TD' | 'BMO' | 'SCOTIABANK' | 'CIBC' | 'NATIONAL_BANK' | 'DESJARDINS';

// USA Banks  
export type USABank = 'CHASE' | 'BANK_OF_AMERICA' | 'WELLS_FARGO' | 'CITI' | 'US_BANK' | 'PNC' | 'CAPITAL_ONE' | 'TRUIST';

export type BankCode = CanadianBank | USABank;

// Payment Methods
export type PaymentMethod = 'etransfer' | 'ach' | 'wire' | 'zelle' | 'eft';

export interface BankIntegration {
  id?: string;
  user_id?: string;
  bank_code: BankCode;
  country: Country;
  account_name: string;
  account_type?: 'checking' | 'savings' | 'business';
  is_active: boolean;
  is_default: boolean;
  configuration?: Record<string, any>;
  capabilities?: BankCapabilities;
  created_at?: string;
  updated_at?: string;
}

export interface BankCapabilities {
  payment_methods: PaymentMethod[];
  max_transaction_amount: number;
  daily_limit: number;
  processing_times: Partial<Record<PaymentMethod, string>>;
  fees: Partial<Record<PaymentMethod, number>>;
  supports_bulk: boolean;
  supports_recurring: boolean;
  supports_international: boolean;
}

export interface PaymentTransaction {
  id?: string;
  user_id?: string;
  bank_integration_id?: string;
  transaction_type: PaymentMethod;
  direction: 'outbound' | 'inbound';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: Currency;
  
  // Sender & Recipient
  sender_name?: string;
  sender_email?: string;
  sender_account_info?: Record<string, any>;
  recipient_name: string;
  recipient_email?: string;
  recipient_account_info?: Record<string, any>;
  
  // Transaction Details
  description?: string;
  reference_number?: string;
  bank_reference_id?: string;
  tracking_url?: string;
  
  // FireBuildAI Context
  invoice_id?: string;
  purchase_order_id?: string;
  contractor_id?: string;
  project_id?: string;
  
  // Processing
  processing_fee?: number;
  exchange_rate?: number;
  estimated_delivery?: string;
  actual_delivery?: string;
  
  // Error Handling
  error_code?: string;
  error_message?: string;
  retry_count?: number;
  retryable?: boolean;
  
  // Metadata
  metadata?: Record<string, any>;
  webhook_data?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethodInfo {
  id?: string;
  user_id?: string;
  customer_id?: string;
  method_type: 'bank_account' | 'etransfer' | 'zelle';
  country: Country;
  is_default: boolean;
  is_verified: boolean;
  details: Record<string, any>;
  verification_status?: 'pending' | 'verified' | 'failed';
  verified_at?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// e-Transfer specific types
export interface ETransferRequest {
  recipient_email: string;
  recipient_name?: string;
  amount: number;
  currency: 'CAD';
  message: string;
  security_question?: string;
  security_answer?: string;
  auto_deposit?: boolean;
  sender_bank_code: CanadianBank;
  sender_account_id: string;
  callback_url?: string;
  reference_number?: string;
  
  // FireBuildAI Context
  project_id?: string;
  contractor_id?: string;
  invoice_id?: string;
  po_number?: string;
}

export interface ETransferResponse {
  success: boolean;
  transaction_id: string;
  reference_number: string;
  status: 'sent' | 'pending' | 'failed';
  estimated_delivery: string;
  fees: number;
  exchange_rate?: number;
  bank_transaction_id: string;
  bank_reference: string;
  tracking_url?: string;
  status_check_url?: string;
  error_code?: string;
  error_message?: string;
  retryable?: boolean;
}

// ACH specific types
export interface ACHPaymentRequest {
  recipient_name: string;
  recipient_bank_name: string;
  recipient_account_number: string; // Encrypted
  recipient_routing_number: string;
  recipient_account_type: 'checking' | 'savings';
  amount: number;
  currency: 'USD';
  description: string;
  processing_type: 'standard' | 'same_day' | 'next_day';
  effective_date?: string;
  sender_bank_code: USABank;
  sender_account_id: string;
  sec_code: 'PPD' | 'CCD' | 'WEB' | 'TEL';
  company_id: string;
  company_name: string;
  callback_url?: string;
  reference_number?: string;
  
  // FireBuildAI Context
  project_id?: string;
  contractor_id?: string;
  invoice_id?: string;
  po_number?: string;
}

export interface ACHPaymentResponse {
  success: boolean;
  transaction_id: string;
  ach_trace_number: string;
  status: 'submitted' | 'processing' | 'settled' | 'returned' | 'failed';
  effective_date: string;
  settlement_date: string;
  fees: number;
  bank_transaction_id: string;
  bank_reference: string;
  tracking_number?: string;
  status_check_url?: string;
  error_code?: string;
  error_message?: string;
  return_code?: string;
  return_reason?: string;
  retryable?: boolean;
}

// Bank Information
export const CANADIAN_BANKS: Record<CanadianBank, { name: string; logo?: string }> = {
  RBC: { name: 'Royal Bank of Canada' },
  TD: { name: 'TD Canada Trust' },
  BMO: { name: 'Bank of Montreal' },
  SCOTIABANK: { name: 'Scotiabank' },
  CIBC: { name: 'CIBC' },
  NATIONAL_BANK: { name: 'National Bank' },
  DESJARDINS: { name: 'Desjardins' }
};

export const USA_BANKS: Record<USABank, { name: string; logo?: string }> = {
  CHASE: { name: 'Chase Bank' },
  BANK_OF_AMERICA: { name: 'Bank of America' },
  WELLS_FARGO: { name: 'Wells Fargo' },
  CITI: { name: 'Citibank' },
  US_BANK: { name: 'U.S. Bank' },
  PNC: { name: 'PNC Bank' },
  CAPITAL_ONE: { name: 'Capital One' },
  TRUIST: { name: 'Truist' }
};

// Bank capabilities configuration
export const BANK_CAPABILITIES: Record<BankCode, Partial<BankCapabilities>> = {
  // Canadian Banks
  RBC: {
    payment_methods: ['etransfer', 'wire', 'eft'],
    max_transaction_amount: 3000,
    daily_limit: 10000,
    processing_times: {
      etransfer: '30 minutes',
      wire: 'Same day',
      eft: '1-3 business days'
    },
    fees: {
      etransfer: 1.50,
      wire: 30.00,
      eft: 0
    }
  },
  TD: {
    payment_methods: ['etransfer', 'wire', 'eft'],
    max_transaction_amount: 3000,
    daily_limit: 10000,
    processing_times: {
      etransfer: '30 minutes',
      wire: 'Same day',
      eft: '1-3 business days'
    },
    fees: {
      etransfer: 1.50,
      wire: 30.00,
      eft: 0
    }
  },
  BMO: {
    payment_methods: ['etransfer', 'wire', 'eft'],
    max_transaction_amount: 3000,
    daily_limit: 10000,
    processing_times: {
      etransfer: '30 minutes',
      wire: 'Same day',
      eft: '1-3 business days'
    },
    fees: {
      etransfer: 1.50,
      wire: 30.00,
      eft: 0
    }
  },
  SCOTIABANK: {
    payment_methods: ['etransfer', 'wire', 'eft'],
    max_transaction_amount: 3000,
    daily_limit: 10000,
    processing_times: {
      etransfer: '30 minutes',
      wire: 'Same day',
      eft: '1-3 business days'
    },
    fees: {
      etransfer: 1.50,
      wire: 30.00,
      eft: 0
    }
  },
  CIBC: {
    payment_methods: ['etransfer', 'wire', 'eft'],
    max_transaction_amount: 3000,
    daily_limit: 10000,
    processing_times: {
      etransfer: '30 minutes',
      wire: 'Same day',
      eft: '1-3 business days'
    },
    fees: {
      etransfer: 1.50,
      wire: 30.00,
      eft: 0
    }
  },
  NATIONAL_BANK: {
    payment_methods: ['etransfer', 'wire', 'eft'],
    max_transaction_amount: 3000,
    daily_limit: 10000,
    processing_times: {
      etransfer: '30 minutes',
      wire: 'Same day',
      eft: '1-3 business days'
    },
    fees: {
      etransfer: 1.50,
      wire: 30.00,
      eft: 0
    }
  },
  DESJARDINS: {
    payment_methods: ['etransfer', 'wire', 'eft'],
    max_transaction_amount: 3000,
    daily_limit: 10000,
    processing_times: {
      etransfer: '30 minutes',
      wire: 'Same day',
      eft: '1-3 business days'
    },
    fees: {
      etransfer: 1.50,
      wire: 30.00,
      eft: 0
    }
  },
  // USA Banks  
  CHASE: {
    payment_methods: ['ach', 'wire', 'zelle'],
    max_transaction_amount: 25000,
    daily_limit: 100000,
    processing_times: {
      ach: '1-3 business days',
      wire: 'Same day',
      zelle: 'Minutes'
    },
    fees: {
      ach: 0.25,
      wire: 25.00,
      zelle: 0
    }
  },
  BANK_OF_AMERICA: {
    payment_methods: ['ach', 'wire', 'zelle'],
    max_transaction_amount: 1000000,
    daily_limit: 1000000,
    processing_times: {
      ach: '1-3 business days',
      wire: 'Same day',
      zelle: 'Minutes'
    },
    fees: {
      ach: 0.30,
      wire: 25.00,
      zelle: 0
    }
  },
  WELLS_FARGO: {
    payment_methods: ['ach', 'wire', 'zelle'],
    max_transaction_amount: 50000,
    daily_limit: 150000,
    processing_times: {
      ach: '1-3 business days',
      wire: 'Same day',
      zelle: 'Minutes'
    },
    fees: {
      ach: 0.25,
      wire: 25.00,
      zelle: 0
    }
  },
  CITI: {
    payment_methods: ['ach', 'wire', 'zelle'],
    max_transaction_amount: 100000,
    daily_limit: 500000,
    processing_times: {
      ach: '1-3 business days',
      wire: 'Same day',
      zelle: 'Minutes'
    },
    fees: {
      ach: 0.30,
      wire: 30.00,
      zelle: 0
    }
  },
  US_BANK: {
    payment_methods: ['ach', 'wire', 'zelle'],
    max_transaction_amount: 50000,
    daily_limit: 100000,
    processing_times: {
      ach: '1-3 business days',
      wire: 'Same day',
      zelle: 'Minutes'
    },
    fees: {
      ach: 0.25,
      wire: 25.00,
      zelle: 0
    }
  },
  PNC: {
    payment_methods: ['ach', 'wire', 'zelle'],
    max_transaction_amount: 50000,
    daily_limit: 100000,
    processing_times: {
      ach: '1-3 business days',
      wire: 'Same day',
      zelle: 'Minutes'
    },
    fees: {
      ach: 0.25,
      wire: 25.00,
      zelle: 0
    }
  },
  CAPITAL_ONE: {
    payment_methods: ['ach', 'wire', 'zelle'],
    max_transaction_amount: 50000,
    daily_limit: 100000,
    processing_times: {
      ach: '1-3 business days',
      wire: 'Same day',
      zelle: 'Minutes'
    },
    fees: {
      ach: 0.25,
      wire: 20.00,
      zelle: 0
    }
  },
  TRUIST: {
    payment_methods: ['ach', 'wire', 'zelle'],
    max_transaction_amount: 50000,
    daily_limit: 100000,
    processing_times: {
      ach: '1-3 business days',
      wire: 'Same day',
      zelle: 'Minutes'
    },
    fees: {
      ach: 0.25,
      wire: 25.00,
      zelle: 0
    }
  }
} as const;