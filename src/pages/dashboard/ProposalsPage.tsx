import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/MVPAuthContext';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Send,
  CheckCircle,
  Clock,
  DollarSign,
  FileSignature,
  CreditCard,
  ArrowRight
} from 'lucide-react';

export default function ProposalsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchProposals();
    }
  }, [user]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      
      // For now, use empty array since proposals table needs migration
      setProposals([]);
      
      // TODO: Once proposals table is ready, use:
      // const { data, error } = await supabase
      //   .from('proposals')
      //   .select('*')
      //   .eq('created_by', user?.id);
      
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = () => {
    // Navigate to estimates and inform user to create estimate first
    toast.info('Create an estimate first, then convert it to a proposal');
    navigate('/dashboard/estimates');
  };

  const getWorkflowSteps = () => [
    { 
      title: 'Estimate', 
      icon: FileText, 
      completed: true,
      action: () => navigate('/dashboard/estimates')
    },
    { 
      title: 'Proposal', 
      icon: FileText, 
      active: true,
      action: () => {} 
    },
    { 
      title: 'Signature', 
      icon: FileSignature, 
      pending: true,
      action: () => {} 
    },
    { 
      title: 'Deposit', 
      icon: CreditCard, 
      pending: true,
      action: () => {} 
    },
    { 
      title: 'Invoice', 
      icon: DollarSign, 
      pending: true,
      action: () => navigate('/dashboard/invoices') 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Proposals & Signatures</h2>
          <p className="text-muted-foreground">
            Convert estimates to proposals and collect signatures & deposits
          </p>
        </div>
        <Button onClick={handleCreateProposal}>
          <Plus className="mr-2 h-4 w-4" />
          New Proposal
        </Button>
      </div>

      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Progress</CardTitle>
          <CardDescription>Track your project through each stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
            <div className="relative flex justify-between">
              {getWorkflowSteps().map((step, index) => {
                const Icon = step.icon;
                return (
                  <button
                    key={step.title}
                    onClick={step.action}
                    className="relative flex flex-col items-center group"
                    disabled={step.pending}
                  >
                    <div className={`
                      relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all
                      ${step.completed ? 'bg-green-100 border-green-500 text-green-700' : ''}
                      ${step.active ? 'bg-blue-100 border-blue-500 text-blue-700 ring-4 ring-blue-100' : ''}
                      ${step.pending ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                      ${!step.pending ? 'group-hover:scale-110 cursor-pointer' : 'cursor-not-allowed'}
                    `}>
                      <Icon className="h-5 w-5" />
                      {step.completed && (
                        <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-600 bg-white rounded-full" />
                      )}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${step.pending ? 'text-gray-400' : 'text-foreground'}`}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Digital Signatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Collect legally binding signatures directly from clients via email or text
            </p>
            <Button variant="outline" className="w-full mt-4" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Deposit Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Request and collect deposits automatically after proposal acceptance
            </p>
            <Button variant="outline" className="w-full mt-4" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Automated Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set automatic reminders for unsigned proposals and unpaid deposits
            </p>
            <Button variant="outline" className="w-full mt-4" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use the Workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
              1
            </div>
            <div>
              <h4 className="font-medium">Create an Estimate</h4>
              <p className="text-sm text-muted-foreground">
                Start by creating a detailed estimate with all line items and pricing
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
              2
            </div>
            <div>
              <h4 className="font-medium">Convert to Proposal</h4>
              <p className="text-sm text-muted-foreground">
                Add terms, conditions, and scope details to create a professional proposal
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
              3
            </div>
            <div>
              <h4 className="font-medium">Collect Signature</h4>
              <p className="text-sm text-muted-foreground">
                Send the proposal for electronic signature directly from the platform
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
              4
            </div>
            <div>
              <h4 className="font-medium">Request Deposit</h4>
              <p className="text-sm text-muted-foreground">
                Automatically request deposit payment after signature is collected
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
              5
            </div>
            <div>
              <h4 className="font-medium">Create Invoice & Work Order</h4>
              <p className="text-sm text-muted-foreground">
                Generate invoices for progress payments and work orders for your crew
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}