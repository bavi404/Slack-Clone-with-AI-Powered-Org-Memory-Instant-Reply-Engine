
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Smile, Paperclip, MoreVertical, Bot } from 'lucide-react';
import { Message } from './Message';
import { ToneImpactMeter } from './ToneImpactMeter';
import { MeetingNotesGen } from './MeetingNotesGen';

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
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: {
        id: 2,
        name: 'Alice Cooper',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
      },
      content: 'Hey everyone! Welcome to the #general channel 👋',
      timestamp: new Date(Date.now() - 3600000),
      replies: 3,
      channel: 'general'
    },
    {
      id: 2,
      user: {
        id: 3,
        name: 'Bob Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
      },
      content: 'Thanks Alice! Excited to be here. @alice when is the next team meeting?',
      timestamp: new Date(Date.now() - 1800000),
      replies: 1,
      channel: 'general'
    },
    {
      id: 3,
      user: {
        id: 4,
        name: 'Carol Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol'
      },
      content: 'Check out this new design concept I\'ve been working on! What do you all think?',
      timestamp: new Date(Date.now() - 900000),
      replies: 0,
      channel: 'design'
    }
  ]);

  const scrollAreaRef = useRef<any>(null);

  const channelMessages = messages.filter(msg => msg.channel === currentChannel);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: currentUser,
      content: message,
      timestamp: new Date(),
      replies: 0,
      channel: currentChannel
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    
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
          {channelMessages.length === 0 ? (
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
