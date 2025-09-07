// Xactimate Import Component
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  DollarSign, 
  Home, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { XactimateService } from '@/services/xactimate';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface ImportedEstimateData {
  claim_number: string;
  insured_name: string;
  property_address: string;
  date_of_loss: Date;
  total_rcv: number;
  total_acv: number;
  deductible: number;
  line_items: any[];
}

export const XactimateImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [estimateData, setEstimateData] = useState<ImportedEstimateData | null>(null);
  const [importedEstimateId, setImportedEstimateId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const validTypes = ['.xmo', '.pdf', 'application/pdf'];
      const fileType = uploadedFile.name.toLowerCase();
      
      if (!fileType.endsWith('.xmo') && !fileType.endsWith('.pdf')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a .XMO or .PDF file",
          variant: "destructive"
        });
        return;
      }
      
      setFile(uploadedFile);
      // Mock preview for demo
      setEstimateData({
        claim_number: 'CLM-2024-001',
        insured_name: 'John Doe',
        property_address: '123 Main St, Dallas, TX 75201',
        date_of_loss: new Date('2024-01-15'),
        total_rcv: 125000,
        total_acv: 100000,
        deductible: 2500,
        line_items: [
          { code: 'DRY-001', description: 'Remove & Replace Drywall', quantity: 250, unit: 'SF', total: 1125, trade: 'drywall' },
          { code: 'PNT-001', description: 'Paint Walls - 2 Coats', quantity: 250, unit: 'SF', total: 562.50, trade: 'painting' },
          { code: 'FLR-001', description: 'Install Luxury Vinyl Plank', quantity: 180, unit: 'SF', total: 1215, trade: 'flooring' },
          { code: 'ELE-001', description: 'Replace Electrical Outlets', quantity: 4, unit: 'EA', total: 340, trade: 'electrical' },
          { code: 'PLB-001', description: 'Replace Supply Lines', quantity: 2, unit: 'EA', total: 250, trade: 'plumbing' }
        ]
      });
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Import the estimate
      const estimate = await XactimateService.importEstimate(file, user.id);
      setImportedEstimateId(estimate.id);
      
      clearInterval(progressInterval);
      setImportProgress(100);

      toast({
        title: "Import successful",
        description: `Estimate ${estimateData?.claim_number} imported successfully`,
      });

      // Optionally create project
      setTimeout(() => {
        handleCreateProject(estimate.id);
      }, 1000);
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "Failed to import Xactimate estimate",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateProject = async (estimateId: string) => {
    try {
      const projectId = await XactimateService.createProjectFromEstimate(estimateId);
      navigate(`/app/jobs/${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // Group line items by trade
  const groupByTrade = (items: any[]) => {
    const grouped = items.reduce((acc, item) => {
      const trade = item.trade || 'general';
      if (!acc[trade]) acc[trade] = [];
      acc[trade].push(item);
      return acc;
    }, {});
    return grouped;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import Xactimate Estimate
          </CardTitle>
          <CardDescription>
            Upload your Xactimate .XMO or PDF file to import estimate data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
            <Input
              type="file"
              accept=".xmo,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="xactimate-upload"
            />
            <label htmlFor="xactimate-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {file ? file.name : 'Drop Xactimate file here or click to browse'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports .XMO and .PDF files
                </p>
              </div>
            </label>
          </div>

          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importing estimate...</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {estimateData && !isImporting && (
        <Card>
          <CardHeader>
            <CardTitle>Estimate Preview</CardTitle>
            <CardDescription>Review the imported estimate data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Estimate Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Claim Number</p>
                <p className="font-medium">{estimateData.claim_number}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Insured</p>
                <p className="font-medium">{estimateData.insured_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date of Loss</p>
                <p className="font-medium">
                  {new Date(estimateData.date_of_loss).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Property</p>
                <p className="font-medium text-sm">{estimateData.property_address}</p>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">RCV</p>
                  <p className="text-lg font-semibold">
                    ${estimateData.total_rcv.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">ACV</p>
                  <p className="text-lg font-semibold">
                    ${estimateData.total_acv.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Deductible</p>
                  <p className="text-lg font-semibold">
                    ${estimateData.deductible.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Line Items by Trade */}
            <div className="space-y-4">
              <h4 className="font-medium">Work Scopes by Trade</h4>
              {Object.entries(groupByTrade(estimateData.line_items)).map(([trade, items]: [string, any]) => (
                <div key={trade} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium capitalize flex items-center gap-2">
                      {trade}
                      <Badge variant="secondary">{items.length} items</Badge>
                    </h5>
                    <span className="text-sm font-medium">
                      ${items.reduce((sum: number, item: any) => sum + (item.total || 0), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">{item.code}</span>
                          <span>{item.description}</span>
                          <span className="text-muted-foreground">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <span className="font-medium">${item.total?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setEstimateData(null)}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={isImporting}>
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Create Project from Estimate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};