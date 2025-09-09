import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Send, Hash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AutoReplyComposer } from './AutoReplyComposer';
import { MeetingNotesGen } from './MeetingNotesGen';

interface ThreadViewProps {
  thread: any;
  currentUser: any;
  onClose: () => void;
}

export const ThreadView: React.FC<ThreadViewProps> = ({ thread, currentUser, onClose }) => {
  const [reply, setReply] = useState('');
  const [showAutoReply, setShowAutoReply] = useState(false);
  const [showMeetingNotes, setShowMeetingNotes] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    const newReply = {
      id: Date.now(),
      user: currentUser,
      content: reply,
      timestamp: new Date()
    };

    setReplies([...replies, newReply]);
    setReply('');
  };

  const handleSelectReply = (suggestedReply: string) => {
    setReply(suggestedReply);
    setShowAutoReply(false);
  };

  const allMessages = [thread, ...replies];

  return (
    <div className="w-96 bg-slate-900/50 backdrop-blur-sm border-l border-white/10 flex flex-col">
      {/* Thread Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
            <Hash className="w-3 h-3 text-slate-400" />
          </div>
          <span className="text-white font-medium">Thread</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMeetingNotes(!showMeetingNotes)}
            className="h-8 px-2 text-xs text-slate-400 hover:text-white"
          >
            Notes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAutoReply(!showAutoReply)}
            className="h-8 px-2 text-xs text-slate-400 hover:text-white"
          >
            AI Reply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* AI Tools */}
      {showMeetingNotes && (
        <div className="p-4 border-b border-white/10">
          <MeetingNotesGen
            messages={allMessages}
            channelName={`Thread: ${thread.content.substring(0, 30)}...`}
          />
        </div>
      )}

      {showAutoReply && (
        <div className="p-4 border-b border-white/10">
          <AutoReplyComposer
            threadMessages={allMessages}
            onSelectReply={handleSelectReply}
          />
        </div>
      )}

      {/* Original Message */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={thread.user.avatar} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {thread.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-white">{thread.user.name}</span>
              <span className="text-xs text-slate-400">
                {formatDistanceToNow(thread.timestamp, { addSuffix: true })}
              </span>
            </div>
            <div className="text-slate-300 break-words">{thread.content}</div>
          </div>
        </div>
      </div>

      {/* Replies */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {replies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-2">No replies yet</p>
              <p className="text-sm text-slate-500">
                Be the first to reply to this message
              </p>
            </div>
          ) : (
            replies.map((replyMsg) => (
              <div key={replyMsg.id} className="flex items-start space-x-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={replyMsg.user.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                    {replyMsg.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-white text-sm">{replyMsg.user.name}</span>
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(replyMsg.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <div className="text-slate-300 text-sm break-words">{replyMsg.content}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Reply Input */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSendReply} className="flex items-center space-x-2">
          <Input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Reply to thread..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!reply.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
