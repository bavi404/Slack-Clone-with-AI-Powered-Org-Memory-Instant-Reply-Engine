import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { threadMessages, title } = await req.json();

    if (!Array.isArray(threadMessages) || threadMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'threadMessages (non-empty array) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const clean = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v));
    const transcript = threadMessages
      .map((m: any, i: number) => `${i + 1}. ${(m?.user?.name ?? 'User')}: ${clean(m?.content)}`)
      .join('\n');

    const sys = `You are an assistant that generates concise, well-structured meeting notes from a chat thread.
Return ONLY Markdown with the following sections when possible:

# ${title || 'Meeting Notes'}

## Summary
One or two paragraphs summarizing key points.

## Decisions
- Bullet list of decisions (if any)

## Action Items
- Owner — Action (Due date if mentioned)

## Risks/Concerns
- Bullet list (if any)

## Detailed Discussion
- Brief bullets capturing main discussion points.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: `Thread transcript:\n\n${transcript}` }
        ],
        temperature: 0.5,
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const notes = data.choices?.[0]?.message?.content ?? '';

    return new Response(
      JSON.stringify({ notes }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('meeting-notes-gen error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});


