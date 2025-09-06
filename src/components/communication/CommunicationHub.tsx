import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Users, 
  Building, 
  HardHat,
  Briefcase,
  Search,
  Filter,
  Plus,
  Bell,
  Settings,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { CommunicationHubService, type CommunicationChannel, type ChannelType } from '@/services/communicationHub';
import { ChannelList } from './ChannelList';
import { MessageThread } from './MessageThread';
import { TemplateManager } from './TemplateManager';
import { useToast } from '@/hooks/use-toast';

interface CommunicationHubProps {
  projectId?: string;
  jobId?: string;
}

export function CommunicationHub({ projectId, jobId }: CommunicationHubProps) {
  const [channels, setChannels] = useState<CommunicationChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<CommunicationChannel | null>(null);
  const [activeTab, setActiveTab] = useState<ChannelType>('internal');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadChannels();
  }, [activeTab, projectId, jobId]);

  const loadChannels = async () => {
    try {
      setLoading(true);
      const data = await CommunicationHubService.getChannels({
        channel_type: activeTab,
        project_id: projectId,
        job_id: jobId
      });
      setChannels(data);
      if (data.length > 0 && !selectedChannel) {
        setSelectedChannel(data[0]);
      }
    } catch (error) {
      console.error('Error loading channels:', error);
      toast({
        title: 'Error',
        description: 'Failed to load communication channels',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewChannel = async () => {
    try {
      const channelName = prompt('Enter channel name:');
      if (!channelName) return;

      const newChannel = await CommunicationHubService.createChannel({
        name: channelName,
        channel_type: activeTab,
        project_id: projectId,
        job_id: jobId
      });

      setChannels([newChannel, ...channels]);
      setSelectedChannel(newChannel);
      
      toast({
        title: 'Success',
        description: 'Channel created successfully',
      });
    } catch (error) {
      console.error('Error creating channel:', error);
      toast({
        title: 'Error',
        description: 'Failed to create channel',
        variant: 'destructive',
      });
    }
  };

  const getTabIcon = (type: ChannelType) => {
    switch (type) {
      case 'internal':
        return <Users className="w-4 h-4" />;
      case 'client':
        return <Building className="w-4 h-4" />;
      case 'contractor':
        return <HardHat className="w-4 h-4" />;
      case 'subcontractor':
        return <Briefcase className="w-4 h-4" />;
      case 'project':
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTabLabel = (type: ChannelType) => {
    switch (type) {
      case 'internal':
        return 'Internal Team';
      case 'client':
        return 'Clients';
      case 'contractor':
        return 'Contractors';
      case 'subcontractor':
        return 'Subcontractors';
      case 'project':
        return 'Project';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Communication Hub
              </CardTitle>
              <CardDescription>
                Centralized communication with all stakeholders
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-[calc(100%-80px)]">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ChannelType)} className="h-full">
            <div className="border-b px-4">
              <TabsList className="h-12 bg-transparent p-0 gap-4">
                {(['internal', 'client', 'contractor', 'subcontractor', 'project'] as ChannelType[]).map((type) => (
                  <TabsTrigger 
                    key={type} 
                    value={type}
                    className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3"
                  >
                    {getTabIcon(type)}
                    <span>{getTabLabel(type)}</span>
                    {channels.filter(c => c.channel_type === type).length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 px-1">
                        {channels.filter(c => c.channel_type === type).length}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {(['internal', 'client', 'contractor', 'subcontractor', 'project'] as ChannelType[]).map((type) => (
              <TabsContent key={type} value={type} className="h-[calc(100%-48px)] m-0">
                <div className="flex h-full">
                  {/* Channel List Sidebar */}
                  <div className="w-80 border-r flex flex-col">
                    <div className="p-4 border-b space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search channels..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Button 
                        onClick={createNewChannel}
                        className="w-full"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Channel
                      </Button>
                    </div>
                    
                    <ScrollArea className="flex-1">
                      <ChannelList
                        channels={channels.filter(c => 
                          c.channel_type === type &&
                          c.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )}
                        selectedChannel={selectedChannel}
                        onSelectChannel={setSelectedChannel}
                      />
                    </ScrollArea>
                  </div>

                  {/* Message Thread Area */}
                  <div className="flex-1">
                    {selectedChannel ? (
                      <MessageThread 
                        channel={selectedChannel}
                        onRefresh={loadChannels}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Select a channel to view messages</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}