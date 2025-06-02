#  AI-Enhanced Slack-like Chat Platform

This project is a collaborative chat platform (like Slack!) with channels, threads, and mentions — powered by advanced AI integrations to make your team's communication smarter and smoother.

##  Features

 **Real-Time Chat Platform**

* Channels & threads
* @mentions and reactions
* Fast, intuitive UI built with **React** and **Vite**
* **Supabase** for authentication and real-time database updates

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

   git clone https://github.com/<your-username>/ai-chat-platform.git
   cd ai-chat-platform

2. **Install dependencies**:

   npm install

3. **Configure environment**:
   Create a `.env` file with:

   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   VITE_OPENAI_API_KEY=<optional-if-using-openai>
   VITE_GEMINI_API_KEY=<optional-if-using-gemini>

4. **Run the app locally**:

   npm run dev

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

