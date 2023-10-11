import logging

from enum import Enum
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

from main_agent import run_main_agent
from relevance_agent import RelevanceAgent
from supabase_db import supabase
from utils import flag_query_topics

load_dotenv()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

app = FastAPI()


# Should be comparable by priority
class Priority(Enum):
    LOW = 0
    MEDIUM = 1
    HIGH = 2
    CRITICAL = 3


class Stimulus(BaseModel):
    priority: str
    author: str
    content: str
    source: str


relevance_agent = RelevanceAgent()


@app.post("/process_stimulus")
async def process_stimulus(stimulus: Stimulus):
    # Process the stimulus
    if stimulus.priority < Priority.MEDIUM:
        logger.info("Archiving low priority stimulus")
        try:
            supabase.table("inbox").insert({"stimulus": stimulus}).execute().data
        except Exception as e:
            logger.error(f"Error inserting stimulus: {e}")
    else:
        logger.info("Processing high priority stimulus")
        if stimulus.source == "chat":
            flag_query_topics()
        else:
            # Evaluate and batch stimulus, triggers upsert to topic_batches
            try:
                relevance_agent.batch_stimulus_into_topic(stimulus)
            except Exception as e:
                logger.error(f"Error batching stimulus: {e}")

    return {"ok": True}


@app.post("/inject_context")
async def manage_convo_context():
    """Queries the topic batches, passes them to main agent.
    Main Agent then parses topics by relevance and decides whether
    to inject context into conversation, use a tool, etc"""

    # Run main agent
    try:
        run_main_agent()
    except Exception as e:
        logger.error(f"Error running main agent: {e}")

    return {"ok": True}
