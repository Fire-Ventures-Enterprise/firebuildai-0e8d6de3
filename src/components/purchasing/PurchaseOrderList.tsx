import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, FileText, Filter, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id?: string;
  vendor_name: string;
  vendor_email?: string;
  job_id?: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  expected_delivery?: string;
  due_date?: string;
  payment_terms?: string;
  payment_method?: string;
  payment_status?: string;
  approval_status?: string;
  notes?: string;
  invoice_id?: string;
  category?: string;
  paid_amount?: number;
  created_at: string;
  updated_at: string;
}

interface PurchaseOrderListProps {
  purchaseOrders: PurchaseOrder[];
  onEdit: (po: PurchaseOrder) => void;
  onDelete: (id: string) => void;
}

export function PurchaseOrderList({ purchaseOrders, onEdit, onDelete }: PurchaseOrderListProps) {
  const [filteredPOs, setFilteredPOs] = useState(purchaseOrders);
  const [vendorFilter, setVendorFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('');
  const [vendors, setVendors] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetchVendors();
    fetchJobs();
  }, []);

  useEffect(() => {
    filterPurchaseOrders();
  }, [purchaseOrders, vendorFilter, jobFilter, statusFilter, approvalFilter]);

  const fetchVendors = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const { data } = await supabase
      .from('vendors')
      .select('id, company_name')
      .eq('user_id', user.user.id)
      .order('company_name');

    setVendors(data || []);
  };

  const fetchJobs = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const { data } = await supabase
      .from('jobs')
      .select('id, title')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    setJobs(data || []);
  };

  const filterPurchaseOrders = () => {
    let filtered = [...purchaseOrders];

    if (vendorFilter) {
      filtered = filtered.filter(po => po.vendor_id === vendorFilter);
    }
    if (jobFilter) {
      filtered = filtered.filter(po => po.job_id === jobFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter(po => po.payment_status === statusFilter);
    }
    if (approvalFilter) {
      filtered = filtered.filter(po => po.approval_status === approvalFilter);
    }

    setFilteredPOs(filtered);
  };

  const getApprovalBadge = (status?: string) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft", icon: <Clock className="w-3 h-3" /> },
      submitted: { variant: "outline" as const, label: "Submitted", icon: <Clock className="w-3 h-3" /> },
      approved: { variant: "default" as const, label: "Approved", icon: <CheckCircle className="w-3 h-3" /> },
      rejected: { variant: "destructive" as const, label: "Rejected", icon: <XCircle className="w-3 h-3" /> },
      closed: { variant: "secondary" as const, label: "Closed", icon: <CheckCircle className="w-3 h-3" /> },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      ordered: { variant: "outline" as const, label: "Ordered" },
      shipped: { variant: "default" as const, label: "Shipped" },
      received: { variant: "default" as const, label: "Received" },
      cancelled: { variant: "destructive" as const, label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      unpaid: { variant: "destructive" as const, label: "Unpaid" },
      partial: { variant: "outline" as const, label: "Partial" },
      paid: { variant: "default" as const, label: "Paid" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unpaid;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (purchaseOrders.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No purchase orders found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first purchase order to track your expenses
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate summary stats
  const totalPending = purchaseOrders.filter(po => po.payment_status === 'unpaid').reduce((sum, po) => sum + po.total, 0);
  const totalPaid = purchaseOrders.filter(po => po.payment_status === 'paid').reduce((sum, po) => sum + po.total, 0);
  const totalOverdue = purchaseOrders.filter(po => {
    if (!po.due_date) return false;
    return new Date(po.due_date) < new Date() && po.payment_status !== 'paid';
  }).reduce((sum, po) => sum + po.total, 0);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${totalPending.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalOverdue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Purchase Orders</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 mb-4">
            <Select value={vendorFilter} onValueChange={setVendorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Vendors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Vendors</SelectItem>
                {vendors.map(vendor => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Jobs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Jobs</SelectItem>
                {jobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Payment Status</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partial">Partially Paid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Approval Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Approval Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPOs.map((po) => {
                const job = jobs.find(j => j.id === po.job_id);
                const isOverdue = po.due_date && new Date(po.due_date) < new Date() && po.payment_status !== 'paid';
                
                return (
                  <TableRow key={po.id} className={isOverdue ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">{po.po_number}</TableCell>
                    <TableCell>{po.vendor_name}</TableCell>
                    <TableCell>{job?.title || '-'}</TableCell>
                    <TableCell>{getApprovalBadge(po.approval_status)}</TableCell>
                    <TableCell>{getStatusBadge(po.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(po.payment_status || 'unpaid')}</TableCell>
                    <TableCell className="font-semibold">${po.total.toFixed(2)}</TableCell>
                    <TableCell className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                      {po.due_date
                        ? format(new Date(po.due_date), 'MMM dd, yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(po)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete PO #{po.po_number}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(po.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}