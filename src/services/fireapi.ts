// FireAPI.dev Integration Service
// Connects FireBuild.ai to the FireAPI construction intelligence platform

const CONFIG = {
  FIREAPI_BASE: 'https://fireapi.dev/api/v1', // Live API endpoint
  API_KEY: 'demo-key', // Request your API key at fireapi.dev
  ENABLE_FIREAPI: true,
  FALLBACK_TO_DEMO: true,
  DEFAULT_REGION: 'toronto'
};

const headers = {
  'Authorization': `Bearer ${CONFIG.API_KEY}`,
  'Content-Type': 'application/json',
  'User-Agent': 'FireBuild.AI/1.0'
};

// Health check for FireAPI availability
export async function checkFireAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${CONFIG.FIREAPI_BASE}/health`, { headers });
    const result = await response.json();
    return result.success && result.data.status === 'healthy';
  } catch (error) {
    console.warn('FireAPI health check failed:', error);
    return false;
  }
}

// Project Analysis Integration
export async function analyzeProjectWithFireAPI(
  description: string, 
  region: string = CONFIG.DEFAULT_REGION
) {
  const response = await fetch(`${CONFIG.FIREAPI_BASE}/construction/complete-analysis`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      description,
      region,
      options: {
        includeOptimizations: true,
        includeCompliance: true,
        includeRisks: true
      }
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    return {
      projectId: result.data.projectId,
      projectType: result.data.analysis.projectType,
      complexity: result.data.analysis.complexity,
      estimatedCost: result.data.costs.totalEstimate,
      timeline: result.data.workflow.estimatedDuration,
      tasks: result.data.workflow.tasks,
      recommendations: result.data.insights.recommendations
    };
  }
  
  throw new Error(result.error?.message || 'Analysis failed');
}

// Workflow Generation Integration
export async function generateWorkflowWithFireAPI(
  projectType: string, 
  projectDetails: any, 
  region: string
) {
  const response = await fetch(`${CONFIG.FIREAPI_BASE}/workflows/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      projectType,
      projectDetails,
      region,
      options: {
        includeCriticalPath: true,
        includeInspections: true,
        optimizeParallelTasks: true
      }
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    return {
      tasks: result.data.workflow.tasks.map((task: any) => ({
        id: task.id,
        name: task.name,
        duration: task.duration,
        dependencies: task.dependencies,
        category: task.category,
        inspection_required: task.inspection_required || false
      })),
      criticalPath: result.data.workflow.criticalPath,
      totalDuration: result.data.summary.estimatedDuration,
      optimizations: result.data.optimizations
    };
  }
  
  throw new Error(result.error?.message || 'Workflow generation failed');
}

// Cost Estimation Integration
export async function estimateCostsWithFireAPI(
  projectType: string, 
  tasks: any[], 
  region: string, 
  materials: any[] = []
) {
  const response = await fetch(`${CONFIG.FIREAPI_BASE}/costs/estimate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      projectType,
      tasks,
      region,
      materials,
      options: {
        includeContingency: true,
        includeProfitMargin: true,
        marketConditions: 'normal'
      }
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    return {
      totalCost: result.data.estimate.totalCost,
      breakdown: {
        materials: result.data.breakdown.materials,
        labor: result.data.breakdown.labor,
        permits: result.data.breakdown.permits,
        contingency: result.data.breakdown.contingency
      },
      confidence: result.data.estimate.confidence,
      regionalMultiplier: result.data.regionalFactors.multiplier,
      recommendations: result.data.recommendations
    };
  }
  
  throw new Error(result.error?.message || 'Cost estimation failed');
}

// Construction Sequencer API
export async function sequenceConstructionTasks(
  items: string[], 
  projectType?: string
) {
  try {
    const response = await fetch(`${CONFIG.FIREAPI_BASE}/construction/sequence`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        items,
        projectType,
        options: {
          optimizeSchedule: true,
          detectDependencies: true,
          includeInspections: true
        }
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      return {
        phases: result.data.phases,
        timeline: result.data.timeline,
        criticalPath: result.data.criticalPath,
        totalDuration: result.data.totalDuration
      };
    }
    
    throw new Error(result.error?.message || 'Sequencing failed');
  } catch (error) {
    // Fallback to local sequencing if API fails
    console.warn('FireAPI sequencing failed, using local fallback:', error);
    throw error;
  }
}

// Graceful fallback wrapper
export async function analyzeProjectWithFallback(
  description: string, 
  region: string,
  fallbackFn?: (description: string) => any
) {
  if (!CONFIG.ENABLE_FIREAPI) {
    return fallbackFn ? fallbackFn(description) : null;
  }

  try {
    // Try FireAPI first
    return await analyzeProjectWithFireAPI(description, region);
  } catch (error) {
    console.warn('FireAPI unavailable, using fallback:', error);
    
    if (CONFIG.FALLBACK_TO_DEMO && fallbackFn) {
      return fallbackFn(description);
    }
    
    throw error;
  }
}

// Export configuration for components to check status
export const fireAPIConfig = CONFIG;