import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Copy, CheckCircle2, AlertCircle, Calendar, Clock, Users } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  }
};

export default function ConstructionAPIDemo() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [customRequest, setCustomRequest] = useState(JSON.stringify(exampleRequests.kitchen.request, null, 2));
  const [includePermits, setIncludePermits] = useState(true);
  const [includeInspections, setIncludeInspections] = useState(true);
  const { toast } = useToast();

  const callAPI = async (request: any) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  const renderGanttChart = () => {
    if (!response?.data?.tasks) return null;

    const tasks = response.data.tasks;
    const totalDays = response.data.totalDuration;
    const dayWidth = 100 / totalDays;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Project Timeline
        </h3>
        <div className="border rounded-lg p-4 overflow-x-auto">
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
            </div>

            {/* Tasks */}
            {tasks.slice(0, 15).map((task: any) => (
              <div key={task.id} className="flex items-center mb-2">
                <div className="w-48 text-sm truncate pr-4">
                  {task.name}
                </div>
                <div className="flex-1 relative h-8">
                  <div
                    className={`absolute h-full rounded flex items-center px-2 text-xs text-white ${
                      task.criticalPath ? 'bg-destructive' : 'bg-primary'
                    }`}
                    style={{
                      left: `${task.startDay * dayWidth}%`,
                      width: `${task.duration * dayWidth}%`,
                    }}
                  >
                    {task.duration}d
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Construction Sequencer API</h1>
        <p className="text-muted-foreground">
          Production-ready API for intelligent construction project sequencing
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="outline">fireapi.dev</Badge>
          <Badge variant="outline">v1.0.0</Badge>
          <Badge className="bg-green-500">Production Ready</Badge>
        </div>
      </div>

      <Tabs defaultValue="demo" className="space-y-4">
        <TabsList>
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="demo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Try the API</CardTitle>
              <CardDescription>
                Select an example or customize your own request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(exampleRequests).map(([key, example]) => (
                  <Button
                    key={key}
                    variant="outline"
                    onClick={() => {
                      setCustomRequest(JSON.stringify(example.request, null, 2));
                      callAPI(example.request);
                    }}
                  >
                    {example.name}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Request Body</Label>
                <Textarea
                  value={customRequest}
                  onChange={(e) => setCustomRequest(e.target.value)}
                  className="font-mono text-sm"
                  rows={10}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={includePermits}
                    onCheckedChange={setIncludePermits}
                  />
                  <Label>Include Permits</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={includeInspections}
                    onCheckedChange={setIncludeInspections}
                  />
                  <Label>Include Inspections</Label>
                </div>
              </div>

              <Button
                onClick={() => {
                  try {
                    const req = JSON.parse(customRequest);
                    req.includePermits = includePermits;
                    req.includeInspections = includeInspections;
                    callAPI(req);
                  } catch {
                    toast({
                      title: "Invalid JSON",
                      description: "Please check your request format",
                      variant: "destructive"
                    });
                  }
                }}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  <><Play className="mr-2 h-4 w-4" /> Send Request</>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {response && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Response</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" />
                            {response.data?.totalDuration} days
                          </Badge>
                          <Badge variant="outline">
                            <Users className="mr-1 h-3 w-3" />
                            {response.data?.tasks?.length} tasks
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-auto max-h-96">
                        <pre>{JSON.stringify(response, null, 2)}</pre>
                      </div>
                    </CardContent>
                  </Card>

                  {renderGanttChart()}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Endpoint</h3>
                <code className="bg-muted px-2 py-1 rounded">
                  POST https://fireapi.dev/v1/construction-sequencer
                </code>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Request Schema</h3>
                <pre className="bg-muted rounded-lg p-4 overflow-auto">
{`{
  "projectDescription": "string (required)",
  "squareFootage": "number (optional)",
  "projectType": "string (optional)",
  "location": "string (optional)",
  "estimatedBudget": "number (optional)",
  "includePermits": "boolean (optional)",
  "includeInspections": "boolean (optional)"
}`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Response Schema</h3>
                <pre className="bg-muted rounded-lg p-4 overflow-auto">
{`{
  "success": "boolean",
  "data": {
    "project": {
      "name": "string",
      "type": "string",
      "squareFootage": "number",
      "estimatedDuration": "number",
      "phases": "Array<Phase>"
    },
    "tasks": "Array<SequencedTask>",
    "criticalPath": "Array<string>",
    "totalDuration": "number",
    "inspections": "Array<Inspection>",
    "permits": "Array<Permit>"
  },
  "error": "string (on failure)",
  "requestId": "string"
}`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>AI-powered project analysis using GPT-4</li>
                  <li>Building code compliance verification</li>
                  <li>Automatic dependency mapping</li>
                  <li>Critical path identification</li>
                  <li>Inspection scheduling</li>
                  <li>Permit requirement detection</li>
                  <li>Trade-specific task assignment</li>
                  <li>Forward scheduling algorithm</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">JavaScript/TypeScript</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(`const response = await fetch('https://fireapi.dev/v1/construction-sequencer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    projectDescription: "Kitchen renovation with new cabinets",
    squareFootage: 200,
    includePermits: true
  })
});

const data = await response.json();
console.log(data.tasks);`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="bg-muted rounded-lg p-4 overflow-auto text-sm">
{`const response = await fetch('https://fireapi.dev/v1/construction-sequencer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    projectDescription: "Kitchen renovation with new cabinets",
    squareFootage: 200,
    includePermits: true
  })
});

const data = await response.json();
console.log(data.tasks);`}
                </pre>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Python</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(`import requests

response = requests.post(
    'https://fireapi.dev/v1/construction-sequencer',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
    },
    json={
        'projectDescription': 'Kitchen renovation with new cabinets',
        'squareFootage': 200,
        'includePermits': True
    }
)

data = response.json()
print(data['tasks'])`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="bg-muted rounded-lg p-4 overflow-auto text-sm">
{`import requests

response = requests.post(
    'https://fireapi.dev/v1/construction-sequencer',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
    },
    json={
        'projectDescription': 'Kitchen renovation with new cabinets',
        'squareFootage': 200,
        'includePermits': True
    }
)

data = response.json()
print(data['tasks'])`}
                </pre>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  The API is currently in public beta. No authentication required for testing.
                  Production access will require API keys available at fireapi.dev
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}