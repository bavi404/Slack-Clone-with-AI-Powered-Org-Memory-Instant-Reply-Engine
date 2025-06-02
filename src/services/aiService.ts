import { supabase } from '@/integrations/supabase/client';

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class AIService {
  private static readonly BASE_ENDPOINT = 'END_POINT_FUNCTION_URL';
  private static readonly ANON_KEY = 'ANON_KEY';

  static async callAgent(agent: string, payload: any): Promise<AIResponse> {
    try {
      console.log(`Calling ${agent} with payload:`, payload);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.ANON_KEY}`,
        'apikey': this.ANON_KEY
      };

      const response = await fetch(this.BASE_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, response:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`${agent} response:`, result);
      
      return { success: true, data: result };
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
