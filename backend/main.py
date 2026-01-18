from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY")
)

@app.get("/scribe-token")
async def get_scribe_token():
    token = elevenlabs.tokens.single_use.create("realtime_scribe")
    return token
