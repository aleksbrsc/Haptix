# Hackville 2026 - Real-time Speech-to-Text with Sentiment Analysis

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a `.env` file with your ElevenLabs API key:

```bash
cp .env.example .env
```

3. Add your ElevenLabs API key to `.env`:

```
ELEVENLABS_API_KEY=your_actual_api_key_here
```

4. Install dependencies:

```bash
uv sync
```

5. Run the backend server:

```bash
uv run fastapi dev main.py
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Application Flow

1. **User starts session**: Click "Start Recording" in the AudioTest component
2. **Real-time transcription**: ElevenLabs Scribe v2 transcribes speech with diarization
3. **Backend processing**: Transcripts are sent via WebSocket to the backend
4. **Sentiment analysis**: Each committed transcript is analyzed by an LLM for sentiment
5. **Real-time display**: Results are displayed in the UI with sentiment indicators

## API Endpoints

- `GET /` - Health check
- `POST /api/get-token` - Get ElevenLabs API token
- `WebSocket /ws/transcripts/{session_id}` - WebSocket endpoint for real-time transcript streaming
- `GET /api/session/{session_id}` - Retrieve session transcripts

## Features

- Real-time speech-to-text transcription with speaker diarization
- WebSocket-based streaming for low latency
- Sentiment analysis integration (placeholder for LLM)
- Session management with transcript history
- Modern React UI with real-time updates

## Next Steps

To integrate a real LLM for sentiment analysis, update the `analyze_sentiment` function in `backend/main.py` to call your preferred LLM API (OpenAI, Anthropic, etc.).
