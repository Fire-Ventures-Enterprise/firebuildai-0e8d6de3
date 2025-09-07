import { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Settings, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  BankIntegration,
  BankCode,
  Country,
  CANADIAN_BANKS,
  USA_BANKS,
  BANK_CAPABILITIES
} from '@/types/banking';
import {
  getBankIntegrations,
  createBankIntegration,
  updateBankIntegration,
  deleteBankIntegration
} from '@/services/bankingIntegration';

export function BankIntegrationSettings() {
  const [integrations, setIntegrations] = useState<BankIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>('CA');
  const [formData, setFormData] = useState<Partial<BankIntegration>>({
    country: 'CA',
    is_active: true,
    is_default: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const data = await getBankIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error('Failed to load bank integrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bank integrations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddIntegration = async () => {
    if (!formData.bank_code || !formData.account_name) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await createBankIntegration(formData as BankIntegration);
      toast({
        title: 'Success',
        description: 'Bank integration added successfully',
      });
      setShowAddForm(false);
      setFormData({ country: 'CA', is_active: true, is_default: false });
      loadIntegrations();
    } catch (error) {
      console.error('Failed to add bank integration:', error);
      toast({
        title: 'Error',
        description: 'Failed to add bank integration',
        variant: 'destructive'
      });
    }
  };

  const handleToggleDefault = async (id: string) => {
    try {
      // First, unset all defaults
      const updates = integrations.map(async (integration) => {
        if (integration.is_default && integration.id !== id) {
          await updateBankIntegration(integration.id!, { is_default: false });
        }
      });
      await Promise.all(updates);
      
      // Then set the new default
      await updateBankIntegration(id, { is_default: true });
      
      toast({
        title: 'Success',
        description: 'Default bank updated',
      });
      loadIntegrations();
    } catch (error) {
      console.error('Failed to update default bank:', error);
      toast({
        title: 'Error',
        description: 'Failed to update default bank',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBankIntegration(id);
      toast({
        title: 'Success',
        description: 'Bank integration removed',
      });
      loadIntegrations();
    } catch (error) {
      console.error('Failed to delete bank integration:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove bank integration',
        variant: 'destructive'
      });
    }
  };

  const getBankName = (code: BankCode, country: Country) => {
    if (country === 'CA') {
      return CANADIAN_BANKS[code as keyof typeof CANADIAN_BANKS]?.name || code;
    } else {
      return USA_BANKS[code as keyof typeof USA_BANKS]?.name || code;
    }
  };

  const getBanksByCountry = (country: Country) => {
    if (country === 'CA') {
      return Object.entries(CANADIAN_BANKS);
    } else {
      return Object.entries(USA_BANKS);
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
          <h2 className="text-2xl font-bold">Bank Integrations</h2>
          <p className="text-muted-foreground">
            Connect your Canadian and US bank accounts for seamless payments
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bank Account
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Bank Account</CardTitle>
            <CardDescription>
              Connect a new bank account for payment processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value: Country) => {
                    setFormData({ ...formData, country: value, bank_code: undefined });
                    setSelectedCountry(value);
                  }}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Canada
                      </div>
                    </SelectItem>
                    <SelectItem value="US">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        United States
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank">Bank</Label>
                <Select
                  value={formData.bank_code}
                  onValueChange={(value: BankCode) => 
                    setFormData({ ...formData, bank_code: value })
                  }
                >
                  <SelectTrigger id="bank">
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {getBanksByCountry(formData.country || 'CA').map(([code, info]) => (
                      <SelectItem key={code} value={code}>
                        {info.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account_name">Account Name</Label>
                <Input
                  id="account_name"
                  value={formData.account_name || ''}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  placeholder="e.g., Business Checking"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_type">Account Type</Label>
                <Select
                  value={formData.account_type}
                  onValueChange={(value: any) => 
                    setFormData({ ...formData, account_type: value })
                  }
                >
                  <SelectTrigger id="account_type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, is_default: checked })
                  }
                />
                <Label htmlFor="is_default">Set as default account</Label>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowAddForm(false);
                  setFormData({ country: 'CA', is_active: true, is_default: false });
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddIntegration}>
                  Add Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="canadian" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="canadian">
            <MapPin className="h-4 w-4 mr-2" />
            Canadian Banks
          </TabsTrigger>
          <TabsTrigger value="usa">
            <MapPin className="h-4 w-4 mr-2" />
            US Banks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="canadian" className="space-y-4">
          {integrations.filter(i => i.country === 'CA').length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No Canadian bank accounts connected. Add one to start processing e-Transfers.
              </AlertDescription>
            </Alert>
          ) : (
            integrations.filter(i => i.country === 'CA').map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">
                          {getBankName(integration.bank_code, integration.country)}
                        </CardTitle>
                        <CardDescription>{integration.account_name}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {integration.is_default && (
                        <Badge variant="default">Default</Badge>
                      )}
                      {integration.is_active ? (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Payment Methods</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {integration.capabilities?.payment_methods?.map(method => (
                          <Badge key={method} variant="secondary" className="text-xs">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Daily Limit</p>
                      <p className="font-medium">
                        ${integration.capabilities?.daily_limit?.toLocaleString()} CAD
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => !integration.is_default && handleToggleDefault(integration.id!)}
                      disabled={integration.is_default}
                    >
                      {integration.is_default ? 'Default Account' : 'Make Default'}
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(integration.id!)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="usa" className="space-y-4">
          {integrations.filter(i => i.country === 'US').length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No US bank accounts connected. Add one to start processing ACH payments.
              </AlertDescription>
            </Alert>
          ) : (
            integrations.filter(i => i.country === 'US').map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">
                          {getBankName(integration.bank_code, integration.country)}
                        </CardTitle>
                        <CardDescription>{integration.account_name}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {integration.is_default && (
                        <Badge variant="default">Default</Badge>
                      )}
                      {integration.is_active ? (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Payment Methods</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {integration.capabilities?.payment_methods?.map(method => (
                          <Badge key={method} variant="secondary" className="text-xs">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Daily Limit</p>
                      <p className="font-medium">
                        ${integration.capabilities?.daily_limit?.toLocaleString()} USD
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => !integration.is_default && handleToggleDefault(integration.id!)}
                      disabled={integration.is_default}
                    >
                      {integration.is_default ? 'Default Account' : 'Make Default'}
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(integration.id!)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}