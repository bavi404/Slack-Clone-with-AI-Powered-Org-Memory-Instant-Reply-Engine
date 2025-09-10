
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { UserList } from './UserList';
import { ThreadView } from './ThreadView';
import { OrgBrain } from './OrgBrain';
import { Button } from '@/components/ui/button';
import { Brain, X } from 'lucide-react';

interface LayoutProps {
  currentUser: any;
  currentChannel: string;
  setCurrentChannel: (channel: string) => void;
  currentThread: any;
  setCurrentThread: (thread: any) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  currentUser,
  currentChannel,
  setCurrentChannel,
  currentThread,
  setCurrentThread,
  onLogout
}) => {
  const [showOrgBrain, setShowOrgBrain] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden animated-gradient bg-[linear-gradient(120deg,_#0f172a,_#312e81,_#0f766e,_#4c1d95,_#0f172a)]">
      <Sidebar
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      
      <div className="flex-1 flex">
        <ChatArea
          currentChannel={currentChannel}
          currentUser={currentUser}
          setCurrentThread={setCurrentThread}
        />
        
        <UserList currentChannel={currentChannel} />
      </div>
      
      {/* OrgBrain Toggle Button */}
      {!showOrgBrain && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={() => setShowOrgBrain(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            size="sm"
          >
            <Brain className="w-4 h-4 mr-2" />
            Ask OrgBrain
          </Button>
        </div>
      )}
      
      {/* OrgBrain Panel */}
      {showOrgBrain && (
        <div className="w-96 relative">
          <div className="absolute top-2 right-2 z-10">
            <Button
              onClick={() => setShowOrgBrain(false)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <OrgBrain currentUser={currentUser} />
        </div>
      )}
      
      {currentThread && (
        <ThreadView
          thread={currentThread}
          currentUser={currentUser}
          onClose={() => setCurrentThread(null)}
        />
      )}
    </div>
  );
};
