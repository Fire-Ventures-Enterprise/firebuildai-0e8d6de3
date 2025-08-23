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
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { InvoiceForm } from "./InvoiceForm";
import { InvoicePreview } from "./InvoicePreview";

interface InvoiceListProps {
  invoices: Invoice[];
  onCreateInvoice: (data: any) => void;
  onUpdateInvoice: (id: string, data: any) => void;
  onDeleteInvoice: (id: string) => void;
  onSendInvoice: (id: string) => void;
}

export const InvoiceList = ({
  invoices,
  onCreateInvoice,
  onUpdateInvoice,
  onDeleteInvoice,
  onSendInvoice
}: InvoiceListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  const getStatusBadge = (status: InvoiceStatus) => {
    const variants: Record<InvoiceStatus, string> = {
      [InvoiceStatus.DRAFT]: "secondary",
      [InvoiceStatus.SENT]: "default",
      [InvoiceStatus.VIEWED]: "outline",
      [InvoiceStatus.PAID]: "success",
      [InvoiceStatus.OVERDUE]: "destructive",
      [InvoiceStatus.CANCELLED]: "secondary"
    };

    const icons: Record<InvoiceStatus, JSX.Element> = {
      [InvoiceStatus.DRAFT]: <Clock className="h-3 w-3" />,
      [InvoiceStatus.SENT]: <Send className="h-3 w-3" />,
      [InvoiceStatus.VIEWED]: <Eye className="h-3 w-3" />,
      [InvoiceStatus.PAID]: <CheckCircle className="h-3 w-3" />,
      [InvoiceStatus.OVERDUE]: <Clock className="h-3 w-3" />,
      [InvoiceStatus.CANCELLED]: <Clock className="h-3 w-3" />
    };

    return (
      <Badge variant={variants[status] as any} className="gap-1">
        {icons[status]}
        {status}
      </Badge>
    );
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary stats
  const stats = {
    total: invoices.length,
    totalValue: invoices.reduce((sum, inv) => sum + inv.total, 0),
    paid: invoices.filter(inv => inv.status === InvoiceStatus.PAID).length,
    overdue: invoices.filter(inv => inv.status === InvoiceStatus.OVERDUE).length,
    pending: invoices.filter(inv => inv.balance > 0).reduce((sum, inv) => sum + inv.balance, 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-orange-600">${stats.pending.toFixed(2)}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* List Header */}
      <Card>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Invoices</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>

        {/* Invoice Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>
                  {invoice.customer ? (
                    <div>
                      <p className="font-medium">
                        {invoice.customer.firstName} {invoice.customer.lastName}
                      </p>
                      {invoice.customer.company && (
                        <p className="text-sm text-muted-foreground">{invoice.customer.company}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No customer</span>
                  )}
                </TableCell>
                <TableCell>{format(new Date(invoice.issueDate), "MMM dd, yyyy")}</TableCell>
                <TableCell>{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</TableCell>
                <TableCell className="font-medium">${invoice.total.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowPreviewDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {invoice.status === InvoiceStatus.DRAFT && (
                        <DropdownMenuItem onClick={() => onSendInvoice(invoice.id)}>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredInvoices.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No invoices found
          </div>
        )}
      </Card>

      {/* Dialogs */}
      <InvoiceForm
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
        onSave={onCreateInvoice}
      />

      {selectedInvoice && (
        <>
          <InvoiceForm
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            invoice={selectedInvoice}
            mode="edit"
            onSave={(data) => onUpdateInvoice(selectedInvoice.id, data)}
          />

          <InvoicePreview
            open={showPreviewDialog}
            onOpenChange={setShowPreviewDialog}
            invoice={selectedInvoice}
          />
        </>
      )}
    </div>
  );
};