import { supabase } from '@/integrations/supabase/client';

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class AIService {
  private static readonly SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://advqicvbufeskswnvjtz.supabase.co";

  static async callAgent(agent: string, payload: any): Promise<AIResponse> {
    try {
      console.log(`Calling ${agent} with payload:`, payload);

      // Use Supabase Edge Function for OrgBrain
      if (agent === 'OrgBrain') {
        const { data, error } = await supabase.functions.invoke('ask-org-brain', {
          body: { query: payload.prompt }
        });

        if (error) {
          throw error;
        }

        return { success: true, data };
      }

      // Use Supabase Edge Function for AutoReplyComposer
      if (agent === 'AutoReplyComposer') {
        const { data, error } = await supabase.functions.invoke('auto-reply-composer', {
          body: { threadMessages: payload.threadMessages }
        });

        if (error) {
          throw error;
        }

        return { success: true, data };
      }

      // For other agents, use a fallback or mock response
      return { 
        success: false, 
        error: `Agent ${agent} not implemented yet` 
      };
    } catch (error) {
      console.error(`AI Service Error (${agent}):`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // OrgBrain methods
  static async summarizeMessages(query: string, channelId?: string, contextDocs?: string[]) {
    console.log('OrgBrain query:', query, 'channelId:', channelId, 'contextDocs:', contextDocs?.length);
    return this.callAgent('OrgBrain', { 
      agent: 'OrgBrain', 
      prompt: query,
      contextDocs: contextDocs || []
    });
  }

  // AutoReplyComposer methods
  static async suggestReply(threadMessages: any[], context?: string) {
    return this.callAgent('AutoReplyComposer', { 
      agent: 'AutoReplyComposer', 
      threadMessages 
    });
  }

  // ToneImpactMeter methods
  static async analyzeTone(message: string) {
    return this.callAgent('ToneImpactMeter', { 
      agent: 'ToneImpactMeter', 
      prompt: message 
    });
  }

  // MeetingNotesGen methods
  static async generateMeetingNotes(messages: any[], title?: string) {
    return this.callAgent('MeetingNotesGen', { 
      agent: 'MeetingNotesGen', 
      threadMessages: messages 
    });
  }
}
