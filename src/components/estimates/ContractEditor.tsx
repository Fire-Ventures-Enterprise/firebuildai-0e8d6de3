import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  generateContractText, 
  ContractData, 
  CONTRACT_SECTIONS, 
  STANDARD_EXCLUSIONS,
  PAYMENT_SCHEDULE_TEMPLATES 
} from '@/templates/construction-contract';
import { FileText, Download, Copy, Check, Edit3 } from 'lucide-react';
import { notify } from '@/lib/notify';

interface ContractEditorProps {
  estimate?: any;
  onSave?: (contractText: string) => void;
  defaultContractText?: string;
}

export function ContractEditor({ estimate, onSave, defaultContractText }: ContractEditorProps) {
  const [contractData, setContractData] = useState<Partial<ContractData>>({
    clientName: estimate?.customer_name || '',
    clientAddress: estimate?.customer_address || '',
    clientPhone: estimate?.customer_phone || '',
    clientEmail: estimate?.customer_email || '',
    projectAddress: estimate?.service_address || '',
    contractPrice: estimate?.total || 0,
    depositAmount: estimate?.deposit_amount || 0,
    scopeOfWork: estimate?.scope_of_work || '',
    startDate: new Date().toLocaleDateString(),
    completionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
  });

  const [contractText, setContractText] = useState(defaultContractText || '');
  const [editMode, setEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedExclusions, setSelectedExclusions] = useState<string[]>([]);

  useEffect(() => {
    if (!editMode && !defaultContractText) {
      const exclusions = selectedExclusions.length > 0 
        ? selectedExclusions.join('\n- ') 
        : STANDARD_EXCLUSIONS.slice(0, 5).join('\n- ');
      
      const updatedData = { ...contractData, exclusions };
      const generatedText = generateContractText(updatedData);
      setContractText(generatedText);
    }
  }, [contractData, selectedExclusions, editMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractText);
    setCopied(true);
    notify.success('Contract copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([contractText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract-${estimate?.estimate_number || 'draft'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify.success('Contract downloaded');
  };

  const toggleExclusion = (exclusion: string) => {
    setSelectedExclusions(prev => 
      prev.includes(exclusion) 
        ? prev.filter(e => e !== exclusion)
        : [...prev, exclusion]
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Contract Agreement</CardTitle>
            <CardDescription>
              Construction contract for {estimate?.customer_name || 'Client'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              <Edit3 className="h-4 w-4 mr-1" />
              {editMode ? 'Preview' : 'Edit'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details" className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Contract Details</TabsTrigger>
            <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={contractData.companyName || ''}
                  onChange={(e) => setContractData(prev => ({ 
                    ...prev, 
                    companyName: e.target.value 
                  }))}
                  placeholder="Your Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyLicense">License Number</Label>
                <Input
                  id="companyLicense"
                  value={contractData.companyLicense || ''}
                  onChange={(e) => setContractData(prev => ({ 
                    ...prev, 
                    companyLicense: e.target.value 
                  }))}
                  placeholder="License #"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={contractData.startDate || ''}
                  onChange={(e) => setContractData(prev => ({ 
                    ...prev, 
                    startDate: e.target.value 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionDate">Completion Date</Label>
                <Input
                  id="completionDate"
                  type="date"
                  value={contractData.completionDate || ''}
                  onChange={(e) => setContractData(prev => ({ 
                    ...prev, 
                    completionDate: e.target.value 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractPrice">Contract Price</Label>
                <Input
                  id="contractPrice"
                  type="number"
                  value={contractData.contractPrice || 0}
                  onChange={(e) => setContractData(prev => ({ 
                    ...prev, 
                    contractPrice: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="depositAmount">Deposit Amount</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  value={contractData.depositAmount || 0}
                  onChange={(e) => setContractData(prev => ({ 
                    ...prev, 
                    depositAmount: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scopeOfWork">Scope of Work</Label>
              <Textarea
                id="scopeOfWork"
                value={contractData.scopeOfWork || ''}
                onChange={(e) => setContractData(prev => ({ 
                  ...prev, 
                  scopeOfWork: e.target.value 
                }))}
                placeholder="Detailed description of work to be performed..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Textarea
                id="paymentTerms"
                value={contractData.paymentTerms || ''}
                onChange={(e) => setContractData(prev => ({ 
                  ...prev, 
                  paymentTerms: e.target.value 
                }))}
                placeholder="Payment schedule and terms..."
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="exclusions" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Standard Exclusions</Label>
              <p className="text-sm text-muted-foreground">
                Select which exclusions to include in the contract
              </p>
            </div>

            <div className="space-y-2">
              {STANDARD_EXCLUSIONS.map((exclusion, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id={`exclusion-${index}`}
                    checked={selectedExclusions.includes(exclusion)}
                    onChange={() => toggleExclusion(exclusion)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor={`exclusion-${index}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {exclusion}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Payment Schedule Templates</Label>
              <div className="space-y-2">
                {Object.entries(PAYMENT_SCHEDULE_TEMPLATES).map(([key, template]) => (
                  <Card key={key} className="p-3">
                    <h4 className="font-medium text-sm mb-2">{template.name}</h4>
                    <ul className="space-y-1">
                      {template.stages.map((stage, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {stage.percentage}% - {stage.description}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            {editMode ? (
              <Textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                className="min-h-[600px] font-mono text-xs"
              />
            ) : (
              <div className="bg-muted p-6 rounded-lg max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-xs">
                  {contractText}
                </pre>
              </div>
            )}
            
            {onSave && (
              <Button
                className="mt-4 w-full"
                onClick={() => onSave(contractText)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Save Contract
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}