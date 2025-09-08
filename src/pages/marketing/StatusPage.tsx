import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { R } from "@/routes/routeMap";
import { CheckCircle, AlertCircle, XCircle, Activity } from "lucide-react";

const services = [
  { name: "Web Application", status: "operational", uptime: "99.98%" },
  { name: "API", status: "operational", uptime: "99.99%" },
  { name: "Database", status: "operational", uptime: "100%" },
  { name: "Payment Processing", status: "operational", uptime: "99.95%" },
  { name: "Email Service", status: "operational", uptime: "99.97%" },
  { name: "File Storage", status: "operational", uptime: "100%" }
];

const incidents = [
  {
    date: "2024-01-10",
    title: "Brief API Latency",
    status: "resolved",
    duration: "15 minutes",
    description: "Some API requests experienced increased latency. Issue has been resolved."
  },
  {
    date: "2024-01-05",
    title: "Scheduled Maintenance",
    status: "completed",
    duration: "2 hours",
    description: "Planned database maintenance completed successfully."
  }
];

export const StatusPage = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "outage":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to={R.home} className="text-2xl font-bold text-primary">
              FireBuild.ai
            </Link>
            <div className="flex items-center gap-4">
              <Link to={R.home}>
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to={R.contact}>
                <Button variant="ghost">Contact</Button>
              </Link>
              <Button variant="outline">Subscribe to Updates</Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Overall Status */}
      <section className="py-12 bg-green-50 dark:bg-green-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h1 className="text-4xl font-bold">All Systems Operational</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </section>

      {/* Service Status */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Service Status</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {services.map((service, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {service.status === "operational" ? "Operational" : "Issues detected"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{service.uptime}</p>
                    <p className="text-xs text-muted-foreground">30-day uptime</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Incidents</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {incidents.map((incident, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{incident.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{incident.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      incident.status === "resolved" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {incident.status}
                    </span>
                    <span className="text-sm text-muted-foreground">{incident.duration}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{incident.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get real-time updates about service status
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Subscribe to Updates</Button>
            <Button size="lg" variant="outline">View History</Button>
          </div>
        </div>
      </section>
    </div>
  );
};