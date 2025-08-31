import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eraser, PenTool, Type } from 'lucide-react';

interface EnhancedSignaturePadProps {
  onSave: (signature: string, agreedToTerms: boolean) => void;
  requireTerms?: boolean;
  termsText?: string;
}

const EnhancedSignaturePad = forwardRef<any, EnhancedSignaturePadProps>(({ 
  onSave, 
  requireTerms = true,
  termsText = "I agree to all terms and conditions"
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [typedName, setTypedName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');

  useImperativeHandle(ref, () => ({
    clear: () => clearSignature(),
    save: () => saveSignature(),
    isEmpty: () => signatureType === 'draw' ? isEmpty : !typedName.trim()
  }));

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current || signatureType !== 'draw') return;
    
    setIsDrawing(true);
    setIsEmpty(false);
    
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current || signatureType !== 'draw') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (signatureType === 'draw' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setIsEmpty(true);
    } else {
      setTypedName('');
    }
    setAgreedToTerms(false);
  };

  const generateTypedSignature = (): string => {
    if (!typedName.trim()) return '';
    
    // Create a temporary canvas for the typed signature
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set cursive font style - use Google Font
    ctx.font = '48px "Dancing Script", "Great Vibes", "Brush Script MT", cursive';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw the typed name
    ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);
    
    return canvas.toDataURL('image/png');
  };

  const saveSignature = () => {
    let signatureData = '';
    
    if (signatureType === 'draw') {
      if (!canvasRef.current || isEmpty) return;
      signatureData = canvasRef.current.toDataURL('image/png');
    } else {
      if (!typedName.trim()) return;
      signatureData = generateTypedSignature();
    }
    
    if (requireTerms && !agreedToTerms) {
      return;
    }
    
    onSave(signatureData, agreedToTerms);
  };

  const canSave = () => {
    const hasSignature = signatureType === 'draw' ? !isEmpty : typedName.trim().length > 0;
    const termsAccepted = !requireTerms || agreedToTerms;
    return hasSignature && termsAccepted;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Tabs value={signatureType} onValueChange={(value) => setSignatureType(value as 'draw' | 'type')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw">
              <PenTool className="h-4 w-4 mr-2" />
              Draw Signature
            </TabsTrigger>
            <TabsTrigger value="type">
              <Type className="h-4 w-4 mr-2" />
              Type Signature
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="draw" className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-2">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
            <p className="text-sm text-muted-foreground">Draw your signature above</p>
          </TabsContent>
          
          <TabsContent value="type" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="typed-signature">Type your full name</Label>
              <Input
                id="typed-signature"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Enter your full name"
                className="text-lg"
              />
            </div>
            {typedName && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                <div 
                  className="text-center text-4xl"
                  style={{ 
                    fontFamily: '"Dancing Script", "Great Vibes", cursive',
                    fontWeight: 400,
                    color: '#000'
                  }}
                >
                  {typedName}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {requireTerms && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms-agreement"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-1"
              />
              <Label 
                htmlFor="terms-agreement" 
                className="text-sm leading-relaxed cursor-pointer"
              >
                {termsText}
              </Label>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            {!canSave() && requireTerms && !agreedToTerms && (signatureType === 'draw' ? !isEmpty : typedName.trim()) && (
              <span className="text-destructive">Please agree to the terms and conditions</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={signatureType === 'draw' ? isEmpty : !typedName.trim()}
            >
              <Eraser className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={saveSignature}
              disabled={!canSave()}
            >
              Accept & Sign
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
});

EnhancedSignaturePad.displayName = 'EnhancedSignaturePad';

export default EnhancedSignaturePad;