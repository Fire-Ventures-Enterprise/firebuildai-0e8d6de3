import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Calendar, MapPin, User, Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { MVPLayout } from '@/layouts/MVPLayout';

interface Project {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  status: string;
  priority: string | null;
  start_date: string | null;
  end_date: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  budget: number | null;
  created_at: string;
  updated_at: string;
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    address: '',
    city: '',
    state: '',
    zip: '',
    budget: 0
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async () => {
    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProject.id);

        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([formData]);

        if (error) throw error;
        toast.success('Project created successfully');
      }

      setShowDialog(false);
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        address: '',
        city: '',
        state: '',
        zip: '',
        budget: 0
      });
      loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setShowDialog(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold">Projects</h1>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? "Try adjusting your filters"
                  : "Create your first project to get started"}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button onClick={() => setShowDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/mvp/projects/${project.id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                    <Badge variant={getStatusVariant(project.status)}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1">{project.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    {project.address && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">
                          {project.city && project.state 
                            ? `${project.city}, ${project.state}`
                            : project.address}
                        </span>
                      </div>
                    )}
                    
                    {project.start_date && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(project.start_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {project.budget && project.budget > 0 && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-semibold">Budget:</span>
                        <span>${project.budget.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProject(project);
                      }}
                    >
                      Edit
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
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={formData.priority || 'medium'} 
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state || ''}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                    maxLength={2}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input
                    id="zip"
                    value={formData.zip || ''}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                  placeholder="Project budget"
                  min="0"
                  step="100"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProject} disabled={!formData.name}>
                {editingProject ? 'Update' : 'Create'} Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MVPLayout>
  );
}