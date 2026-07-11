# AI Code Reviewer

An AI-powered code reviewer built with Google Gemini and Express.js. Paste your code, select a language, and get instant feedback on bugs, security issues, and improvements — along with a fully fixed version of your code.

Built for the **Build with AI Workshop** by Google Developer Group.

---

## Features

- Detects **bugs**, **security issues**, and suggests **improvements**
- Returns a **rewritten, fixed version** of your code
- Recognizes when code is already perfect and celebrates it
- Supports JavaScript, TypeScript, Python, Java, Go, Rust, C++, SQL, Bash, and more
- Clean, responsive UI with one-click copy for fixed code
- `Ctrl+Enter` / `Cmd+Enter` keyboard shortcut to submit

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Node.js, Express                    |
| AI Model | Google Gemini 2.5 Flash             |
| Frontend | Vanilla HTML, CSS, JavaScript       |
| Config   | dotenv                              |

## Prerequisites

- Node.js 18 or higher
- A free Google Gemini API key — get one at [aistudio.google.com](https://aistudio.google.com)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd code
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure your API key**

   Create a `.env` file in the project root:

   ```env
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```

   Or just copy the example file:

   ```bash
   cp .env.example .env
   ```

4. **Start the server**

   ```bash
   # Production
   npm start

   # Development (auto-restarts on file changes)
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Select your programming language from the dropdown.
2. Paste your code into the text area.
3. Click **Review with Gemini** (or press `Ctrl+Enter`).
4. Review the results — bugs, security issues, and improvement suggestions.
5. Copy the fixed code with the **Copy** button.

## Project Structure

```
.
├── public/
│   └── index.html    # Frontend UI
├── server.js         # Express server + Gemini integration
├── package.json
└── .env              # API key (not committed)
```

## Environment Variables

| Variable         | Description                              | Required |
|------------------|------------------------------------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key               | Yes      |
| `PORT`           | Server port (defaults to 3000)           | No       |
