import { useEffect, useState } from "react";
import { useCompanySettings } from "@/hooks/useCompanySettings";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className = "", width = 200, height = 56 }: LogoProps) => {
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
  
  // Use the correct logo based on theme
  // The light logo should be used in light mode, dark logo in dark mode
  const logoSrc = isDarkMode 
    ? '/lovable-uploads/6051e38e-b331-47c4-b218-10bea1030315.png'  // dark logo
    : '/lovable-uploads/467a434f-0eee-4143-bd64-3d716cce95b1.png'; // light logo
  
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