import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2, Zap, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            <span className="font-bold text-xl">fireapi.dev</span>
          </div>
          <nav className="flex gap-6">
            <Link to="/playground" className="hover:text-primary">Playground</Link>
            <Link to="/docs" className="hover:text-primary">Documentation</Link>
            <Button variant="outline">Get API Key</Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4">Currently in Public Beta</Badge>
        <h1 className="text-5xl font-bold mb-4">
          Professional Construction Project<br />Sequencing API
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Intelligent trade management and work sequencing for construction projects. Power your
          construction management applications with our comprehensive API.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/playground">
            <Button size="lg">
              Try API Playground <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/docs">
            <Button size="lg" variant="outline">View Documentation</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Smart Sequencing</h3>
              <p className="text-muted-foreground">
                Automatically generate optimized work sequences based on trade dependencies and project requirements.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Building Code Compliance</h3>
              <p className="text-muted-foreground">
                Ensures proper sequencing according to regional building codes and inspection requirements.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Globe className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">RESTful API</h3>
              <p className="text-muted-foreground">
                Clean, well-documented REST endpoints with JSON responses. Easy integration with any platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* API Endpoint Preview */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Simple Integration</h2>
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <pre>{`POST https://fireapi.dev/v1/construction-sequencer

{
  "projectDescription": "Kitchen renovation with new cabinets",
  "squareFootage": 200,
  "projectType": "renovation",
  "includePermits": true
}`}</pre>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
