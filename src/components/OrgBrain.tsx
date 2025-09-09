
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Loader2, AlertCircle } from 'lucide-react';
import { AIService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OrgBrainProps {
  currentUser: any;
}

interface OrgBrainResponse {
  response: string;
  sources?: {
    channels: number;
    messages: number;
    documents: number;
  };
}

interface ChatMessage {
  id: string;
  type: 'user' | 'orgbrain';
  content: string;
  timestamp: Date;
  sources?: {
    channels: number;
    messages: number;
    documents: number;
  };
  error?: boolean;
}

export const OrgBrain: React.FC<OrgBrainProps> = ({ currentUser }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { toast } = useToast();


  const handleAskOrgBrain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, userMessage]);
    const currentQuery = query;
    setQuery('');
    setIsLoading(true);

    try {
      console.log('Sending OrgBrain query:', currentQuery);
      
      // Call the Supabase Edge Function directly
      const { data, error } = await supabase.functions.invoke('ask-org-brain', {
        body: { query: currentQuery }
      });

      if (error) {
        throw error;
      }

      console.log('OrgBrain response received:', data);

      // Handle the response from the Edge Function
      let responseText: string;
      let sources: any = undefined;

      if (typeof data === 'string') {
        responseText = data;
      } else if (data.response) {
        responseText = data.response;
        sources = data.sources;
      } else {
        responseText = JSON.stringify(data);
      }
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'orgbrain',
        content: responseText,
        timestamp: new Date(),
        sources: sources,
      };

      setChatHistory(prev => [...prev, botMessage]);

      toast({
        title: "Success",
        description: "OrgBrain has processed your query successfully.",
      });

    } catch (error) {
      console.error('OrgBrain Error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'orgbrain',
        content: `I apologize, but I encountered an error while processing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
        error: true,
      };

      setChatHistory(prev => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to get response from OrgBrain. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900/50 backdrop-blur-sm border-white/10 border rounded-lg">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <div className="flex items-center space-x-2 text-white mb-2">
          <Brain className="w-6 h-6 text-blue-400" />
          <span className="text-lg font-semibold">OrgBrain</span>
        </div>
        <p className="text-sm text-slate-400">
          Ask questions about your organization's channels and documents
        </p>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">Welcome to OrgBrain!</p>
                <p className="text-sm text-slate-500 mb-4">
                  Ask me anything about your organization's channels and documents.
                </p>
                <div className="mt-4 text-xs text-slate-500">
                  <p className="mb-2">Try asking:</p>
                  <ul className="space-y-1 text-left max-w-sm mx-auto">
                    <li>"What's being discussed in the development channel?"</li>
                    <li>"Any recent updates in general?"</li>
                    <li>"What are the latest messages about?"</li>
                    <li>"Show me what's happening in design channel"</li>
                    <li>"Summarize recent conversations"</li>
                  </ul>
                </div>
              </div>
            ) : (
              chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.error
                        ? 'bg-red-900/30 text-red-300 border border-red-500/30'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {message.type === 'orgbrain' && (
                      <div className="flex items-center space-x-2 mb-2">
                        {message.error ? (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          <Brain className="w-4 h-4 text-blue-400" />
                        )}
                        <span className={`text-xs font-medium ${message.error ? 'text-red-400' : 'text-blue-400'}`}>
                          OrgBrain
                        </span>
                      </div>
                    )}
                    
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    
                    {message.sources && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-xs text-slate-400">
                          Sources: {message.sources.channels} channels, {message.sources.messages} messages, {message.sources.documents} documents
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-1 text-xs text-slate-400">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-lg p-3 flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-slate-300">OrgBrain is analyzing your organization's data...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input Area - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 bg-slate-900/50">
          <form onSubmit={handleAskOrgBrain} className="flex items-center space-x-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask OrgBrain anything about your organization..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!query.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
