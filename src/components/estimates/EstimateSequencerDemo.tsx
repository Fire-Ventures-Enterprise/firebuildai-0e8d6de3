import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { sequenceLineItems, getPhaseGroups } from '@/utils/constructionSequencer';
import { ChevronRight, Clock, Hammer, CheckCircle2 } from 'lucide-react';
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
      demolition: 'bg-red-100 text-red-800',
      site_prep: 'bg-orange-100 text-orange-800',
      framing: 'bg-amber-100 text-amber-800',
      electrical_rough: 'bg-yellow-100 text-yellow-800',
      plumbing_rough: 'bg-blue-100 text-blue-800',
      drywall: 'bg-gray-100 text-gray-800',
      cabinets: 'bg-purple-100 text-purple-800',
      countertops: 'bg-indigo-100 text-indigo-800',
      backsplash: 'bg-cyan-100 text-cyan-800',
      electrical_finish: 'bg-yellow-100 text-yellow-800',
      plumbing_finish: 'bg-blue-100 text-blue-800',
      painting: 'bg-pink-100 text-pink-800',
      cleanup: 'bg-green-100 text-green-800',
      final_inspection: 'bg-emerald-100 text-emerald-800'
    };
    return colors[phase] || 'bg-gray-100 text-gray-800';
  };

  const formatPhaseName = (phase: string) => {
    return phase.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Construction Estimate Sequencer</CardTitle>
          <CardDescription>
            Paste your estimate text to automatically sequence it in proper construction order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Estimate Text (paste or edit below)
            </label>
            <Textarea
              value={estimateText}
              onChange={(e) => setEstimateText(e.target.value)}
              placeholder="Paste your estimate text here (one item per line)..."
              className="min-h-[400px] font-mono text-xs leading-relaxed resize-vertical"
              rows={20}
            />
          </div>
          
          <Button 
            onClick={parseEstimate}
            className="w-full"
            size="lg"
          >
            <Hammer className="mr-2 h-4 w-4" />
            Parse & Sequence Estimate
          </Button>
        </CardContent>
      </Card>

      {isParsed && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Original Parsed Items</CardTitle>
              <CardDescription>
                {parsedItems.length} line items extracted from estimate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {parsedItems.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground w-8">{idx + 1}.</span>
                    <span className="flex-1">{item.description}</span>
                    <Badge variant="outline">{item.quantity} {item.unit}</Badge>
                    {item.total > 0 && (
                      <span className="font-medium">${item.total.toFixed(2)}</span>
                    )}
                  </div>
                ))}
                {parsedItems.length > 5 && (
                  <div className="text-sm text-muted-foreground pt-2">
                    ... and {parsedItems.length - 5} more items
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sequenced Construction Phases</CardTitle>
              <CardDescription>
                Items automatically organized into {sequencedPhases.length} construction phases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sequencedPhases.map((phase, phaseIdx) => (
                  <div key={phase.phase} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getPhaseIcon(phase.phase)}</span>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Phase {phaseIdx + 1}: {formatPhaseName(phase.phase)}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getPhaseColor(phase.phase)}>
                              {phase.items.length} items
                            </Badge>
                            {phase.total > 0 && (
                              <span className="text-sm text-muted-foreground">
                                ${phase.total.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Order: {phase.phaseOrder}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {phase.items.map((item: any, itemIdx: number) => (
                        <div key={itemIdx} className="flex items-start gap-2 pl-4 text-sm">
                          <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="flex-1">{item.description}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.quantity} {item.unit}
                            </Badge>
                            {item.total > 0 && (
                              <span className="font-medium">${item.total.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Ready for Work Order Generation</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This sequenced estimate can now be converted into properly ordered work orders for each trade.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}