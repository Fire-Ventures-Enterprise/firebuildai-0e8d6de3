import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search, Wrench, Plus, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { R } from "@/routes/routeMap";
import { GenerateFromInvoiceModal } from "@/components/workorders/GenerateFromInvoiceModal";

interface WorkOrder {
  id: string;
  title: string;
  invoice_id: string;
  invoice_number?: string;
  customer_name?: string;
  service_address?: string;
  starts_at: string;
  ends_at: string;
  status: 'issued' | 'in_progress' | 'completed' | 'cancelled';
  team_name?: string;
  created_at: string;
}

export default function WorkOrdersListPage() {
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

  // Debounce search input
  useEffect(() => {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    
    setSearchTimer(timer);
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    fetchWorkOrders();
  }, [debouncedSearch, statusFilter, teamFilter]);

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("work_orders")
        .select(`
          *,
          invoices_enhanced(id, invoice_number, customer_name)
        `)
        .order("starts_at", { ascending: false });

      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      // Apply search filter using OR conditions
      if (debouncedSearch.trim()) {
        const searchLower = debouncedSearch.toLowerCase();
        
        // Get initial data first to then filter in memory
        // This is because Supabase doesn't support complex OR queries across joins
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Filter in memory for complex search
        const filtered = (data || []).filter((wo: any) => {
          const matchId = wo.id.toLowerCase().includes(searchLower);
          const matchTitle = wo.title?.toLowerCase().includes(searchLower);
          const matchInvoiceNumber = wo.invoices_enhanced?.invoice_number?.toLowerCase().includes(searchLower);
          const matchCustomer = wo.invoices_enhanced?.customer_name?.toLowerCase().includes(searchLower);
          const matchAddress = wo.service_address?.toLowerCase().includes(searchLower);
          
          return matchId || matchTitle || matchInvoiceNumber || matchCustomer || matchAddress;
        });
        
        const formattedOrders: WorkOrder[] = filtered.map((wo: any) => ({
          id: wo.id,
          title: wo.title,
          invoice_id: wo.invoice_id,
          invoice_number: wo.invoices_enhanced?.invoice_number,
          customer_name: wo.invoices_enhanced?.customer_name,
          service_address: wo.service_address,
          starts_at: wo.starts_at,
          ends_at: wo.ends_at,
          status: wo.status,
          team_name: null,
          created_at: wo.created_at,
        }));
        
        setWorkOrders(formattedOrders);
      } else {
        // No search, just apply filters
        const { data, error } = await query;
        
        if (error) throw error;

        const formattedOrders: WorkOrder[] = (data || []).map((wo: any) => ({
          id: wo.id,
          title: wo.title,
          invoice_id: wo.invoice_id,
          invoice_number: wo.invoices_enhanced?.invoice_number,
          customer_name: wo.invoices_enhanced?.customer_name,
          service_address: wo.service_address,
          starts_at: wo.starts_at,
          ends_at: wo.ends_at,
          status: wo.status,
          team_name: null,
          created_at: wo.created_at,
        }));

        setWorkOrders(formattedOrders);
      }
    } catch (error: any) {
      toast.error("Failed to load work orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      issued: { variant: "secondary", label: "Issued" },
      in_progress: { variant: "default", label: "In Progress" },
      completed: { variant: "success", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };
    const config = variants[status] || variants.issued;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const hasAnyWorkOrders = workOrders.length > 0 || debouncedSearch || statusFilter !== "all";

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6" data-testid="wo-list">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Work Orders</h1>
          <p className="text-muted-foreground">Manage field work assignments</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by work order ID, invoice #, customer, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && loading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading && !searchQuery ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              Loading work orders...
            </div>
          ) : workOrders.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {hasAnyWorkOrders ? "No work orders found" : "No work orders yet"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {hasAnyWorkOrders
                  ? "Try adjusting your filters or search terms"
                  : "Work Orders are created from scheduled invoices. Generate one to dispatch your crew (no pricing is ever shown)."}
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setShowGenerateModal(true)}
                  data-testid="empty-btn-generate"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate from Invoice
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(R.invoices)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Go to Invoices
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Team</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((wo) => (
                  <TableRow
                    key={wo.id}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => navigate(R.workOrderDetail(wo.id))}
                    data-testid="wo-row"
                  >
                    <TableCell className="font-medium">{wo.title}</TableCell>
                    <TableCell>{wo.invoice_number || "—"}</TableCell>
                    <TableCell>{wo.customer_name || "—"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(new Date(wo.starts_at), "MMM d, h:mm a")}</div>
                        <div className="text-muted-foreground">
                          to {format(new Date(wo.ends_at), "h:mm a")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {wo.service_address || "—"}
                    </TableCell>
                    <TableCell>{getStatusBadge(wo.status)}</TableCell>
                    <TableCell>{wo.team_name || "Unassigned"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <GenerateFromInvoiceModal
        open={showGenerateModal}
        onClose={() => {
          setShowGenerateModal(false);
          // Refresh the list after modal closes
          fetchWorkOrders();
        }}
      />
    </div>
  );
}