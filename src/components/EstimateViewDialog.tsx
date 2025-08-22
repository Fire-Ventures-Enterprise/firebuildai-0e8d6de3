import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Calendar, DollarSign, FileText, Users, Wrench, Download, Send, Edit } from "lucide-react";

interface EstimateViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate: any;
  onEdit?: () => void;
}

export const EstimateViewDialog = ({ open, onOpenChange, estimate, onEdit }: EstimateViewDialogProps) => {
  if (!estimate) return null;

  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      APPROVED: "bg-green-100 text-green-800 border-green-200", 
      DECLINED: "bg-red-100 text-red-800 border-red-200"
    };
    
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.PENDING}>
        {status}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pb-4">
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Estimate {estimate.estimateNumber}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                CANCEL
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                SAVE
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Company Info */}
          <div className="col-span-5 space-y-6">
            {/* Company Logo and Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">FB</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">FIREBUILD.AI</h3>
                  <p className="text-sm text-muted-foreground">CONSTRUCTION</p>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>29 Birchbank Crescent</p>
                <p>Kanata, ontario</p>
                <p>K2M 2J9</p>
                <p>Canada</p>
                <p>firebuildai@gmail.com</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-sm font-medium">Description</TableHead>
                    <TableHead className="text-sm font-medium w-20">Rate</TableHead>
                    <TableHead className="text-sm font-medium w-20">Markup</TableHead>
                    <TableHead className="text-sm font-medium w-20">Quantity</TableHead>
                    <TableHead className="text-sm font-medium w-16">Tax</TableHead>
                    <TableHead className="text-sm font-medium w-24 text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="align-top">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Bathroom</span>
                          <Button variant="outline" size="sm" className="h-6 text-xs px-2">
                            📋 Item List
                          </Button>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-3">
                          <p className="font-medium text-foreground">Bathroom Renovation Scope of Work</p>
                          
                          <div>
                            <p className="font-medium text-foreground mb-1">Demolition:</p>
                            <p className="mb-2">Remove and dispose of the following items from the property...</p>
                            
                            <div className="ml-2 space-y-0.5 text-xs">
                              <p>• Wal Tiles..</p>
                              <p>• Floor Tiles..</p>
                              <p>• Bathtub..</p>
                              <p>• Shower Faucet..</p>
                              <p>• Floor Tiles..</p>
                              <p>• Vanity..</p>
                              <p>• Faucet and Vanity Sink..</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-medium text-foreground mb-1">Supply and Installation:</p>
                            <div className="ml-2 text-xs">
                              <p>1. Install a 59" acrylic shower base with a frameless glass enclosure, featuring black frame.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className="text-sm">$21,557.00</span>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className="text-sm text-muted-foreground">Markup</span>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className="text-sm">1</span>
                    </TableCell>
                    <TableCell className="align-top">
                      <span className="text-sm text-muted-foreground">Tax</span>
                    </TableCell>
                    <TableCell className="align-top text-right">
                      <span className="font-medium">$21,557.00</span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right Column - Client Info and Estimate Details */}
          <div className="col-span-7 space-y-6">
            {/* Client Information - Green Border Box */}
            <Card className="border-2 border-green-500 bg-green-50/30">
              <CardContent className="p-4">
                <div className="space-y-1">
                  <p className="font-bold text-lg text-foreground">{estimate.clientName}</p>
                  <p className="text-sm text-muted-foreground">Michael.manulak@gmail.com</p>
                  <p className="text-sm text-muted-foreground">{estimate.phone}</p>
                  <p className="text-sm text-muted-foreground">{estimate.address}</p>
                  <p className="text-sm text-muted-foreground">{estimate.city}</p>
                </div>
              </CardContent>
            </Card>

            {/* Estimate Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="estimateNumber" className="text-sm text-blue-600 font-medium">Estimate #</Label>
                <Input 
                  id="estimateNumber"
                  value={estimate.estimateNumber.replace('#', '')}
                  className="mt-1 border-2 h-10"
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="date" className="text-sm text-blue-600 font-medium">Date</Label>
                <div className="relative">
                  <Input 
                    id="date"
                    value="21-08-2025"
                    className="mt-1 border-2 h-10 pr-10"
                    readOnly
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="expirationDate" className="text-sm text-blue-600 font-medium">Expiration Date</Label>
                <div className="relative">
                  <Input 
                    id="expirationDate"
                    value="26-08-2025"
                    className="mt-1 border-2 h-10 pr-10"
                    readOnly
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <p className="text-xs text-blue-600 font-medium">
                Clients will have 5 day(s) to approve this estimate if sent today
              </p>

              <div>
                <Label htmlFor="poNumber" className="text-sm text-blue-600 font-medium">PO Number</Label>
                <Input 
                  id="poNumber"
                  className="mt-1 border-2 h-10"
                  placeholder="Enter PO number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Estimate
            </Button>
          )}
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};