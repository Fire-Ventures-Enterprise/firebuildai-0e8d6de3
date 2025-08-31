import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { VendorForm } from "@/components/vendors/VendorForm";
import { VendorList } from "@/components/vendors/VendorList";

interface Vendor {
  id: string;
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  payment_terms?: string;
  tax_rate?: number;
  default_category?: string;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.user.id)
        .order('company_name', { ascending: true });

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVendor = () => {
    setMode('create');
    setSelectedVendor(null);
    setShowForm(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setMode('edit');
    setSelectedVendor(vendor);
    setShowForm(true);
  };

  const handleDeleteVendor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive",
      });
    }
  };

  const handleSaveVendor = async () => {
    await fetchVendors();
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading vendors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vendors</h1>
        <Button onClick={handleCreateVendor}>
          <Plus className="mr-2 h-4 w-4" /> Add Vendor
        </Button>
      </div>

      <VendorList
        vendors={vendors}
        onEdit={handleEditVendor}
        onDelete={handleDeleteVendor}
      />

      {showForm && (
        <VendorForm
          open={showForm}
          onOpenChange={setShowForm}
          vendor={selectedVendor}
          mode={mode}
          onSave={handleSaveVendor}
        />
      )}
    </div>
  );
}