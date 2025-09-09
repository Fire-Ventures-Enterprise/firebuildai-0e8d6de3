// Domain detection utility
export const getCurrentDomain = () => {
  if (typeof window === 'undefined') return 'firebuild.ai';
  
  const hostname = window.location.hostname;
  
  // Check if it's the old .com domain
  if (hostname.includes('firebuildai.com')) {
    return 'firebuildai.com';
  }
  
  // Default to .ai domain (includes localhost and firebuild.ai)
  return 'firebuild.ai';
};

export const isLegacyDomain = () => {
  return getCurrentDomain() === 'firebuildai.com';
};

export const isPrimaryDomain = () => {
  return getCurrentDomain() === 'firebuild.ai';
};