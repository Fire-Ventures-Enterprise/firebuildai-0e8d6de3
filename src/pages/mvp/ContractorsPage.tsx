import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Phone, Mail, Wrench, Star, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { MVPLayout } from '@/layouts/MVPLayout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Contractor {
  id: string;
  company_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  trade: string | null;
  license_number: string | null;
  insurance_info: string | null;
  rating: number | null;
  hourly_rate: number | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const TRADES = [
  'General Contractor',
  'Electrician',
  'Plumber',
  'HVAC',
  'Carpenter',
  'Painter',
  'Roofer',
  'Flooring',
  'Landscaping',
  'Mason',
  'Drywall',
  'Concrete',
  'Other'
];

export function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrade, setFilterTrade] = useState<string>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contractorToDelete, setContractorToDelete] = useState<Contractor | null>(null);
  const [formData, setFormData] = useState<Partial<Contractor>>({
    name: '',
    email: '',
    phone: '',
    trade: '',
    license_number: '',
    insurance_info: '',
    rating: 5,
    hourly_rate: 0,
    notes: '',
    is_active: true
  });
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadContractors();
    }
  }, [user]);

  const loadContractors = async () => {
    try {
      const { data, error } = await supabase
        .from('contractors')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setContractors(data || []);
    } catch (error) {
      console.error('Error loading contractors:', error);
      toast.error('Failed to load contractors');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContractor = async () => {
    try {
      if (editingContractor) {
        const { error } = await supabase
          .from('contractors')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingContractor.id);

        if (error) throw error;
        toast.success('Contractor updated successfully');
      } else {
        const { error } = await supabase
          .from('contractors')
          .insert([formData]);

        if (error) throw error;
        toast.success('Contractor added successfully');
      }

      setShowDialog(false);
      setEditingContractor(null);
      resetForm();
      loadContractors();
    } catch (error) {
      console.error('Error saving contractor:', error);
      toast.error('Failed to save contractor');
    }
  };

  const handleDeleteContractor = async () => {
    if (!contractorToDelete) return;

    try {
      const { error } = await supabase
        .from('contractors')
        .delete()
        .eq('id', contractorToDelete.id);

      if (error) throw error;
      toast.success('Contractor deleted successfully');
      setShowDeleteDialog(false);
      setContractorToDelete(null);
      loadContractors();
    } catch (error) {
      console.error('Error deleting contractor:', error);
      toast.error('Failed to delete contractor');
    }
  };

  const handleEditContractor = (contractor: Contractor) => {
    setEditingContractor(contractor);
    setFormData(contractor);
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      trade: '',
      license_number: '',
      insurance_info: '',
      rating: 5,
      hourly_rate: 0,
      notes: '',
      is_active: true
    });
  };

  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contractor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contractor.phone?.includes(searchTerm);
    const matchesTrade = filterTrade === 'all' || contractor.trade === filterTrade;
    return matchesSearch && matchesTrade;
  });

  const renderStars = (rating: number | null) => {
    const stars = [];
    const actualRating = rating || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= actualRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  if (loading) {
    return (
      <MVPLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MVPLayout>
    );
  }

  return (
    <MVPLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Contractors</h1>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contractor
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contractors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterTrade} onValueChange={setFilterTrade}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by trade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trades</SelectItem>
              {TRADES.map(trade => (
                <SelectItem key={trade} value={trade}>{trade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contractors Grid */}
        {filteredContractors.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No contractors found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterTrade !== 'all' 
                  ? "Try adjusting your filters"
                  : "Add your first contractor to get started"}
              </p>
              {!searchTerm && filterTrade === 'all' && (
                <Button onClick={() => setShowDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contractor
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContractors.map((contractor) => (
              <Card key={contractor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{contractor.name}</CardTitle>
                      {contractor.trade && (
                        <Badge variant="secondary" className="mt-1">
                          {contractor.trade}
                        </Badge>
                      )}
                    </div>
                    <Badge variant={contractor.is_active ? "default" : "outline"}>
                      {contractor.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contractor.rating && renderStars(contractor.rating)}
                  
                  <div className="space-y-2 text-sm">
                    {contractor.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${contractor.email}`} className="hover:text-primary">
                          {contractor.email}
                        </a>
                      </div>
                    )}
                    
                    {contractor.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${contractor.phone}`} className="hover:text-primary">
                          {contractor.phone}
                        </a>
                      </div>
                    )}

                    {contractor.hourly_rate && contractor.hourly_rate > 0 && (
                      <div className="text-muted-foreground">
                        <span className="font-semibold">Rate:</span> ${contractor.hourly_rate}/hr
                      </div>
                    )}

                    {contractor.license_number && (
                      <div className="text-muted-foreground">
                        <span className="font-semibold">License:</span> {contractor.license_number}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditContractor(contractor)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setContractorToDelete(contractor);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContractor ? 'Edit Contractor' : 'Add New Contractor'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contractor name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="trade">Trade</Label>
                  <Select 
                    value={formData.trade || ''} 
                    onValueChange={(value) => setFormData({ ...formData, trade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trade" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRADES.map(trade => (
                        <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hourly_rate">Hourly Rate</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    value={formData.hourly_rate || ''}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) || 0 })}
                    placeholder="$/hour"
                    min="0"
                    step="10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    value={formData.license_number || ''}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    placeholder="License #"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Select 
                    value={String(formData.rating || 5)} 
                    onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={String(num)}>
                          {num} Star{num !== 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="insurance_info">Insurance Information</Label>
                <Textarea
                  id="insurance_info"
                  value={formData.insurance_info || ''}
                  onChange={(e) => setFormData({ ...formData, insurance_info: e.target.value })}
                  placeholder="Insurance details"
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowDialog(false);
                setEditingContractor(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleSaveContractor} disabled={!formData.name}>
                {editingContractor ? 'Update' : 'Add'} Contractor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {contractorToDelete?.name}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteContractor}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MVPLayout>
  );
}