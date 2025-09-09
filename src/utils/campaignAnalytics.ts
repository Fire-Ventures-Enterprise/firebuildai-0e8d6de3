// Analytics tracking for marketing campaigns
import { getCampaignFromURL, getDomainStrategy } from './marketingStrategy';

export interface CampaignEvent {
  event_name: string;
  campaign_id?: string;
  campaign_type?: string;
  domain: string;
  industry?: string;
  problem?: string;
  region?: string;
  competitor?: string;
  event?: string;
  season?: string;
  action: string;
  value?: number;
  metadata?: Record<string, any>;
}

class CampaignAnalytics {
  private queue: CampaignEvent[] = [];
  private isInitialized = false;
  
  initialize() {
    if (this.isInitialized) return;
    
    // Track page view on initialization
    this.trackPageView();
    
    // Set up listeners
    this.setupListeners();
    
    this.isInitialized = true;
  }
  
  private setupListeners() {
    // Track time on page
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      this.track('page_exit', { time_on_page: timeOnPage });
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
          this.track('scroll_depth', { depth: maxScroll });
        }
      }
    });
  }
  
  trackPageView() {
    const campaign = getCampaignFromURL();
    const domain = getDomainStrategy();
    
    this.track('page_view', {
      path: window.location.pathname,
      referrer: document.referrer,
      campaign_id: campaign?.id,
      campaign_type: campaign?.type,
      domain_strategy: domain,
    });
  }
  
  track(action: string, metadata?: Record<string, any>) {
    const campaign = getCampaignFromURL();
    const event: CampaignEvent = {
      event_name: 'campaign_action',
      campaign_id: campaign?.id,
      campaign_type: campaign?.type,
      domain: window.location.hostname,
      industry: campaign?.industry,
      problem: campaign?.problem,
      region: campaign?.region,
      competitor: campaign?.competitor,
      event: campaign?.event,
      season: campaign?.season,
      action,
      metadata,
    };
    
    // Add to queue
    this.queue.push(event);
    
    // Send to analytics (implement your analytics provider here)
    this.sendToAnalytics(event);
  }
  
  trackConversion(type: 'signup' | 'demo' | 'trial' | 'contact', value?: number) {
    this.track('conversion', {
      conversion_type: type,
      conversion_value: value,
      timestamp: new Date().toISOString(),
    });
  }
  
  trackEngagement(type: 'video_play' | 'calculator_use' | 'demo_interaction' | 'download', metadata?: Record<string, any>) {
    this.track('engagement', {
      engagement_type: type,
      ...metadata,
    });
  }
  
  private sendToAnalytics(event: CampaignEvent) {
    // Implement your analytics provider here
    // Examples: Google Analytics, Mixpanel, Segment, etc.
    
    // Google Analytics 4 example:
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event_name, {
        ...event,
        custom_timestamp: Date.now(),
      });
    }
    
    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Campaign Analytics:', event);
    }
  }
  
  getSessionData() {
    return {
      queue: this.queue,
      session_duration: Date.now() - parseInt(sessionStorage.getItem('session_start') || '0'),
      page_views: this.queue.filter(e => e.action === 'page_view').length,
      conversions: this.queue.filter(e => e.action === 'conversion'),
    };
  }
}

export const campaignAnalytics = new CampaignAnalytics();