import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Smartphone, Check, Camera, FileText, MapPin, Clock, Wifi, Download, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export const MobileAppPage = () => {
  useEffect(() => {
    document.title = "Mobile Construction App - Work From Anywhere | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Mobile construction app for contractors. Access everything from the field, capture photos, create estimates, track time, and manage jobs on any device.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full">
              <Smartphone className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-medium">Mobile App</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Work From <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">Anywhere</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Full-featured mobile app for iOS and Android. Access everything from the field - create estimates, track time, capture photos, and manage your business on the go.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};