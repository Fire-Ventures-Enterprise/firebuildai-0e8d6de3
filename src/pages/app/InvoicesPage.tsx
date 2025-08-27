// Invoices Page - Manage invoices and billing
import { useState } from "react";
import { EnhancedInvoiceForm } from "@/components/invoicing/EnhancedInvoiceForm";
import { InvoiceList } from "@/components/invoicing/InvoiceList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, Clock, DollarSign, CheckCircle } from "lucide-react";
import { Invoice, InvoiceStatus } from "@/types/invoice";

export const InvoicesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const handleSaveInvoice = (data: any) => {
    if (mode === 'edit' && selectedInvoice) {
      // Update existing invoice
      setInvoices(invoices.map(inv => 
        inv.id === selectedInvoice.id 
          ? { ...inv, ...data, updatedAt: new Date() }
          : inv
      ));
    } else {
      // Create new invoice
      const newInvoice: Invoice = {
        ...data,
        id: `INV-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setInvoices([...invoices, newInvoice]);
    }
    setShowForm(false);
    setSelectedInvoice(null);
  };

  const handleCreateInvoice = () => {
    setMode('create');
    setSelectedInvoice(null);
    setShowForm(true);
  };

  const handleUpdateInvoice = (id: string, data: any) => {
    setInvoices(invoices.map(inv => 
      inv.id === id 
        ? { ...inv, ...data, updatedAt: new Date() }
        : inv
    ));
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const handleSendInvoice = (id: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === id 
        ? { ...inv, status: InvoiceStatus.SENT, updatedAt: new Date() }
        : inv
    ));
  };

  const stats = {
    total: invoices.length,
    pending: invoices.filter(i => i.status === InvoiceStatus.SENT || i.status === InvoiceStatus.VIEWED).length,
    paid: invoices.filter(i => i.status === InvoiceStatus.PAID).length,
    totalValue: invoices.reduce((sum, i) => sum + i.total, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage billing and payments</p>
        </div>
        <Button onClick={handleCreateInvoice}>
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-semibold">{stats.paid}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-semibold">${stats.totalValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Invoices List */}
      {invoices.length > 0 ? (
        <InvoiceList 
          invoices={invoices} 
          onCreateInvoice={handleSaveInvoice}
          onUpdateInvoice={handleUpdateInvoice}
          onDeleteInvoice={handleDeleteInvoice}
          onSendInvoice={handleSendInvoice}
        />
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
            <p className="text-muted-foreground mb-4">Create your first invoice to get started</p>
            <Button onClick={handleCreateInvoice}>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </Card>
      )}

      {/* Invoice Form Modal */}
      {showForm && (
        <InvoiceForm
          open={showForm}
          onOpenChange={(open) => {
            setShowForm(open);
            if (!open) {
              setSelectedInvoice(null);
              setMode('create');
            }
          }}
          invoice={selectedInvoice || undefined}
          mode={mode}
          onSave={handleSaveInvoice}
        />
      )}
    </div>
  );
};