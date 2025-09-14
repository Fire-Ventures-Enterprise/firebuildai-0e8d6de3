import { HelmetProvider } from 'react-helmet-async';
import { ReactNode } from 'react';

interface AppHelmetProviderProps {
  children: ReactNode;
}

export function AppHelmetProvider({ children }: AppHelmetProviderProps) {
  return <HelmetProvider>{children}</HelmetProvider>;
}