# Testing Real-Time Functionality

## Prerequisites
1. Make sure you have set up the Supabase database with the `init-db.sql` script
2. Configure your `.env` file with the correct Supabase credentials
3. Start the development server with `npm run dev`

## Test Steps

### 1. Basic Real-Time Messaging Test
1. Open the app in **two different browser windows/tabs** (or use incognito mode)
2. In the first window:
   - Sign up with a new account (e.g., `user1@example.com`)
   - Wait for the app to load
3. In the second window:
   - Sign up with a different account (e.g., `user2@example.com`)
   - Wait for the app to load
4. In the first window, send a message: "Hello from User 1!"
5. **Expected Result**: The message should appear instantly in the second window
6. In the second window, send a reply: "Hi User 1! This is User 2"
7. **Expected Result**: The reply should appear instantly in the first window

### 2. Channel Switching Test
1. In the first window, switch to the "development" channel
2. Send a message: "Testing development channel"
3. In the second window, switch to the "development" channel
4. **Expected Result**: You should see the message from User 1
5. Send a reply: "I can see your message in development channel!"

### 3. Persistence Test
1. Close both browser windows
2. Open the app again in one window
3. Log in with User 1's credentials
4. Switch to the "general" channel
5. **Expected Result**: You should see all previous messages from both users
6. Switch to the "development" channel
7. **Expected Result**: You should see the messages from the development channel test

### 4. Multiple Users Test
1. Open the app in a third browser window (or incognito)
2. Sign up with a third account (e.g., `user3@example.com`)
3. In the third window, send a message: "Hello from User 3!"
4. **Expected Result**: Both User 1 and User 2 should see this message instantly

## Troubleshooting

### If messages don't appear in real-time:
1. Check the browser console for errors
2. Verify your Supabase credentials in the `.env` file
3. Make sure the database has the correct RLS policies (run the `init-db.sql` script)
4. Check if Supabase real-time is enabled in your project settings

### If messages don't persist:
1. Verify the database tables were created correctly
2. Check the Supabase logs for any errors
3. Make sure the user authentication is working properly

### If you get authentication errors:
1. Check that the Supabase URL and anon key are correct
2. Verify that the users table exists and has the correct structure
3. Make sure RLS policies allow public read access to messages and channels
