import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Send
} from "lucide-react";
import { format } from "date-fns";
import { EnhancedInvoice } from "@/types/enhanced-invoice";
import { EnhancedInvoicePreview } from "./EnhancedInvoicePreview";
import { InvoiceStatus } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface SimpleInvoiceTableProps {
  invoices: EnhancedInvoice[];
  onEdit: (invoice: EnhancedInvoice) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export const SimpleInvoiceTable = ({
  invoices,
  onEdit,
  onDelete,
  onRefresh
}: SimpleInvoiceTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<EnhancedInvoice | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { className: string; label: string }> = {
      'draft': { className: "bg-muted text-muted-foreground", label: "Draft" },
      'sent': { className: "bg-primary/10 text-primary", label: "Sent" },
      'viewed': { className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", label: "Viewed" },
      'paid': { className: "bg-success/10 text-success", label: "Paid" },
      'partially_paid': { className: "bg-warning/10 text-warning", label: "Partial" },
      'overdue': { className: "bg-destructive/10 text-destructive", label: "Overdue" },
      'cancelled': { className: "bg-muted text-muted-foreground", label: "Cancelled" }
    };

    const style = statusStyles[status] || statusStyles['draft'];
    
    return (
      <Badge className={`${style.className} border-0`}>
        {style.label}
      </Badge>
    );
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendInvoice = async (invoice: EnhancedInvoice) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          invoiceId: invoice.id,
          customerEmail: invoice.customerEmail,
          customerName: invoice.customerName,
          invoiceNumber: invoice.invoiceNumber,
          total: invoice.total,
          dueDate: invoice.dueDate
        }
      });

      if (error) throw error;

      await supabase
        .from('invoices_enhanced')
        .update({ status: 'sent' })
        .eq('id', invoice.id);

      toast({
        title: "Invoice sent",
        description: `Invoice ${invoice.invoiceNumber} has been sent to ${invoice.customerEmail}`
      });

      onRefresh();
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast({
        title: "Error",
        description: "Failed to send invoice",
        variant: "destructive"
      });
    }
  };

  const handleViewInvoice = (invoice: EnhancedInvoice) => {
    setSelectedInvoice(invoice);
    setShowPreview(true);
  };

  return (
    <>
      <Card className="p-6 bg-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Invoice List</h2>
            <p className="text-sm text-muted-foreground">View and manage all invoices</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">Invoice #</TableHead>
                <TableHead className="font-medium">Client</TableHead>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Due Date</TableHead>
                <TableHead className="font-medium text-right">Total</TableHead>
                <TableHead className="font-medium text-right">Paid</TableHead>
                <TableHead className="font-medium text-right">Balance</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      {invoice.customerName || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {format(invoice.issueDate, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {invoice.dueDate ? format(invoice.dueDate, "MMM dd, yyyy") : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(invoice.paidAmount || 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={invoice.balance === 0 && invoice.paidAmount > 0 ? "text-success" : ""}>
                        {formatCurrency(invoice.balance || invoice.total)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(invoice)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {invoice.status === 'draft' && (
                              <DropdownMenuItem onClick={() => handleSendInvoice(invoice)}>
                                <Send className="h-4 w-4 mr-2" />
                                Send Invoice
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => onDelete(invoice.id!)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No invoices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Invoice Preview Modal */}
      {selectedInvoice && (
        <EnhancedInvoicePreview 
          open={showPreview}
          onOpenChange={setShowPreview}
          invoice={selectedInvoice}
        />
      )}
    </>
  );
};