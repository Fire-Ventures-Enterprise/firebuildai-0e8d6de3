import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Package, 
  Users, 
  AlertCircle,
  FileText,
  Wrench
} from "lucide-react";
import { sequenceWorkflow, generateWorkOrder, type SequencedWorkflow } from "@/services/workflowSequencing";
import { toast } from "@/components/ui/use-toast";

export function WorkflowSequencer() {
  const [inputItems, setInputItems] = useState("");
  const [projectName, setProjectName] = useState("Johnson Kitchen Renovation");
  const [workflow, setWorkflow] = useState<SequencedWorkflow | null>(null);
  const [workOrderText, setWorkOrderText] = useState<string>("");

  const handleSequence = () => {
    if (!inputItems.trim()) {
      toast({
        title: "No items to sequence",
        description: "Please enter estimate line items to sequence",
        variant: "destructive"
      });
      return;
    }

    // Enhanced parsing to handle complex estimate formats
    let items: { description: string }[] = [];
    
    // Check if input looks like a detailed estimate with headers
    const lines = inputItems.split('\n').map(line => line.trim()).filter(Boolean);
    
    for (const line of lines) {
      // Skip headers, prices, and formatting lines
      if (line.startsWith('#') || 
          line.startsWith('$') || 
          line.startsWith('---') ||
          line.startsWith('**') && line.endsWith('**') ||
          line.length < 5) {
        continue;
      }
      
      // Clean up markdown formatting and extract actual work items
      let cleanLine = line
        .replace(/^\*\s*/, '') // Remove bullet points
        .replace(/^\d+\.\s*/, '') // Remove numbered lists
        .replace(/^-\s*/, '') // Remove dashes
        .replace(/\*\*/g, '') // Remove bold markdown
        .trim();
      
      // Skip section headers and notes
      if (cleanLine.startsWith('###') ||
          cleanLine.startsWith('####') ||
          cleanLine.toLowerCase().includes('note:') ||
          cleanLine.toLowerCase().includes('client') ||
          cleanLine.toLowerCase().includes('responsibility') ||
          cleanLine.toLowerCase().includes('acknowledgment') ||
          cleanLine.toLowerCase().includes('management fee') ||
          cleanLine.toLowerCase().includes('scope of work')) {
        continue;
      }
      
      // Only add lines that describe actual work items
      if (cleanLine.length > 10 && 
          !cleanLine.match(/^\d+(\.\d+)?%?$/) && // Skip percentages/numbers
          !cleanLine.match(/^level \d+/i) && // Skip level descriptions
          !cleanLine.includes('$')) { // Skip lines with prices
        items.push({ description: cleanLine });
      }
    }

    if (items.length === 0) {
      toast({
        title: "No valid items found",
        description: "Please enter at least one line item or paste an estimate",
        variant: "destructive"
      });
      return;
    }

    // Generate sequenced workflow
    const sequencedWorkflow = sequenceWorkflow(projectName, items);
    setWorkflow(sequencedWorkflow);

    // Generate work order text
    const woText = generateWorkOrder(sequencedWorkflow, `WO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`);
    setWorkOrderText(woText);

    toast({
      title: "Workflow sequenced successfully",
      description: `Generated ${sequencedWorkflow.phases.length} phases with ${items.length} tasks`,
    });
  };

  const loadTestCase = () => {
    const testItems = `Kitchen Remodel

### **Demolition**
* Complete removal of existing cabinetry
* Removal of the front door separation wall
* Demolition of existing backsplash wall
* Removal of tile flooring on the main level (excluding bedrooms)
* Wood-Burning Fireplace: Complete removal from roof down to the basement ceiling

### **Construction**
* Supply and install new ½" drywall for kitchen, family room ceilings
* Prime and paint ceiling only

### **Window Work**
* Remove existing kitchen window
* Supply and install new 60" wide x 40" tall window in the kitchen area

### **Cabinetry & Millwork**
* White shaker cabinetry with a contrasting secondary color for the island
* Soft-close hinges and under-mounted, ball-bearing drawer slides
* Includes a 9" spice rack and pull-out garbage cabinet

### **Kitchen Island**
* Seats 3 comfortably with additional cabinetry storage
* Finished in a secondary color (blue)

### **Countertops & Sink**
* Choice of Level 1 Granite or Quartz countertops
* Undermount 60/40 stainless steel sink included

### **Backsplash**
* Supply and install customer-selected backsplash tiles
* Full-height backsplash installation at the stove wall

### **Flooring**
* Supply and install approximately 410 sqft of 5"–6" wide plank flooring

### **Electrical & Lighting**
* Supply and install 6 pot lights
* Updated switches and plugs (modern decor style)
* Island plug with integrated USB charger
* Power source for dishwasher
* Installation of 3 client-supplied pendant lights above the island

### **Painting**
* Supply and apply paint to walls and ceilings of kitchen, living room, and eating area

### **Trim, Baseboards & Casings**
* Supply, paint, and install 5" square flat baseboards with beveled edge

### **Plumbing & Appliance Hookups**
* Re-route plumbing for new sink location
* Install client-supplied faucet and dishwasher
* Add new water line for fridge
* Install client-supplied hood vent`;
    
    setInputItems(testItems);
    setProjectName("Kitchen Remodel");
  };

  const getPhaseIcon = (phaseLabel: string) => {
    if (phaseLabel.includes("Demo")) return <Wrench className="h-4 w-4" />;
    if (phaseLabel.includes("Rough")) return <Package className="h-4 w-4" />;
    if (phaseLabel.includes("Paint")) return <Package className="h-4 w-4" />;
    if (phaseLabel.includes("Install")) return <Wrench className="h-4 w-4" />;
    if (phaseLabel.includes("Finish")) return <CheckCircle2 className="h-4 w-4" />;
    if (phaseLabel.includes("Final")) return <CheckCircle2 className="h-4 w-4" />;
    return <Package className="h-4 w-4" />;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'crew': return <Users className="h-4 w-4" />;
      case 'client': return <FileText className="h-4 w-4" />;
      case 'material': return <Package className="h-4 w-4" />;
      case 'inspection': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Workflow Sequencer</CardTitle>
          <CardDescription>
            Enter unordered estimate line items and let AI sequence them into proper construction phases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter project name"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Estimate Line Items (one per line)</label>
              <Button variant="outline" size="sm" onClick={loadTestCase}>
                Load Test Case
              </Button>
            </div>
            <Textarea
              value={inputItems}
              onChange={(e) => setInputItems(e.target.value)}
              placeholder="Enter line items, one per line..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <Button onClick={handleSequence} className="w-full">
            Sequence Workflow <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {workflow && (
        <Card>
          <CardHeader>
            <CardTitle>{workflow.projectName}</CardTitle>
            <CardDescription>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {workflow.totalDuration} days total
                </span>
                <span className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  {workflow.phases.length} phases
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="phases" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="phases">Phases</TabsTrigger>
                <TabsTrigger value="workorder">Work Order</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="phases" className="space-y-4">
                <ScrollArea className="h-[500px] pr-4">
                  {workflow.phases.map((phase, index) => (
                    <div key={phase.number} className="mb-6">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {getPhaseIcon(phase.label)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">
                              Phase {phase.number}: {phase.label}
                            </h3>
                            <Badge variant="outline">
                              {phase.estimatedDuration} days
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            {phase.tasks.map((task, taskIndex) => (
                              <div key={taskIndex} className="flex items-start gap-2 text-sm">
                                <span className="text-muted-foreground">□</span>
                                <span>{task.description}</span>
                                {task.trade && (
                                  <Badge variant="secondary" className="text-xs">
                                    {task.trade}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>

                          {phase.materials.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Materials:</span> {phase.materials.join(', ')}
                            </div>
                          )}

                          {phase.inspectionsRequired.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {phase.inspectionsRequired.map((inspection, i) => (
                                <Badge key={i} variant="destructive" className="text-xs">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  {inspection}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {index < workflow.phases.length - 1 && (
                            <div className="pt-2">
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="workorder">
                <ScrollArea className="h-[500px]">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg">
                    {workOrderText}
                  </pre>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-2">
                <ScrollArea className="h-[500px]">
                  {workflow.notifications.map((notification, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            notification.type === 'crew' ? 'default' :
                            notification.type === 'client' ? 'secondary' :
                            notification.type === 'inspection' ? 'destructive' :
                            'outline'
                          }>
                            {notification.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Phase {notification.phase} - {notification.timing}
                          </span>
                        </div>
                        <div className="text-sm mt-1">{notification.message}</div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}