from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import PlainTextResponse

app = FastAPI()

class Challenge(BaseModel):
    token: str
    challenge: str
    type: str

@app.post("/slack_events")
def slack_events(challenge: Challenge):
    """Incoming messages from slack"""
    if challenge.challenge:
        return PlainTextResponse(content=challenge.challenge)

    return {"ok": True}


@app.get("/get_messages")
def get_messages():
    """Request from the User to get all messages in the inbox"""
    return {"messages": []}
