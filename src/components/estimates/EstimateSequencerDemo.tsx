import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { sequenceLineItems, getPhaseGroups } from '@/utils/constructionSequencer';
import { 
  ChevronRight, 
  Clock, 
  Hammer, 
  CheckCircle2,
  Sparkles,
  FileText,
  DollarSign,
  Layers,
  ArrowRight,
  Zap,
  Activity
} from 'lucide-react';
import { EXAMPLE_KITCHEN_ESTIMATE } from '@/data/exampleKitchenEstimate';

interface ParsedItem {
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
}

export function EstimateSequencerDemo() {
  const [estimateText, setEstimateText] = useState(EXAMPLE_KITCHEN_ESTIMATE);
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [sequencedPhases, setSequencedPhases] = useState<any[]>([]);
  const [isParsed, setIsParsed] = useState(false);

  const parseEstimate = () => {
    const lines = estimateText.split('\n');
    const items: ParsedItem[] = [];
    
    lines.forEach(line => {
      // Match lines with the format: description | Quantity: X | Unit: X | Rate: $X | Amount: $X
      const match = line.match(/^\d+\.\s+(.+?)\s*(?:Quantity:\s*(\d+(?:\.\d+)?)\s*\|\s*Unit:\s*(\w+)\s*\|\s*Rate:\s*\$?([\d,]+(?:\.\d+)?)\s*\|\s*Amount:\s*\$?([\d,]+(?:\.\d+)?))?/);
      
      if (match) {
        const [, description, quantity, unit, rate, amount] = match;
        items.push({
          description: description.trim(),
          quantity: parseFloat(quantity || '1'),
          unit: unit || 'EA',
          rate: parseFloat((rate || '0').replace(/,/g, '')),
          total: parseFloat((amount || '0').replace(/,/g, ''))
        });
      }
      
      // Also try to match simpler format without pipes
      const simpleMatch = line.match(/^\d+\.\s+(.+?)\s*-\s*(.+?)$/);
      if (simpleMatch && !match) {
        const [, mainDesc, details] = simpleMatch;
        items.push({
          description: `${mainDesc} - ${details}`,
          quantity: 1,
          unit: 'LS',
          rate: 0,
          total: 0
        });
      }
    });

    if (items.length > 0) {
      const sequenced = sequenceLineItems(items);
      const phases = getPhaseGroups(sequenced);
      setParsedItems(items);
      setSequencedPhases(phases);
      setIsParsed(true);
    }
  };

  const getPhaseIcon = (phase: string) => {
    if (phase.includes('demo')) return '🔨';
    if (phase.includes('fram') || phase.includes('rough')) return '🏗️';
    if (phase.includes('cabinet')) return '🗄️';
    if (phase.includes('counter')) return '🪨';
    if (phase.includes('electric')) return '⚡';
    if (phase.includes('plumb')) return '🚿';
    if (phase.includes('paint')) return '🎨';
    if (phase.includes('clean') || phase.includes('final')) return '✅';
    return '📋';
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      demolition: 'bg-destructive/10 text-destructive border-destructive/20',
      site_prep: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
      framing: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      electrical_rough: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      plumbing_rough: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      drywall: 'bg-muted text-muted-foreground border-muted-foreground/20',
      cabinets: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
      countertops: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
      backsplash: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
      electrical_finish: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      plumbing_finish: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      painting: 'bg-pink-500/10 text-pink-700 border-pink-500/20',
      cleanup: 'bg-green-500/10 text-green-700 border-green-500/20',
      final_inspection: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
    };
    return colors[phase] || 'bg-muted text-muted-foreground border-muted-foreground/20';
  };

  const formatPhaseName = (phase: string) => {
    return phase.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getTotalAmount = () => {
    return parsedItems.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          AI-Powered Estimates in 5 Minutes
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          From product descriptions to detailed estimates with automated workflow sequencing. 
          <span className="font-medium"> FireBuild.ai </span> constructs client proposals and manages your workflow.
        </p>
      </div>

      {/* Main Input Card */}
      <Card className="shadow-xl border bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-4 bg-gradient-to-br from-background to-muted/20 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Generate Smart Estimate</CardTitle>
              <CardDescription className="text-base mt-1">
                Paste your estimate text to automatically sequence it in proper construction order
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">
              Estimate Details
            </label>
            <Textarea
              value={estimateText}
              onChange={(e) => setEstimateText(e.target.value)}
              placeholder="Paste your estimate text here (one item per line)..."
              className="min-h-[250px] font-mono text-sm leading-relaxed resize-vertical border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              rows={15}
            />
          </div>
          
          <Button 
            onClick={parseEstimate}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            <Zap className="mr-2 h-5 w-5" />
            Generate AI Estimates & Sequence
          </Button>
        </CardContent>
      </Card>

      {isParsed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Estimate Card */}
          <Card className="shadow-xl border bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 h-fit">
            <CardHeader className="pb-4 bg-gradient-to-br from-background to-muted/20 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Project Estimate</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {parsedItems.length} line items extracted
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-muted/30 to-muted/50 rounded-lg border">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold">{parsedItems.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${getTotalAmount().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Line Items Preview */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {parsedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-muted-foreground font-medium min-w-[24px]">{idx + 1}.</span>
                      <span className="flex-1 text-sm">{item.description}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {item.quantity} {item.unit}
                        </Badge>
                        {item.total > 0 && (
                          <span className="font-semibold text-sm">${item.total.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI-Optimized Timeline Card */}
          <Card className="shadow-xl border bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 h-fit">
            <CardHeader className="pb-4 bg-gradient-to-br from-background to-muted/20 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Layers className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">AI-Optimized Timeline</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {sequencedPhases.length} construction phases
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {sequencedPhases.map((phase, phaseIdx) => (
                  <div key={phase.phase} className="p-4 border rounded-lg bg-card/50 hover:shadow-lg hover:bg-card/80 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-1">{getPhaseIcon(phase.phase)}</span>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-base">
                            Phase {phaseIdx + 1}: {formatPhaseName(phase.phase)}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getPhaseColor(phase.phase)} border`}>
                              {phase.items.length} tasks
                            </Badge>
                            {phase.total > 0 && (
                              <Badge variant="outline" className="font-mono">
                                ${phase.total.toFixed(2)}
                              </Badge>
                            )}
                            <Badge variant="outline" className="gap-1">
                              <Clock className="h-3 w-3" />
                              Day {phase.phaseOrder}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Collapsible items */}
                    <details className="group">
                      <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                        View tasks
                      </summary>
                      <div className="mt-3 space-y-2 pl-4 border-l-2 border-muted ml-4">
                        {phase.items.map((item: any, itemIdx: number) => (
                          <div key={itemIdx} className="flex items-start gap-2 text-sm">
                            <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="flex-1">{item.description}</span>
                            <span className="font-medium text-muted-foreground">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Message */}
      {isParsed && (
        <Card className="shadow-xl border border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10 hover:shadow-2xl transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  See AI Workflow Sequencing in Action
                </h3>
                <p className="text-muted-foreground">
                  FireBuild.ai intelligently arranges your estimates into properly sequenced construction phases, ensuring optimal workflow and timeline management.
                </p>
              </div>
              <Button size="lg" className="gap-2">
                Create Work Orders
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}