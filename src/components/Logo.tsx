import { useEffect, useState } from "react";
import { getLogoUrl } from "@/config/branding.config";
import { useCompanySettings } from "@/hooks/useCompanySettings";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className = "", width, height }: LogoProps) => {
  const [mounted, setMounted] = useState(false);
  const { settings } = useCompanySettings();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for dark mode using document root class or media query
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                     window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);
    
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  if (!mounted) {
    return (
      <div 
        className={`bg-muted animate-pulse rounded ${className}`} 
        style={{ 
          width: width || 180, 
          height: height || 50,
          minWidth: width || 180,
          minHeight: height || 50
        }} 
      />
    );
  }
  
  // Use dynamic logo URL from configuration
  const logoSrc = getLogoUrl(
    isDarkMode ? 'dark' : 'light',
    settings?.logo_url
  );
  
  // Get company name dynamically
  const companyName = settings?.company_name || 'Your Company';

  return (
    <img 
      src={logoSrc} 
      alt={companyName}
      className={`${className} object-contain`}
      style={{ 
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        display: 'block'
      }}
      onError={(e) => {
        console.error('Logo failed to load:', logoSrc);
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};