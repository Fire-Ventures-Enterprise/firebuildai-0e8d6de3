import { useEffect, useState } from 'react';
import { GitCommit, Globe, Server } from 'lucide-react';

interface DeploymentInfo {
  id: string;
  sha: string;
  timestamp: string;
  environment: string;
}

export const DeploymentInfo = () => {
  const [deploymentInfo, setDeploymentInfo] = useState<DeploymentInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get deployment info from environment variables or build-time injection
    const deploymentId = import.meta.env.VITE_DEPLOYMENT_ID || 'local-dev';
    const commitSha = import.meta.env.VITE_GIT_SHA || import.meta.env.VITE_COMMIT_SHA || 'unknown';
    const buildTime = import.meta.env.VITE_BUILD_TIME || new Date().toISOString();
    const appMode = import.meta.env.VITE_APP_MODE || import.meta.env.VITE_ADMIN_MODE ? 'admin' : import.meta.env.VITE_MARKETING_MODE ? 'marketing' : 'app';

    setDeploymentInfo({
      id: deploymentId,
      sha: commitSha.substring(0, 7),
      timestamp: buildTime,
      environment: appMode
    });

    // Log deployment info to console for verification
    console.log('Deployment:', deploymentId);
    console.log('Commit SHA:', commitSha);
    console.log('Build Time:', buildTime);
    console.log('Environment:', appMode);
  }, []);

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'marketing':
        return 'text-blue-500';
      case 'app':
        return 'text-green-500';
      case 'admin':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const getEnvironmentUrl = (env: string) => {
    switch (env) {
      case 'marketing':
        return 'https://firebuild.ai';
      case 'app':
        return 'https://app.firebuild.ai';
      case 'admin':
        return 'https://admin.firebuild.ai';
      default:
        return window.location.origin;
    }
  };

  if (!deploymentInfo) return null;

  return (
    <>
      {/* Deployment Badge - Bottom Right */}
      <div 
        className="fixed bottom-4 right-4 z-50"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <button
          className="bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 shadow-lg hover:bg-background transition-all"
          title="Deployment Info"
        >
          <GitCommit className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Expanded Info Panel */}
        {isVisible && (
          <div className="absolute bottom-12 right-0 bg-background border border-border rounded-lg shadow-xl p-4 min-w-[280px] animate-in fade-in slide-in-from-bottom-2">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Server className="h-4 w-4" />
              Deployment Information
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Environment:</span>
                <span className={`font-mono ${getEnvironmentColor(deploymentInfo.environment)}`}>
                  {deploymentInfo.environment.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Deployment ID:</span>
                <span className="font-mono text-foreground">
                  {deploymentInfo.id.split('-').slice(0, 2).join('-')}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Commit:</span>
                <a 
                  href={`https://github.com/your-org/firebuildai/commit/${deploymentInfo.sha}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-primary hover:underline"
                >
                  {deploymentInfo.sha}
                </a>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">URL:</span>
                <a 
                  href={getEnvironmentUrl(deploymentInfo.environment)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  Live Site
                </a>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Deployed:</span>
                <span className="text-foreground">
                  {new Date(deploymentInfo.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <a 
                href="https://github.com/your-org/firebuildai/actions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center justify-center gap-1"
              >
                View Deployment Logs →
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};