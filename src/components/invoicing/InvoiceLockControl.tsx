import { useState, useEffect } from 'react';
import { Lock, Unlock, AlertTriangle, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface InvoiceLockControlProps {
  invoice: any;
  onUnlock: () => void;
  changeOrders?: any[];
}

export default function InvoiceLockControl({ invoice, onUnlock, changeOrders = [] }: InvoiceLockControlProps) {
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [overridePhrase, setOverridePhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const pendingChangeOrder = changeOrders.find(co => 
    co.invoice_id === invoice.id && 
    co.status === 'approved' && 
    !co.applied_at
  );

  // Fetch customer data on component mount
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (invoice.customer_id) {
        const { data } = await supabase
          .from('customers')
          .select('*')
          .eq('id', invoice.customer_id)
          .single();
        
        if (data) {
          setCustomerData(data);
        }
      }
    };
    fetchCustomerData();
  }, [invoice.customer_id]);

  const sendNotification = async (type: 'lock_override' | 'change_order' | 'auto_lock', details: any) => {
    try {
      const customerName = customerData ? 
        `${customerData.first_name || ''} ${customerData.last_name || customerData.company_name || 'Customer'}`.trim() : 
        'Customer';

      await supabase.functions.invoke('send-invoice-notification', {
        body: {
          type,
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoice_number,
          customerName,
          userEmail: user?.email || '',
          adminEmail: profile?.notify_on_invoice_override ? user?.email : undefined,
          details
        }
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleOverride = async () => {
    if (overridePhrase.toLowerCase() !== 'accept changes') {
      toast({
        title: "Invalid Override",
        description: "Please type 'accept changes' to override the lock",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Call the database function to check override
      const { data, error } = await supabase.rpc('can_edit_invoice', {
        invoice_id_param: invoice.id,
        override_phrase: overridePhrase
      });

      if (error) throw error;

      if (data) {
        // Temporarily unlock the invoice
        await supabase
          .from('invoices')
          .update({ 
            is_locked: false,
            last_override_at: new Date().toISOString()
          })
          .eq('id', invoice.id);

        // Send notification about the override
        await sendNotification('lock_override', {
          overrideBy: user?.email,
          timestamp: new Date().toISOString(),
          reason: 'Emergency override used'
        });

        toast({
          title: "Invoice Unlocked",
          description: "You can now edit the invoice. Remember to document changes properly.",
        });

        // Set timeout to re-lock after 1 hour
        setTimeout(async () => {
          try {
            await supabase
              .from('invoices')
              .update({ 
                is_locked: true,
                lock_reason: 'Auto-locked after override period'
              })
              .eq('id', invoice.id);
            
            // Send auto-lock notification
            await sendNotification('auto_lock', {
              timestamp: new Date().toISOString()
            });
          } catch (error) {
            console.error('Failed to auto-lock invoice:', error);
          }
        }, 3600000); // 1 hour

        setShowOverrideDialog(false);
        setOverridePhrase('');
        onUnlock();
      }
    } catch (error) {
      console.error('Error overriding lock:', error);
      toast({
        title: "Error",
        description: "Failed to override invoice lock",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyChangeOrder = async () => {
    if (!pendingChangeOrder) return;

    setLoading(true);
    try {
      // Apply the change order
      await supabase
        .from('change_orders')
        .update({ 
          status: 'applied',
          applied_at: new Date().toISOString()
        })
        .eq('id', pendingChangeOrder.id);

      // Unlock invoice for changes
      await supabase
        .from('invoices')
        .update({ 
          is_locked: false,
          lock_reason: 'Change order approved'
        })
        .eq('id', invoice.id);

      // Log the change
      await supabase
        .from('invoice_change_log')
        .insert({
          invoice_id: invoice.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          change_type: 'change_order_applied',
          description: `Change Order #${pendingChangeOrder.order_number} applied`,
          change_order_id: pendingChangeOrder.id
        });

      toast({
        title: "Change Order Applied",
        description: "Invoice is now unlocked for authorized changes",
      });

      onUnlock();
    } catch (error) {
      console.error('Error applying change order:', error);
      toast({
        title: "Error",
        description: "Failed to apply change order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!invoice.is_locked) {
    return (
      <Alert className="border-green-500">
        <Unlock className="h-4 w-4" />
        <AlertTitle>Invoice Unlocked</AlertTitle>
        <AlertDescription>
          This invoice can be edited. Remember to lock it after changes are complete.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card className="border-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-600" />
            Invoice Protection Active
          </CardTitle>
          <CardDescription>
            This invoice is locked to prevent unauthorized changes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Why is this locked?</AlertTitle>
            <AlertDescription>
              Invoices are automatically locked to ensure all changes go through proper change orders. 
              This protects you from scope creep and ensures you get paid for additional work.
            </AlertDescription>
          </Alert>

          {invoice.last_override_at && (
            <div className="text-sm text-muted-foreground">
              Last overridden: {new Date(invoice.last_override_at).toLocaleString()}
              {invoice.last_override_by && ` by ${invoice.last_override_by}`}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {pendingChangeOrder ? (
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Approved Change Order Available
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Order #{pendingChangeOrder.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      Amount: {formatCurrency(pendingChangeOrder.total)}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={applyChangeOrder}
                    disabled={loading}
                  >
                    <FileEdit className="h-4 w-4 mr-2" />
                    Apply Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  To modify this invoice, you can:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Create and get approval for a change order</li>
                  <li>• Use the emergency override (tracked for accountability)</li>
                </ul>
              </div>
            )}

            <Button 
              variant="outline" 
              className="border-amber-500 hover:bg-amber-50"
              onClick={() => setShowOverrideDialog(true)}
            >
              Emergency Override
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Override Invoice Lock</DialogTitle>
            <DialogDescription>
              This action will be logged and tracked. Use only when necessary.
            </DialogDescription>
          </DialogHeader>
          
          <Alert className="border-amber-500">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Overriding the lock bypasses important protections. All changes will be tracked
              in the audit log. Consider creating a change order instead.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="override">Type "accept changes" to continue</Label>
              <Input
                id="override"
                value={overridePhrase}
                onChange={(e) => setOverridePhrase(e.target.value)}
                placeholder="Type the override phrase"
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowOverrideDialog(false);
                setOverridePhrase('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleOverride}
              disabled={loading || overridePhrase.toLowerCase() !== 'accept changes'}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Override Lock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}