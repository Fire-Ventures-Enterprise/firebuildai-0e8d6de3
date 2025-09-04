import { useEffect } from 'react';

export const HealthCheck = () => {
  useEffect(() => {
    // Simple health check endpoint response
    document.body.textContent = 'OK';
  }, []);
  
  return null;
};

export default HealthCheck;