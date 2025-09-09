# Testing OrgBrain Functionality

## Prerequisites
1. Set up Supabase database with the `init-db.sql` script
2. Configure your `.env` file with Supabase credentials and OpenAI API key
3. Start the development server with `npm run dev`

## Test Steps

### 1. Basic OrgBrain Test
1. **Open the app** and sign up with a new account
2. **Click the "Ask OrgBrain" button** in the top-right corner
3. **Try these sample queries**:
   - "What channels are available?"
   - "Summarize recent conversations"
   - "What's being discussed in the general channel?"

### 2. Test with Real Messages
1. **Send some messages** in different channels:
   - Go to #general and send: "Hey team! Working on the new feature today"
   - Go to #development and send: "Found a bug in the authentication flow"
   - Go to #design and send: "Need feedback on the new UI mockups"

2. **Ask OrgBrain** about these messages:
   - "What's being discussed in development?"
   - "Any issues mentioned recently?"
   - "What feedback is needed?"

### 3. Test with Pinned Documents
1. **Create a pinned document** (if you have admin access):
   - Go to Supabase Dashboard > Table Editor > pinned_documents
   - Insert a new document with title and content

2. **Ask OrgBrain** about the document:
   - "What documents are available?"
   - "Tell me about Project Atlas" (if you added the sample doc)

### 4. Test Real-time Updates
1. **Open two browser windows** with different users
2. **Send messages** in one window
3. **Ask OrgBrain** in the other window about the new messages
4. **Verify** that OrgBrain can see the latest messages

## Expected Results

### ✅ Working Correctly
- OrgBrain responds with relevant information from actual messages
- Shows source counts (channels, messages, documents)
- Provides helpful summaries based on real data
- Updates in real-time as new messages are added

### ❌ Common Issues
- **"No data available"** → Check if messages exist in the database
- **API errors** → Verify OpenAI API key is configured
- **Empty responses** → Check Supabase Edge Function logs
- **Permission errors** → Verify RLS policies are set up correctly

## Troubleshooting

### Check Database Data
```sql
-- Check if channels exist
SELECT * FROM channels;

-- Check if messages exist
SELECT m.content, c.name as channel_name, u.display_name 
FROM messages m 
JOIN channels c ON m.channel_id = c.id 
JOIN users u ON m.user_id = u.id 
ORDER BY m.created_at DESC;

-- Check if pinned documents exist
SELECT * FROM pinned_documents;
```

### Check Supabase Edge Function
1. Go to Supabase Dashboard > Functions
2. Check the `ask-org-brain` function logs
3. Look for any errors in the function execution

### Check OpenAI Integration
1. Verify your OpenAI API key is correct
2. Check if you have credits available
3. Look for rate limiting errors

## Sample Test Queries

Try these queries to test different aspects:

**Channel Information:**
- "What channels are available?"
- "Tell me about the development channel"

**Message Analysis:**
- "What are people talking about?"
- "Any recent updates?"
- "Summarize today's conversations"

**Document Search:**
- "What documents are pinned?"
- "Tell me about Project Atlas"
- "Show me important information"

**Specific Searches:**
- "What bugs were mentioned?"
- "Any design feedback needed?"
- "What features are being worked on?"
