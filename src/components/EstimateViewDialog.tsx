import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Phone, MapPin, Calendar, DollarSign, FileText, Users, Wrench, Download, Send, Edit } from "lucide-react";

interface EstimateViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate: any;
  onEdit?: () => void;
}

// Mock line items data matching the reference
const mockLineItems = [
  {
    id: 1,
    description: "Bathroom Renovation Scope of Work",
    qty: 1,
    rate: 19376.11,
    markup: 0,
    tax: 0,
    total: 19376.11
  }
];

const mockSubItems = [
  "Complete removal of the following items from the property:",
  "- Wall Tiles",
  "- Floor Tiles", 
  "- Drywall/Walls",
  "- Ceiling",
  "- Floor Tiles",
  "- Tub",
  "- Vanity and vanity bowl",
  "",
  "Supply and Installation:",
  "1. Install 3/8\" sq so, chipset flood wall 4 horizontal glass blockade featuring black frame",
  "2. Supply and install shower wall tiles, 12x24 glossy",
  "3. Install floor tiles/sheet vinyl and caulk with thinset, ensuring all trimms are installed to prevent water passage behind the shower base and tiles",
  "4. Apply a waterproofing sealant sealing entire reclaimed and backer coating for enhanced protection",
  "5. Paint the bathroom walls and baseboard in the client choice of color providing a fresh and modern finish",
  "6. Supply and install vanity cabinet only, with white granite count countertop",
  "7. Close openings at bathroom accessories, faucets, hand-holders, paper holder, safety lights",
  "8. Supply and install black shower head in black with optional tail down handle",
  "9. Supply black vanity faucet with gold mount chrome backing/spill wall",
  "10. Supply and install mirror above the vanity (24\" x 36\")",
  "",
  "**Please note plumbing and electrical work will be performed by professionals.",
  "***Schedule to be agreed on a day scheduled with the contractor***",
  "",
  "We look forward to the opportunity to transform your space. Please let us know if you have any questions or any adjustments are needed."
];

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

  const subtotal = 19376.11;
  const discount = 0;
  const taxRate = 0;
  const tax = subtotal * taxRate;
  const total = subtotal - discount + tax;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl text-primary">
                Estimate {estimate.estimateNumber}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">FireBuild.ai Construction</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={estimate.status} />
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                CANCEL
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                SAVE
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client and Estimate Info */}
          <div className="grid grid-cols-2 gap-8">
            {/* Client Information */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-600 mb-3">Client Information</h3>
                <div className="space-y-2">
                  <p className="font-medium">{estimate.clientName}</p>
                  <p className="text-sm text-muted-foreground">{estimate.address}</p>
                  <p className="text-sm text-muted-foreground">{estimate.city}</p>
                  <p className="text-sm text-muted-foreground">{estimate.phone}</p>
                  <p className="text-sm text-muted-foreground">manulak@firmbuild.gmail.com</p>
                </div>
              </CardContent>
            </Card>

            {/* Estimate Details */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">PO Number</label>
                    <div className="border rounded px-3 py-2 mt-1">21043</div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Created</label>
                    <div className="border rounded px-3 py-2 mt-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      21/08/2025
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Due Date</label>
                    <div className="border rounded px-3 py-2 mt-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      21/08/2025
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-16">Qty</TableHead>
                    <TableHead className="w-24">Rate</TableHead>
                    <TableHead className="w-20">Markup</TableHead>
                    <TableHead className="w-20">Quantity</TableHead>
                    <TableHead className="w-16">Tax</TableHead>
                    <TableHead className="w-24 text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLineItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <div className="mt-2 text-sm text-muted-foreground space-y-1">
                            {mockSubItems.map((subItem, subIndex) => (
                              <p key={subIndex} className="whitespace-pre-wrap">
                                {subItem}
                              </p>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>${item.rate.toLocaleString()}</TableCell>
                      <TableCell>{item.markup}%</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{item.tax}%</TableCell>
                      <TableCell className="text-right font-medium">
                        ${item.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Totals */}
          <div className="flex justify-end">
            <Card className="w-96">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Markup</span>
                    <span>$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected deposit</span>
                    <span>$5000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Schedule</span>
                    <span>$5000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$2519.11</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total (CAD)</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Online Payment Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Online Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Accept Credit Cards and PayPal</span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <div className="w-8 h-5 bg-blue-600 rounded"></div>
                    <div className="w-8 h-5 bg-red-500 rounded"></div>
                    <div className="w-8 h-5 bg-yellow-400 rounded"></div>
                    <div className="w-8 h-5 bg-blue-800 rounded"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No merchant account required. Your customers will be charged the processing fee.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Auto-generate Invoice</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically send your client your invoice via email when this estimate is approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <FileText className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
            <div className="flex gap-3">
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
              <div className="bg-green-600 text-white px-4 py-2 rounded-md">
                Allow client communications for payments, approvals,
                scheduling etc.
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};