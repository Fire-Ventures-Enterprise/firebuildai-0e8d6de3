import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  FileText, 
  Layers, 
  Play, 
  Code, 
  Eye,
  Clock,
  Users,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Hammer,
  HardHat,
  Paintbrush,
  Wrench,
  Zap,
  Home,
  Building,
  TreePine
} from "lucide-react";
import { sequenceLineItems, getPhaseGroups, detectProjectType } from "@/utils/constructionSequencer";
import { cn } from "@/lib/utils";

interface ParsedItem {
  description: string;
  quantity?: number;
  unit?: string;
  rate?: number;
  total?: number;
}

interface PhaseData {
  phase: string;
  items: any[];
  duration: number;
  dependencies: string[];
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
}

export function EnhancedSequencer() {
  const [estimateText, setEstimateText] = useState("");
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [sequencedPhases, setSequencedPhases] = useState<PhaseData[]>([]);
  const [isParsed, setIsParsed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [projectType, setProjectType] = useState("");
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const parseEstimate = async () => {
    setIsProcessing(true);
    
    // Parse the estimate text
    const lines = estimateText.split('\n').filter(line => line.trim());
    const items = lines.map(line => {
      const match = line.match(/^(.*?)(?:\s+(\d+(?:\.\d+)?)\s*(\w+))?\s*(?:@\s*\$?([\d,]+(?:\.\d+)?))?\s*(?:=\s*\$?([\d,]+(?:\.\d+)?))?$/);
      if (match) {
        return {
          description: match[1]?.trim() || line,
          quantity: match[2] ? parseFloat(match[2]) : undefined,
          unit: match[3],
          rate: match[4] ? parseFloat(match[4].replace(/,/g, '')) : undefined,
          total: match[5] ? parseFloat(match[5].replace(/,/g, '')) : undefined
        };
      }
      return { description: line };
    });

    setParsedItems(items);

    // Detect project type and sequence items
    const detectedType = detectProjectType(items);
    setProjectType(detectedType);

    const sequenced = await sequenceLineItems(items.map(i => i.description));
    const phases = getPhaseGroups(sequenced);
    
    // Enhanced phase data with progress and status
    const enhancedPhases = phases.map((phase, idx) => ({
      ...phase,
      duration: Math.ceil(phase.items.length / 2), // Estimate duration
      dependencies: idx > 0 ? [phases[idx - 1].phase] : [],
      progress: idx === 0 ? 35 : 0,
      status: idx === 0 ? 'in-progress' as const : 'pending' as const
    }));

    setSequencedPhases(enhancedPhases);
    setIsParsed(true);
    setIsProcessing(false);
  };

  const getPhaseIcon = (phase: string) => {
    const icons: Record<string, JSX.Element> = {
      'Site Preparation': <TreePine className="w-5 h-5" />,
      'Foundation': <Building className="w-5 h-5" />,
      'Framing': <Home className="w-5 h-5" />,
      'Mechanical': <Wrench className="w-5 h-5" />,
      'Electrical': <Zap className="w-5 h-5" />,
      'Insulation': <Layers className="w-5 h-5" />,
      'Drywall': <HardHat className="w-5 h-5" />,
      'Painting': <Paintbrush className="w-5 h-5" />,
      'Finishing': <Hammer className="w-5 h-5" />
    };
    return icons[phase] || <Layers className="w-5 h-5" />;
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      'Site Preparation': 'from-amber-500/20 to-amber-600/20 border-amber-500/30',
      'Foundation': 'from-gray-500/20 to-gray-600/20 border-gray-500/30',
      'Framing': 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
      'Mechanical': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      'Electrical': 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
      'Insulation': 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
      'Drywall': 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      'Painting': 'from-green-500/20 to-green-600/20 border-green-500/30',
      'Finishing': 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30'
    };
    return colors[phase] || 'from-slate-500/20 to-slate-600/20 border-slate-500/30';
  };

  const getTotalAmount = () => {
    return parsedItems.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const getCodeOutput = () => {
    return JSON.stringify({
      projectType,
      totalCost: getTotalAmount(),
      totalDuration: sequencedPhases.reduce((sum, p) => sum + p.duration, 0),
      phases: sequencedPhases.map(p => ({
        name: p.phase,
        items: p.items.length,
        duration: p.duration,
        dependencies: p.dependencies
      }))
    }, null, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Construction Sequencer
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered construction workflow optimization
            </p>
          </div>
          <Badge variant="secondary" className="px-4 py-2">
            {projectType || "No Project Type"}
          </Badge>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input Panel */}
          <div className="space-y-4">
            <Card className="shadow-2xl border bg-card/60 backdrop-blur-md">
              <CardHeader className="bg-gradient-to-br from-background to-muted/30 rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Estimate Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <Textarea
                  value={estimateText}
                  onChange={(e) => setEstimateText(e.target.value)}
                  placeholder="Paste your estimate text here..."
                  className="min-h-[400px] font-mono text-sm bg-background/60 border-muted"
                />
                <Button 
                  onClick={parseEstimate}
                  disabled={!estimateText.trim() || isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Sequence Estimate
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            {isParsed && (
              <Card className="shadow-xl border bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-md">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Items</p>
                      <p className="text-2xl font-bold">{parsedItems.length}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="text-2xl font-bold">
                        ${getTotalAmount().toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Phases</p>
                      <p className="text-2xl font-bold">{sequencedPhases.length}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-2xl font-bold">
                        {sequencedPhases.reduce((sum, p) => sum + p.duration, 0)} weeks
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Output Panel */}
          <div className="space-y-4">
            {isParsed ? (
              <Card className="shadow-2xl border bg-card/60 backdrop-blur-md h-full">
                <CardHeader className="bg-gradient-to-br from-background to-muted/30 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Sequenced Workflow
                    </CardTitle>
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                      <TabsList>
                        <TabsTrigger value="visual">
                          <Eye className="w-4 h-4 mr-2" />
                          Visual
                        </TabsTrigger>
                        <TabsTrigger value="code">
                          <Code className="w-4 h-4 mr-2" />
                          Code
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="p-6 max-h-[600px] overflow-y-auto">
                  {viewMode === 'visual' ? (
                    <div className="space-y-4">
                      {sequencedPhases.map((phase, idx) => (
                        <div
                          key={phase.phase}
                          className={cn(
                            "relative p-4 rounded-xl border-2 bg-gradient-to-br transition-all duration-300 cursor-pointer",
                            getPhaseColor(phase.phase),
                            selectedPhase === phase.phase ? "ring-2 ring-primary" : "hover:scale-[1.02]"
                          )}
                          onClick={() => setSelectedPhase(phase.phase === selectedPhase ? null : phase.phase)}
                        >
                          {/* Phase Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-background/60 rounded-lg">
                                {getPhaseIcon(phase.phase)}
                              </div>
                              <div>
                                <h3 className="font-semibold">{phase.phase}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {phase.duration} weeks
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {phase.items.length} tasks
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant={phase.status === 'completed' ? 'default' : 
                                      phase.status === 'in-progress' ? 'secondary' : 'outline'}
                            >
                              {phase.status}
                            </Badge>
                          </div>

                          {/* Progress Bar */}
                          {phase.status === 'in-progress' && (
                            <Progress value={phase.progress} className="h-2 mb-3" />
                          )}

                          {/* Items (shown when selected) */}
                          {selectedPhase === phase.phase && (
                            <div className="mt-4 space-y-2 animate-fade-in">
                              {phase.items.slice(0, 5).map((item, itemIdx) => (
                                <div 
                                  key={itemIdx}
                                  className="flex items-center gap-2 text-sm p-2 bg-background/40 rounded-lg"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                                  <span>{item.description}</span>
                                </div>
                              ))}
                              {phase.items.length > 5 && (
                                <p className="text-sm text-muted-foreground pl-6">
                                  +{phase.items.length - 5} more items
                                </p>
                              )}
                            </div>
                          )}

                          {/* Connection Line */}
                          {idx < sequencedPhases.length - 1 && (
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                              <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <pre className="bg-background/60 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{getCodeOutput()}</code>
                    </pre>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl border bg-card/60 backdrop-blur-md h-full min-h-[600px] flex items-center justify-center">
                <CardContent className="text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Enter an estimate to see the AI-optimized sequence
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}