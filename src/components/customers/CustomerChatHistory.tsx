import { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface CustomerChatHistoryProps {
  customerId: string;
}

interface JobChat {
  id: string;
  job_id: string;
  name: string;
  created_at: string;
  job?: {
    id: string;
    title: string;
    status: string;
  };
  message_count?: number;
  member_count?: number;
  last_message_at?: string;
}

export function CustomerChatHistory({ customerId }: CustomerChatHistoryProps) {
  const [chatRooms, setChatRooms] = useState<JobChat[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomerChats();
  }, [customerId]);

  const loadCustomerChats = async () => {
    try {
      // First get all jobs for this customer
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, status')
        .eq('customer_id', customerId);

      if (jobsError) throw jobsError;

      if (!jobs || jobs.length === 0) {
        setChatRooms([]);
        setLoading(false);
        return;
      }

      // Get all chat rooms for these jobs
      const jobIds = jobs.map(j => j.id);
      const { data: rooms, error: roomsError } = await supabase
        .from('job_chat_rooms')
        .select('*')
        .in('job_id', jobIds);

      if (roomsError) throw roomsError;

      // Get message counts and member counts for each room
      const roomsWithDetails = await Promise.all(
        (rooms || []).map(async (room) => {
          const job = jobs.find(j => j.id === room.job_id);
          
          // Get message count
          const { count: messageCount } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id);

          // Get member count
          const { count: memberCount } = await supabase
            .from('chat_room_members')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id);

          // Get last message time
          const { data: lastMessage } = await supabase
            .from('chat_messages')
            .select('created_at')
            .eq('room_id', room.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...room,
            job,
            message_count: messageCount || 0,
            member_count: memberCount || 0,
            last_message_at: lastMessage?.created_at,
          };
        })
      );

      setChatRooms(roomsWithDetails);
    } catch (error) {
      console.error('Error loading customer chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-blue-500',
      'in-progress': 'bg-yellow-500',
      review: 'bg-purple-500',
      completed: 'bg-green-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading chat history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Communication History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chatRooms.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No chat rooms associated with this customer's jobs yet.
          </p>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {chatRooms.map((room) => (
                <Card 
                  key={room.id} 
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/app/jobs/${room.job_id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{room.job?.title || 'Unknown Job'}</h4>
                        <p className="text-sm text-muted-foreground">{room.name}</p>
                      </div>
                      {room.job?.status && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(room.job.status)}`} />
                          {room.job.status.replace('-', ' ')}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {room.message_count} messages
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {room.member_count} members
                      </div>
                      {room.last_message_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Last activity: {new Date(room.last_message_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}