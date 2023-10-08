import os
from enum import Enum
from fastapi import FastAPI
from dotenv import load_dotenv
from supabase import create_client, Client
from agent_protocol import Agent, Step, Task

load_dotenv()

url: str = os.environ.get("DATABASE_URL")
key: str = os.environ.get("DATABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI()


class StepTypes(str, Enum):
    PROCESS = "process"  # Process Stimulus
    SEND = "send"  # Send Message


# Does this make sense? Think so...


async def _process_stimuli(step: Step) -> Step:
    # Process the stimulus
    # NOTE: Chiung-Yi add code here
    pass


async def _message_user(step: Step) -> Step:
    # Send the message to the user
    pass


async def task_handler(task: Task) -> None:
    if not task.input:
        raise Exception("No task prompt")
    await Agent.db.create_step(task.task_id, StepTypes.PROCESS)


async def step_handler(step: Step):
    task = await Agent.db.get_task(step.task_id)
    if step.name == StepTypes.PROCESS:
        return await _process_stimuli(step)
    elif step.name == StepTypes.SEND:
        return await _message_user(task, step)
    else:
        return await _process_stimuli(task, step)


# Insert Agent Protocol stuff here
@app.post("/stimulus/")
def receive_stim_message():
    return {"ok": True}


# Then, some number of endpoints for interaction with the UI
@app.post("/send_message")
def send_message():
    return {}
