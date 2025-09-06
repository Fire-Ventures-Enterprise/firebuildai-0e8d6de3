import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkflowSequencer } from '@/components/workflow/WorkflowSequencer';
import { testKitchenRemodelWorkflow, testBulkPricingCalculations, runKitchenRemodelDemo } from '@/services/enhancedWorkflowEngine';
import { Play, FileText, Calculator } from 'lucide-react';

const WorkflowTestPage = () => {
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Capture console.log output
  const captureConsoleOutput = (fn: () => Promise<void> | void) => {
    const originalLog = console.log;
    const logs: string[] = [];
    
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };

    const runTest = async () => {
      setIsRunning(true);
      setOutput([]);
      try {
        await fn();
        setOutput(logs);
      } finally {
        console.log = originalLog;
        setIsRunning(false);
      }
    };
    
    return runTest();
  };

  const runKitchenDemo = () => captureConsoleOutput(runKitchenRemodelDemo);
  const runWorkflowTest = () => captureConsoleOutput(testKitchenRemodelWorkflow);
  const runPricingTest = () => captureConsoleOutput(testBulkPricingCalculations);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Workflow Test & Sequencing</h1>
        <p className="text-muted-foreground">
          Test the AI-powered construction workflow sequencing and bulk pricing system
        </p>
      </div>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tests">Test Suite</TabsTrigger>
          <TabsTrigger value="sequencer">AI Sequencer</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kitchen Remodel Workflow Tests</CardTitle>
              <CardDescription>
                Run comprehensive tests of the contractor workflow system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={runKitchenDemo}
                  disabled={isRunning}
                  className="w-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Run Complete Demo
                </Button>
                <Button 
                  onClick={runWorkflowTest}
                  disabled={isRunning}
                  variant="outline"
                  className="w-full"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Test Workflow Only
                </Button>
                <Button 
                  onClick={runPricingTest}
                  disabled={isRunning}
                  variant="outline"
                  className="w-full"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Test Pricing Only
                </Button>
              </div>

              {output.length > 0 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Test Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] w-full">
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {output.join('\n')}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequencer">
          <WorkflowSequencer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowTestPage;