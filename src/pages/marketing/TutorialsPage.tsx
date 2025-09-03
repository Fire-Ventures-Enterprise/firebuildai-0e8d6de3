import { useMemo, useRef, useState } from "react";
import { Play, Youtube, Clock, ChevronRight, Download, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

type Chapter = { t: number; label: string }; // seconds

const YT_ID = "dQw4w9WgXcQ"; // Replace with your actual YouTube video ID
const CDN_MP4 = ""; // Optional: "https://cdn.firebuildai.com/marketing/overview.mp4"
const POSTER = "/lovable-uploads/c78f53fd-e549-485e-a133-aad2f54a5823.png"; // Using existing logo as placeholder

const CHAPTERS: Chapter[] = [
  { t: 0, label: "Introduction & Platform Overview" },
  { t: 25, label: "Job-Based Chat & Communication" },
  { t: 60, label: "Purchase Orders & Payment Processing" },
  { t: 105, label: "Estimates to Invoices Workflow" },
  { t: 155, label: "Receipt Capture & OCR Technology" },
  { t: 195, label: "Mobile App & QR Code Pairing" },
  { t: 240, label: "Analytics & Reporting Dashboard" },
  { t: 280, label: "Team Management & Permissions" },
];

const TRANSCRIPT = `Welcome to FireBuildAI - the complete construction management platform that transforms how contractors run their business.

In this comprehensive tutorial, we'll walk you through every feature of our platform, from job management to invoicing, expense tracking to team collaboration.

[Introduction - 0:00]
FireBuildAI is designed specifically for contractors and construction professionals who want to streamline their operations, reduce paperwork, and increase profitability. Our platform combines powerful desktop tools with mobile capabilities, ensuring you stay connected whether you're in the office or on the job site.

[Job-Based Chat - 0:25]
Communication is critical in construction. Our job-based chat system keeps all conversations organized by project. No more searching through text messages or emails - everything related to a specific job is in one place. Team members can share photos, documents, and updates in real-time.

[Purchase Orders & Payments - 1:00]
Managing purchase orders has never been easier. Create, track, and approve POs with just a few clicks. Our integrated payment system supports multiple payment methods and automatically syncs with your accounting. Track vendor payments, manage approvals, and maintain a complete audit trail.

[Estimates to Invoices - 1:45]
Convert estimates to invoices with one click. Our smart system remembers your pricing, terms, and customer preferences. Add line items, apply discounts, and track payment schedules. The platform automatically calculates taxes and generates professional documents your clients will appreciate.

[Receipt Capture & OCR - 2:35]
Stop losing receipts! Our mobile app uses advanced OCR technology to instantly capture and categorize expenses. Simply snap a photo, and our AI extracts vendor information, amounts, and dates. Expenses are automatically matched to jobs and categories for accurate cost tracking.

[Mobile App & QR Pairing - 3:15]
Our mobile app extends your office to the field. Use QR code pairing for instant setup - no complicated configuration required. Access all your jobs, capture receipts, communicate with your team, and even process payments from your phone.

[Analytics & Reporting - 4:00]
Make data-driven decisions with our comprehensive analytics dashboard. Track profitability by job, monitor cash flow, identify your best customers, and spot trends. Custom reports help you understand exactly where your business stands.

[Team Management - 4:40]
Manage permissions and access controls for your entire team. Assign roles, set approval limits, and track individual performance. Our system grows with your business, from solo contractors to large teams.

Ready to transform your contracting business? Start your free trial today and see why thousands of contractors trust FireBuildAI.`;

export default function TutorialsPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [useCdn, setUseCdn] = useState(Boolean(CDN_MP4));

  const ytUrl = useMemo(() => `https://www.youtube-nocookie.com/embed/${YT_ID}?rel=0&modestbranding=1`, []);
  const ytWatch = useMemo(() => `https://youtu.be/${YT_ID}?utm_source=site&utm_medium=tutorials`, []);

  const seek = (t: number) => {
    if (useCdn && videoRef.current) {
      videoRef.current.currentTime = t;
      videoRef.current.play().catch(() => {});
    } else {
      window.open(`https://youtu.be/${YT_ID}?t=${t}`, "_blank");
    }
    
    // Analytics event
    window.dispatchEvent(new CustomEvent("analytics", { 
      detail: { ev: "chapter_click", chapter: CHAPTERS.find(c => c.t === t)?.label, time: t } 
    }));
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const r = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${r}`;
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/lovable-uploads/a384a2f8-9029-4efd-b9db-d6facfe2369c.png" alt="FireBuild.ai" className="h-8 w-8" />
              <span className="font-bold text-xl">FireBuild.ai</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/tutorials" className="text-foreground font-medium">Tutorials</Link>
              <Link to="/download" className="text-muted-foreground hover:text-foreground transition-colors">Download</Link>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link>
              <Link to="/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tutorials & Product Tour</h1>
          <p className="text-xl text-muted-foreground">
            See how FireBuildAI streamlines jobs, purchase orders, estimates, invoices, and expenses.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden border bg-card aspect-video">
              {useCdn && CDN_MP4 ? (
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  controls
                  preload="metadata"
                  poster={POSTER}
                  onPlay={() => window.dispatchEvent(new CustomEvent("analytics", { detail: { ev: "video_play", src: "cdn" } }))}
                >
                  <source src={CDN_MP4} type="video/mp4" />
                  <iframe
                    title="FireBuildAI Tutorial"
                    className="w-full h-full"
                    src={ytUrl}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </video>
              ) : (
                <iframe
                  title="FireBuildAI Tutorial"
                  className="w-full h-full"
                  src={ytUrl}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={() => window.dispatchEvent(new CustomEvent("analytics", { detail: { ev: "video_impression", src: "youtube" } }))}
                />
              )}
            </div>

            <div className="flex gap-3 mt-4">
              {CDN_MP4 && (
                <button
                  onClick={() => setUseCdn(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    useCdn 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Play className="inline-block w-4 h-4 mr-2" />
                  Play Locally
                </button>
              )}
              <a
                href={ytWatch}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center ${
                  !useCdn && CDN_MP4
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                onClick={() => CDN_MP4 && setUseCdn(false)}
              >
                <Youtube className="w-4 h-4 mr-2" />
                Watch on YouTube
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Chapters */}
            <div className="border rounded-xl p-6 bg-card">
              <div className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Chapters
              </div>
              <ul className="space-y-2">
                {CHAPTERS.map((c) => (
                  <li key={c.t}>
                    <button
                      onClick={() => seek(c.t)}
                      className="text-sm hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-muted-foreground">{formatTime(c.t)}</span>
                      <span>{c.label}</span>
                    </button>
                  </li>
                ))}
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
                  <a href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                    Help Center →
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog & Updates →
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Transcript */}
        <details className="mt-12 border rounded-xl p-6 bg-card">
          <summary className="cursor-pointer font-semibold text-lg hover:text-primary transition-colors">
            Video Transcript
          </summary>
          <div className="mt-4 prose prose-sm max-w-none text-muted-foreground">
            <pre className="whitespace-pre-wrap font-sans">{TRANSCRIPT}</pre>
          </div>
        </details>

        {/* VideoObject JSON-LD */}
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": "FireBuildAI Complete Product Tour & Tutorial",
              "description": "Comprehensive overview of FireBuildAI's construction management platform including job-based chat, purchase orders, estimates to invoices workflow, OCR receipt capture, and mobile app features.",
              "thumbnailUrl": [POSTER],
              "uploadDate": "2025-08-31",
              "duration": "PT5M20S",
              "embedUrl": ytUrl,
              "contentUrl": CDN_MP4 || undefined,
              "publisher": { 
                "@type": "Organization", 
                "name": "FireBuildAI", 
                "logo": { 
                  "@type": "ImageObject", 
                  "url": "https://firebuildai.com/lovable-uploads/c78f53fd-e549-485e-a133-aad2f54a5823.png" 
                } 
              }
            })
          }} 
        />
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link to="/tutorials" className="hover:text-foreground">Tutorials</Link></li>
                <li><Link to="/download" className="hover:text-foreground">Download</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/about" className="hover:text-foreground">About</a></li>
                <li><a href="/blog" className="hover:text-foreground">Blog</a></li>
                <li><a href="/careers" className="hover:text-foreground">Careers</a></li>
                <li><a href="/contact" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/help" className="hover:text-foreground">Help Center</a></li>
                <li><a href="/docs" className="hover:text-foreground">Documentation</a></li>
                <li><a href="/api" className="hover:text-foreground">API</a></li>
                <li><a href="/status" className="hover:text-foreground">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy" className="hover:text-foreground">Privacy</a></li>
                <li><a href="/terms" className="hover:text-foreground">Terms</a></li>
                <li><a href="/security" className="hover:text-foreground">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 FireBuildAI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}