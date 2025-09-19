import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { notify } from '@/lib/notify';
import { supabase } from '@/integrations/supabase/client';
import PaymentStagesForm from './PaymentStagesForm';
import SignaturePad from './SignaturePad';
import { EnhancedProposalPreview } from '@/components/sales/EnhancedProposalPreview';
import { FileText, DollarSign, PenTool, Send, CreditCard, CheckCircle2, Copy, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { generateContractText, STANDARD_EXCLUSIONS, PAYMENT_SCHEDULE_TEMPLATES } from '@/templates/construction-contract';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51234567890'); // TODO: Use actual publishable key

interface ProposalConversionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate: any;
  onSuccess?: () => void;
}

function DepositPaymentForm({ estimate, onSuccess }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/estimates/${estimate.id}?payment=success`,
        },
        redirect: "if_required"
      });

      if (error) {
        notify.error(error.message || "Payment failed");
      } else {
        notify.success("Deposit payment successful!");
        onSuccess?.();
      }
    } catch (error) {
      notify.error("Payment error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? "Processing..." : `Pay Deposit $${(estimate.deposit_amount || 0).toFixed(2)}`}
      </Button>
    </form>
  );
}

export function ProposalConversionDialog({ open, onOpenChange, estimate, onSuccess }: ProposalConversionDialogProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [proposalData, setProposalData] = useState({
    includeSignature: true,
    requireDeposit: true,
    depositAmount: estimate?.deposit_amount || 0,
    depositPercentage: estimate?.deposit_percentage || 30,
    paymentStages: [],
    termsConditions: estimate?.terms_conditions || '',
    notes: estimate?.notes || '',
    contractText: estimate?.contract_text || ''
  });
  const [signature, setSignature] = useState('');
  const [clientSecret, setClientSecret] = useState<string>();
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStep, setConversionStep] = useState<'setup' | 'preview' | 'signature' | 'payment' | 'complete'>('setup');
  const [useStandardContract, setUseStandardContract] = useState(true);
  const [selectedPaymentTemplate, setSelectedPaymentTemplate] = useState<keyof typeof PAYMENT_SCHEDULE_TEMPLATES>('standard');
  const [estimateItems, setEstimateItems] = useState<any[]>([]);

  // Fetch estimate items on mount
  useEffect(() => {
    if (estimate?.id) {
      fetchEstimateItems();
    }
  }, [estimate?.id]);

  const fetchEstimateItems = async () => {
    if (!estimate?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('estimate_items')
        .select('*')
        .eq('estimate_id', estimate.id)
        .order('item_order', { ascending: true });

      if (error) throw error;
      setEstimateItems(data || []);
    } catch (error) {
      console.error('Failed to fetch estimate items:', error);
    }
  };

  // Calculate deposit amount based on percentage
  useEffect(() => {
    if (proposalData.requireDeposit && estimate?.total) {
      const depositAmount = (estimate.total * proposalData.depositPercentage) / 100;
      setProposalData(prev => ({ ...prev, depositAmount }));
    }
  }, [proposalData.depositPercentage, proposalData.requireDeposit, estimate?.total]);

  // Initialize payment intent when moving to payment step
  useEffect(() => {
    if (conversionStep === 'payment' && proposalData.requireDeposit && !clientSecret) {
      initializePayment();
    }
  }, [conversionStep]);

  const initializePayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('process-deposit', {
        body: { 
          estimate_id: estimate.id,
          amount: Math.round(proposalData.depositAmount * 100) // Convert to cents
        }
      });
      
      if (error) throw error;
      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      notify.error('Failed to initialize payment', error);
    }
  };

  const handleConvertToProposal = async () => {
    setIsConverting(true);
    try {
      // Update estimate to proposal status with payment stages
      const { error } = await supabase
        .from('estimates')
        .update({
          is_proposal: true,
          proposal_sent_at: new Date().toISOString(),
          payment_stages: proposalData.paymentStages,
          deposit_amount: proposalData.requireDeposit ? proposalData.depositAmount : 0,
          deposit_percentage: proposalData.requireDeposit ? proposalData.depositPercentage : 0,
          signature_required: proposalData.includeSignature,
          terms_conditions: proposalData.termsConditions,
          notes: proposalData.notes,
          contract_text: proposalData.contractText,
          status: 'sent'
        })
        .eq('id', estimate.id);

      if (error) throw error;

      // Move to signature step if required
      if (proposalData.includeSignature) {
        setConversionStep('signature');
      } else if (proposalData.requireDeposit) {
        setConversionStep('payment');
      } else {
        await convertToInvoice();
      }
    } catch (error) {
      notify.error('Failed to convert to proposal', error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleSignature = async () => {
    if (!signature) {
      notify.error('Please provide a signature');
      return;
    }

    try {
      // Save signature
      const { error } = await supabase
        .from('estimates')
        .update({
          signature_data: signature,
          signed_at: new Date().toISOString(),
          signed_by_name: estimate.customer_name,
          status: 'accepted'
        })
        .eq('id', estimate.id);

      if (error) throw error;

      // Move to payment step if deposit required
      if (proposalData.requireDeposit) {
        setConversionStep('payment');
      } else {
        await convertToInvoice();
      }
    } catch (error) {
      notify.error('Failed to save signature', error);
    }
  };

  const handleDepositPaymentSuccess = async () => {
    try {
      // Mark deposit as paid
      const { error } = await supabase
        .from('estimates')
        .update({
          deposit_paid: true,
          deposit_paid_at: new Date().toISOString()
        })
        .eq('id', estimate.id);

      if (error) throw error;

      await convertToInvoice();
    } catch (error) {
      notify.error('Failed to update deposit status', error);
    }
  };

  const convertToInvoice = async () => {
    try {
      // Call the conversion function
      const { data, error } = await supabase
        .rpc('convert_estimate_to_invoice', {
          p_estimate_id: estimate.id
        });

      if (error) throw error;

      setConversionStep('complete');
      notify.success('Successfully converted to invoice!');
      
      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      notify.error('Failed to convert to invoice', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Convert Estimate to Proposal</DialogTitle>
        </DialogHeader>

        {conversionStep === 'preview' && (
          <div className="flex-1 overflow-y-auto p-4">
            <EnhancedProposalPreview
              estimate={estimate}
              items={estimateItems}
              paymentStages={proposalData.paymentStages}
              contractText={proposalData.contractText}
              onEdit={() => setConversionStep('setup')}
            />
          </div>
        )}

        {conversionStep === 'setup' && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="payment">
                <DollarSign className="h-4 w-4 mr-2" />
                Payment
              </TabsTrigger>
              <TabsTrigger value="contract">
                <PenTool className="h-4 w-4 mr-2" />
                Contract
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-1">
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Proposal Details</CardTitle>
                    <CardDescription>
                      Configure how the proposal will be presented to the client
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signature">Require Signature</Label>
                      <Switch
                        id="signature"
                        checked={proposalData.includeSignature}
                        onCheckedChange={(checked) => 
                          setProposalData(prev => ({ ...prev, includeSignature: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="deposit">Require Deposit</Label>
                      <Switch
                        id="deposit"
                        checked={proposalData.requireDeposit}
                        onCheckedChange={(checked) => 
                          setProposalData(prev => ({ ...prev, requireDeposit: checked }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes for Client</Label>
                      <Textarea
                        id="notes"
                        value={proposalData.notes}
                        onChange={(e) => 
                          setProposalData(prev => ({ ...prev, notes: e.target.value }))
                        }
                        placeholder="Any additional notes for the client..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4">
                {proposalData.requireDeposit && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Deposit Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="depositPercentage">Deposit Percentage</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="depositPercentage"
                              type="number"
                              min="0"
                              max="100"
                              value={proposalData.depositPercentage}
                              onChange={(e) => 
                                setProposalData(prev => ({ 
                                  ...prev, 
                                  depositPercentage: parseFloat(e.target.value) || 0 
                                }))
                              }
                            />
                            <span>%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Deposit Amount</Label>
                          <div className="text-2xl font-bold">
                            ${proposalData.depositAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <PaymentStagesForm
                  stages={proposalData.paymentStages}
                  onChange={(stages) => 
                    setProposalData(prev => ({ ...prev, paymentStages: stages }))
                  }
                  totalAmount={estimate?.total || 0}
                />
              </TabsContent>

              <TabsContent value="contract" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract & Terms</CardTitle>
                    <CardDescription>
                      Configure the contract agreement for this proposal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="useStandard">Use Standard Contract Template</Label>
                      <Switch
                        id="useStandard"
                        checked={useStandardContract}
                        onCheckedChange={(checked) => {
                          setUseStandardContract(checked);
                          if (checked) {
                            // Generate contract from template
                            const contractData = {
                              companyName: 'Your Company Name', // TODO: Get from company settings
                              clientName: estimate?.customer_name || '',
                              projectAddress: estimate?.service_address || '',
                              contractPrice: estimate?.total || 0,
                              depositAmount: proposalData.depositAmount,
                              scopeOfWork: estimate?.scope_of_work || '',
                              startDate: new Date().toLocaleDateString(),
                              completionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                            };
                            const contractText = generateContractText(contractData);
                            setProposalData(prev => ({ ...prev, contractText }));
                          }
                        }}
                      />
                    </div>

                    {useStandardContract && (
                      <div className="space-y-2">
                        <Label>Payment Schedule Template</Label>
                        <Select
                          value={selectedPaymentTemplate}
                          onValueChange={(value: keyof typeof PAYMENT_SCHEDULE_TEMPLATES) => {
                            setSelectedPaymentTemplate(value);
                            const template = PAYMENT_SCHEDULE_TEMPLATES[value];
                            const stages = template.stages.map(stage => ({
                              description: stage.description,
                              percentage: stage.percentage,
                              amount: (estimate?.total || 0) * (stage.percentage / 100),
                              milestone: stage.description
                            }));
                            setProposalData(prev => ({ ...prev, paymentStages: stages }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(PAYMENT_SCHEDULE_TEMPLATES).map(([key, template]) => (
                              <SelectItem key={key} value={key}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="contractText">Contract Text</Label>
                        {useStandardContract && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(proposalData.contractText);
                              notify.success('Contract copied to clipboard');
                            }}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        )}
                      </div>
                      <Textarea
                        id="contractText"
                        value={proposalData.contractText}
                        onChange={(e) => 
                          setProposalData(prev => ({ ...prev, contractText: e.target.value }))
                        }
                        placeholder="Enter contract details..."
                        rows={12}
                        className="font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Standard Exclusions</Label>
                      <div className="bg-muted p-3 rounded-lg">
                        <ul className="text-sm space-y-1">
                          {STANDARD_EXCLUSIONS.slice(0, 5).map((exclusion, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-muted-foreground mr-2">•</span>
                              <span>{exclusion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="terms">Additional Terms & Conditions</Label>
                      <Textarea
                        id="terms"
                        value={proposalData.termsConditions}
                        onChange={(e) => 
                          setProposalData(prev => ({ ...prev, termsConditions: e.target.value }))
                        }
                        placeholder="Enter terms and conditions..."
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        )}

        {conversionStep === 'signature' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Signature Required</CardTitle>
                <CardDescription>
                  Please sign below to accept the proposal terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignaturePad
                  onSave={setSignature}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {conversionStep === 'payment' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Payment</CardTitle>
                <CardDescription>
                  A deposit of ${proposalData.depositAmount.toFixed(2)} is required to proceed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <DepositPaymentForm 
                      estimate={estimate}
                      onSuccess={handleDepositPaymentSuccess}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    Initializing payment...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {conversionStep === 'complete' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
            <h3 className="text-2xl font-semibold">Conversion Complete!</h3>
            <p className="text-muted-foreground text-center">
              The proposal has been accepted and converted to an invoice.
            </p>
          </div>
        )}

        <DialogFooter>
          {conversionStep === 'setup' && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => setConversionStep('preview')}>
                <Eye className="h-4 w-4 mr-2" />
                Preview Proposal
              </Button>
            </>
          )}

          {conversionStep === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setConversionStep('setup')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Edit
              </Button>
              <Button onClick={handleConvertToProposal} disabled={isConverting}>
                <ArrowRight className="h-4 w-4 mr-2" />
                {isConverting ? 'Processing...' : 'Send for Approval'}
              </Button>
            </>
          )}

          {conversionStep === 'signature' && (
            <>
              <Button variant="outline" onClick={() => setConversionStep('preview')}>
                Back
              </Button>
              <Button onClick={handleSignature} disabled={!signature}>
                <PenTool className="h-4 w-4 mr-2" />
                Confirm Signature
              </Button>
            </>
          )}

          {conversionStep === 'payment' && !proposalData.requireDeposit && (
            <Button onClick={convertToInvoice}>
              <CreditCard className="h-4 w-4 mr-2" />
              Skip Payment & Convert
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}