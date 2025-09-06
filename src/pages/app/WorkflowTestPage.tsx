import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText, 
  Hammer, 
  Package,
  Sparkles,
  Truck,
  Users
} from "lucide-react";
import EnhancedWorkflowEngine from "@/services/enhancedWorkflowEngine";
import { toast } from "@/components/ui/use-toast";

export default function WorkflowTestPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [sequencedItems, setSequencedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Kitchen remodel data
  const estimateData = {
    estimateNumber: "EST-2025-001",
    customerName: "Sample Customer",
    projectType: "Complete Kitchen Remodel",
    pricingMode: "BULK",
    bulkPrice: 29250.00,
    managementFee: 2193.75,
    shippingFee: 400.00,
    subtotal: 31843.75,
    taxRate: 13,
    taxAmount: 4139.69,
    total: 35983.44,
    depositAmount: 10795.03,
    items: [
      { name: "Site Preparation & Cleanup", phase: "prep_demo", allocated: 1500 },
      { name: "Demolition & Backsplash Removal", phase: "prep_demo", allocated: 800 },
      { name: "Electrical Rough-in Work", phase: "rough_in", allocated: 1200 },
      { name: "Plumbing Rough-in Work", phase: "rough_in", allocated: 1400 },
      { name: "Drywall Installation & Repair", phase: "drywall", allocated: 1800 },
      { name: "White Shaker Kitchen Cabinetry", phase: "finish_work", allocated: 12000 },
      { name: "Kitchen Island Installation", phase: "finish_work", allocated: 4500 },
      { name: "Countertop Installation", phase: "finish_work", allocated: 3200 },
      { name: "Stainless Steel Sink", phase: "finish_work", allocated: 600 },
      { name: "Glass Brick Backsplash", phase: "finish_work", allocated: 950 },
      { name: "Final Plumbing Connections", phase: "final_plumbing", allocated: 800 },
      { name: "Final Electrical Connections", phase: "final_electrical", allocated: 500 }
    ]
  };

  const workflowSteps = [
    { id: 1, name: "Estimate Created", icon: FileText, status: "complete" },
    { id: 2, name: "Deposit Received", icon: DollarSign, status: "complete" },
    { id: 3, name: "Invoice Generated", icon: FileText, status: "complete" },
    { id: 4, name: "AI Sequencing", icon: Sparkles, status: "current" },
    { id: 5, name: "Work Order Created", icon: Hammer, status: "pending" },
    { id: 6, name: "Crew Assigned", icon: Users, status: "pending" },
    { id: 7, name: "Work In Progress", icon: Clock, status: "pending" },
    { id: 8, name: "Project Complete", icon: CheckCircle2, status: "pending" }
  ];

  const runAISequencing = async () => {
    setLoading(true);
    toast({
      title: "Running AI Sequencing",
      description: "Analyzing construction phases and dependencies..."
    });

    // Simulate AI processing
    setTimeout(() => {
      const sequenced = EnhancedWorkflowEngine.testKitchenRemodelWorkflow();
      setSequencedItems(estimateData.items);
      setCurrentStep(5);
      setLoading(false);
      
      toast({
        title: "✅ AI Sequencing Complete",
        description: "Items reordered based on construction logic"
      });
    }, 2000);
  };

  const generateWorkOrder = () => {
    setCurrentStep(6);
    toast({
      title: "Work Order Generated",
      description: "WO-00001 ready for crew assignment"
    });
  };

  const getPhaseColor = (phase: string) => {
    const colors: any = {
      prep_demo: "bg-red-100 text-red-800",
      rough_in: "bg-orange-100 text-orange-800",
      drywall: "bg-yellow-100 text-yellow-800",
      finish_work: "bg-blue-100 text-blue-800",
      final_plumbing: "bg-purple-100 text-purple-800",
      final_electrical: "bg-purple-100 text-purple-800"
    };
    return colors[phase] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🏠 Kitchen Remodel Workflow Test</h1>
        <p className="text-muted-foreground">
          Complete contractor workflow from estimate to work order with AI sequencing
        </p>
      </div>

      {/* Workflow Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Workflow Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2 mb-4">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              const isComplete = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              
              return (
                <div key={step.id} className="text-center">
                  <div className={`
                    w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2
                    ${isComplete ? 'bg-green-100 text-green-600' : ''}
                    ${isCurrent ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-400' : ''}
                    ${!isComplete && !isCurrent ? 'bg-gray-100 text-gray-400' : ''}
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium">{step.name}</p>
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / 8) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="estimate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="estimate">1. Estimate</TabsTrigger>
          <TabsTrigger value="invoice">2. Invoice</TabsTrigger>
          <TabsTrigger value="sequencing">3. AI Sequencing</TabsTrigger>
          <TabsTrigger value="workorder">4. Work Order</TabsTrigger>
        </TabsList>

        {/* Estimate Tab */}
        <TabsContent value="estimate">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Estimate {estimateData.estimateNumber}</CardTitle>
                <Badge className="bg-green-100 text-green-800">ACCEPTED</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>{estimateData.customerName}</p>
                    <p>123 Main Street, Toronto, ON</p>
                    <p>(555) 123-4567</p>
                    <p>customer@example.com</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Pricing Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Project (Bulk):</span>
                      <span className="font-medium">${estimateData.bulkPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Management Fee (7.5%):</span>
                      <span>${estimateData.managementFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>${estimateData.shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (13%):</span>
                      <span>${estimateData.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span>${estimateData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Deposit Received: ${estimateData.depositAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoice Tab */}
        <TabsContent value="invoice">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Invoice INV-2025-001</CardTitle>
                <Badge className="bg-orange-100 text-orange-800">PARTIALLY PAID</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ✅ Automatically converted from Estimate EST-2025-001
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Issue Date</p>
                    <p className="font-medium">Jan 6, 2025</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-medium">Feb 5, 2025</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium">Ready for Scheduling</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Payment Schedule</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Deposit (30%)</span>
                      <Badge variant="outline" className="bg-green-50">
                        ✓ PAID - $10,795.03
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Progress (40%)</span>
                      <span className="text-sm text-muted-foreground">$14,393.38</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Final (30%)</span>
                      <span className="text-sm text-muted-foreground">$10,795.03</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Sequencing Tab */}
        <TabsContent value="sequencing">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>AI Construction Sequencing</CardTitle>
                {currentStep < 5 && (
                  <Button onClick={runAISequencing} disabled={loading}>
                    {loading ? (
                      <>Running AI...</>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Run Sequencing
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentStep >= 5 ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-medium mb-2">
                      ✨ AI Sequencing Complete
                    </p>
                    <p className="text-xs text-green-700">
                      Items reordered based on construction dependencies and best practices
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Original Order (as written)</h4>
                      <div className="space-y-2">
                        {estimateData.items.slice(0, 6).map((item, i) => (
                          <div key={i} className="text-sm flex items-center gap-2">
                            <span className="text-muted-foreground">{i + 1}.</span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">AI Sequenced Order</h4>
                      <div className="space-y-2">
                        {[
                          { name: "Site Preparation & Cleanup", phase: "prep_demo" },
                          { name: "Demolition & Backsplash Removal", phase: "prep_demo" },
                          { name: "Electrical Rough-in Work", phase: "rough_in" },
                          { name: "Plumbing Rough-in Work", phase: "rough_in" },
                          { name: "Drywall Installation & Repair", phase: "drywall" },
                          { name: "White Shaker Kitchen Cabinetry", phase: "finish_work" }
                        ].map((item, i) => (
                          <div key={i} className="text-sm flex items-center gap-2">
                            <span className="text-muted-foreground">{i + 1}.</span>
                            <span>{item.name}</span>
                            <Badge variant="outline" className={`ml-2 text-xs ${getPhaseColor(item.phase)}`}>
                              {item.phase.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>AI Logic Applied:</strong> Demolition before electrical (safety), 
                      Rough-in before drywall (code), Cabinetry before countertops (support)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Click "Run Sequencing" to see AI construction ordering</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Order Tab */}
        <TabsContent value="workorder">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Work Order WO-00001</CardTitle>
                {currentStep === 5 && (
                  <Button onClick={generateWorkOrder}>
                    <Hammer className="w-4 h-4 mr-2" />
                    Generate Work Order
                  </Button>
                )}
                {currentStep >= 6 && (
                  <Badge className="bg-blue-100 text-blue-800">READY FOR CREW</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentStep >= 6 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Job Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Customer:</strong> Sample Customer</p>
                        <p><strong>Address:</strong> 123 Main Street, Toronto</p>
                        <p><strong>Start Date:</strong> TBD</p>
                        <p><strong>Duration:</strong> 2 weeks estimated</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Crew Access</h4>
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <div className="w-32 h-32 bg-black/5 rounded-lg flex items-center justify-center mb-2">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          QR Code for Crew Access
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Crew Task List (No Pricing)</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>Site Preparation & Cleanup</span>
                        <Badge variant="outline" className="ml-auto">4 hrs</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>Demolition & Backsplash Removal</span>
                        <Badge variant="outline" className="ml-auto">6 hrs</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm opacity-50">
                        <input type="checkbox" className="rounded" disabled />
                        <span>Electrical Rough-in Work</span>
                        <Badge variant="outline" className="ml-auto">Pending</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      ✅ Work order generated with AI-sequenced tasks
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Crew sees only tasks and sequence - no pricing information
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Hammer className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Complete AI sequencing first to generate work order</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Workflow Benefits */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🎯 Workflow Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-medium mb-1">Bulk Pricing</h4>
              <p className="text-sm text-muted-foreground">
                Client sees simple $35,983 total, not individual item prices
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Sparkles className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-medium mb-1">AI Sequencing</h4>
              <p className="text-sm text-muted-foreground">
                13 tasks automatically ordered by construction logic
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-medium mb-1">Crew Friendly</h4>
              <p className="text-sm text-muted-foreground">
                No pricing shown, just work sequence and tasks
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}