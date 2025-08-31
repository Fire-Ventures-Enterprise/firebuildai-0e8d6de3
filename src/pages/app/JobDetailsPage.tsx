import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, AlertCircle, DollarSign, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { JobChat } from '@/components/jobs/JobChat';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  priority: string;
  start_date: string;
  end_date: string;
  progress: number;
  budget: number;
  actual_cost: number;
  notes: string;
  customer_id: string;
  customer?: {
    first_name: string;
    last_name: string;
    company_name: string;
  };
}

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;

      // Fetch customer details separately
      let customerData = null;
      if (jobData?.customer_id) {
        const { data: customer } = await supabase
          .from('customers')
          .select('first_name, last_name, company_name')
          .eq('id', jobData.customer_id)
          .single();
        customerData = customer;
      }

      setJob({
        ...jobData,
        customer: customerData || undefined,
      });
    } catch (error) {
      console.error('Error loading job details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-blue-500',
      'in-progress': 'bg-yellow-500',
      review: 'bg-purple-500',
      completed: 'bg-green-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityVariant = (priority: string): "default" | "secondary" | "outline" | "destructive" => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      low: 'secondary',
      medium: 'outline',
      high: 'default',
      urgent: 'destructive',
    };
    return variants[priority] || 'outline';
  };

  return (
    <div className="p-8">
      {/* Job Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <p className="text-muted-foreground">
              {job.customer?.company_name || `${job.customer?.first_name} ${job.customer?.last_name}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityVariant(job.priority)}>
              <AlertCircle className="w-3 h-3 mr-1" />
              {job.priority}
            </Badge>
            <Badge className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status)}`} />
              {job.status.replace('-', ' ')}
            </Badge>
          </div>
        </div>

        {/* Job Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Location</span>
              </div>
              <p className="font-medium">{job.location}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Timeline</span>
              </div>
              <p className="font-medium text-sm">
                {new Date(job.start_date).toLocaleDateString()} - {new Date(job.end_date).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Budget</span>
              </div>
              <p className="font-medium">${job.budget?.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={job.progress} className="flex-1" />
                <span className="text-sm font-medium">{job.progress}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Comprehensive overview of the job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{job.description || 'No description provided'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-muted-foreground">{job.notes || 'No notes added'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Financial Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <span>${job.budget?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Actual Cost:</span>
                      <span>${job.actual_cost?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Variance:</span>
                      <span className={job.actual_cost > job.budget ? 'text-destructive' : 'text-green-600'}>
                        ${((job.budget || 0) - (job.actual_cost || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks & Milestones</CardTitle>
              <CardDescription>Track job tasks and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Task management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>View and manage job schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Calendar integration coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Job-related documents and files</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Document management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <JobChat jobId={job.id} jobTitle={job.title} />
        </TabsContent>
      </Tabs>
    </div>
  );
}