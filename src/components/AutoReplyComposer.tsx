
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Copy, Loader2, RefreshCw } from 'lucide-react';
import { AIService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

interface AutoReplyComposerProps {
  threadMessages: any[];
  onSelectReply: (reply: string) => void;
}

interface ReplyOption {
  id: string;
  content: string;
  tone: string;
}

export const AutoReplyComposer: React.FC<AutoReplyComposerProps> = ({ 
  threadMessages, 
  onSelectReply 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [replySuggestions, setReplySuggestions] = useState<ReplyOption[]>([]);
  const { toast } = useToast();

  const generateReplySuggestions = async () => {
    setIsLoading(true);
    setReplySuggestions([]);

    try {
      console.log('Generating reply suggestions for thread:', threadMessages.length, 'messages');
      
      const response = await AIService.suggestReply(threadMessages);
      
      console.log('AutoReplyComposer response:', response);

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate reply suggestions');
      }

      let suggestions: ReplyOption[] = [];

      // Handle the new response format from Edge Function
      if (response.data && response.data.suggestions) {
        suggestions = response.data.suggestions.map((item: any, index: number) => ({
          id: (index + 1).toString(),
          content: item.content || item,
          tone: item.tone || 'Professional'
        }));
      } else if (Array.isArray(response.data)) {
        // Fallback for array format
        suggestions = response.data.map((item: any, index: number) => ({
          id: (index + 1).toString(),
          content: typeof item === 'string' ? item : item.content || item.reply || JSON.stringify(item),
          tone: item.tone || 'Professional'
        }));
      } else if (typeof response.data === 'string') {
        // Single string response
        suggestions = [{
          id: '1',
          content: response.data,
          tone: 'Professional'
        }];
      }

      // Ensure we have at least some suggestions
      if (suggestions.length === 0) {
        suggestions = [{
          id: '1',
          content: "Thanks for sharing! I'll review this and get back to you.",
          tone: 'Professional'
        }, {
          id: '2',
          content: "This looks interesting. Can you provide more details?",
          tone: 'Curious'
        }, {
          id: '3',
          content: "I appreciate you bringing this up. Let's discuss this further.",
          tone: 'Collaborative'
        }];
      }

      setReplySuggestions(suggestions);

      toast({
        title: "Success",
        description: `Generated ${suggestions.length} reply suggestions`,
      });

    } catch (error) {
      console.error('AutoReplyComposer Error:', error);
      
      // Provide fallback suggestions on error
      const fallbackSuggestions: ReplyOption[] = [
        {
          id: '1',
          content: "Thanks for sharing this! I'll take a look and get back to you.",
          tone: 'Professional'
        },
        {
          id: '2',
          content: "This is helpful. Can you elaborate on the key points?",
          tone: 'Inquisitive'
        },
        {
          id: '3',
          content: "I appreciate the update. Let's discuss this in our next meeting.",
          tone: 'Collaborative'
        }
      ];
      
      setReplySuggestions(fallbackSuggestions);

      toast({
        title: "Note",
        description: "Using fallback suggestions. Check your connection for AI-generated replies.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseReply = (reply: string) => {
    onSelectReply(reply);
    toast({
      title: "Reply Selected",
      description: "The suggested reply has been added to your message input.",
    });
  };

  const handleCopyReply = async (reply: string) => {
    try {
      await navigator.clipboard.writeText(reply);
      toast({
        title: "Copied",
        description: "Reply copied to clipboard!",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-white text-sm">
          <Bot className="w-4 h-4 text-blue-400" />
          <span>AI Reply Suggestions</span>
          <Button
            onClick={generateReplySuggestions}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="ml-auto h-6 px-2 text-xs"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {replySuggestions.length === 0 && !isLoading ? (
          <div className="text-center py-4">
            <Bot className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400 mb-3">
              Get AI-powered reply suggestions based on the conversation context.
            </p>
            <Button
              onClick={generateReplySuggestions}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Bot className="w-3 h-3 mr-1" />
              Generate Reply Suggestions
            </Button>
          </div>
        ) : (
          <ScrollArea className="max-h-48">
            <div className="space-y-3">
              {isLoading && (
                <div className="flex items-center space-x-2 text-slate-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating AI reply suggestions...</span>
                </div>
              )}
              
              {replySuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="bg-slate-700/50 rounded-lg p-3 border border-slate-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-blue-400 font-medium">
                      {suggestion.tone}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-200 mb-3 leading-relaxed">
                    {suggestion.content}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleUseReply(suggestion.content)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs"
                    >
                      Use Reply
                    </Button>
                    <Button
                      onClick={() => handleCopyReply(suggestion.content)}
                      size="sm"
                      variant="outline"
                      className="h-7 px-3 text-xs border-slate-500 text-slate-300 hover:bg-slate-600"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
