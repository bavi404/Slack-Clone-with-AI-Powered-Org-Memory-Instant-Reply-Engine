import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Database {
  public: {
    Tables: {
      channels: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_public: boolean;
          created_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          content: string;
          channel_id: string;
          user_id: string;
          created_at: string;
        };
      };
      pinned_documents: {
        Row: {
          id: string;
          title: string;
          content: string;
          channel_id: string | null;
          created_by: string;
          created_at: string;
        };
      };
      users: {
        Row: {
          id: string;
          username: string;
          display_name: string;
        };
      };
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { threadMessages } = await req.json();
    
    if (!threadMessages || !Array.isArray(threadMessages)) {
      return new Response(
        JSON.stringify({ error: 'threadMessages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AutoReplyComposer received thread messages:', threadMessages.length);

    // Get organizational context for better suggestions
    const { data: channels } = await supabaseClient
      .from('channels')
      .select('id, name, description')
      .eq('is_public', true);

    const { data: recentMessages } = await supabaseClient
      .from('messages')
      .select(`
        content,
        created_at,
        channels!inner(name),
        users!inner(display_name, username)
      `)
      .in('channel_id', channels?.map(c => c.id) || [])
      .order('created_at', { ascending: false })
      .limit(20);

    const { data: pinnedDocs } = await supabaseClient
      .from('pinned_documents')
      .select(`
        title,
        content,
        channels(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    // Format thread messages for AI
    const threadContext = threadMessages.map((msg, index) => 
      `${index + 1}. ${msg.user?.name || 'User'}: ${msg.content}`
    ).join('\n');

    // Format organizational context
    const orgContext = recentMessages?.map(m => 
      `[${(m as any).channels?.name}] ${(m as any).users?.display_name || (m as any).users?.username}: ${m.content}`
    ).join('\n') || '';

    const docContext = pinnedDocs?.map(d => 
      `Document: "${d.title}" - ${d.content.substring(0, 200)}...`
    ).join('\n') || '';

    const systemPrompt = `You are an AI assistant that suggests intelligent replies for team chat conversations. 

Current Thread Context:
${threadContext}

Recent Organizational Context:
${orgContext}

Relevant Documents:
${docContext}

Based on the thread conversation and organizational context, suggest 3 different reply options with different tones:
1. Professional - formal and business-appropriate
2. Collaborative - friendly and team-oriented  
3. Concise - brief and to the point

Each suggestion should be contextually relevant to the conversation and appropriate for the team setting.`;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate 3 reply suggestions for this conversation thread.' }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse the AI response to extract suggestions
    const suggestions = parseReplySuggestions(aiResponse);

    console.log('AutoReplyComposer response generated successfully');

    return new Response(
      JSON.stringify({ 
        suggestions: suggestions,
        context: {
          threadMessages: threadMessages.length,
          recentMessages: recentMessages?.length || 0,
          documents: pinnedDocs?.length || 0
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in auto-reply-composer function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function parseReplySuggestions(aiResponse: string) {
  // Try to parse structured response
  const lines = aiResponse.split('\n').filter(line => line.trim());
  const suggestions = [];
  
  let currentSuggestion = '';
  let currentTone = 'Professional';
  
  for (const line of lines) {
    if (line.match(/^\d+\./)) {
      // Save previous suggestion if exists
      if (currentSuggestion.trim()) {
        suggestions.push({
          content: currentSuggestion.trim(),
          tone: currentTone
        });
      }
      
      // Start new suggestion
      currentSuggestion = line.replace(/^\d+\.\s*/, '');
      
      // Check for tone indicators
      if (line.toLowerCase().includes('professional')) {
        currentTone = 'Professional';
      } else if (line.toLowerCase().includes('collaborative')) {
        currentTone = 'Collaborative';
      } else if (line.toLowerCase().includes('concise')) {
        currentTone = 'Concise';
      }
    } else if (line.trim()) {
      currentSuggestion += ' ' + line.trim();
    }
  }
  
  // Add the last suggestion
  if (currentSuggestion.trim()) {
    suggestions.push({
      content: currentSuggestion.trim(),
      tone: currentTone
    });
  }
  
  // Ensure we have at least 3 suggestions
  while (suggestions.length < 3) {
    suggestions.push({
      content: "Thanks for sharing! I'll review this and get back to you.",
      tone: 'Professional'
    });
  }
  
  return suggestions.slice(0, 3);
}
