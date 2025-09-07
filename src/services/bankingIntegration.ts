import { supabase } from '@/lib/supabase';
import { 
  BankIntegration, 
  PaymentTransaction, 
  PaymentMethodInfo,
  ETransferRequest,
  ETransferResponse,
  ACHPaymentRequest,
  ACHPaymentResponse,
  BankCode,
  Country,
  BANK_CAPABILITIES
} from '@/types/banking';

// Bank Integration Management
export async function getBankIntegrations(userId?: string) {
  const query = supabase
    .from('bank_integrations')
    .select('*')
    .eq('is_active', true)
    .order('is_default', { ascending: false });
  
  if (userId) {
    query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as BankIntegration[];
}

export async function createBankIntegration(integration: BankIntegration) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // Add capabilities based on bank code
  const capabilities = BANK_CAPABILITIES[integration.bank_code] || {};
  
  const { data, error } = await supabase
    .from('bank_integrations')
    .insert({
      ...integration,
      user_id: user.id,
      capabilities
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as BankIntegration;
}

export async function updateBankIntegration(id: string, updates: Partial<BankIntegration>) {
  const { data, error } = await supabase
    .from('bank_integrations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as BankIntegration;
}

export async function deleteBankIntegration(id: string) {
  const { error } = await supabase
    .from('bank_integrations')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Payment Transaction Management
export async function getPaymentTransactions(filters?: {
  status?: string;
  invoice_id?: string;
  purchase_order_id?: string;
  limit?: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  let query = supabase
    .from('payment_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.invoice_id) {
    query = query.eq('invoice_id', filters.invoice_id);
  }
  
  if (filters?.purchase_order_id) {
    query = query.eq('purchase_order_id', filters.purchase_order_id);
  }
  
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as PaymentTransaction[];
}

export async function createPaymentTransaction(transaction: PaymentTransaction) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('payment_transactions')
    .insert({
      ...transaction,
      user_id: user.id,
      status: 'pending',
      reference_number: generateReferenceNumber()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as PaymentTransaction;
}

export async function updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>) {
  const { data, error } = await supabase
    .from('payment_transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as PaymentTransaction;
}

// Payment Method Management
export async function getPaymentMethods(customerId?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  let query = supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false });
  
  if (customerId) {
    query = query.eq('customer_id', customerId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as PaymentMethodInfo[];
}

export async function createPaymentMethod(method: PaymentMethodInfo) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('payment_methods')
    .insert({
      ...method,
      user_id: user.id
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as PaymentMethodInfo;
}

export async function deletePaymentMethod(id: string) {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Canadian e-Transfer Processing
export async function sendETransfer(request: ETransferRequest): Promise<ETransferResponse> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // Create transaction record
  const transaction = await createPaymentTransaction({
    transaction_type: 'etransfer',
    direction: 'outbound',
    status: 'pending',
    amount: request.amount,
    currency: request.currency,
    recipient_name: request.recipient_name || '',
    recipient_email: request.recipient_email,
    description: request.message,
    invoice_id: request.invoice_id,
    project_id: request.project_id,
    contractor_id: request.contractor_id
  });
  
  // Call edge function to process e-Transfer
  const { data, error } = await supabase.functions.invoke('process-etransfer', {
    body: {
      ...request,
      transaction_id: transaction.id
    }
  });
  
  if (error) {
    await updatePaymentTransaction(transaction.id!, {
      status: 'failed',
      error_code: error.message,
      error_message: error.message
    });
    
    return {
      success: false,
      transaction_id: transaction.id!,
      reference_number: transaction.reference_number!,
      status: 'failed',
      estimated_delivery: '',
      fees: 0,
      bank_transaction_id: '',
      bank_reference: '',
      error_code: error.message,
      error_message: error.message,
      retryable: true
    };
  }
  
  // Update transaction with response
  await updatePaymentTransaction(transaction.id!, {
    status: data.status,
    bank_reference_id: data.bank_transaction_id,
    tracking_url: data.tracking_url,
    processing_fee: data.fees,
    estimated_delivery: data.estimated_delivery
  });
  
  return data as ETransferResponse;
}

// USA ACH Processing
export async function sendACHPayment(request: ACHPaymentRequest): Promise<ACHPaymentResponse> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // Create transaction record
  const transaction = await createPaymentTransaction({
    transaction_type: 'ach',
    direction: 'outbound',
    status: 'pending',
    amount: request.amount,
    currency: request.currency,
    recipient_name: request.recipient_name,
    recipient_account_info: {
      bank_name: request.recipient_bank_name,
      account_type: request.recipient_account_type,
      // Note: account & routing numbers should be encrypted
    },
    description: request.description,
    invoice_id: request.invoice_id,
    project_id: request.project_id,
    contractor_id: request.contractor_id
  });
  
  // Call edge function to process ACH
  const { data, error } = await supabase.functions.invoke('process-ach-payment', {
    body: {
      ...request,
      transaction_id: transaction.id
    }
  });
  
  if (error) {
    await updatePaymentTransaction(transaction.id!, {
      status: 'failed',
      error_code: error.message,
      error_message: error.message
    });
    
    return {
      success: false,
      transaction_id: transaction.id!,
      ach_trace_number: '',
      status: 'failed',
      effective_date: '',
      settlement_date: '',
      fees: 0,
      bank_transaction_id: '',
      bank_reference: '',
      error_code: error.message,
      error_message: error.message,
      retryable: true
    };
  }
  
  // Update transaction with response
  await updatePaymentTransaction(transaction.id!, {
    status: data.status,
    bank_reference_id: data.bank_transaction_id,
    tracking_url: data.tracking_url,
    processing_fee: data.fees,
    estimated_delivery: data.settlement_date
  });
  
  return data as ACHPaymentResponse;
}

// Cross-border payment routing
export async function routePayment(
  senderCountry: Country,
  recipientCountry: Country,
  amount: number,
  currency: 'CAD' | 'USD'
) {
  // Determine optimal payment method based on countries
  if (senderCountry === 'CA' && recipientCountry === 'CA') {
    return {
      preferred_method: 'etransfer',
      fallback_methods: ['wire', 'eft'],
      max_amount: 3000,
      processing_time: '30 minutes',
      requires_conversion: false
    };
  } else if (senderCountry === 'US' && recipientCountry === 'US') {
    return {
      preferred_method: 'ach',
      fallback_methods: ['zelle', 'wire'],
      max_amount: 25000,
      processing_time: '1-3 business days',
      requires_conversion: false
    };
  } else {
    // Cross-border
    return {
      preferred_method: 'wire',
      fallback_methods: ['correspondent_bank'],
      max_amount: 1000000,
      processing_time: '1-5 business days',
      requires_conversion: currency !== (recipientCountry === 'CA' ? 'CAD' : 'USD'),
      additional_fees: true
    };
  }
}

// Utility functions
function generateReferenceNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `FB-${timestamp}-${random}`.toUpperCase();
}

// Webhook processing
export async function processBankWebhook(
  bankCode: string,
  webhookId: string,
  eventType: string,
  payload: any
) {
  const { data, error } = await supabase
    .from('bank_webhooks')
    .insert({
      bank_code: bankCode,
      webhook_id: webhookId,
      event_type: eventType,
      payload,
      processed: false
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Process webhook based on event type
  if (eventType === 'payment.completed') {
    await updatePaymentTransaction(payload.transaction_id, {
      status: 'completed',
      actual_delivery: new Date().toISOString(),
      webhook_data: payload
    });
  } else if (eventType === 'payment.failed') {
    await updatePaymentTransaction(payload.transaction_id, {
      status: 'failed',
      error_code: payload.error_code,
      error_message: payload.error_message,
      webhook_data: payload
    });
  }
  
  // Mark webhook as processed
  await supabase
    .from('bank_webhooks')
    .update({ processed: true, processed_at: new Date().toISOString() })
    .eq('id', data.id);
  
  return data;
}

// Compliance logging
export async function logComplianceEvent(
  transactionId: string,
  complianceType: string,
  country: Country,
  action: string,
  details: any
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('compliance_logs')
    .insert({
      user_id: user.id,
      transaction_id: transactionId,
      compliance_type: complianceType,
      country,
      action,
      details
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}