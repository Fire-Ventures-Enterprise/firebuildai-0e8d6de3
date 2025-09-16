import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sparkles, 
  Wand2, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Package,
  Wrench,
  Truck,
  AlertTriangle
} from 'lucide-react';
import { EstimateParser } from '@/utils/estimateParser';
import { cn } from '@/lib/utils';
import { MissingItemsWarningModal } from './MissingItemsWarningModal';
import { useToast } from '@/hooks/use-toast';

interface SmartEstimateInputProps {
  onItemsExtracted: (items: any[]) => void;
  onScopeExtracted: (scope: string) => void;
  onNotesExtracted: (notes: string) => void;
  onPaymentScheduleExtracted?: (schedule: any[]) => void;
  onTermsExtracted?: (terms: string) => void;
}

export function SmartEstimateInput({ 
  onItemsExtracted, 
  onScopeExtracted, 
  onNotesExtracted,
  onPaymentScheduleExtracted,
  onTermsExtracted 
}: SmartEstimateInputProps) {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [highlightedKeywords, setHighlightedKeywords] = useState<string[]>([]);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [projectType, setProjectType] = useState('');
  const [missingItems, setMissingItems] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Real-time parsing as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.length > 10) {
        const quickItems = EstimateParser.quickParse(inputText);
        if (quickItems.length > 0) {
          setHighlightedKeywords(quickItems.map(item => item.description));
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputText]);

  const handleParse = () => {
    if (!inputText.trim()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay for UX
    setTimeout(() => {
      const result = EstimateParser.parse(inputText);
      
      setParsedItems(result.lineItems);
      
      // Filter out suggestions for items that are already in the parsed items
      const existingDescriptions = result.lineItems.map((item: any) => 
        item.description.toLowerCase().replace(/[^a-z\s]/g, '')
      );
      
      const filteredSuggestions = (result.suggestions || []).filter(suggestion => {
        const cleanSuggestion = suggestion.replace('⚠️ ', '').toLowerCase().replace(/[^a-z\s]/g, '');
        return !existingDescriptions.some((desc: string) => 
          desc.includes(cleanSuggestion.split(' ').slice(0, 3).join(' ')) ||
          cleanSuggestion.split(' ').slice(0, 3).join(' ').includes(desc)
        );
      });
      
      setSuggestions(filteredSuggestions);
      
      // Check for critical missing items
      const criticalMissing = filteredSuggestions.filter(s => s.startsWith('⚠️'));
      
      if (criticalMissing.length > 0) {
        // Prepare missing items for modal
        const items = filteredSuggestions.map(suggestion => ({
          description: suggestion,
          critical: suggestion.startsWith('⚠️'),
          suggestedPrice: undefined
        }));
        
        setMissingItems(items);
        
        // Detect project type for modal
        const detectedType = EstimateParser.detectProjectType(inputText, result.lineItems);
        setProjectType(detectedType);
        
        setShowWarningModal(true);
      } else {
        // No critical items missing, proceed normally
        proceedWithEstimate(result);
      }
      
      setIsProcessing(false);
    }, 500);
  };

  const proceedWithEstimate = (result: any) => {
    setShowPreview(true);
    
    // Pass data to parent with proper formatting
    const formattedItems = result.lineItems.map((item: any) => ({
      description: item.description,
      quantity: item.quantity || 1,
      rate: item.rate || 0,
      amount: (item.quantity || 1) * (item.rate || 0)
    }));
    
    onItemsExtracted(formattedItems);
    onScopeExtracted(result.scopeOfWork);
    onNotesExtracted(result.notes);
    
    // Extract payment schedule if available
    if (result.paymentSchedule && onPaymentScheduleExtracted) {
      onPaymentScheduleExtracted(result.paymentSchedule);
    }
    
    // Extract terms if available
    if (result.termsAndConditions && onTermsExtracted) {
      onTermsExtracted(result.termsAndConditions);
    }
    
    toast({
      title: "Estimate parsed successfully",
      description: `${result.lineItems.length} line items extracted`,
    });
  };

  const handleAddMissingItems = (items: any[]) => {
    // Add selected missing items to the parsed items
    const newItems = items.map(item => {
      const cleanDescription = item.description.replace('⚠️ ', '');
      const price = item.suggestedPrice || 0;
      return {
        description: cleanDescription,
        quantity: 1,
        rate: price,
        amount: price,
        category: 'general'
      };
    });
    
    // Insert items in the correct sequence based on construction workflow
    const updatedItems = insertItemsInSequence(parsedItems, newItems);
    setParsedItems(updatedItems);
    
    // Re-process with added items
    const result = {
      lineItems: updatedItems,
      scopeOfWork: '',
      notes: '',
      suggestions: suggestions.filter(s => !items.some(i => i.description === s))
    };
    
    proceedWithEstimate(result);
    setShowWarningModal(false);
    
    toast({
      title: "Items added",
      description: `${items.length} missing items have been added to your estimate`,
    });
  };

  // Helper function to insert items in the correct construction sequence
  const insertItemsInSequence = (existingItems: any[], newItems: any[]) => {
    const result = [...existingItems];
    
    // Define construction sequence order (from start to finish)
    const sequenceOrder = [
      // Site prep and foundation
      'permit', 'demolition', 'excavation', 'grading', 'footings', 'foundation', 'concrete',
      // Structural
      'framing', 'frame', 'studs', 'trusses', 'sheathing', 'roofing', 'roof',
      // Roof and Exterior Details (added soffit, fascia, eaves here)
      'soffit', 'fascia', 'eaves', 'ventilation', 'gutters', 'downspouts',
      // Exterior
      'siding', 'exterior', 'windows', 'doors', 'garage door',
      // MEP (Mechanical, Electrical, Plumbing) - Rough-in
      'plumbing rough', 'electrical rough', 'hvac rough', 'rough-in',
      // Insulation and drywall
      'insulation', 'drywall', 'tape', 'texture', 'wall', 'ceiling',
      // Interior and exterior lighting
      'lighting', 'light fixtures', 'electrical fixtures',
      // MEP - Finish
      'plumbing finish', 'electrical finish', 'hvac finish', 'fixtures',
      // Interior finishes
      'painting', 'paint', 'flooring', 'floor', 'trim', 'cabinets', 'countertops',
      // Final
      'landscaping', 'cleanup', 'clean', 'final', 'inspection'
    ];
    
    // Function to get sequence position based on item description
    const getSequencePosition = (description: string) => {
      const lowerDesc = description.toLowerCase();
      
      // Check for exact matches first
      for (let i = 0; i < sequenceOrder.length; i++) {
        if (lowerDesc.includes(sequenceOrder[i])) {
          return i * 10; // Multiply by 10 to allow fine-tuning
        }
      }
      
      // Special handling for garage door openers (after garage doors)
      if (lowerDesc.includes('garage door opener')) {
        return sequenceOrder.indexOf('garage door') * 10 + 1;
      }
      
      // Special handling for site work
      if (lowerDesc.includes('site') || lowerDesc.includes('excavat')) {
        return 20; // Early in the sequence
      }
      
      return sequenceOrder.length * 10; // Put at end if no match
    };
    
    // Sort new items by sequence
    const sortedNewItems = [...newItems].sort((a, b) => {
      return getSequencePosition(a.description) - getSequencePosition(b.description);
    });
    
    // Insert each new item in the appropriate position
    for (const newItem of sortedNewItems) {
      const newItemPosition = getSequencePosition(newItem.description);
      
      // Find the right insertion point
      let insertIndex = result.length;
      for (let i = 0; i < result.length; i++) {
        const existingPosition = getSequencePosition(result[i].description);
        if (existingPosition > newItemPosition) {
          insertIndex = i;
          break;
        }
      }
      
      result.splice(insertIndex, 0, newItem);
    }
    
    return result;
  };

  const handleProceedWithout = () => {
    const result = {
      lineItems: parsedItems,
      scopeOfWork: '',
      notes: '',
      suggestions: suggestions
    };
    
    proceedWithEstimate(result);
    setShowWarningModal(false);
    
    toast({
      title: "Proceeding without changes",
      description: "Estimate created without the suggested items",
      variant: "default"
    });
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'material':
        return <Package className="h-4 w-4" />;
      case 'labor':
        return <Wrench className="h-4 w-4" />;
      case 'equipment':
        return <Truck className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'material':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'labor':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'equipment':
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const exampleText = `2-Car Detached Garage Construction
Property: 123 Oak Street

Hey John, here's what we're looking at for your new garage:

@ Install garage door openers (2 units) $1,850
@ Roofing shingles and underlayment - 1100 sq ft $3,200
@ Pour concrete floor - 24x24 ft $4,800
@ Electrical rough-in and panel connection $2,400
@ Frame walls with 2x6 studs 16" OC $3,600
@ Site excavation and grading $2,200
@ Install windows (3) and service door $1,450
@ Exterior siding - vinyl or fiber cement $3,800
@ Pour concrete footings and foundation walls $5,200
@ Drywall and tape interior walls $2,100
@ Install 2 garage doors - 9x7 insulated $2,800
@ Roof framing - trusses and sheathing $4,200
@ Electrical finish - outlets, lights, switches $1,100
@ Final grade and seed disturbed areas $650
@ Interior painting - walls and ceiling $1,200
@ Permits and inspections $850

Subtotal: $41,400
Tax (8.5%): $3,519
Total: $44,919

Payment Schedule:
- Upon signing: 25% deposit = $11,230
- After foundation: 25% = $11,230
- After framing/roofing: 25% = $11,230
- Upon completion: 25% = $11,229

Timeline: 4-5 weeks from permit approval
Warranty: 1 year on workmanship, manufacturer warranties on materials

Notes: Price includes all materials and labor. Owner responsible for any HOA approvals. Access to power and water required during construction.`;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Smart Estimate Builder
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Type or paste your estimate details and our AI will automatically identify line items, quantities, and pricing
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Start typing or paste your estimate details here... 

Example:
- Install 10 sheets of drywall @ $12 each
- Paint 500 sq ft of walls 
- 8 hours of electrical work @ $85/hr"
              className="min-h-[200px] font-mono text-sm"
            />
            
            {/* Live keyword highlighting indicator */}
            {highlightedKeywords.length > 0 && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {highlightedKeywords.length} items detected
                </Badge>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleParse}
              disabled={!inputText || isProcessing}
              className="flex items-center gap-2"
              type="button"
            >
              <Wand2 className={cn("h-4 w-4", isProcessing && "animate-spin")} />
              {isProcessing ? 'Processing...' : 'Parse Estimate'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                console.log('Loading example text...');
                setInputText(exampleText);
              }}
              type="button"
            >
              Load Example
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setInputText('');
                setParsedItems([]);
                setSuggestions([]);
                setShowPreview(false);
              }}
              type="button"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Parsed Results Preview */}
      {showPreview && parsedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Parsed {parsedItems.length} Line Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {parsedItems.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={cn("flex items-center gap-1", getCategoryColor(item.category))}
                    >
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </Badge>
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} {item.unit || 'units'} × ${item.rate.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.quantity * item.rate).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Estimated Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${parsedItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions with warning emphasis */}
      {suggestions.length > 0 && (
        <Alert className={suggestions.some(s => s.startsWith('⚠️')) ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' : ''}>
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <p className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">
              Suggestions to improve your estimate:
            </p>
            <ul className="list-disc list-inside space-y-1">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  className={cn(
                    "text-sm",
                    suggestion.startsWith('⚠️') ? 'font-semibold text-yellow-700 dark:text-yellow-300' : ''
                  )}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Missing Items Warning Modal */}
      <MissingItemsWarningModal
        open={showWarningModal}
        onOpenChange={setShowWarningModal}
        missingItems={missingItems}
        projectType={projectType}
        onAddItems={handleAddMissingItems}
        onProceedWithout={handleProceedWithout}
      />

      {/* Help text */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">Tips for best results:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Include quantities and units (e.g., "10 sheets", "500 sq ft", "8 hours")</li>
          <li>Add prices with @ or $ symbol (e.g., "@ $50/hr" or "$1,200")</li>
          <li>Use common construction terms for automatic categorization</li>
          <li>Separate different sections with blank lines</li>
        </ul>
      </div>
    </div>
  );
}