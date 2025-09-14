import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  UserPlus, 
  Users,
  Search,
  ChevronRight
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
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      // Fetch customers first
      const { data: customersData, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch jobs separately (optional - only if jobs table exists)
      let jobsData: any[] = [];
      try {
        const { data: jobs } = await supabase
          .from('jobs')
          .select('id, customer_id, created_at, budget');
        
        if (jobs) jobsData = jobs;
      } catch (jobError) {
        // Jobs table might not exist yet, continue without it
        console.log('Jobs data not available');
      }

      const formattedClients = customersData?.map(customer => {
        // Find jobs for this customer
        const customerJobs = jobsData.filter(job => job.customer_id === customer.id);
        
        return {
          id: customer.id,
          name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.company_name || 'Unnamed',
          email: customer.email || '',
          phone: customer.phone || '',
          address: `${customer.address || ''} ${customer.city || ''} ${customer.province || ''}`.trim() || undefined,
          created_at: customer.created_at,
          job_count: customerJobs.length,
          total_revenue: customerJobs.reduce((sum: number, job: any) => sum + (job.budget || 0), 0),
          last_job_date: customerJobs.length > 0 ? customerJobs[0].created_at : undefined,
          status: customerJobs.length > 0 ? 'active' : 'inactive' as 'active' | 'inactive'
        };
      }) || [];

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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clients List - Simple Clickable Names */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading clients...</p>
          ) : filteredClients.length === 0 ? (
            <p className="text-center text-muted-foreground">No clients found</p>
          ) : (
            <div className="space-y-2">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => navigate(`/app/customers/${client.id}`)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <span className="font-medium">{client.name}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
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