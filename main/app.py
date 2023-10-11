import json
import logging
import traceback
from enum import Enum

from agent_protocol import Agent, Step, Task
from dotenv import load_dotenv
from fastapi import FastAPI

from main_agent import run_main_agent
from relevance_agent import RelevanceAgent
from supabase_db import supabase
from utils import flag_query_topics

load_dotenv()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

app = FastAPI()


class StepTypes(str, Enum):
    PROCESS = "process"  # Eval + Batch
    QUERY = "query"  # If the user has asked for information of any level
    REPORT = "report"  # When the main agent reports topic stimuli in the conversation
    UNSUPPORTED = "unsupported"  # Default response for bad requests


priority_map = {
    "critical": 3,
    "high": 2,
    "medium": 1,
    "low": 0,
}

relevance_agent = RelevanceAgent()


async def _process_stimuli(step: Step) -> Step:
    # Process the stimulus
    logger.info(step.input)
    step.input = json.loads(step.input)
    if True:
        logger.info("Processing high priority stimulus")
        # Evaluate and batch stimulus, triggers upsert to topic_batches
        relevance_agent.batch_stimulus_into_topic(step.input)
        step.status = "done"
        step.output = "Processed stimulus"  # TODO: Replace with actual output
    else:
        logger.info("Archiving low priority stimulus")
        try:
            supabase.table("inbox").insert({"stimulus": step.input}).execute().data
        except Exception as e:
            import pdb

            pdb.set_trace()
            logger.error(f"Error inserting stimulus: {e}")
        step.status = "archived"

    step.status = "done"
    return step


# Should we put this as a tool for the main agent?
async def _service_query(step: Step) -> Step:
    # fetch topic batches based on user query
    # add response to chat_history

    flag_query_topics(step.input["content"])
    # This then forwards the input over to the agent
    run_main_agent()
    # The output

    step.output = "Serviced query"  # TODO: Replace with actual output
    step.status = "done"
    return step


async def _manage_convo_context(step: Step) -> Step:
    """Queries the topic batches, passes them to main agent.
    Main Agent then parses topics by relevance and decides whether
    to inject context into conversation, use a tool, etc"""

    # Run main agent
    run_main_agent()

    step.status = "done"

    return step


# NOTE: ALL ABOUT AGENT PROTOCOL --  YEET!!
async def _handle_unsupported_step(step: Step) -> Step:
    step.name = StepTypes.UNSUPPORTED.name
    return step


async def task_handler(task: Task) -> None:
    if not task.input:
        raise Exception("No task prompt")
    await Agent.db.create_step(task.task_id, StepTypes.PROCESS)


async def step_handler(step: Step):
    try:
        task = await Agent.db.get_task(step.task_id)
        if not task.steps:
            await Agent.db.create_step(task_id=task.task_id, input="")
        if step.name == StepTypes.PROCESS:
            return await _process_stimuli(step)
        elif step.name == StepTypes.QUERY:
            return await _service_query(step)
        elif step.name == StepTypes.REPORT:
            return await _manage_convo_context(task, step)
        else:
            logger.error(f"Unknown step type: {step.name}")
            return await _handle_unsupported_step(step)
    except Exception as e:
        traceback.print_exception(e)
        import pdb

        pdb.set_trace()
