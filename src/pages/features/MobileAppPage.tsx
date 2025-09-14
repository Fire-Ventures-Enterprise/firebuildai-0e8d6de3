import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Smartphone, 
  Check, 
  Camera, 
  FileText, 
  MapPin, 
  Clock, 
  Wifi, 
  Download, 
  ArrowRight,
  Star,
  Users,
  Shield,
  Battery,
  Cloud,
  Bell
} from "lucide-react";
import { useEffect } from "react";

export const MobileAppPage = () => {
  useEffect(() => {
    document.title = "Mobile Construction App - Work From Anywhere | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Mobile construction app for contractors. Access everything from the field, capture photos, create estimates, track time, and manage jobs on any device.');
    }
  }, []);

  const benefits = [
    "Work offline anywhere with full functionality",
    "Real-time sync across all devices instantly",
    "GPS time tracking with automatic location verification",
    "Photo documentation with project organization",
    "Digital signatures for instant approvals",
    "Push notifications for job updates and messages",
    "Voice-to-text for quick note taking",
    "Barcode scanning for material tracking"
  ];

  const features = [
    {
      icon: Camera,
      title: "Photo & Video Capture",
      description: "Document job progress with unlimited photo and video storage. Automatically organize by project and date."
    },
    {
      icon: Clock,
      title: "Time & Attendance",
      description: "Track crew hours with GPS verification. Generate accurate timesheets and payroll reports automatically."
    },
    {
      icon: FileText,
      title: "Digital Forms & Documents",
      description: "Create estimates, invoices, and work orders on-site. Get digital signatures and send instantly."
    },
    {
      icon: MapPin,
      title: "GPS & Navigation",
      description: "Get directions to job sites, track mileage automatically, and monitor crew locations in real-time."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full">
                <Smartphone className="h-4 w-4 text-pink-500" />
                <span className="text-sm font-medium">Mobile App</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Work From{" "}
                <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                  Anywhere
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Full-featured mobile app for iOS and Android. Access everything from the field - create 
                estimates, track time, capture photos, and manage your business on the go.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Pricing
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground">Offline Ready</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">50K+</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4.8★</p>
                  <p className="text-sm text-muted-foreground">App Rating</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-pink-500/5 to-pink-600/5 border-pink-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">FireBuild Mobile</h3>
                    <span className="text-sm bg-green-500/10 text-green-600 px-2 py-1 rounded">Active</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <Camera className="h-5 w-5 text-pink-500 mb-2" />
                      <p className="text-sm font-medium">Photo Capture</p>
                      <p className="text-xs text-muted-foreground">Document instantly</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-500 mb-2" />
                      <p className="text-sm font-medium">Time Tracking</p>
                      <p className="text-xs text-muted-foreground">GPS verified</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-500 mb-2" />
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-xs text-muted-foreground">Real-time tracking</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <FileText className="h-5 w-5 text-orange-500 mb-2" />
                      <p className="text-sm font-medium">Forms</p>
                      <p className="text-xs text-muted-foreground">Digital signatures</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1 bg-pink-600 hover:bg-pink-700">
                      <Download className="mr-2 h-4 w-4" />
                      Download App
                    </Button>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-pink-500 text-white p-3 rounded-full">
                <Smartphone className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Contractors Love Our Mobile App
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <p className="text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need in Your Pocket
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete business management tools optimized for mobile. Work efficiently from any job site.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-500/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for the Field
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Wifi className="h-12 w-12 mx-auto mb-4 text-pink-500" />
              <h3 className="text-lg font-semibold mb-2">Offline Mode</h3>
              <p className="text-sm text-muted-foreground">
                Full functionality without internet. Syncs when connection returns.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Battery className="h-12 w-12 mx-auto mb-4 text-pink-500" />
              <h3 className="text-lg font-semibold mb-2">Battery Optimized</h3>
              <p className="text-sm text-muted-foreground">
                Efficient power usage for all-day work on a single charge.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-pink-500" />
              <h3 className="text-lg font-semibold mb-2">Secure & Encrypted</h3>
              <p className="text-sm text-muted-foreground">
                Bank-level security protects your business data on any device.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500/10 to-pink-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Work From Anywhere?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join 50,000+ contractors who run their business from their phone.
            Download the app and start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="min-w-[200px] bg-pink-600 hover:bg-pink-700">
              <Download className="mr-2 h-5 w-5" />
              Download for iOS
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px]">
              <Download className="mr-2 h-5 w-5" />
              Download for Android
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>4.8 Rating</span>
            </div>
            <span>•</span>
            <span>50K+ Downloads</span>
            <span>•</span>
            <span>Free Trial</span>
          </div>
        </div>
      </section>
    </div>
  );
};