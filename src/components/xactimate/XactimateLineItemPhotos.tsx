// Xactimate Line Item Photo Management Component
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Image as ImageIcon,
  X,
  ZoomIn
} from 'lucide-react';
import { XactimateService } from '@/services/xactimate';
import { XactimateLineItem, XactimatePhotoLink } from '@/types/xactimate';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface XactimateLineItemPhotosProps {
  lineItem: XactimateLineItem;
  onStatusUpdate?: (status: 'not_started' | 'in_progress' | 'completed') => void;
  onPhotoUpload?: () => void;
}

export const XactimateLineItemPhotos: React.FC<XactimateLineItemPhotosProps> = ({
  lineItem,
  onStatusUpdate,
  onPhotoUpload
}) => {
  const [photos, setPhotos] = useState<{
    before: XactimatePhotoLink[];
    during: XactimatePhotoLink[];
    after: XactimatePhotoLink[];
    documentation: XactimatePhotoLink[];
  }>({
    before: [],
    during: [],
    after: [],
    documentation: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPhotos();
  }, [lineItem.id]);

  const loadPhotos = async () => {
    try {
      const allPhotos = await XactimateService.getLineItemPhotos(lineItem.id);
      const grouped = {
        before: allPhotos.filter(p => p.stage === 'before'),
        during: allPhotos.filter(p => p.stage === 'during'),
        after: allPhotos.filter(p => p.stage === 'after'),
        documentation: allPhotos.filter(p => p.stage === 'documentation')
      };
      setPhotos(grouped);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const handlePhotoUpload = async (
    files: FileList, 
    stage: 'before' | 'during' | 'after' | 'documentation'
  ) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        await XactimateService.uploadLineItemPhoto(
          lineItem.id,
          file,
          stage,
          `${stage} photo for ${lineItem.description}`
        );
      }
      
      await loadPhotos();
      onPhotoUpload?.();
      
      toast({
        title: "Photos uploaded",
        description: `${files.length} photo(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photos",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await XactimateService.updateLineItemProgress({
        line_item_id: lineItem.id,
        status: status as 'not_started' | 'in_progress' | 'completed',
        completion_percentage: status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0
      });
      
      onStatusUpdate?.(status as 'not_started' | 'in_progress' | 'completed');
      
      toast({
        title: "Status updated",
        description: `Line item marked as ${status.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update line item status",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      in_progress: 'secondary',
      not_started: 'outline'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const PhotoGrid: React.FC<{
    photos: XactimatePhotoLink[];
    stage: 'before' | 'during' | 'after' | 'documentation';
    placeholder: string;
  }> = ({ photos, stage, placeholder }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.photo_url}
              alt={photo.photo_caption || `${stage} photo`}
              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(photo.photo_url)}
            />
            <button
              className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(photo.photo_url);
              }}
            >
              <ZoomIn className="h-3 w-3 text-white" />
            </button>
          </div>
        ))}
        <label className="border-2 border-dashed border-muted-foreground/20 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
          <Input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handlePhotoUpload(e.target.files, stage)}
            disabled={isUploading}
          />
          <Upload className="h-5 w-5 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground">Upload</span>
        </label>
      </div>
      {photos.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">
          {placeholder}
        </p>
      )}
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-muted-foreground">{lineItem.xactimate_code}</span>
                <span>{lineItem.description}</span>
              </CardTitle>
              <CardDescription className="flex items-center gap-4 text-sm">
                <span>{lineItem.quantity} {lineItem.unit}</span>
                <span className="font-medium">${lineItem.total_price?.toLocaleString()}</span>
                {lineItem.trade && (
                  <Badge variant="outline" className="text-xs">
                    {lineItem.trade}
                  </Badge>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(lineItem.status || 'not_started')}
              <Select
                value={lineItem.status || 'not_started'}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h5 className="text-sm font-medium flex items-center gap-1">
                <Camera className="h-3 w-3" />
                Before
                <Badge variant="outline" className="text-xs">
                  {photos.before.length}
                </Badge>
              </h5>
              <PhotoGrid
                photos={photos.before}
                stage="before"
                placeholder="Upload before photos"
              />
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium flex items-center gap-1">
                <Camera className="h-3 w-3" />
                During
                <Badge variant="outline" className="text-xs">
                  {photos.during.length}
                </Badge>
              </h5>
              <PhotoGrid
                photos={photos.during}
                stage="during"
                placeholder="Upload progress photos"
              />
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium flex items-center gap-1">
                <Camera className="h-3 w-3" />
                After
                <Badge variant="outline" className="text-xs">
                  {photos.after.length}
                </Badge>
              </h5>
              <PhotoGrid
                photos={photos.after}
                stage="after"
                placeholder="Upload completion photos"
              />
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                Documentation
                <Badge variant="outline" className="text-xs">
                  {photos.documentation.length}
                </Badge>
              </h5>
              <PhotoGrid
                photos={photos.documentation}
                stage="documentation"
                placeholder="Upload documents"
              />
            </div>
          </div>

          {lineItem.notes && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm">{lineItem.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};