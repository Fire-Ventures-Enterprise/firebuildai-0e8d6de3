import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText, 
  Mail, 
  Phone,
  MapPin,
  User,
  Clock,
  CheckCircle2,
  Sparkles,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useFireAPI } from '@/hooks/useFireAPI';
import { sequenceWorkflow } from '@/services/workflowSequencing';
import { supabase } from '@/integrations/supabase/client';

interface ProposalPreviewProps {
  estimate: any;
  items?: any[];
  paymentStages?: any[];
  contractText?: string;
  onApprove?: () => void;
  onEdit?: () => void;
}

interface EnhancedLineItem {
  id: string;
  description: string;
  detailedScope: string;
  includedTasks: string[];
  materials: string[];
  quantity: number;
  rate: number;
  amount: number;
  phase: string;
  trade: string;
  duration?: string;
}

export function EnhancedProposalPreview({ 
  estimate, 
  items = [], 
  paymentStages = [],
  contractText,
  onApprove,
  onEdit 
}: ProposalPreviewProps) {
  const { settings: companySettings } = useCompanySettings();
  const { analyzeProject, isHealthy, isLoading: fireApiLoading } = useFireAPI();
  const [enhancedItems, setEnhancedItems] = useState<EnhancedLineItem[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<any>({});

  // Fetch customer details from database
  useEffect(() => {
    if (estimate?.customer_id) {
      fetchCustomerDetails();
    }
  }, [estimate?.customer_id]);

  const fetchCustomerDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', estimate.customer_id)
        .single();

      if (data && !error) {
        setCustomerDetails(data);
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

  // Enhanced AI analysis of line items
  useEffect(() => {
    if (items.length > 0 && isHealthy) {
      enhanceLineItems();
    }
  }, [items, isHealthy]);

  const enhanceLineItems = async () => {
    setIsEnhancing(true);
    try {
      // Use FireAPI if available, otherwise use local analysis
      if (isHealthy) {
        const projectDescription = items.map(item => item.description).join(', ');
        const analysis = await analyzeProject(projectDescription);
        
        if (analysis?.tasks) {
          // Map analyzed tasks to enhanced items
          const enhanced = items.map((item, index) => {
            const task = analysis.tasks[index] || {};
            return generateEnhancedItem(item, task);
          });
          setEnhancedItems(enhanced);
        } else {
          // Fallback to local analysis
          useLocalAnalysis();
        }
      } else {
        useLocalAnalysis();
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      useLocalAnalysis();
    } finally {
      setIsEnhancing(false);
    }
  };

  const useLocalAnalysis = () => {
    // Use local workflow sequencing for analysis
    const workflow = sequenceWorkflow(
      estimate?.estimate_number || 'Project',
      items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate
      }))
    );

    const enhanced = items.map((item, index) => {
      const phase = workflow.phases[Math.floor(index / Math.ceil(items.length / workflow.phases.length))];
      const task = phase?.tasks?.[index % Math.ceil(items.length / workflow.phases.length)] || {};
      
      return generateEnhancedItem(item, task);
    });

    setEnhancedItems(enhanced);
  };

  const generateEnhancedItem = (item: any, taskInfo: any): EnhancedLineItem => {
    const description = item.description.toLowerCase();
    
    // Construction-specific knowledge base
    const tradeAnalysis = analyzeTradeWork(description);
    
    return {
      id: item.id,
      description: item.description,
      detailedScope: tradeAnalysis.scope,
      includedTasks: tradeAnalysis.tasks,
      materials: tradeAnalysis.materials,
      quantity: item.quantity || 1,
      rate: item.rate || 0,
      amount: item.amount || 0,
      phase: taskInfo.phase || tradeAnalysis.phase,
      trade: taskInfo.trade || tradeAnalysis.trade,
      duration: taskInfo.duration || tradeAnalysis.estimatedDuration
    };
  };

  const analyzeTradeWork = (description: string) => {
    // Knowledge base for construction trades
    const tradePatterns = {
      cabinet: {
        trade: 'Carpentry',
        phase: 'Finishing',
        scope: 'Complete cabinet installation including assembly, mounting, hardware installation, and adjustments',
        tasks: [
          'Remove existing cabinetry if applicable',
          'Install wall blocking and support structures',
          'Mount upper and lower cabinets to manufacturer specifications',
          'Install cabinet doors, drawers, and hardware',
          'Adjust for level and proper operation',
          'Install filler strips and crown molding'
        ],
        materials: ['Cabinets', 'Hardware', 'Mounting brackets', 'Shims', 'Fasteners'],
        estimatedDuration: '2-3 days'
      },
      plumbing: {
        trade: 'Plumbing',
        phase: 'Rough-In',
        scope: 'Complete plumbing installation including supply lines, drainage, and fixture connections',
        tasks: [
          'Install water supply lines',
          'Install drain and vent piping',
          'Connect fixtures to supply and drainage',
          'Test for leaks and proper flow',
          'Install shut-off valves',
          'Insulate pipes as required'
        ],
        materials: ['PEX/Copper piping', 'Fittings', 'Valves', 'Fixtures', 'Sealants'],
        estimatedDuration: '1-2 days'
      },
      electrical: {
        trade: 'Electrical',
        phase: 'Rough-In',
        scope: 'Complete electrical installation including wiring, outlets, switches, and fixtures',
        tasks: [
          'Install electrical boxes and conduit',
          'Run wiring to code specifications',
          'Install outlets, switches, and fixtures',
          'Connect to electrical panel',
          'Test circuits and GFCI protection',
          'Install cover plates and trim'
        ],
        materials: ['Wire', 'Boxes', 'Outlets', 'Switches', 'Breakers', 'Fixtures'],
        estimatedDuration: '1-2 days'
      },
      drywall: {
        trade: 'Drywall',
        phase: 'Framing',
        scope: 'Complete drywall installation including hanging, taping, mudding, and finishing',
        tasks: [
          'Measure and cut drywall sheets',
          'Hang drywall with appropriate fasteners',
          'Tape all joints and corners',
          'Apply compound coats (3 minimum)',
          'Sand between coats for smooth finish',
          'Prime surfaces for paint'
        ],
        materials: ['Drywall sheets', 'Joint compound', 'Tape', 'Corner bead', 'Fasteners'],
        estimatedDuration: '3-5 days'
      },
      flooring: {
        trade: 'Flooring',
        phase: 'Finishing',
        scope: 'Complete flooring installation including subfloor preparation, material installation, and finishing',
        tasks: [
          'Prepare and level subfloor',
          'Install moisture barrier if required',
          'Layout and cut flooring material',
          'Install flooring per manufacturer specs',
          'Install transitions and trim',
          'Clean and seal as required'
        ],
        materials: ['Flooring material', 'Underlayment', 'Adhesive', 'Transitions', 'Trim'],
        estimatedDuration: '2-3 days'
      },
      painting: {
        trade: 'Painting',
        phase: 'Finishing',
        scope: 'Complete painting including surface preparation, priming, and finish coats',
        tasks: [
          'Protect floors and fixtures',
          'Patch and sand imperfections',
          'Apply primer coat',
          'Apply finish coats (2 minimum)',
          'Paint trim and details',
          'Clean up and touch up'
        ],
        materials: ['Primer', 'Paint', 'Brushes/Rollers', 'Tape', 'Drop cloths'],
        estimatedDuration: '2-3 days'
      },
      tile: {
        trade: 'Tile Setting',
        phase: 'Finishing',
        scope: 'Complete tile installation including surface prep, waterproofing, setting, and grouting',
        tasks: [
          'Prepare substrate and waterproof',
          'Layout tile pattern',
          'Mix and apply thinset mortar',
          'Set tiles with proper spacing',
          'Apply grout and clean',
          'Seal grout lines'
        ],
        materials: ['Tiles', 'Thinset', 'Grout', 'Waterproofing', 'Spacers', 'Sealer'],
        estimatedDuration: '2-4 days'
      }
    };

    // Find matching trade pattern
    for (const [key, pattern] of Object.entries(tradePatterns)) {
      if (description.includes(key)) {
        return pattern;
      }
    }

    // Default pattern
    return {
      trade: 'General Construction',
      phase: 'Construction',
      scope: 'Complete installation as specified',
      tasks: ['Prepare work area', 'Install as per specifications', 'Clean and inspect'],
      materials: ['Materials as specified'],
      estimatedDuration: '1-2 days'
    };
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxAmount = subtotal * (estimate?.tax_rate || 0) / 100;
  const total = subtotal + taxAmount;
  const depositAmount = estimate?.deposit_amount || (total * (estimate?.deposit_percentage || 30) / 100);

  // Determine customer name
  const customerName = customerDetails?.first_name && customerDetails?.last_name
    ? `${customerDetails.first_name} ${customerDetails.last_name}`
    : estimate?.customer_name || "Client Name";

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="shadow-lg">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-8 space-y-8">
            {/* Header with Company Info */}
            <div className="flex justify-between items-start border-b pb-6">
              <div className="space-y-2">
                {companySettings?.logo_url ? (
                  <img 
                    src={companySettings.logo_url} 
                    alt={companySettings.company_name || "Company Logo"}
                    className="h-16 object-contain"
                  />
                ) : (
                  <div className="text-2xl font-bold text-primary">
                    {companySettings?.company_name || "Your Company Name"}
                  </div>
                )}
                <div className="text-sm text-muted-foreground space-y-1">
                  {companySettings?.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {companySettings.address}
                    </div>
                  )}
                  {companySettings?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {companySettings.phone}
                    </div>
                  )}
                  {companySettings?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {companySettings.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right space-y-2">
                <h1 className="text-3xl font-bold text-primary">PROPOSAL</h1>
                <div className="text-sm space-y-1">
                  <div className="font-semibold">#{estimate?.estimate_number || "EST-0001"}</div>
                  <Badge variant="outline" className="text-xs">
                    {estimate?.status || "DRAFT"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Client Info and Dates */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="font-semibold text-sm text-muted-foreground">PREPARED FOR</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{customerName}</span>
                  </div>
                  {(customerDetails?.email || estimate?.customer_email) && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{customerDetails?.email || estimate.customer_email}</span>
                    </div>
                  )}
                  {(customerDetails?.phone || estimate?.customer_phone) && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{customerDetails?.phone || estimate.customer_phone}</span>
                    </div>
                  )}
                  {estimate?.service_address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">
                        {estimate.service_address}
                        {estimate.service_city && `, ${estimate.service_city}`}
                        {estimate.service_province && `, ${estimate.service_province}`}
                        {estimate.service_postal_code && ` ${estimate.service_postal_code}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-semibold text-sm text-muted-foreground">PROPOSAL DETAILS</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Issue Date: {estimate?.issue_date ? format(new Date(estimate.issue_date), "MMM dd, yyyy") : format(new Date(), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Valid Until: {estimate?.expiration_date ? format(new Date(estimate.expiration_date), "MMM dd, yyyy") : format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "MMM dd, yyyy")}
                    </span>
                  </div>
                  {estimate?.project_start_date && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Project Start: {format(new Date(estimate.project_start_date), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scope of Work */}
            {estimate?.scope_of_work && (
              <div className="space-y-3">
                <div className="font-semibold text-sm text-muted-foreground">PROJECT OVERVIEW</div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{estimate.scope_of_work}</p>
                </div>
              </div>
            )}

            {/* Enhanced Line Items with AI Analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-sm text-muted-foreground">
                DETAILED SCOPE OF WORK
                {isEnhancing && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-xs">Analyzing scope...</span>
                  </>
                )}
                {!isEnhancing && enhancedItems.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </Badge>
                )}
              </div>
              
              <div className="space-y-4">
                {(enhancedItems.length > 0 ? enhancedItems : items).map((item, index) => {
                  const isEnhanced = enhancedItems.length > 0;
                  const enhancedItem = isEnhanced ? item as EnhancedLineItem : null;
                  
                  return (
                    <Card key={item.id || index} className="p-4">
                      <div className="space-y-3">
                        {/* Item Header */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-base">{item.description}</div>
                            {enhancedItem && (
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {enhancedItem.trade}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {enhancedItem.phase}
                                </Badge>
                                {enhancedItem.duration && (
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {enhancedItem.duration}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              {item.quantity || 1} × ${(item.rate || 0).toFixed(2)}
                            </div>
                            <div className="text-lg font-semibold">
                              ${(item.amount || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Details */}
                        {enhancedItem && (
                          <>
                            {/* Detailed Scope */}
                            <div className="text-sm text-muted-foreground">
                              {enhancedItem.detailedScope}
                            </div>

                            {/* Included Tasks */}
                            {enhancedItem.includedTasks.length > 0 && (
                              <div className="bg-muted/30 p-3 rounded">
                                <div className="text-xs font-medium mb-2">Included:</div>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {enhancedItem.includedTasks.map((task, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <CheckCircle2 className="h-3 w-3 mt-0.5 text-primary" />
                                      <span>{task}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Materials */}
                            {enhancedItem.materials.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                <span className="font-medium">Materials: </span>
                                {enhancedItem.materials.join(', ')}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Summary Table */}
              <Card className="overflow-hidden">
                <table className="w-full">
                  <tfoot>
                    <tr className="border-t">
                      <td className="text-right p-3 text-sm">Subtotal</td>
                      <td className="text-right p-3 text-sm font-medium w-32">${subtotal.toFixed(2)}</td>
                    </tr>
                    {taxAmount > 0 && (
                      <tr>
                        <td className="text-right p-3 text-sm">
                          Tax ({estimate?.tax_rate || 0}%)
                        </td>
                        <td className="text-right p-3 text-sm font-medium w-32">${taxAmount.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="border-t bg-primary/5">
                      <td className="text-right p-3 font-semibold">Total Project Investment</td>
                      <td className="text-right p-3 text-lg font-bold text-primary w-32">
                        ${total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </Card>
            </div>

            {/* Payment Schedule */}
            {(paymentStages.length > 0 || estimate?.deposit_amount > 0) && (
              <div className="space-y-3">
                <div className="font-semibold text-sm text-muted-foreground">PAYMENT SCHEDULE</div>
                <Card className="p-4">
                  <div className="space-y-3">
                    {estimate?.deposit_amount > 0 && (
                      <div className="flex justify-between items-center pb-3 border-b">
                        <div>
                          <div className="font-medium">Initial Deposit</div>
                          <div className="text-sm text-muted-foreground">Due upon contract signing</div>
                        </div>
                        <div className="text-lg font-bold text-primary">
                          ${depositAmount.toFixed(2)}
                        </div>
                      </div>
                    )}
                    {paymentStages.map((stage, index) => (
                      <div key={index} className="flex justify-between items-center pb-3 border-b last:border-0">
                        <div>
                          <div className="font-medium">{stage.description}</div>
                          <div className="text-sm text-muted-foreground">{stage.milestone}</div>
                        </div>
                        <div className="text-lg font-bold">
                          ${(stage.amount || 0).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Terms & Conditions */}
            {(contractText || estimate?.terms_conditions) && (
              <div className="space-y-3">
                <div className="font-semibold text-sm text-muted-foreground">TERMS & CONDITIONS</div>
                <Card className="p-4">
                  <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {contractText || estimate.terms_conditions}
                  </div>
                </Card>
              </div>
            )}

            {/* Notes */}
            {estimate?.notes && (
              <div className="space-y-3">
                <div className="font-semibold text-sm text-muted-foreground">ADDITIONAL NOTES</div>
                <div className="text-sm whitespace-pre-wrap">{estimate.notes}</div>
              </div>
            )}

            <Separator />

            {/* Footer */}
            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Thank you for considering our proposal. We look forward to bringing your vision to life!
              </div>
              <div className="text-xs text-muted-foreground">
                This proposal is valid until {estimate?.expiration_date ? format(new Date(estimate.expiration_date), "MMMM dd, yyyy") : format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "MMMM dd, yyyy")}.
                All prices are subject to change after this date.
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        {onEdit && (
          <Button variant="outline" onClick={onEdit}>
            <FileText className="h-4 w-4 mr-2" />
            Edit Proposal
          </Button>
        )}
        {onApprove && (
          <Button size="lg" onClick={onApprove} className="ml-auto">
            Proceed to Customer Approval
          </Button>
        )}
      </div>
    </div>
  );
}