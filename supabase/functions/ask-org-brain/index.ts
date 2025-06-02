
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

    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('OrgBrain received query:', query);

    // Fetch all public channels
    const { data: channels, error: channelsError } = await supabaseClient
      .from('channels')
      .select('id, name, description')
      .eq('is_public', true);

    if (channelsError) {
      console.error('Error fetching channels:', channelsError);
      throw channelsError;
    }

    // Fetch recent messages from public channels
    const { data: messages, error: messagesError } = await supabaseClient
      .from('messages')
      .select(`
        content,
        created_at,
        channels!inner(name),
        users!inner(display_name)
      `)
      .in('channel_id', channels?.map(c => c.id) || [])
      .order('created_at', { ascending: false })
      .limit(50);

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      throw messagesError;
    }

    // Fetch all pinned documents
    const { data: pinnedDocs, error: pinnedDocsError } = await supabaseClient
      .from('pinned_documents')
      .select(`
        title,
        content,
        created_at,
        channels(name),
        users!inner(display_name)
      `)
      .order('created_at', { ascending: false });

    if (pinnedDocsError) {
      console.error('Error fetching pinned documents:', pinnedDocsError);
      throw pinnedDocsError;
    }

    // Prepare context for OpenAI
    const channelContext = channels?.map(c => `Channel: ${c.name} - ${c.description || 'No description'}`).join('\n');
    
    const messageContext = messages?.map(m => 
      `[${(m as any).channels?.name}] ${(m as any).users?.display_name}: ${m.content} (${new Date(m.created_at).toLocaleDateString()})`
    ).join('\n');

    const documentContext = pinnedDocs?.map(d => 
      `Document: "${d.title}" in ${(d as any).channels?.name || 'General'} by ${(d as any).users?.display_name}:\n${d.content}`
    ).join('\n\n');

    const systemPrompt = `You are OrgBrain, an AI assistant that helps users find information across their organization's chat channels and documents.

Available Channels:
${channelContext}

Recent Messages:
${messageContext}

Pinned Documents:
${documentContext}

Please provide a helpful summary based on the user's query. Focus on relevant information from the channels and documents. If you can't find specific information, let the user know what channels or documents might be relevant.`;

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
          { role: 'user', content: query }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('OrgBrain response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        sources: {
          channels: channels?.length || 0,
          messages: messages?.length || 0,
          documents: pinnedDocs?.length || 0
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in ask-org-brain function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
