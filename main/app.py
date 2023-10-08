from fastapi import FastAPI
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from agent_protocol import Agent, Step, Task

load_dotenv()

url: str = os.environ.get("DATABASE_URL")
key: str = os.environ.get("DATABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI()


# Insert Agent Protocol stuff here
@app.post("/stimulus/")
def receive_stim_message():
    return {"ok": True}


# Then, some number of endpoints for interaction with the UI
@app.post("/send_message")
def send_message():
    return {}
