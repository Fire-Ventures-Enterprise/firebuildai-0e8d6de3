import { Youtube, Download, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import firebuildDashboard from "@/assets/firebuild-dashboard-preview.jpg";

export default function TutorialsPage() {
  return (
    <MarketingLayout>
      <section className="container mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tutorials & Product Tour</h1>
          <p className="text-xl text-muted-foreground">
            See how FireBuildAI streamlines jobs, purchase orders, estimates, invoices, and expenses.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Placeholder */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden border bg-card aspect-video relative group cursor-pointer">
              {/* Background Image */}
              <div 
                className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                style={{
                  backgroundImage: `url(${firebuildDashboard})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay'
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  {/* YouTube Play Button */}
                  <div className="relative">
                    <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center group-hover:bg-red-700 transition-colors">
                      <svg
                        className="w-10 h-10 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Coming Soon Text */}
                  <h2 className="text-white text-2xl font-bold mt-6">Video Coming Soon</h2>
                  <p className="text-white/80 mt-2">We're creating an amazing tutorial for you</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                disabled
                className="px-4 py-2 rounded-md text-sm font-medium bg-secondary/50 text-secondary-foreground cursor-not-allowed opacity-50"
              >
                <Youtube className="inline-block w-4 h-4 mr-2" />
                Watch Tutorial (Coming Soon)
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Coming Soon Info */}
            <div className="border rounded-xl p-6 bg-card">
              <div className="font-semibold mb-4 flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-600" />
                Tutorial Topics (Coming Soon)
              </div>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">• Introduction & Platform Overview</li>
                <li className="text-sm text-muted-foreground">• Job-Based Chat & Communication</li>
                <li className="text-sm text-muted-foreground">• Purchase Orders & Payment Processing</li>
                <li className="text-sm text-muted-foreground">• Estimates to Invoices Workflow</li>
                <li className="text-sm text-muted-foreground">• Receipt Capture & OCR Technology</li>
                <li className="text-sm text-muted-foreground">• Mobile App & QR Code Pairing</li>
                <li className="text-sm text-muted-foreground">• Analytics & Reporting Dashboard</li>
                <li className="text-sm text-muted-foreground">• Team Management & Permissions</li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="border rounded-xl p-6 bg-card space-y-3">
              <h3 className="font-semibold mb-2">Ready to get started?</h3>
              <Link 
                to="/download" 
                className="block rounded-md bg-primary text-primary-foreground text-center font-medium py-3 hover:bg-primary/90 transition-colors"
              >
                <Download className="inline-block w-4 h-4 mr-2" />
                Download the App
              </Link>
              <Link 
                to="/#contact" 
                className="block rounded-md bg-secondary text-secondary-foreground text-center font-medium py-3 hover:bg-secondary/80 transition-colors"
              >
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Book a Demo
              </Link>
            </div>

            {/* Additional Resources */}
            <div className="border rounded-xl p-6 bg-card">
              <h3 className="font-semibold mb-3">More Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://youtube.com/@firebuildai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    YouTube Channel →
                  </a>
                </li>
                <li>
                  <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">
                    Help Center →
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog & Updates →
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Description */}
        <div className="mt-12 border rounded-xl p-6 bg-card">
          <h2 className="font-semibold text-lg mb-4">About FireBuildAI</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p>
              Welcome to FireBuildAI - the complete construction management platform that transforms how contractors run their business.
            </p>
            <p className="mt-4">
              Our comprehensive platform covers everything from job management to invoicing, expense tracking to team collaboration. 
              FireBuildAI is designed specifically for contractors and construction professionals who want to streamline their operations, 
              reduce paperwork, and increase profitability.
            </p>
            <p className="mt-4">
              The platform combines powerful desktop tools with mobile capabilities, ensuring you stay connected whether you're in the 
              office or on the job site. Make data-driven decisions with our comprehensive analytics dashboard, manage permissions and 
              access controls for your entire team, and grow your business with confidence.
            </p>
            <p className="mt-4 font-semibold">
              Ready to transform your contracting business? Start your free trial today and see why thousands of contractors trust FireBuildAI.
            </p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}