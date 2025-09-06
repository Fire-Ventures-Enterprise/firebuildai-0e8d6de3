import { AppLayout } from "@/layouts/AppLayout";
import { WorkflowSequencer } from "@/components/workflow/WorkflowSequencer";
import WorkflowTestRunner from "@/components/workflow/WorkflowTestRunner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Zap, CheckCircle2, ArrowRight, TestTube, Wrench } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WorkflowSequencingPage() {
  return (
    <div className="container mx-auto py-4 md:py-6 px-3 sm:px-4 md:px-6 space-y-4 md:space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">AI Workflow Sequencing</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Transform unordered estimate items into properly sequenced construction workflows
        </p>
      </div>

      <Alert className="border-primary/20">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription className="text-xs md:text-sm">
          Our AI analyzes your estimate line items and automatically:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Sequences tasks in proper construction order</li>
            <li>Groups related work into logical phases</li>
            <li>Identifies required inspections and dependencies</li>
            <li>Generates crew and client notifications</li>
            <li>Creates detailed work orders without pricing</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Feature cards - Responsive grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 mb-3 md:mb-4">
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <CardTitle className="text-lg md:text-xl">Smart Sequencing</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              AI understands construction dependencies and automatically orders tasks correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-xs md:text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Demo before rough-in</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Inspections before closing walls</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Paint before finish work</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 mb-3 md:mb-4">
              <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <CardTitle className="text-lg md:text-xl">Phase Grouping</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Related tasks are grouped into logical phases with clear dependencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-xs md:text-sm">
              <li className="flex items-start gap-2">
                <span className="font-medium">Phase 1:</span>
                <span>Demo & Prep</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">Phase 2:</span>
                <span>Rough-In Work</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">Phase 3:</span>
                <span>Finishes</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 mb-3 md:mb-4">
              <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <CardTitle className="text-lg md:text-xl">Work Orders</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Generate detailed work orders with materials, inspections, and crew assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-xs md:text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Task checklists</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Material lists</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Inspection schedules</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tabs - Mobile optimized */}
      <Tabs defaultValue="sequencer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10 md:h-11">
          <TabsTrigger value="sequencer" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Wrench className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Workflow</span> Sequencer
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <TestTube className="h-3 w-3 md:h-4 md:w-4" />
            Test <span className="hidden sm:inline">Suite</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sequencer" className="mt-4 md:mt-6">
          <WorkflowSequencer />
        </TabsContent>
        
        <TabsContent value="test" className="mt-4 md:mt-6">
          <WorkflowTestRunner />
        </TabsContent>
      </Tabs>
    </div>
  );
}