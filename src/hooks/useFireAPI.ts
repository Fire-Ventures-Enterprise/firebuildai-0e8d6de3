import { useState, useEffect } from 'react';
import { useAsyncToast } from './useAsyncToast';
import {
  checkFireAPIHealth,
  analyzeProjectWithFireAPI,
  generateWorkflowWithFireAPI,
  estimateCostsWithFireAPI,
  sequenceConstructionTasks,
  analyzeProjectWithFallback,
  fireAPIConfig
} from '@/services/fireapi';

export function useFireAPI() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { run } = useAsyncToast();

  // Check FireAPI health on mount
  useEffect(() => {
    if (fireAPIConfig.ENABLE_FIREAPI) {
      checkFireAPIHealth().then(setIsHealthy);
    }
  }, []);

  const analyzeProject = async (description: string, region?: string) => {
    setIsLoading(true);
    try {
      const result = await run(
        analyzeProjectWithFireAPI,
        [description, region || fireAPIConfig.DEFAULT_REGION],
        {
          pending: 'Analyzing project with AI...',
          success: 'Project analysis complete',
          error: 'Failed to analyze project'
        }
      );
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const generateWorkflow = async (
    projectType: string,
    projectDetails: any,
    region?: string
  ) => {
    setIsLoading(true);
    try {
      const result = await run(
        generateWorkflowWithFireAPI,
        [projectType, projectDetails, region || fireAPIConfig.DEFAULT_REGION],
        {
          pending: 'Generating optimized workflow...',
          success: 'Workflow generated successfully',
          error: 'Failed to generate workflow'
        }
      );
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const estimateCosts = async (
    projectType: string,
    tasks: any[],
    region?: string,
    materials?: any[]
  ) => {
    setIsLoading(true);
    try {
      const result = await run(
        estimateCostsWithFireAPI,
        [projectType, tasks, region || fireAPIConfig.DEFAULT_REGION, materials],
        {
          pending: 'Calculating costs...',
          success: 'Cost estimate ready',
          error: 'Failed to estimate costs'
        }
      );
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const sequenceTasks = async (items: string[], projectType?: string) => {
    setIsLoading(true);
    try {
      const result = await run(
        sequenceConstructionTasks,
        [items, projectType],
        {
          pending: 'Sequencing construction tasks...',
          success: 'Tasks sequenced successfully',
          error: 'Failed to sequence tasks'
        }
      );
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeWithFallback = async (
    description: string,
    region?: string,
    fallbackFn?: (description: string) => any
  ) => {
    setIsLoading(true);
    try {
      const result = await analyzeProjectWithFallback(
        description,
        region || fireAPIConfig.DEFAULT_REGION,
        fallbackFn
      );
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Status
    isHealthy,
    isLoading,
    isEnabled: fireAPIConfig.ENABLE_FIREAPI,
    
    // API Methods
    analyzeProject,
    generateWorkflow,
    estimateCosts,
    sequenceTasks,
    analyzeWithFallback,
    
    // Configuration
    config: fireAPIConfig
  };
}