import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Copy, CheckCircle2, AlertCircle, Calendar, Clock, Users, Zap, Shield, Code } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_ENDPOINT = "https://mvrxwkyilhbhbaoxfvyp.supabase.co/functions/v1/construction-sequencer";

const exampleRequests = {
  kitchen: {
    name: "Kitchen Renovation",
    request: {
      projectDescription: "Complete kitchen renovation including demolition of existing kitchen, new cabinetry installation, granite countertops, tile backsplash, under-cabinet lighting, new appliances, and painting",
      squareFootage: 200,
      projectType: "renovation",
      location: "Toronto, ON",
      includePermits: true,
      includeInspections: true
    }
  },
  addition: {
    name: "Home Addition",
    request: {
      projectDescription: "1320 sqft two-story addition with master suite on second floor, foundation work, framing, roofing, full electrical and plumbing, HVAC extension, insulation, drywall, flooring, and finishing",
      squareFootage: 1320,
      projectType: "addition",
      location: "Vancouver, BC",
      includePermits: true,
      includeInspections: true
    }
  },
  bathroom: {
    name: "Bathroom Remodel",
    request: {
      projectDescription: "Master bathroom remodel with new vanity, tile shower, soaking tub, heated floors, new plumbing fixtures, and ventilation fan",
      squareFootage: 100,
      projectType: "renovation",
      location: "Calgary, AB",
      includePermits: false,
      includeInspections: true
    }
  },
  commercial: {
    name: "Office Build-Out",
    request: {
      projectDescription: "5000 sqft commercial office build-out with conference rooms, open workspace, kitchenette, two bathrooms, IT infrastructure, HVAC zones, and modern lighting",
      squareFootage: 5000,
      projectType: "commercial",
      location: "Montreal, QC",
      includePermits: true,
      includeInspections: true
    }
  }
};

export default function APIPlayground() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [projectDescription, setProjectDescription] = useState(exampleRequests.kitchen.request.projectDescription);
  const [squareFootage, setSquareFootage] = useState(exampleRequests.kitchen.request.squareFootage.toString());
  const [projectType, setProjectType] = useState(exampleRequests.kitchen.request.projectType);
  const [location, setLocation] = useState(exampleRequests.kitchen.request.location);
  const [includePermits, setIncludePermits] = useState(true);
  const [includeInspections, setIncludeInspections] = useState(true);
  const [apiKey, setApiKey] = useState("public-beta");
  const { toast } = useToast();

  const callAPI = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const request = {
      projectDescription,
      squareFootage: parseInt(squareFootage) || undefined,
      projectType,
      location,
      includePermits,
      includeInspections
    };

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify(request)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'API request failed');
      }

      setResponse(data);
      toast({
        title: "Success",
        description: `Sequenced ${data.data?.tasks?.length || 0} tasks in ${data.data?.totalDuration || 0} days`,
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  const loadExample = (example: any) => {
    setProjectDescription(example.request.projectDescription);
    setSquareFootage(example.request.squareFootage.toString());
    setProjectType(example.request.projectType);
    setLocation(example.request.location);
    setIncludePermits(example.request.includePermits);
    setIncludeInspections(example.request.includeInspections);
  };

  const renderGanttChart = () => {
    if (!response?.data?.tasks) return null;

    const tasks = response.data.tasks;
    const totalDays = response.data.totalDuration;
    const dayWidth = 100 / Math.min(totalDays, 30);

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Timeline
          </CardTitle>
          <CardDescription>Visual representation of task scheduling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 overflow-x-auto bg-muted/30">
            <div className="min-w-[800px]">
              {/* Day markers */}
              <div className="flex border-b pb-2 mb-4">
                {Array.from({ length: Math.min(totalDays, 30) }, (_, i) => (
                  <div
                    key={i}
                    className="text-xs text-muted-foreground"
                    style={{ width: `${dayWidth}%` }}
                  >
                    D{i + 1}
                  </div>
                ))}
                {totalDays > 30 && (
                  <div className="text-xs text-muted-foreground ml-2">
                    ... Day {totalDays}
                  </div>
                )}
              </div>

              {/* Tasks */}
              {tasks.slice(0, 12).map((task: any) => (
                <div key={task.id} className="flex items-center mb-2">
                  <div className="w-48 text-sm truncate pr-4" title={task.name}>
                    {task.name}
                  </div>
                  <div className="flex-1 relative h-8">
                    <div
                      className={`absolute h-full rounded flex items-center px-2 text-xs text-white transition-all hover:opacity-90 ${
                        task.criticalPath ? 'bg-destructive' : 'bg-primary'
                      }`}
                      style={{
                        left: `${Math.min(task.startDay, 30) * dayWidth}%`,
                        width: `${Math.min(task.duration, 30 - task.startDay) * dayWidth}%`,
                      }}
                      title={`${task.duration} days`}
                    >
                      {task.duration}d
                    </div>
                  </div>
                </div>
              ))}
              {tasks.length > 12 && (
                <div className="text-sm text-muted-foreground mt-2">
                  ... and {tasks.length - 12} more tasks
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">API Playground</h1>
        <p className="text-muted-foreground">
          Test the Construction Sequencer API with real-time responses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Request Builder</CardTitle>
            <CardDescription>Configure your API request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Example Buttons */}
            <div>
              <Label>Load Example</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(exampleRequests).map(([key, example]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example)}
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Currently in public beta - use "public-beta" for testing
              </p>
            </div>

            {/* Project Description */}
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your construction project..."
                rows={4}
              />
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sqft">Square Footage</Label>
                <Input
                  id="sqft"
                  type="number"
                  value={squareFootage}
                  onChange={(e) => setSquareFootage(e.target.value)}
                  placeholder="e.g., 1500"
                />
              </div>
              <div>
                <Label htmlFor="type">Project Type</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                    <SelectItem value="addition">Addition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Toronto, ON"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="permits"
                  checked={includePermits}
                  onCheckedChange={setIncludePermits}
                />
                <Label htmlFor="permits">Include Permits</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="inspections"
                  checked={includeInspections}
                  onCheckedChange={setIncludeInspections}
                />
                <Label htmlFor="inspections">Include Inspections</Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={callAPI}
              disabled={loading || !projectDescription}
              className="w-full"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                <><Play className="mr-2 h-4 w-4" /> Send Request</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Response */}
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>API response will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {response && (
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-2xl font-bold">{response.data?.totalDuration}</p>
                          <p className="text-xs text-muted-foreground">Total Days</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-2xl font-bold">{response.data?.tasks?.length}</p>
                          <p className="text-xs text-muted-foreground">Tasks</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-2xl font-bold">{response.data?.phases?.length}</p>
                          <p className="text-xs text-muted-foreground">Phases</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* JSON Response */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>JSON Response</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-auto max-h-96">
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                  </div>
                </div>

                {/* Request ID */}
                {response.requestId && (
                  <div className="text-xs text-muted-foreground">
                    Request ID: {response.requestId}
                  </div>
                )}
              </div>
            )}

            {!response && !error && (
              <div className="text-center text-muted-foreground py-12">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure your request and click Send to see the response</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gantt Chart */}
      {response && renderGanttChart()}
    </div>
  );
}