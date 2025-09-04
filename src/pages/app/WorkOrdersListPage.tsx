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
import { Search, Filter, Calendar, Wrench, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { R } from "@/routes/routeMap";

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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");

  useEffect(() => {
    fetchWorkOrders();
  }, [statusFilter, teamFilter]);

  const fetchWorkOrders = async () => {
    try {
      let query = supabase
        .from("work_orders")
        .select(`
          *,
          invoices_enhanced!invoice_id(invoice_number, customer_name),
          teams:team_id(name)
        `)
        .order("starts_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

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
        team_name: wo.teams?.name,
        created_at: wo.created_at,
      }));

      setWorkOrders(formattedOrders);
    } catch (error: any) {
      toast.error("Failed to load work orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = workOrders.filter(wo => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      wo.title?.toLowerCase().includes(query) ||
      wo.invoice_number?.toLowerCase().includes(query) ||
      wo.customer_name?.toLowerCase().includes(query) ||
      wo.service_address?.toLowerCase().includes(query)
    );
  });

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

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
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
                placeholder="Search by title, invoice, customer, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
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
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading work orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No work orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Work orders will appear here when generated from invoices"}
              </p>
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
                {filteredOrders.map((wo) => (
                  <TableRow
                    key={wo.id}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => navigate(R.workOrderDetail(wo.id))}
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
    </div>
  );
}