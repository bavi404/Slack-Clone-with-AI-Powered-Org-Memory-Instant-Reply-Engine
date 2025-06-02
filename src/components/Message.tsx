
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, MoreHorizontal, Smile, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MessageProps {
  message: any;
  currentUser: any;
  onReply: () => void;
  onMessageClick?: () => void;
}

export const Message: React.FC<MessageProps> = ({ message, currentUser, onReply, onMessageClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatContent = (content: string) => {
    // Simple mention highlighting
    return content.replace(/@(\w+)/g, '<span class="bg-blue-600/30 text-blue-300 px-1 rounded">@$1</span>');
  };

  const handleMessageClick = () => {
    console.log('Message clicked:', message);
    if (onMessageClick) {
      onMessageClick();
    }
  };

  return (
    <div
      className="group flex items-start space-x-3 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleMessageClick}
    >
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage src={message.user.avatar} />
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          {message.user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-white">{message.user.name}</span>
          <span className="text-xs text-slate-400">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
        </div>
        
        <div 
          className="text-slate-300 break-words"
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
        />
        
        {message.replies > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onReply();
            }}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 p-1 h-auto"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            {message.replies} {message.replies === 1 ? 'reply' : 'replies'}
          </Button>
        )}
      </div>
      
      {isHovered && (
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Smile className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onReply();
            }}
            className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-white/10"
          >
            <Reply className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
