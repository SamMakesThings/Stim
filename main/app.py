import logging
from enum import Enum
from fastapi import FastAPI
from agent_protocol import Agent, Step, Task

from supabase_db import supabase
from relevance_agent import RelevanceAgent

# from main_agent import run_main_agent

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

app = FastAPI()


# test
relevance = RelevanceAgent()
relevance.batch_stimulus_into_topic(
    {
        "sender": "Alex",
        "content": "Who is joining for coffee at 4?",
        "message_id": 1,
        "relevance": 0.5,
    }
)


class StepTypes(str, Enum):
    PROCESS = "process"  # Eval + Batch
    QUERY = "query"  # If the user has asked for information of any level
    REPORT = "report"  # When the main agent reports topic stimuli in the conversation
    UNSUPPORTED = "unsupported"  # Default response for bad requests


async def _process_stimuli(step: Step) -> Step:
    # Process the stimulus
    # AKA Eval + Batch
    # NOTE: Chiung-Yi code here

    step.output = "Processed stimulus"  # TODO: Replace with actual output
    step.status = "done"
    return step


# Should we put this as a tool for the main agent?
async def _service_query(step: Step) -> Step:
    # fetch topic batches based on user query
    # add response to chat_history

    # The input to this step would be the user input
    # This then forwards the input over to the agent
    # The output

    step.output = "Serviced query"  # TODO: Replace with actual output
    step.status = "done"
    return step


async def _manage_convo_context(step: Step) -> Step:
    """Queries the topic batches, passes them to main agent.
    Main Agent then parses topics by relevance and decides whether
    to inject context into conversation, use a tool, etc"""

    # Fetch latest topics
    batches = (
        supabase.table("topic_batches").select("*").order_by("relevance").execute().data
    )

    # Pass to main agent
    run_main_agent(batches=batches)

    # TODO: Update step status to done

    return step


async def _handle_unsupported_step(step: Step) -> Step:
    step.name = StepTypes.UNSUPPORTED.name
    return step


async def task_handler(task: Task) -> None:
    if not task.input:
        raise Exception("No task prompt")
    await Agent.db.create_step(task.task_id, StepTypes.PROCESS)


async def step_handler(step: Step):
    task = await Agent.db.get_task(step.task_id)
    if step.name == StepTypes.PROCESS:
        return await _process_stimuli(step)
    elif step.name == StepTypes.QUERY:
        return await _service_query(step)
    elif step.name == StepTypes.REPORT:
        return await _manage_convo_context(task, step)
    else:
        logger.error(f"Unknown step type: {step.name}")
        return await _handle_unsupported_step(step)


# Insert Agent Protocol stuff here
@app.post("/stimulus/")
def receive_stim_message():
    return {"ok": True}


# Then, some number of endpoints for interaction with the UI
@app.post("/send_message")
def send_message():
    return {}
