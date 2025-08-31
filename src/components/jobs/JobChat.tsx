import { useState, useEffect, useRef } from 'react';
import { Send, Users, X, UserPlus, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface JobChatProps {
  jobId: string;
  jobTitle: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role?: string;
  specialty?: string;
}

interface ChatMember {
  id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  member_details?: TeamMember;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender_details?: TeamMember;
}

export function JobChat({ jobId, jobTitle }: JobChatProps) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<ChatMember[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize or get chat room
  useEffect(() => {
    initializeChatRoom();
    loadTeamMembers();
  }, [jobId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!roomId) return;

    // Subscribe to new messages
    const messageChannel = supabase
      .channel(`room-${roomId}-messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const newMsg = payload.new as ChatMessage;
          // Fetch sender details
          const { data: memberData } = await supabase
            .from('team_members')
            .select('*')
            .eq('user_id', newMsg.sender_id)
            .single();
          
          setMessages((prev) => [...prev, { ...newMsg, sender_details: memberData }]);
          scrollToBottom();
        }
      )
      .subscribe();

    // Subscribe to member changes
    const memberChannel = supabase
      .channel(`room-${roomId}-members`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_room_members',
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          loadChatMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(memberChannel);
    };
  }, [roomId]);

  const initializeChatRoom = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if chat room exists for this job
      const { data: existingRoom } = await supabase
        .from('job_chat_rooms')
        .select('*')
        .eq('job_id', jobId)
        .single();

      if (existingRoom) {
        setRoomId(existingRoom.id);
        await loadChatData(existingRoom.id);
      } else {
        // Create new chat room
        const { data: newRoom, error } = await supabase
          .from('job_chat_rooms')
          .insert({
            job_id: jobId,
            name: `Chat: ${jobTitle}`,
            created_by: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        // Add creator as admin
        await supabase
          .from('chat_room_members')
          .insert({
            room_id: newRoom.id,
            user_id: user.id,
            role: 'admin',
          });

        setRoomId(newRoom.id);
        await loadChatData(newRoom.id);
      }
    } catch (error) {
      console.error('Error initializing chat room:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize chat room',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadChatData = async (roomId: string) => {
    await Promise.all([
      loadMessages(roomId),
      loadChatMembers(),
    ]);
  };

  const loadMessages = async (roomId: string) => {
    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch sender details separately
      if (messages && messages.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        const messagesWithDetails = messages.map((msg) => ({
          ...msg,
          sender_details: {
            id: msg.sender_id,
            name: 'Team Member',
            email: '',
          } as TeamMember,
        }));
        setMessages(messagesWithDetails);
      } else {
        setMessages([]);
      }
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadChatMembers = async () => {
    if (!roomId) return;
    
    try {
      const { data: membersData, error } = await supabase
        .from('chat_room_members')
        .select('*')
        .eq('room_id', roomId);

      if (error) throw error;
      
      // Type-safe member conversion
      const typedMembers: ChatMember[] = (membersData || []).map(member => ({
        id: member.id,
        user_id: member.user_id,
        role: member.role as 'admin' | 'member',
        joined_at: member.joined_at,
        member_details: {
          id: member.user_id,
          name: 'Team Member',
          email: '',
        } as TeamMember,
      }));
      
      setMembers(typedMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true);

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !roomId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          sender_id: user.id,
          message: newMessage.trim(),
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  const inviteTeamMember = async () => {
    if (!selectedMember || !roomId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if member is already in the room
      const isAlreadyMember = members.some(m => m.user_id === selectedMember);
      if (isAlreadyMember) {
        toast({
          title: 'Info',
          description: 'This team member is already in the chat',
        });
        return;
      }

      const { error } = await supabase
        .from('chat_room_members')
        .insert({
          room_id: roomId,
          user_id: selectedMember,
          role: 'member',
          invited_by: user.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Team member invited to chat',
      });
      setSelectedMember('');
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: 'Error',
        description: 'Failed to invite team member',
        variant: 'destructive',
      });
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Loading chat...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Job Chat
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              {members.length} members
            </Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Select a team member to add to this job's chat
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers
                        .filter(tm => !members.some(m => m.user_id === tm.id))
                        .map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-2">
                              <span>{member.name}</span>
                              {member.role && (
                                <Badge variant="outline" className="text-xs">
                                  {member.role}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={inviteTeamMember} 
                    disabled={!selectedMember}
                    className="w-full"
                  >
                    Send Invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {message.sender_details?.name?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {message.sender_details?.name || 'Unknown'}
                    </span>
                    {message.sender_details?.role && (
                      <Badge variant="outline" className="text-xs">
                        {message.sender_details.role}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}