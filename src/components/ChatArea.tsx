
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Smile, Paperclip, MoreVertical, Bot } from 'lucide-react';
import { Message } from './Message';
import { ToneImpactMeter } from './ToneImpactMeter';
import { MeetingNotesGen } from './MeetingNotesGen';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatAreaProps {
  currentChannel: string;
  currentUser: any;
  setCurrentThread: (thread: any) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  currentChannel,
  currentUser,
  setCurrentThread
}) => {
  const [message, setMessage] = useState('');
  const [showMeetingNotes, setShowMeetingNotes] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<any>(null);
  const { toast } = useToast();

  // Load messages when channel changes
  useEffect(() => {
    loadMessages();
  }, [currentChannel]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('New message received:', payload);
          loadMessageWithUser(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      // First, get the channel ID
      const { data: channelData, error: channelError } = await supabase
        .from('channels')
        .select('id')
        .eq('name', currentChannel)
        .single();

      if (channelError) {
        console.error('Error fetching channel:', channelError);
        return;
      }

      // Load messages for this channel
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          user_id,
          users!inner(display_name, username)
        `)
        .eq('channel_id', channelData.id)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return;
      }

      // Transform messages to match expected format
      const transformedMessages = messagesData?.map(msg => ({
        id: msg.id,
        user: {
          id: msg.user_id,
          name: msg.users?.display_name || msg.users?.username || 'Unknown User',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user_id}`
        },
        content: msg.content,
        timestamp: new Date(msg.created_at),
        replies: 0, // TODO: Implement reply counting
        channel: currentChannel
      })) || [];

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessageWithUser = async (messageData: any) => {
    try {
      // Get user info for the new message
      const { data: userData } = await supabase
        .from('users')
        .select('display_name, username')
        .eq('id', messageData.user_id)
        .single();

      const newMessage = {
        id: messageData.id,
        user: {
          id: messageData.user_id,
          name: userData?.display_name || userData?.username || 'Unknown User',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${messageData.user_id}`
        },
        content: messageData.content,
        timestamp: new Date(messageData.created_at),
        replies: 0,
        channel: currentChannel
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error loading message with user:', error);
    }
  };

  const channelMessages = messages.filter(msg => msg.channel === currentChannel);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;

    const messageContent = message.trim();
    setMessage(''); // Clear input immediately for better UX

    try {
      // Get the channel ID
      const { data: channelData, error: channelError } = await supabase
        .from('channels')
        .select('id')
        .eq('name', currentChannel)
        .single();

      if (channelError) {
        throw channelError;
      }

      // Save message to database
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          content: messageContent,
          channel_id: channelData.id,
          user_id: currentUser.id
        })
        .select()
        .single();

      if (messageError) {
        throw messageError;
      }

      // The real-time subscription will handle adding the message to the UI
      console.log('Message saved successfully:', messageData);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      // Restore message to input on error
      setMessage(messageContent);
    }
    
    // Scroll to bottom
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }, 100);
  };

  const handleReply = (messageId: number) => {
    console.log('handleReply called with messageId:', messageId);
    const threadMessage = messages.find(msg => msg.id === messageId);
    console.log('Found message:', threadMessage);
    if (threadMessage) {
      console.log('Setting current thread to:', threadMessage);
      setCurrentThread(threadMessage);
    } else {
      console.log('No message found with ID:', messageId);
    }
  };

  const handleMessageClick = (messageId: number) => {
    console.log('Message clicked, opening thread for message ID:', messageId);
    handleReply(messageId);
  };

  return (
    <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-sm">
      {/* Channel Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-white">
              #{currentChannel}
            </h2>
            <span className="text-slate-400">|</span>
            <span className="text-sm text-slate-400">{channelMessages.length} messages</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowMeetingNotes(!showMeetingNotes)}
              className="text-slate-400 hover:text-white"
            >
              <Bot className="w-4 h-4 mr-1" />
              Notes
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* AI Tools Panel */}
      {showMeetingNotes && (
        <div className="p-4 border-b border-white/10 space-y-4">
          <MeetingNotesGen
            messages={channelMessages}
            channelName={currentChannel}
          />
        </div>
      )}

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-slate-400">Loading messages...</div>
            </div>
          ) : channelMessages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No messages in #{currentChannel} yet.</p>
              <p className="text-sm text-slate-500 mt-1">Be the first to say something!</p>
            </div>
          ) : (
            channelMessages.map((msg) => (
              <Message
                key={msg.id}
                message={msg}
                currentUser={currentUser}
                onReply={() => handleReply(msg.id)}
                onMessageClick={() => handleMessageClick(msg.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10 space-y-4">
        {/* Tone Analysis - Show when user is typing */}
        {message.trim() && (
          <ToneImpactMeter message={message} />
        )}
        
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${currentChannel}`}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button 
            type="submit" 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
