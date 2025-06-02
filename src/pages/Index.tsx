
import React, { useState } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { Layout } from '@/components/Layout';

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentChannel, setCurrentChannel] = useState('general');
  const [currentThread, setCurrentThread] = useState(null);

  const handleAuth = (user: any) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentChannel('general');
    setCurrentThread(null);
  };

  if (!currentUser) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <Layout
      currentUser={currentUser}
      currentChannel={currentChannel}
      setCurrentChannel={setCurrentChannel}
      currentThread={currentThread}
      setCurrentThread={setCurrentThread}
      onLogout={handleLogout}
    />
  );
};

export default Index;
