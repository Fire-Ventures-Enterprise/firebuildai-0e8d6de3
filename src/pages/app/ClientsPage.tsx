import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Users,
  Search, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  DollarSign,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AddCustomerDialog } from "@/components/shared/AddCustomerDialog";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  created_at: string;
  job_count: number;
  total_revenue: number;
  last_job_date?: string;
  status: 'active' | 'inactive';
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data: customersData, error } = await supabase
        .from('customers')
        .select(`
          *,
          jobs!jobs_customer_id_fkey(
            id,
            created_at,
            budget
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedClients = customersData?.map(customer => ({
        id: customer.id,
        name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.company_name || 'Unnamed',
        email: customer.email || '',
        phone: customer.phone || '',
        address: `${customer.address || ''} ${customer.city || ''} ${customer.province || ''}`.trim() || undefined,
        created_at: customer.created_at,
        job_count: Array.isArray(customer.jobs) ? customer.jobs.length : 0,
        total_revenue: Array.isArray(customer.jobs) ? customer.jobs.reduce((sum: number, job: any) => sum + (job.budget || 0), 0) : 0,
        last_job_date: Array.isArray(customer.jobs) && customer.jobs.length > 0 ? customer.jobs[0].created_at : undefined,
        status: (Array.isArray(customer.jobs) && customer.jobs.length > 0) ? 'active' : 'inactive' as 'active' | 'inactive'
      })) || [];

      setClients(formattedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  const totalRevenue = clients.reduce((sum, client) => sum + client.total_revenue, 0);
  const activeClients = clients.filter(c => c.status === 'active').length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header - Mobile responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage your customer relationships</p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="w-full sm:w-auto bg-gradient-primary shadow-elegant"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Metrics - Mobile responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search clients by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clients - Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <Card className="p-4">
            <p className="text-center text-muted-foreground">Loading clients...</p>
          </Card>
        ) : filteredClients.length === 0 ? (
          <Card className="p-4">
            <p className="text-center text-muted-foreground">No clients found</p>
          </Card>
        ) : (
          filteredClients.map((client) => (
            <Card key={client.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{client.name}</p>
                  {client.address && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {client.address}
                    </p>
                  )}
                </div>
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Contact</p>
                  <p className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {client.email || '-'}
                  </p>
                  <p className="flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" />
                    {client.phone || '-'}
                  </p>
                </div>
                
                <div>
                  <p className="text-muted-foreground mb-1">Activity</p>
                  <p className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {client.job_count} jobs
                  </p>
                  <p className="flex items-center gap-1 mt-1">
                    <DollarSign className="w-3 h-3" />
                    ${client.total_revenue.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {client.last_job_date && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Last activity: {new Date(client.last_job_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Clients Table - Desktop Only */}
      <Card className="hidden sm:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Jobs</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading clients...
                  </TableCell>
                </TableRow>
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        {client.address && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {client.address}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {client.email || '-'}
                        </p>
                        <p className="text-sm flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {client.phone || '-'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        {client.job_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        {client.total_revenue.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client.last_job_date ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(client.last_job_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Client Dialog */}
      <AddCustomerDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCustomerCreated={() => {
          loadClients();
          setShowAddDialog(false);
        }}
      />
    </div>
  );
}