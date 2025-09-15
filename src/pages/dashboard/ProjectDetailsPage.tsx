import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/MVPAuthContext';
import { toast } from 'sonner';
import {
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  Edit,
  Eye,
  Download,
  Send,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Hammer
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  icon: React.ElementType;
  action?: () => void;
}

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'estimate',
      title: 'Estimate',
      description: 'Create and send estimate',
      status: project?.estimate_id ? 'completed' : 'pending',
      icon: FileText,
      action: () => navigate(`/dashboard/estimates/new?project=${id}`)
    },
    {
      id: 'proposal',
      title: 'Proposal',
      description: 'Generate proposal document',
      status: project?.proposal_id ? 'completed' : project?.estimate_id ? 'in_progress' : 'pending',
      icon: FileText,
      action: () => navigate(`/dashboard/proposals/new?project=${id}`)
    },
    {
      id: 'signature',
      title: 'Signature',
      description: 'Collect client signature',
      status: project?.signature_id ? 'completed' : project?.proposal_id ? 'in_progress' : 'pending',
      icon: CheckCircle,
      action: () => navigate(`/dashboard/signatures/request?project=${id}`)
    },
    {
      id: 'deposit',
      title: 'Deposit',
      description: 'Collect initial deposit',
      status: project?.deposit_id ? 'completed' : project?.signature_id ? 'in_progress' : 'pending',
      icon: DollarSign,
      action: () => navigate(`/dashboard/deposits/request?project=${id}`)
    },
    {
      id: 'invoice',
      title: 'Invoice',
      description: 'Create and send invoices',
      status: project?.has_invoices ? 'completed' : project?.deposit_id ? 'in_progress' : 'pending',
      icon: FileText,
      action: () => navigate(`/dashboard/invoices/new?project=${id}`)
    },
    {
      id: 'work_order',
      title: 'Work Order',
      description: 'Create work orders for crew',
      status: project?.has_work_orders ? 'completed' : project?.has_invoices ? 'in_progress' : 'pending',
      icon: Hammer,
      action: () => navigate(`/dashboard/work-orders/new?project=${id}`)
    }
  ];

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id!)
        .single();

      if (projectError) throw projectError;

      // Check for estimates
      const { data: estimates } = await supabase
        .from('project_estimates')
        .select('id')
        .eq('project_id', id!)
        .limit(1);

      // Check for proposals, invoices, and work orders
      // Skip proposals check for now due to type issues
      const proposalCheck = { data: null };

      const invoiceCheck = id ? await supabase
        .from('project_invoices')
        .select('id')
        .eq('project_id', id)
        .limit(1) : { data: null };

      const workOrderCheck = id ? await supabase
        .from('work_orders_mvp')
        .select('id')
        .eq('project_id', id)
        .limit(1) : { data: null };

      setProject({
        ...projectData,
        estimate_id: estimates?.[0]?.id,
        proposal_id: proposalCheck.data?.[0]?.id,
        signature_id: null, // Signatures table to be implemented
        deposit_id: null, // Deposits table to be implemented
        has_invoices: !!(invoiceCheck.data && invoiceCheck.data.length > 0),
        has_work_orders: !!(workOrderCheck.data && workOrderCheck.data.length > 0)
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">Project not found</h3>
        <Button onClick={() => navigate('/dashboard/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              {project.address}
            </div>
            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/dashboard/projects/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Project Workflow</CardTitle>
          <CardDescription>Track progress through each stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
            <div className="relative grid grid-cols-6 gap-4">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="relative">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={step.action}
                        disabled={step.status === 'pending' && index > 0 && workflowSteps[index - 1].status !== 'completed'}
                        className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${getStepStatus(step)} ${
                          step.status !== 'pending' ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {step.status === 'completed' && (
                          <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-600 bg-white rounded-full" />
                        )}
                      </button>
                      <div className="mt-2 text-center">
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{project.type || 'Residential'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">${project.budget?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium">{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.client ? (
                  <>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{project.client.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{project.client.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{project.client.phone}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No client assigned</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Add Client
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
              <CardDescription>All documents related to this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {project.estimate_id && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Estimate</p>
                        <p className="text-sm text-muted-foreground">Created on {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
                {!project.estimate_id && (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No documents yet</p>
                    <Button onClick={() => navigate(`/dashboard/estimates/new?project=${id}`)} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Estimate
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">${project.budget?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">$0</p>
                    <p className="text-sm text-muted-foreground">Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">${project.budget?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                  </div>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Schedule</CardTitle>
              <CardDescription>Timeline and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No schedule created yet</p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Messages</CardTitle>
              <CardDescription>Communication with client and team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No messages yet</p>
                <Button className="mt-4">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}