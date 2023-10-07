from fastapi import FastAPI

app = FastAPI()


@app.post("/slack_message")
def slack_webhook():
    """Incoming messages from slack"""
    return {"ok": True}


@app.get("/get_messages")
def get_messages():
    """Request from the User to get all messages in the inbox"""
    return {"messages": []}
