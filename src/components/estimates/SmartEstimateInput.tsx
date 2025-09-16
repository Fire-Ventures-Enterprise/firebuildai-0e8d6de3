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
  Truck
} from 'lucide-react';
import { EstimateParser } from '@/utils/estimateParser';
import { cn } from '@/lib/utils';

interface SmartEstimateInputProps {
  onItemsExtracted: (items: any[]) => void;
  onScopeExtracted: (scope: string) => void;
  onNotesExtracted: (notes: string) => void;
}

export function SmartEstimateInput({ 
  onItemsExtracted, 
  onScopeExtracted, 
  onNotesExtracted 
}: SmartEstimateInputProps) {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [highlightedKeywords, setHighlightedKeywords] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      setSuggestions(result.suggestions || []);
      setShowPreview(true);
      
      // Pass data to parent with proper formatting
      const formattedItems = result.lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity || 1,
        rate: item.rate || 0,
        amount: (item.quantity || 1) * (item.rate || 0)
      }));
      
      onItemsExtracted(formattedItems);
      onScopeExtracted(result.scopeOfWork);
      onNotesExtracted(result.notes);
      
      setIsProcessing(false);
    }, 500);
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

  const exampleText = `Kitchen Renovation Project

Install new cabinets - 10 linear feet @ $250/ft
Remove old countertops and install granite - 45 sq ft @ $75/sf
Paint walls and ceiling - 350 sq ft @ $3.50/sf
Install backsplash tile - 30 sq ft @ $25/sf
Electrical work - 8 hours @ $85/hr
Plumbing for new sink - 4 hours @ $75/hr

Dumpster rental - 1 week @ $400
Permits and inspections - $500

Scope: Complete kitchen renovation including removal of existing fixtures, installation of new cabinets, countertops, backsplash, and painting. All work to be completed within 2 weeks.

Notes: Customer to select final finishes. Access required Monday-Friday 8am-5pm.`;

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

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-2">Suggestions to improve your estimate:</p>
            <ul className="list-disc list-inside space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

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