import { useEffect, useState } from "react";
import { getLogoUrl } from "@/config/branding.config";
import { useCompanySettings } from "@/hooks/useCompanySettings";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className = "", width = 160, height = 45 }: LogoProps) => {
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
          width: width, 
          height: height,
          minWidth: width,
          minHeight: height
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
  const companyName = settings?.company_name || 'FireBuild.ai';

  return (
    <img 
      src={logoSrc} 
      alt={companyName}
      className={className}
      width={width}
      height={height}
      style={{ 
        objectFit: 'contain',
        display: 'block'
      }}
      onError={(e) => {
        console.error('Logo failed to load:', logoSrc);
        // Create a text fallback
        const parent = e.currentTarget.parentElement;
        if (parent) {
          e.currentTarget.style.display = 'none';
          const textElement = document.createElement('span');
          textElement.className = 'text-xl font-bold text-foreground';
          textElement.textContent = companyName;
          parent.appendChild(textElement);
        }
      }}
    />
  );
};