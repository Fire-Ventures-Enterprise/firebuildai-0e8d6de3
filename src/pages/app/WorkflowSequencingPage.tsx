import { AppLayout } from "@/layouts/AppLayout";
import { WorkflowSequencer } from "@/components/workflow/WorkflowSequencer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Zap, CheckCircle2, ArrowRight } from "lucide-react";

export default function WorkflowSequencingPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">AI Workflow Sequencing</h1>
          <p className="text-muted-foreground">
            Transform unordered estimate items into properly sequenced construction workflows
          </p>
        </div>

        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>How it works</AlertTitle>
          <AlertDescription>
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

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Smart Sequencing</CardTitle>
              <CardDescription>
                AI understands construction dependencies and automatically orders tasks correctly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Demo before rough-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Inspections before closing walls</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Paint before finish work</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Phase Grouping</CardTitle>
              <CardDescription>
                Related tasks are grouped into logical phases with clear dependencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Work Orders</CardTitle>
              <CardDescription>
                Generate detailed work orders with materials, inspections, and crew assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Task checklists</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Material lists</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Inspection schedules</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <WorkflowSequencer />
      </div>
    </AppLayout>
  );
}