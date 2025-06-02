
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface UserListProps {
  currentChannel: string;
}

export const UserList: React.FC<UserListProps> = ({ currentChannel }) => {
  const users = [
    {
      id: 1,
      name: 'Alice Cooper',
      status: 'online',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
    },
    {
      id: 2,
      name: 'Bob Smith',
      status: 'away',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
    },
    {
      id: 3,
      name: 'Carol Johnson',
      status: 'online',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol'
    },
    {
      id: 4,
      name: 'David Wilson',
      status: 'offline',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const onlineUsers = users.filter(user => user.status === 'online');
  const awayUsers = users.filter(user => user.status === 'away');
  const offlineUsers = users.filter(user => user.status === 'offline');

  return (
    <div className="w-64 bg-slate-900/30 backdrop-blur-sm border-l border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-white">Members</span>
          <Badge variant="secondary" className="bg-white/10 text-slate-300">
            {users.length}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {onlineUsers.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Online — {onlineUsers.length}
              </h3>
              <div className="space-y-2">
                {onlineUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-slate-900`} />
                    </div>
                    <span className="text-sm text-slate-300 truncate">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {awayUsers.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Away — {awayUsers.length}
              </h3>
              <div className="space-y-2">
                {awayUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-slate-900`} />
                    </div>
                    <span className="text-sm text-slate-400 truncate">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {offlineUsers.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Offline — {offlineUsers.length}
              </h3>
              <div className="space-y-2">
                {offlineUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer opacity-60">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-slate-900`} />
                    </div>
                    <span className="text-sm text-slate-500 truncate">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
