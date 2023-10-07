from fastapi import FastAPI

app = FastAPI()


# Insert Agent Protocol stuff here
@app.post("/receive_stim_message")
def receive_stim_message():
    return {"ok": True}


# Then, some number of endpoints for interaction with the UI
@app.post("/send_message")
def send_message():
    return {}
