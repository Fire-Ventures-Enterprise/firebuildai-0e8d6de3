// Domain-based marketing strategy routing
export type MarketingStrategy = 
  | 'main-marketing'
  | 'industry-specific'
  | 'problem-solution'
  | 'geographic'
  | 'competitive'
  | 'educational'
  | 'interactive-demo'
  | 'event'
  | 'mobile-first'
  | 'seasonal'
  | 'redirect';

export interface CampaignConfig {
  id: string;
  type: MarketingStrategy;
  industry?: 'residential' | 'commercial' | 'specialty-trades';
  problem?: 'cost-overruns' | 'missed-deadlines' | 'poor-communication';
  region?: string;
  competitor?: string;
  event?: string;
  season?: 'new-year' | 'busy-season' | 'end-of-year';
}

export const getDomainStrategy = (): 'primary' | 'secondary' => {
  if (typeof window === 'undefined') return 'primary';
  
  const hostname = window.location.hostname;
  
  if (hostname.includes('firebuild.ai')) {
    return 'primary';
  } else if (hostname.includes('firebuildai.com')) {
    return 'secondary';
  }
  
  // Default for localhost and other domains
  return 'primary';
};

export const getCampaignFromURL = (): CampaignConfig | null => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const campaign = urlParams.get('campaign');
  const industry = urlParams.get('industry');
  const problem = urlParams.get('problem');
  const region = urlParams.get('region');
  const competitor = urlParams.get('competitor');
  const event = urlParams.get('event');
  const season = urlParams.get('season');
  const type = urlParams.get('type') as MarketingStrategy;
  
  if (!campaign && !type) return null;
  
  return {
    id: campaign || 'direct',
    type: type || 'main-marketing',
    industry: industry as any,
    problem: problem as any,
    region,
    competitor,
    event,
    season: season as any,
  };
};

export const getMarketingRoute = () => {
  const domainStrategy = getDomainStrategy();
  const campaign = getCampaignFromURL();
  const pathname = window.location.pathname;
  
  // Primary domain (firebuild.ai) - always show main marketing
  if (domainStrategy === 'primary') {
    return { 
      component: 'HomePage',
      campaign: null 
    };
  }
  
  // Secondary domain (firebuildai.com) - route based on campaign or path
  if (campaign) {
    switch (campaign.type) {
      case 'industry-specific':
        return { 
          component: 'IndustryLandingPage',
          campaign 
        };
      case 'problem-solution':
        return { 
          component: 'ProblemSolutionPage',
          campaign 
        };
      case 'geographic':
        return { 
          component: 'GeographicLandingPage',
          campaign 
        };
      case 'competitive':
        return { 
          component: 'CompetitivePage',
          campaign 
        };
      case 'educational':
        return { 
          component: 'EducationalHub',
          campaign 
        };
      case 'interactive-demo':
        return { 
          component: 'InteractiveDemoPage',
          campaign 
        };
      case 'event':
        return { 
          component: 'EventLandingPage',
          campaign 
        };
      case 'mobile-first':
        return { 
          component: 'MobileCampaignPage',
          campaign 
        };
      case 'seasonal':
        return { 
          component: 'SeasonalCampaignPage',
          campaign 
        };
      case 'redirect':
        return { 
          component: 'LegacyDomainPage',
          campaign 
        };
      default:
        return { 
          component: 'AlternativeHomePage',
          campaign 
        };
    }
  }
  
  // Path-based routing for secondary domain
  if (pathname.includes('/residential')) {
    return { 
      component: 'IndustryLandingPage',
      campaign: { id: 'residential', type: 'industry-specific', industry: 'residential' }
    };
  }
  
  if (pathname.includes('/commercial')) {
    return { 
      component: 'IndustryLandingPage',
      campaign: { id: 'commercial', type: 'industry-specific', industry: 'commercial' }
    };
  }
  
  if (pathname.includes('/trades')) {
    return { 
      component: 'IndustryLandingPage',
      campaign: { id: 'trades', type: 'industry-specific', industry: 'specialty-trades' }
    };
  }
  
  // Default for secondary domain
  return { 
    component: 'AlternativeHomePage',
    campaign: null
  };
};