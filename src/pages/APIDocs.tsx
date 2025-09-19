import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, Shield, Zap, Code2, Globe, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function APIDocs() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">API Documentation</h1>
        <p className="text-muted-foreground">
          Complete reference for the Construction Sequencer API
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="outline">v1.0.0</Badge>
          <Badge className="bg-green-500">Production Ready</Badge>
          <Badge variant="secondary">RESTful API</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                AI-powered construction project sequencing API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <Zap className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Intelligent Sequencing</h4>
                      <p className="text-sm text-muted-foreground">
                        AI analyzes project descriptions and generates optimized task sequences
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Building Code Compliance</h4>
                      <p className="text-sm text-muted-foreground">
                        Ensures proper sequencing according to construction regulations
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Cpu className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Dependency Mapping</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically identifies task dependencies and critical paths
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Globe className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Regional Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Adapts to location-specific building codes and regulations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Base URL</h3>
                <code className="bg-muted px-3 py-2 rounded block">
                  https://fireapi.dev/v1
                </code>
                <p className="text-sm text-muted-foreground mt-2">
                  Currently using Supabase Edge Functions. Custom domain coming soon.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Rate Limits</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Public Beta</span>
                    <Badge>100 requests/minute</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Basic (Coming Soon)</span>
                    <Badge variant="outline">1,000 requests/hour</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Pro (Coming Soon)</span>
                    <Badge variant="outline">10,000 requests/hour</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>POST /construction-sequencer</CardTitle>
              <CardDescription>
                Generate optimized construction task sequence from project description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm">{`{
  "projectDescription": "string (required)",
  "squareFootage": number,
  "projectType": "residential" | "commercial" | "renovation" | "addition",
  "location": "string",
  "estimatedBudget": number,
  "includePermits": boolean,
  "includeInspections": boolean
}`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Response</h4>
                <div className="bg-muted rounded-lg p-4 overflow-auto">
                  <pre className="text-sm">{`{
  "success": boolean,
  "data": {
    "project": {
      "name": "string",
      "type": "string",
      "squareFootage": number,
      "estimatedDuration": number,
      "phases": [{
        "name": "string",
        "duration": number,
        "taskCount": number
      }]
    },
    "tasks": [{
      "id": "string",
      "name": "string",
      "description": "string",
      "phase": "string",
      "duration": number,
      "dependencies": ["string"],
      "trade": "string",
      "criticalPath": boolean,
      "startDay": number,
      "endDay": number,
      "inspectionRequired": boolean,
      "permitRequired": boolean
    }],
    "criticalPath": ["string"],
    "totalDuration": number,
    "inspections": [{
      "type": "string",
      "afterTask": "string",
      "estimatedDay": number
    }],
    "permits": [{
      "type": "string",
      "requiredBefore": "string"
    }]
  },
  "requestId": "string",
  "timestamp": "string"
}`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Headers</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Header</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>Content-Type</code></td>
                      <td className="py-2">Required</td>
                      <td className="py-2">application/json</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>X-API-Key</code></td>
                      <td className="py-2">Optional</td>
                      <td className="py-2">Your API key (use "public-beta" for testing)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Secure your API requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  The API is currently in public beta. No authentication required for testing.
                  Use "public-beta" as your API key.
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-2">API Key Authentication (Coming Soon)</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Include your API key in the request headers:
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm">{`X-API-Key: your-api-key-here`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">OAuth 2.0 (Planned)</h4>
                <p className="text-sm text-muted-foreground">
                  OAuth 2.0 authentication will be available for enterprise customers,
                  allowing secure delegated access to the API.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Quick start with popular languages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">JavaScript/TypeScript</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(`const response = await fetch('https://fireapi.dev/v1/construction-sequencer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    projectDescription: "Kitchen renovation with new cabinets and appliances",
    squareFootage: 200,
    projectType: "renovation",
    location: "Toronto, ON",
    includePermits: true,
    includeInspections: true
  })
});

const data = await response.json();
console.log(data);`)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="bg-muted rounded-lg p-4 overflow-auto">
                  <pre className="text-sm">{`const response = await fetch('https://fireapi.dev/v1/construction-sequencer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    projectDescription: "Kitchen renovation with new cabinets and appliances",
    squareFootage: 200,
    projectType: "renovation",
    location: "Toronto, ON",
    includePermits: true,
    includeInspections: true
  })
});

const data = await response.json();
console.log(data);`}</pre>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Python</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(`import requests

url = "https://fireapi.dev/v1/construction-sequencer"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "your-api-key"
}
payload = {
    "projectDescription": "Kitchen renovation with new cabinets and appliances",
    "squareFootage": 200,
    "projectType": "renovation",
    "location": "Toronto, ON",
    "includePermits": True,
    "includeInspections": True
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(data)`)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="bg-muted rounded-lg p-4 overflow-auto">
                  <pre className="text-sm">{`import requests

url = "https://fireapi.dev/v1/construction-sequencer"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "your-api-key"
}
payload = {
    "projectDescription": "Kitchen renovation with new cabinets and appliances",
    "squareFootage": 200,
    "projectType": "renovation",
    "location": "Toronto, ON",
    "includePermits": True,
    "includeInspections": True
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(data)`}</pre>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">cURL</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(`curl -X POST https://fireapi.dev/v1/construction-sequencer \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{
    "projectDescription": "Kitchen renovation with new cabinets and appliances",
    "squareFootage": 200,
    "projectType": "renovation",
    "location": "Toronto, ON",
    "includePermits": true,
    "includeInspections": true
  }'`)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="bg-muted rounded-lg p-4 overflow-auto">
                  <pre className="text-sm">{`curl -X POST https://fireapi.dev/v1/construction-sequencer \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{
    "projectDescription": "Kitchen renovation with new cabinets and appliances",
    "squareFootage": 200,
    "projectType": "renovation",
    "location": "Toronto, ON",
    "includePermits": true,
    "includeInspections": true
  }'`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Handling</CardTitle>
              <CardDescription>
                Understanding API error responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Error Response Format</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm">{`{
  "success": false,
  "error": "Error message describing what went wrong",
  "requestId": "unique-request-id",
  "timestamp": "2024-01-15T10:30:00Z"
}`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">HTTP Status Codes</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Code</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>200</code></td>
                      <td className="py-2">Success - Request processed successfully</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>400</code></td>
                      <td className="py-2">Bad Request - Invalid request parameters</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>401</code></td>
                      <td className="py-2">Unauthorized - Invalid or missing API key</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>429</code></td>
                      <td className="py-2">Too Many Requests - Rate limit exceeded</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>500</code></td>
                      <td className="py-2">Internal Server Error - Something went wrong</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Common Error Messages</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded">
                    <p className="font-medium text-sm">Project description is required</p>
                    <p className="text-xs text-muted-foreground">
                      The projectDescription field must be provided in the request body
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="font-medium text-sm">Project description must be less than 5000 characters</p>
                    <p className="text-xs text-muted-foreground">
                      The project description exceeds the maximum allowed length
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="font-medium text-sm">Rate limit exceeded</p>
                    <p className="text-xs text-muted-foreground">
                      You've exceeded the allowed number of requests. Please wait before trying again
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}