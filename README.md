# VOXENTRA — Social Intelligence Analyzer
> *“Understand what’s happening, who is driving it, how it spreads, and what signals deserve attention.”*

Voxentra is a privacy-first, full-stack AI-powered social intelligence platform built for modern cybersecurity, public communication integrity, and research teams.

---

## 🚀 Core Features

- **Multi-Platform Intelligence Engine**: Normalized cross-platform ingestion across **Instagram, X (Twitter), Telegram, Facebook, YouTube, and Reddit**.
- **Content Risk & Forensic Provenance**:
  - Synthetic Media Detection (lip-sync anomalies, neural acoustic vocoder cutoff, optical flow gradients).
  - Provenance & C2PA validation (cryptographic metadata inspection).
  - Context Drift & Archival Matching (perceptual hash matching against historical footage).
  - Coordinated propagation and bot ring clustering detection.
  - Transparent evidence signals instead of fake single-number truth scores.
- **Audience Intelligence**:
  - “Who is driving what?”
  - Anonymized aggregate demographic profiling across 5 age bands (18–24, 25–34, 35–44, 45–54, 55+), Indian regional zones (North, South, East, West, Northeast India), and interest clusters.
  - Strict $k$-anonymity ($k \ge 50$) guarantee: zero individual profiling or identity retention.
- **Sentiment & Emotion Engine**:
  - Multi-dimensional sentiment, emotion vectors (anger, anxiety, fear, excitement, joy, surprise), and stance analysis.
  - Multilingual coverage across English, Hindi, Tamil, Telugu, Kannada, Bengali, Hinglish, and Tanglish.
- **Trends & Narratives**:
  - Real-time acceleration calculation (e.g., $+184\%$), viral keyword trajectories, and narrative evolution tracking (from initial reaction to subsequent shifts).
- **Network & Influence Propagation**:
  - Interactive SVG network graph with timeline playback interaction, centrality scoring, and cluster assignment.
- **Timeline Progression**:
  - Minute-by-minute chronology tracking origin $\to$ early reaction $\to$ amplification $\to$ cross-platform jumps $\to$ narrative shift $\to$ peak/debunking.
- **Executive Dossier Generator**:
  - 11-section printable intelligence brief with real Print/Save-as-PDF CSS and JSON export.
- **Browser Companion**:
  - Chrome Manifest V3 extension bundle located in `public/extension/` with in-app interactive simulator.

---

## 🛠️ Getting Started Locally

### 1. Prerequisites
- Node.js 18+ or 20+
- npm

### 2. Installation
```bash
git clone <repository-url>
cd voxentra
npm install
```

### 3. Running the Full-Stack Dev Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

---

## 🤖 Configuring Gemini AI

Voxentra uses the `@google/genai` TypeScript SDK on the server with model `gemini-3.8-flash`.

1. Get an API key from Google AI Studio.
2. In your `.env` file (copied from `.env.example`), set:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```
3. *Zero-Block Guarantee*: If `GEMINI_API_KEY` is not provided or offline, Voxentra automatically falls back to its deterministic rule-based heuristic intelligence engine without breaking.

---

## 🗄️ Configuring Supabase (Optional)

Voxentra includes built-in local persistent JSON storage (`data/voxentra_store.json`), meaning **no database configuration is required to run the full application**.

If you wish to sync analyses to Supabase PostgreSQL:
1. Create a Supabase project.
2. Open the SQL Editor in Supabase and run the schema file provided at `supabase/schema.sql`.
3. Set your credentials in `.env`:
   ```env
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_SECRET_KEY="your-service-role-or-secret-key"
   ```

---

## 🔌 Active Live Integrations & Seeded Demo Datasets

Voxentra supports a clean, modular connector architecture:

### 🟢 Active Live Platform Integrations:
- **X (Twitter) API v2**: `VOXENTRA_X_BEARER_TOKEN`, `VOXENTRA_X_API_KEY`, `VOXENTRA_X_API_SECRET`
- **YouTube Data API v3**: `VOXENTRA_YOUTUBE_API_KEY`
- **Telegram Bot API & MTProto**: `VOXENTRA_TELEGRAM_BOT_TOKEN`, `VOXENTRA_TELEGRAM_API_ID`, `VOXENTRA_TELEGRAM_API_HASH`

### 📦 Seeded Demo Datasets (No Credentials Required):
- **Instagram**: Seeded with hyper-realistic viral reel datasets (deepfake speech, phishing claims).
- **Facebook**: Seeded with community/neighborhood group spread and emergency alerts.
- **Reddit**: Seeded with technical discussions, forensic debunking, and code benchmarks.

*Zero-Crash Guarantee*: If any external network is slow, rate-limited, or unauthorized (e.g. HTTP 403), Voxentra falls back smoothly to its realistic seeded repository without crashing or producing broken states.

---

## 🧩 Building and Installing the Browser Companion

The Chrome Manifest V3 extension is ready in `public/extension/`.

To load it in your browser:
1. Open Google Chrome or Brave and go to `chrome://extensions/`.
2. Toggle on **Developer mode** in the top-right corner.
3. Click **Load unpacked**.
4. Select the `public/extension` folder inside this project.
5. Navigate to any supported social page or use the **Browser Companion Simulator** tab inside the Voxentra web app to test the workflow.

---

## 🚀 Deployment

Build the optimized production client:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

Voxentra binds to `0.0.0.0:3000` and serves the production build with full REST API support on `/api/*`.

---

## 🔒 Privacy Architecture
- **k-Anonymity**: Demographics are grouped into bins of $\ge 50$ entities.
- **Zero Profiling**: No individual usernames, personal telephone numbers, or biometric databases are stored.
- **Principle**: *Analyze the content, not the person.*
