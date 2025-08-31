import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onCapture: (files: File[]) => Promise<void>;
  isProcessing?: boolean;
}

export function CameraCapture({ onCapture, isProcessing }: CameraCaptureProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // Calculate new dimensions (max 1600px width)
          const maxWidth = 1600;
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            0.85
          );
        };
      };
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    if (selectedFiles.length === 0) return;
    
    try {
      // Compress images
      const compressedFiles = await Promise.all(
        selectedFiles.map(file => compressImage(file))
      );
      
      // Create previews
      const newPreviews = compressedFiles.map(file => URL.createObjectURL(file));
      
      setPreviews(prev => [...prev, ...newPreviews]);
      setFiles(prev => [...prev, ...compressedFiles]);
      
      toast({
        title: "Receipts captured",
        description: `${selectedFiles.length} receipt(s) ready for upload`,
      });
    } catch (error) {
      console.error("Error processing images:", error);
      toast({
        title: "Error",
        description: "Failed to process images",
        variant: "destructive",
      });
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    try {
      await onCapture(files);
      setPreviews([]);
      setFiles([]);
    } catch (error) {
      console.error("Error uploading receipts:", error);
      toast({
        title: "Error",
        description: "Failed to upload receipts",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="default"
          className="flex-1"
        >
          <Camera className="h-4 w-4 mr-2" />
          Capture Receipt
        </Button>
        
        <Button
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.removeAttribute('capture');
              fileInputRef.current.click();
              setTimeout(() => {
                fileInputRef.current?.setAttribute('capture', 'environment');
              }, 100);
            }
          }}
          variant="outline"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      {previews.length > 0 && (
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Receipt ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePreview(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {files.length} Receipt{files.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}