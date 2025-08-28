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
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Send, 
  Download,
  DollarSign,
  Clock,
  CheckCircle,
  Mail,
  FileText,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { EnhancedInvoice } from "@/types/enhanced-invoice";
// Removed InvoicePreview import - will use dialog to open form instead
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EnhancedInvoiceListProps {
  invoices: EnhancedInvoice[];
  onEdit: (invoice: EnhancedInvoice) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export const EnhancedInvoiceList = ({
  invoices,
  onEdit,
  onDelete,
  onRefresh
}: EnhancedInvoiceListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<EnhancedInvoice | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { variant: any; icon: JSX.Element; className?: string }> = {
      'draft': { variant: "secondary", icon: <FileText className="h-3 w-3" /> },
      'sent': { variant: "default", icon: <Send className="h-3 w-3" /> },
      'viewed': { variant: "outline", icon: <Eye className="h-3 w-3" /> },
      'paid': { variant: "default", icon: <CheckCircle className="h-3 w-3" />, className: "bg-success text-success-foreground" },
      'overdue': { variant: "destructive", icon: <AlertCircle className="h-3 w-3" /> },
      'partial': { variant: "default", icon: <Clock className="h-3 w-3" />, className: "bg-warning text-warning-foreground" }
    };

    const style = statusStyles[status] || statusStyles['draft'];
    
    return (
      <Badge variant={style.variant} className={`gap-1 ${style.className || ''}`}>
        {style.icon}
        {status.toUpperCase()}
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
      // Call edge function to send invoice
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

      // Update invoice status
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

  const groupInvoicesByMonth = () => {
    const grouped: Record<string, EnhancedInvoice[]> = {};
    
    filteredInvoices.forEach(invoice => {
      const monthKey = format(invoice.issueDate, "MMMM yyyy");
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(invoice);
    });

    return grouped;
  };

  const groupedInvoices = groupInvoicesByMonth();
  const monthKeys = Object.keys(groupedInvoices).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Calculate monthly totals
  const getMonthlyTotal = (invoices: EnhancedInvoice[]) => {
    return invoices.reduce((sum, inv) => sum + (inv.balance || inv.total), 0);
  };

  return (
    <div className="space-y-6">
      {/* Clean Invoice List Card - Inspired by Replit */}
      <Card className="p-6 bg-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Invoice List</h2>
            <p className="text-sm text-muted-foreground">View and manage all invoices</p>
          </div>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

      {/* Invoices grouped by month */}
      {monthKeys.map(month => {
        const monthInvoices = groupedInvoices[month];
        const monthlyTotal = getMonthlyTotal(monthInvoices);

        return (
          <div key={month} className="space-y-4">
            {/* Month Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{month}</h3>
              <p className="text-sm text-muted-foreground">
                Total Outstanding: ${monthlyTotal.toFixed(2)}
              </p>
            </div>

            {/* Invoice Cards */}
            <div className="space-y-2">
              {monthInvoices.map(invoice => (
                <Card key={invoice.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">
                            {invoice.customerName || 'Unnamed Customer'} - #{invoice.invoiceNumber}
                          </h4>
                          {getStatusBadge(invoice.status)}
                          {invoice.status === 'sent' && (
                            <Badge variant="outline" className="gap-1">
                              <Mail className="h-3 w-3" />
                              Email opened
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(invoice.issueDate, "MMMM d, yyyy")}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {invoice.customerAddress && (
                            <>
                              {invoice.customerAddress}
                              <br />
                              {invoice.customerCity}, {invoice.customerProvince} {invoice.customerPostalCode}
                            </>
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-semibold">
                          ${invoice.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        onClick={() => onEdit(invoice)}
                      >
                        Open
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(invoice)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Invoice
                          </DropdownMenuItem>
                          {invoice.status === 'draft' && (
                            <DropdownMenuItem onClick={() => handleSendInvoice(invoice)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Invoice
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => onDelete(invoice.id!)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Sync Error Badge (if needed) */}
                  {invoice.status === 'overdue' && (
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Sync Error
                      </Badge>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {filteredInvoices.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          No invoices found
        </Card>
      )}
      
      </Card>
    </div>
  );
};