from fastapi import Request, FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv

import os

from pavfunctions import stimulate 

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY")
)

class Stimulus(BaseModel):
    mode: str
    value: int
    repeats: int
    interval: float


@app.post("/trigger-stimulus")
async def trigger_stimulus(stimulus: Stimulus):
    stimulate(stimulus.mode, stimulus.value, stimulus.repeats, stimulus.interval)

    return "Ok"

@app.get("/scribe-token")
async def get_scribe_token():
    token = elevenlabs.tokens.single_use.create("realtime_scribe")
    return token
