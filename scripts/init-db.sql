-- Initialize the database with default channels
-- This script should be run in the Supabase SQL editor

-- Insert default channels
INSERT INTO channels (id, name, description, is_public, created_at) VALUES
  ('general', 'general', 'General discussion for the team', true, NOW()),
  ('development', 'development', 'Development team discussions', true, NOW()),
  ('design', 'design', 'Design team discussions', true, NOW()),
  ('marketing', 'marketing', 'Marketing team discussions', true, NOW()),
  ('random', 'random', 'Random discussions and off-topic chat', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) for real-time subscriptions
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pinned_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to channels and messages
CREATE POLICY "Allow public read access to channels" ON channels
  FOR SELECT USING (is_public = true);

CREATE POLICY "Allow public read access to messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow public read access to users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow public read access to pinned documents" ON pinned_documents
  FOR SELECT USING (true);

-- Grant necessary permissions for real-time subscriptions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.messages TO anon, authenticated;
GRANT SELECT ON public.channels TO anon, authenticated;
GRANT SELECT ON public.users TO anon, authenticated;
GRANT SELECT ON public.pinned_documents TO anon, authenticated;

-- Insert some sample data for testing OrgBrain
-- Note: You'll need to replace these user IDs with actual user IDs from your auth.users table
-- This is just for demonstration purposes

-- Sample pinned document
INSERT INTO pinned_documents (id, title, content, channel_id, created_by, created_at) VALUES
  ('sample-doc-1', 'Project Atlas Overview', 'Project Atlas is our flagship initiative focused on improving team collaboration and productivity. Key features include real-time messaging, AI-powered insights, and seamless integration with existing tools.', 'general', '00000000-0000-0000-0000-000000000000', NOW())
ON CONFLICT (id) DO NOTHING;

-- Note: Messages will be added by users through the application
-- The OrgBrain will analyze real messages as they are created

-- Instructions for deploying Edge Functions:
-- 1. Go to Supabase Dashboard > Functions
-- 2. Create new function: ask-org-brain
-- 3. Copy the code from supabase/functions/ask-org-brain/index.ts
-- 4. Create new function: auto-reply-composer  
-- 5. Copy the code from supabase/functions/auto-reply-composer/index.ts
-- 6. Set environment variables: OPENAI_API_KEY
