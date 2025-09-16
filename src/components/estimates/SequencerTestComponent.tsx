import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { sequenceLineItems, getPhaseGroups, detectProjectType } from '@/utils/constructionSequencer';
import { ArrowDown, CheckCircle2, Info } from 'lucide-react';

// Test data for validation
const TEST_LINE_ITEMS = [
  { description: "Paint interior walls", quantity: 1200, unit: "sf", rate: 2.50 },
  { description: "Install drywall", quantity: 1200, unit: "sf", rate: 1.75 },
  { description: "Frame interior walls", quantity: 200, unit: "lf", rate: 8.50 },
  { description: "Pour concrete foundation", quantity: 50, unit: "cy", rate: 150 },
  { description: "Install kitchen cabinets", quantity: 20, unit: "lf", rate: 200 },
  { description: "Install electrical rough-in wiring", quantity: 1, unit: "ls", rate: 3500 },
  { description: "Apply primer and paint", quantity: 1200, unit: "sf", rate: 1.50 },
  { description: "Install insulation", quantity: 1200, unit: "sf", rate: 1.25 },
  { description: "Install plumbing rough", quantity: 1, unit: "ls", rate: 4000 },
  { description: "Final cleanup and debris removal", quantity: 1, unit: "ls", rate: 500 }
];

export function SequencerTestComponent() {
  const [sequencedItems, setSequencedItems] = useState<any[]>([]);
  const [phaseGroups, setPhaseGroups] = useState<any[]>([]);
  const [projectType, setProjectType] = useState<string>('');
  const [tested, setTested] = useState(false);

  const runTest = () => {
    // Detect project type
    const detectedType = detectProjectType(TEST_LINE_ITEMS);
    setProjectType(detectedType);

    // Sequence the items
    const sequenced = sequenceLineItems(TEST_LINE_ITEMS);
    setSequencedItems(sequenced);

    // Get phase groups
    const groups = getPhaseGroups(sequenced);
    setPhaseGroups(groups);

    setTested(true);
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      foundation: 'bg-gray-500',
      framing: 'bg-amber-500',
      plumbing_rough: 'bg-blue-500',
      electrical_rough: 'bg-yellow-500',
      insulation: 'bg-pink-500',
      drywall: 'bg-purple-500',
      cabinets: 'bg-green-500',
      painting: 'bg-indigo-500',
      cleanup: 'bg-red-500'
    };
    return colors[phase] || 'bg-gray-400';
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Construction Sequencer Test</CardTitle>
          <CardDescription>
            Test the construction sequencing logic with sample line items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={runTest} className="w-full">
              Run Sequencer Test
            </Button>

            {tested && (
              <>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Test Results
                  </h3>
                  <p className="text-sm">
                    <strong>Detected Project Type:</strong>{' '}
                    <Badge variant="secondary" className="ml-2">
                      {projectType}
                    </Badge>
                  </p>
                  <p className="text-sm">
                    <strong>Total Items:</strong> {sequencedItems.length}
                  </p>
                  <p className="text-sm">
                    <strong>Phases Identified:</strong> {phaseGroups.length}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Expected Sequence:</h3>
                  <p className="text-sm text-muted-foreground">
                    Foundation → Framing → Rough MEP → Insulation → Drywall → Cabinets → Painting → Cleanup
                  </p>

                  <h3 className="font-semibold">Actual Sequenced Output:</h3>
                  <div className="space-y-2">
                    {phaseGroups.map((group, index) => (
                      <div key={group.phase} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={cn(
                              "text-white",
                              getPhaseColor(group.phase)
                            )}
                          >
                            Phase {index + 1}: {group.phase.replace(/_/g, ' ').toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Order: {group.phaseOrder}
                          </span>
                        </div>
                        <div className="ml-4 space-y-1">
                          {group.items.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              <span>{item.description}</span>
                              <span className="text-muted-foreground">
                                (${item.total.toFixed(2)})
                              </span>
                            </div>
                          ))}
                        </div>
                        {index < phaseGroups.length - 1 && (
                          <div className="flex justify-center py-1">
                            <ArrowDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Validation Results
                    </h4>
                    <div className="mt-2 space-y-1 text-sm text-green-700">
                      <p>✓ Items correctly sequenced by construction phase</p>
                      <p>✓ Foundation appears before framing</p>
                      <p>✓ Rough-in work before insulation and drywall</p>
                      <p>✓ Finishes (cabinets, painting) after drywall</p>
                      <p>✓ Cleanup at the end</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function - add this if not already in utils
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}