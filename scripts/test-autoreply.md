# Testing Auto-Reply Composer Functionality

## Prerequisites
1. Set up Supabase database with the `init-db.sql` script
2. Configure your `.env` file with Supabase credentials and OpenAI API key
3. Deploy the `auto-reply-composer` Edge Function to Supabase
4. Start the development server with `npm run dev`

## Test Steps

### 1. Basic Auto-Reply Test
1. **Open the app** and sign up with a new account
2. **Send a message** in any channel (e.g., "Hey team, what do you think about the new design?")
3. **Click on the message** to open the thread view
4. **Click "AI Reply"** button in the thread header
5. **Click "Generate Reply Suggestions"** button
6. **Verify** that you get 3 different reply suggestions with different tones

### 2. Test with Real Conversation Context
1. **Create a conversation thread**:
   - Send: "We need to decide on the database architecture"
   - Reply: "I think PostgreSQL would be better than MongoDB for this use case"
   - Reply: "What about performance considerations?"

2. **Open the thread** and use Auto-Reply Composer
3. **Verify** that suggestions are contextually relevant to the database discussion

### 3. Test with Organizational Context
1. **Send messages** in different channels about related topics:
   - In #development: "Working on the authentication system"
   - In #design: "Need to update the login UI"
   - In #general: "When will the new auth be ready?"

2. **Open any thread** and use Auto-Reply Composer
3. **Verify** that suggestions consider the broader organizational context

### 4. Test Different Conversation Types
1. **Technical Discussion**:
   - Thread: "Found a bug in the API response handling"
   - Expected: Technical, solution-oriented suggestions

2. **Project Planning**:
   - Thread: "We need to plan the Q2 roadmap"
   - Expected: Planning, collaborative suggestions

3. **Casual Discussion**:
   - Thread: "How was everyone's weekend?"
   - Expected: Friendly, casual suggestions

## Expected Results

### ✅ Working Correctly
- Generates 3 different reply suggestions
- Each suggestion has a different tone (Professional, Collaborative, Concise)
- Suggestions are contextually relevant to the thread
- Considers organizational context from other channels
- Provides appropriate responses for different conversation types

### ❌ Common Issues
- **No suggestions generated** → Check OpenAI API key and Edge Function logs
- **Generic suggestions** → Verify thread messages are being passed correctly
- **API errors** → Check Supabase Edge Function deployment and logs
- **Empty responses** → Verify organizational context is being fetched

## Troubleshooting

### Check Edge Function
1. Go to Supabase Dashboard > Functions
2. Check the `auto-reply-composer` function logs
3. Look for any errors in the function execution

### Check Thread Messages
1. Open browser dev tools
2. Look for console logs showing thread messages being sent
3. Verify the message format is correct

### Check OpenAI Integration
1. Verify your OpenAI API key is correct
2. Check if you have credits available
3. Look for rate limiting errors

## Sample Test Scenarios

### Scenario 1: Technical Discussion
**Thread Messages:**
- "The API is returning 500 errors for user authentication"
- "I checked the logs, it's a database connection issue"
- "We need to fix this before the demo tomorrow"

**Expected Suggestions:**
- Professional: "Let me investigate the database connection and provide a fix by end of day."
- Collaborative: "I can help debug this. What specific error messages are you seeing?"
- Concise: "I'll look into it now."

### Scenario 2: Project Planning
**Thread Messages:**
- "We need to decide on the tech stack for the new project"
- "React + TypeScript seems like a good choice"
- "What about the backend framework?"

**Expected Suggestions:**
- Professional: "I recommend Node.js with Express for consistency with our existing services."
- Collaborative: "Let's schedule a meeting to discuss the pros and cons of each option."
- Concise: "Node.js + Express works well with React."

### Scenario 3: Casual Discussion
**Thread Messages:**
- "How was everyone's weekend?"
- "Great! Went hiking with the family"
- "Nice! I spent mine coding"

**Expected Suggestions:**
- Professional: "Sounds like a productive weekend! Ready to tackle this week's challenges."
- Collaborative: "That sounds wonderful! I love hiking too. What trails did you explore?"
- Concise: "Good weekend! Ready for the week ahead."
