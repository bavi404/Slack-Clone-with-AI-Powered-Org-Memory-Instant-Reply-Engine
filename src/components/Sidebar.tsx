
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hash, Plus, Users, Settings, LogOut, MessageSquare, Brain } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  currentChannel: string;
  setCurrentChannel: (channel: string) => void;
  currentUser: any;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentChannel,
  setCurrentChannel,
  currentUser,
  onLogout
}) => {
  const [channels] = useState([
    { id: 'general', name: 'general', unread: 0 },
    { id: 'random', name: 'random', unread: 2 },
    { id: 'development', name: 'development', unread: 0 },
    { id: 'design', name: 'design', unread: 1 },
    { id: 'marketing', name: 'marketing', unread: 0 }
  ]);

  return (
    <div className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold">ChatFlow</h1>
            <p className="text-xs text-slate-400">Workspace</p>
          </div>
        </div>
      </div>

      {/* Channels */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* AI Assistant Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">AI Assistant</h3>
            </div>
            <div className="space-y-1">
              <div className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="flex-1">OrgBrain</span>
                <span className="text-xs bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded">AI</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Channels</h3>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setCurrentChannel(channel.id)}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                    currentChannel === channel.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span className="flex-1">{channel.name}</span>
                  {channel.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Direct Messages</h3>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              <button className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-colors text-slate-300 hover:bg-white/10 hover:text-white">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Alice Cooper</span>
              </button>
              <button className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-colors text-slate-300 hover:bg-white/10 hover:text-white">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Bob Smith</span>
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentUser?.name}</p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onLogout}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
