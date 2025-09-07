// Xactimate Integration Main Page
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Upload, 
  Camera, 
  BarChart3, 
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { XactimateImport } from '@/components/xactimate/XactimateImport';
import { XactimateLineItemPhotos } from '@/components/xactimate/XactimateLineItemPhotos';
import { XactimateService } from '@/services/xactimate';
import { XactimateEstimate, XactimateLineItem } from '@/types/xactimate';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function XactimatePage() {
  const [estimates, setEstimates] = useState<XactimateEstimate[]>([]);
  const [selectedEstimate, setSelectedEstimate] = useState<XactimateEstimate | null>(null);
  const [lineItems, setLineItems] = useState<XactimateLineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEstimates();
  }, []);

  const loadEstimates = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const estimates = await XactimateService.getEstimates(user.id);
        setEstimates(estimates);
      }
    } catch (error) {
      console.error('Error loading estimates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEstimateDetails = async (estimateId: string) => {
    try {
      const { estimate, lineItems } = await XactimateService.getEstimateWithLineItems(estimateId);
      setSelectedEstimate(estimate);
      setLineItems(lineItems);
    } catch (error) {
      console.error('Error loading estimate details:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Xactimate Integration
          </h1>
          <p className="text-muted-foreground mt-1">
            Import and manage insurance estimates with photo documentation
          </p>
        </div>
      </div>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="import">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </TabsTrigger>
          <TabsTrigger value="estimates">
            <FileText className="h-4 w-4 mr-2" />
            Estimates
          </TabsTrigger>
          <TabsTrigger value="photos">
            <Camera className="h-4 w-4 mr-2" />
            Photos
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import">
          <XactimateImport />
        </TabsContent>

        <TabsContent value="estimates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Xactimate Estimates</CardTitle>
              <CardDescription>
                Manage imported estimates and track progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-8 text-muted-foreground">Loading estimates...</p>
              ) : estimates.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No estimates imported yet. Go to the Import tab to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {estimates.map((estimate) => (
                    <div 
                      key={estimate.id} 
                      className="border rounded-lg p-4 hover:bg-muted/20 cursor-pointer transition-colors"
                      onClick={() => loadEstimateDetails(estimate.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{estimate.claim_number}</h4>
                            {getStatusIcon(estimate.import_status || 'pending')}
                            <Badge variant="outline">{estimate.import_status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {estimate.insured_name} • {estimate.property_address}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            ${estimate.total_rcv?.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">RCV</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedEstimate && lineItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Line Items for {selectedEstimate.claim_number}</CardTitle>
                <CardDescription>
                  {lineItems.length} items to complete
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {lineItems.slice(0, 5).map((item) => (
                  <XactimateLineItemPhotos 
                    key={item.id} 
                    lineItem={item}
                    onStatusUpdate={() => loadEstimateDetails(selectedEstimate.id)}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Photo Documentation</CardTitle>
              <CardDescription>
                Manage before, during, and after photos for all line items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Select an estimate from the Estimates tab to manage photos
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Progress Reports</CardTitle>
              <CardDescription>
                Generate and export Xactimate-compatible reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Estimates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{estimates.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total RCV</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      ${estimates.reduce((sum, e) => sum + (e.total_rcv || 0), 0).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {estimates.filter(e => e.import_status === 'completed').length}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}