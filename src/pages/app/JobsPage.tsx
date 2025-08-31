import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JobCard } from '@/components/JobCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  customer_id: string;
  customer?: {
    first_name: string;
    last_name: string;
    company_name: string;
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewJobDialog, setShowNewJobDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // New job form state
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    status: 'planning',
    priority: 'medium',
    customer_id: '',
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Load customer details for each job
      const jobsWithCustomers = await Promise.all(
        (jobsData || []).map(async (job) => {
          if (job.customer_id) {
            const { data: customer } = await supabase
              .from('customers')
              .select('first_name, last_name, company_name')
              .eq('id', job.customer_id)
              .single();
            return { ...job, customer };
          }
          return job;
        })
      );

      setJobs(jobsWithCustomers);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load jobs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createJob = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('jobs')
        .insert({
          ...newJob,
          user_id: user.id,
          progress: 0,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Job created successfully',
      });

      setShowNewJobDialog(false);
      setNewJob({
        title: '',
        description: '',
        location: '',
        status: 'planning',
        priority: 'medium',
        customer_id: '',
      });
      loadJobs();
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to create job',
        variant: 'destructive',
      });
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.customer?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const jobCardData = filteredJobs.map((job) => ({
    id: job.id,
    title: job.title,
    client: job.customer?.company_name || `${job.customer?.first_name} ${job.customer?.last_name}` || 'Unknown',
    location: job.location,
    progress: job.progress,
    priority: job.priority as 'low' | 'medium' | 'high' | 'urgent',
    assignedTo: [], // This would come from team assignments
    dueDate: new Date(job.end_date).toLocaleDateString(),
    status: job.status as 'planning' | 'in-progress' | 'review' | 'completed',
  }));

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Jobs</h1>
          <Dialog open={showNewJobDialog} onOpenChange={setShowNewJobDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Job</DialogTitle>
                <DialogDescription>
                  Add a new job to your project pipeline
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g., Kitchen Renovation"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    placeholder="Job details..."
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder="Job location"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={newJob.status} onValueChange={(value) => setNewJob({ ...newJob, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newJob.priority} onValueChange={(value) => setNewJob({ ...newJob, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
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
                <Button onClick={createJob} className="w-full">
                  Create Job
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' 
                ? 'No jobs found matching your criteria' 
                : 'No jobs yet. Create your first job to get started!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobCardData.map((job) => (
            <div 
              key={job.id} 
              onClick={() => navigate(`/app/jobs/${job.id}`)}
              className="cursor-pointer"
            >
              <JobCard {...job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}