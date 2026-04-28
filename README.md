# TrendPost: AI-Native LinkedIn Workspace 🚀

TrendPost is a premium, high-fidelity AI assistant designed for creators who want to transform trends into high-engagement LinkedIn content. It features a professional-grade **Workspace Layout**, real-time **Discovery Mode**, and multi-model support across all major AI providers.

<img width="2551" height="1214" alt="Screenshot 2026-04-28 at 20 51 42" src="https://github.com/user-attachments/assets/063419f0-f283-4fa9-947d-d27bcfd8455f" />


## ✨ Key Features

- **🎛 AI Workspace Mode**: A sleek, side-by-side dashboard that brings your inputs, editor, and research citations into a single, unified view. No more scrolling.
- **🛰 Discovery Mode (Live)**: Hunt for breaking news and trending debates in real-time. TrendPost synthesizes live research into authoritative insights.
- **💎 Premium Aesthetics**: High-fidelity glassmorphism UI with "Glow Mesh" background animations and a perfect dark/light mode experience.
- **🤖 Multi-Model Intelligence**: 
  - **Google Gemini** (Native support for Flash/Pro)
  - **OpenAI** (GPT-4o/Mini)
  - **Anthropic** (Claude 3.5 Sonnet)
  - **HuggingFace** (Plug in any model ID from the Hub)
  - **vLLM** (Connect to your own local inference server)

## 🏗 Architecture

- **Backend**: FastAPI (Python) running in a optimized Docker container.
- **Frontend**: Next.js 15 + Tailwind CSS v4 + Framer Motion.
- **Base Image**: Custom `AIProjects` environment for reusable AI/NLP dependencies.

---

## 🚀 Quick Start

### 1. Build the AI Base Image (One-time)
Run this once to create the environment for this and future AI projects:
```bash
docker build -t aiprojects:latest -f backend/base.Dockerfile backend/
```

### 2. Configure Environment
Create `backend/.env` and add your API keys:
```env
TAVILY_API_KEY=your_key
GEMINI_API_KEY=your_key
OPENAI_API_KEY=your_key
# ANTHROPIC_API_KEY=your_key
# HUGGINGFACE_API_KEY=your_key
```

### 3. Run the Stack
**Backend (Docker)**:
```bash
docker-compose up -d
```

**Frontend (Local)**:
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠 Manual Commands

### Viewing Backend Logs
```bash
docker logs -f trendpost-backend-1
```

### Stopping Services
```bash
docker-compose down
```

---

Built with ❤️ for the ambitious creator.
