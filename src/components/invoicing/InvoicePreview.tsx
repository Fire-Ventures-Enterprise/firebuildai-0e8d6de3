import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Send, Printer } from "lucide-react";
import { format } from "date-fns";
import { Invoice, InvoiceStatus } from "@/types/invoice";

interface InvoicePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
}

export const InvoicePreview = ({ open, onOpenChange, invoice }: InvoicePreviewProps) => {
  const getStatusColor = (status: InvoiceStatus) => {
    const colors: Record<InvoiceStatus, string> = {
      [InvoiceStatus.DRAFT]: "text-gray-600",
      [InvoiceStatus.SENT]: "text-blue-600",
      [InvoiceStatus.VIEWED]: "text-purple-600",
      [InvoiceStatus.PAID]: "text-green-600",
      [InvoiceStatus.OVERDUE]: "text-red-600",
      [InvoiceStatus.CANCELLED]: "text-gray-400"
    };
    return colors[status];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Actions Bar */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/50">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Invoice #{invoice.invoiceNumber}</h2>
            <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            {invoice.status === InvoiceStatus.DRAFT && (
              <Button size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send Invoice
              </Button>
            )}
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 bg-white">
          {/* Header */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4">
                FB
              </div>
              <h3 className="font-bold text-xl">FIREBUILD.AI</h3>
              <p className="text-sm text-muted-foreground">CONSTRUCTION</p>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                <p>29 Birchbank Crescent</p>
                <p>Kanata, Ontario K2M 2J9</p>
                <p>Canada</p>
                <p>firebuildai@gmail.com</p>
                <p>Tax #: 789571296RT0001</p>
              </div>
            </div>

            <div className="text-right">
              <h1 className="text-3xl font-bold text-primary mb-4">INVOICE</h1>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Number:</span>
                  <span className="font-medium">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span className="font-medium">{format(new Date(invoice.issueDate), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className="font-medium">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h4 className="font-semibold mb-2">Bill To:</h4>
            {invoice.customer ? (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </p>
                {invoice.customer.company && <p>{invoice.customer.company}</p>}
                {invoice.customer.address && <p>{invoice.customer.address}</p>}
                {invoice.customer.city && (
                  <p>
                    {invoice.customer.city}, {invoice.customer.state} {invoice.customer.zipCode}
                  </p>
                )}
                {invoice.customer.email && <p>{invoice.customer.email}</p>}
                {invoice.customer.phone && <p>{invoice.customer.phone}</p>}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No customer information</p>
            )}
          </div>

          <Separator className="mb-6" />

          {/* Line Items */}
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Rate</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{item.description}</td>
                  <td className="text-right py-3">{item.quantity}</td>
                  <td className="text-right py-3">${item.rate.toFixed(2)}</td>
                  <td className="text-right py-3 font-medium">${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-80">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.taxAmount > 0 && (
                <div className="flex justify-between py-2">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>${invoice.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
              {invoice.paidAmount > 0 && (
                <>
                  <div className="flex justify-between py-2 text-green-600">
                    <span>Paid:</span>
                    <span>-${invoice.paidAmount.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between py-2 font-bold text-lg">
                    <span>Balance Due:</span>
                    <span>${invoice.balance.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Notes:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          {/* Terms & Conditions */}
          {invoice.termsConditions && (
            <div>
              <h4 className="font-semibold mb-2">Terms & Conditions:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.termsConditions}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">Thank you for your business!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};