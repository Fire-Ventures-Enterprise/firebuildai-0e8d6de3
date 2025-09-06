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

    // Parse input items (one per line)
    const items = inputItems
      .split('\n')
      .filter(line => line.trim())
      .map(line => ({ description: line.trim() }));

    if (items.length === 0) {
      toast({
        title: "No valid items found",
        description: "Please enter at least one line item",
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
    const testItems = `Demolition of existing kitchen cabinets and countertops
Remove and cap existing plumbing lines
Electrical rough-in for under-cabinet lighting and new outlets
Drywall repair and patching
Install new kitchen cabinets
Granite countertop installation
Plumbing rough-in for new sink location
Install new sink and faucet
Tile backsplash installation
Paint kitchen walls and ceiling
Install under-cabinet LED lighting
Final electrical connections
Cleanup and debris removal`;
    
    setInputItems(testItems);
    setProjectName("Johnson Kitchen Renovation");
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