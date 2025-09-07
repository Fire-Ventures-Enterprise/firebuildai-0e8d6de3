import { useState, useEffect } from 'react';
import { 
  Building2, 
  Link,
  Copy,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Send,
  FileText,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface PaymentLink {
  id: string;
  invoice_id?: string;
  purchase_order_id?: string;
  type: 'receivable' | 'payable';
  bank_name: string;
  amount: number;
  currency: string;
  link_url: string;
  status: 'pending' | 'completed' | 'expired';
  reference_number: string;
  recipient_name?: string;
  recipient_email?: string;
  notes?: string;
  created_at: string;
  expires_at?: string;
  completed_at?: string;
}

export function BankIntegrationSettings() {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [linkType, setLinkType] = useState<'receivable' | 'payable'>('receivable');
  const [formData, setFormData] = useState({
    bank_name: '',
    amount: '',
    currency: 'CAD',
    recipient_name: '',
    recipient_email: '',
    notes: '',
    link_url: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadPaymentLinks();
  }, []);

  const loadPaymentLinks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_links')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPaymentLinks(data || []);
    } catch (error) {
      console.error('Failed to load payment links:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment links',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async () => {
    if (!formData.bank_name || !formData.amount || !formData.link_url) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const referenceNumber = `${linkType === 'receivable' ? 'AR' : 'AP'}-${Date.now()}`;
      
      const { error } = await supabase
        .from('payment_links')
        .insert({
          user_id: user?.id,
          type: linkType,
          bank_name: formData.bank_name,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          link_url: formData.link_url,
          recipient_name: formData.recipient_name,
          recipient_email: formData.recipient_email,
          notes: formData.notes,
          reference_number: referenceNumber,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment link created successfully',
      });
      
      setShowCreateForm(false);
      setFormData({
        bank_name: '',
        amount: '',
        currency: 'CAD',
        recipient_name: '',
        recipient_email: '',
        notes: '',
        link_url: ''
      });
      loadPaymentLinks();
    } catch (error) {
      console.error('Failed to create payment link:', error);
      toast({
        title: 'Error',
        description: 'Failed to create payment link',
        variant: 'destructive'
      });
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: 'Copied',
      description: 'Payment link copied to clipboard',
    });
  };

  const handleMarkComplete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_links')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment marked as completed',
      });
      
      loadPaymentLinks();
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment status',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Links</h2>
          <p className="text-muted-foreground">
            Create and manage payment links for accounts receivable and payable
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Link className="h-4 w-4 mr-2" />
          Create Payment Link
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Payment Link</CardTitle>
            <CardDescription>
              Generate a payment link from your bank and track it here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Payment Type</Label>
                <Select
                  value={linkType}
                  onValueChange={(value: 'receivable' | 'payable') => setLinkType(value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receivable">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                        Accounts Receivable (Receiving Money)
                      </div>
                    </SelectItem>
                    <SelectItem value="payable">
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 mr-2 text-red-600" />
                        Accounts Payable (Sending Money)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank">Bank Name</Label>
                <Input
                  id="bank"
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  placeholder="e.g., TD Bank, RBC, Chase"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">
                  {linkType === 'receivable' ? 'Customer Name' : 'Vendor Name'}
                </Label>
                <Input
                  id="recipient"
                  value={formData.recipient_name}
                  onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                  placeholder="Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Payment Link URL</Label>
              <Input
                id="link"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="Paste the payment link from your bank here"
              />
              <p className="text-xs text-muted-foreground">
                Generate this link from your bank's online portal
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Invoice #, PO #, or other reference"
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setShowCreateForm(false);
                setFormData({
                  bank_name: '',
                  amount: '',
                  currency: 'CAD',
                  recipient_name: '',
                  recipient_email: '',
                  notes: '',
                  link_url: ''
                });
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreateLink}>
                Create Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Links</TabsTrigger>
          <TabsTrigger value="receivable">
            <TrendingUp className="h-4 w-4 mr-2" />
            Receivable
          </TabsTrigger>
          <TabsTrigger value="payable">
            <TrendingDown className="h-4 w-4 mr-2" />
            Payable
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {paymentLinks.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No payment links created yet. Create one to start tracking payments.
              </AlertDescription>
            </Alert>
          ) : (
            paymentLinks.map((link) => (
              <Card key={link.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">
                          {link.bank_name} - {link.reference_number}
                        </CardTitle>
                        <CardDescription>
                          {link.recipient_name || 'No recipient specified'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={link.type === 'receivable' ? 'default' : 'secondary'}>
                        {link.type === 'receivable' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {link.type === 'receivable' ? 'Receivable' : 'Payable'}
                      </Badge>
                      {link.status === 'completed' ? (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      ) : link.status === 'expired' ? (
                        <Badge variant="outline" className="text-red-600">
                          Expired
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium text-lg">
                        ${link.amount.toLocaleString()} {link.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">
                        {format(new Date(link.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    {link.completed_at && (
                      <div>
                        <p className="text-muted-foreground">Completed</p>
                        <p className="font-medium">
                          {format(new Date(link.completed_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {link.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="text-sm">{link.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(link.link_url)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(link.link_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Link
                      </Button>
                      {link.recipient_email && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const subject = `Payment Request - ${link.reference_number}`;
                            const body = `Please use the following link to complete your payment of $${link.amount} ${link.currency}:\n\n${link.link_url}`;
                            window.location.href = `mailto:${link.recipient_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                          }}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Email Link
                        </Button>
                      )}
                    </div>
                    {link.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkComplete(link.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="receivable" className="space-y-4">
          {paymentLinks.filter(l => l.type === 'receivable').map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {link.bank_name} - {link.reference_number}
                    </CardTitle>
                    <CardDescription>
                      {link.recipient_name || 'No customer specified'}
                    </CardDescription>
                  </div>
                  <Badge variant="default">
                    ${link.amount.toLocaleString()} {link.currency}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(link.link_url)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(link.link_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                  {link.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkComplete(link.id)}
                    >
                      Mark Received
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="payable" className="space-y-4">
          {paymentLinks.filter(l => l.type === 'payable').map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {link.bank_name} - {link.reference_number}
                    </CardTitle>
                    <CardDescription>
                      {link.recipient_name || 'No vendor specified'}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    ${link.amount.toLocaleString()} {link.currency}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(link.link_url)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(link.link_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                  {link.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkComplete(link.id)}
                    >
                      Mark Paid
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {paymentLinks.filter(l => l.status === 'completed').map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {link.bank_name} - {link.reference_number}
                    </CardTitle>
                    <CardDescription>
                      Completed on {link.completed_at && format(new Date(link.completed_at), 'MMM dd, yyyy')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={link.type === 'receivable' ? 'default' : 'secondary'}>
                      ${link.amount.toLocaleString()} {link.currency}
                    </Badge>
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}