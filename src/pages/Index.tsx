
import React, { useState, useEffect } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentChannel, setCurrentChannel] = useState('general');
  const [currentThread, setCurrentThread] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user profile from database
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const user = {
            id: session.user.id,
            name: profile?.display_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
            status: 'online'
          };
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentChannel('general');
        setCurrentThread(null);
      } else if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const user = {
          id: session.user.id,
          name: profile?.display_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
          status: 'online'
        };
        setCurrentUser(user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = (user: any) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

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
