import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MessageSquare, Users, AlertCircle } from 'lucide-react';
import type { CommunicationChannel } from '@/services/communicationHub';

interface ChannelListProps {
  channels: CommunicationChannel[];
  selectedChannel: CommunicationChannel | null;
  onSelectChannel: (channel: CommunicationChannel) => void;
}

export function ChannelList({ channels, selectedChannel, onSelectChannel }: ChannelListProps) {
  return (
    <div className="p-2">
      {channels.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No channels found</p>
        </div>
      ) : (
        channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onSelectChannel(channel)}
            className={cn(
              "w-full text-left p-3 rounded-lg transition-colors mb-1",
              "hover:bg-accent",
              selectedChannel?.id === channel.id && "bg-accent"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <h4 className="font-medium truncate">{channel.name}</h4>
                </div>
                {channel.metadata?.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {channel.metadata.lastMessage}
                  </p>
                )}
              </div>
              {channel.metadata?.unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {channel.metadata.unreadCount}
                </Badge>
              )}
            </div>
          </button>
        ))
      )}
    </div>
  );
}