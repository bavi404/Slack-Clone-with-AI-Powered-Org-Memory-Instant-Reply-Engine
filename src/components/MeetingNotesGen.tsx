
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Loader2, Download, Copy, Check } from 'lucide-react';
import { AIService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

interface MeetingNotesGenProps {
  messages: any[];
  channelName: string;
}

export const MeetingNotesGen: React.FC<MeetingNotesGenProps> = ({
  messages,
  channelName
}) => {
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(`${channelName} Meeting Notes`);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateNotes = async () => {
    if (messages.length === 0) {
      toast({
        title: "No Messages",
        description: "No messages available to generate notes from",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Generating meeting notes for messages:', messages);
      const response = await AIService.generateMeetingNotes(messages, title);
      console.log('Meeting notes response:', response);
      
      if (response.success && response.data) {
        let notesContent = '';
        
        // Handle different response formats
        if (response.data.notes) {
          notesContent = response.data.notes;
        } else if (typeof response.data === 'string') {
          notesContent = response.data;
        } else {
          notesContent = JSON.stringify(response.data, null, 2);
        }
        
        setNotes(notesContent);
        toast({
          title: "Success",
          description: "Meeting notes generated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to generate meeting notes",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating notes:', error);
      toast({
        title: "Error",
        description: "Failed to generate meeting notes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(notes);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Meeting notes copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadNotes = () => {
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Meeting notes have been downloaded",
    });
  };

  return (
    <Card className="bg-slate-900/50 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <FileText className="w-5 h-5 text-orange-400" />
          <span>Meeting Notes Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Meeting title..."
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
          />
          <Button
            onClick={generateNotes}
            disabled={isLoading || messages.length === 0}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Notes...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Meeting Notes ({messages.length} messages)
              </>
            )}
          </Button>
        </div>

        {notes && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="text-slate-300 border-slate-600"
              >
                {copied ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <Copy className="w-3 h-3 mr-1" />
                )}
                Copy
              </Button>
              <Button
                onClick={downloadNotes}
                size="sm"
                variant="outline"
                className="text-slate-300 border-slate-600"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </div>
            
            <ScrollArea className="h-64 bg-white/5 rounded-lg p-3 border border-white/10">
              <pre className="text-slate-300 text-sm whitespace-pre-wrap break-words">
                {notes}
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
