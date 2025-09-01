import { useState, useEffect } from "react";
import { Plus, Mail, Phone, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'contractor' | 'employee';
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
}

export default function TeamsPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'employee' as TeamMember['role'],
    status: 'active' as TeamMember['status']
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeamMembers((data || []).map((member: any) => ({
        ...member,
        status: member.status || (member.active ? 'active' : 'inactive')
      })));
    } catch (error: any) {
      toast.error("Failed to load team members");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('team_members' as any)
        .insert({
          ...formData,
          user_id: userData.user.id,
          added_by: userData.user.id
        });

      if (error) throw error;

      toast.success("Team member added successfully");
      setIsOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'employee',
        status: 'active'
      });
      fetchTeamMembers();
    } catch (error: any) {
      toast.error(error.message || "Failed to add team member");
      console.error(error);
    }
  };

  const handleStatusChange = async (memberId: string, newStatus: TeamMember['status']) => {
    try {
      const { error } = await supabase
        .from('team_members' as any)
        .update({ status: newStatus })
        .eq('id', memberId);

      if (error) throw error;

      toast.success("Status updated successfully");
      fetchTeamMembers();
    } catch (error: any) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const getRoleBadgeColor = (role: TeamMember['role']) => {
    const colors = {
      admin: 'bg-destructive text-destructive-foreground',
      manager: 'bg-primary text-primary-foreground',
      contractor: 'bg-secondary text-secondary-foreground',
      employee: 'bg-muted text-muted-foreground'
    };
    return colors[role];
  };

  const getStatusBadgeColor = (status: TeamMember['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[status];
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-muted-foreground">Loading team members...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground mt-2">Manage your team members and contractors</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: TeamMember['role']) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: TeamMember['status']) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddMember} className="w-full">
                Add Team Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <UserCircle className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge className={getRoleBadgeColor(member.role)} variant="secondary">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                <Badge className={getStatusBadgeColor(member.status)} variant="outline">
                  {member.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  {member.email}
                </div>
                {member.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    {member.phone}
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Select
                  value={member.status}
                  onValueChange={(value: TeamMember['status']) => handleStatusChange(member.id, value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <UserCircle className="h-12 w-12 mx-auto mb-4" />
            <p>No team members added yet.</p>
            <p className="mt-2">Click the button above to add your first team member.</p>
          </div>
        </Card>
      )}
    </div>
  );
}