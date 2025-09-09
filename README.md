#  AI-Enhanced Slack-like Chat Platform

This project is a collaborative chat platform (like Slack!) with channels, threads, and mentions — powered by advanced AI integrations to make your team's communication smarter and smoother.

##  Features

 **Real-Time Chat Platform**

* **Live Messaging**: Messages appear instantly across all connected clients
* **Persistent Storage**: All messages are saved to the database and persist across sessions
* **Multi-User Support**: Multiple users can chat simultaneously in real-time
* Channels & threads with @mentions and reactions
* Fast, intuitive UI built with **React** and **Vite**
* **Supabase** for authentication, real-time database updates, and live subscriptions

 **AI-Powered Add-ons**

* **Org Brain Plugin**: Summarizes info from all public channels and pinned docs.

  * *Example*: “What’s the latest on Project Atlas?” → AI summary.
* **Auto-Reply Composer**: Suggests intelligent replies in context of the full thread and organizational data.
* **Tone & Impact Meter**: Flags if a message is too aggressive, weak, or unclear — and suggests improvements.
* **Meeting Notes Generator**: Creates structured meeting notes from any thread or channel.

**AI Models**

* Works with **Gemini** or **OpenAI** models for natural language tasks.

---

## Tech Stack

* **Frontend**: React, Vite
* **Backend**: Supabase (authentication & real-time DB)
* **AI APIs**: Gemini / OpenAI
* **Deployment**: Ready to deploy on modern cloud platforms (e.g., Vercel, Netlify).

---

## Setup & Installation

1. **Clone the repo**:

   ```bash
   git clone https://github.com/<your-username>/ai-chat-platform
   cd ai-chat-platform
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up Supabase Database**:
   
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project or use the existing one
   - Run the SQL script from `scripts/init-db.sql` in the SQL Editor to create tables and policies
   - Get your project URL and anon key from Settings > API

4. **Configure environment**:
   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Run the app locally**:

   ```bash
   npm run dev
   ```

6. **Test Real-time Functionality**:
   - Open the app in two different browser windows/tabs
   - Sign up with different accounts
   - Send messages in one window and see them appear instantly in the other

---

## Usage

* **Channels & Threads**: Create channels, start threads, mention team members.
* **AI Queries**: Use the Org Brain to ask for summaries across channels.
* **Auto-Reply & Tone Check**: Click “Suggest Reply” and see the Tone & Impact Meter in real-time.
* **Meeting Notes**: Click “Generate Meeting Notes” in any thread.

---

## Future Improvements

* Role-based access control for channels.
* Enhanced formatting for meeting notes (Markdown export).
* Video/audio clip support in threads.

---

##  Contributing

Pull requests welcome! If you have ideas for new AI plugins or improvements, open an issue or PR.

---

## License

MIT License.

