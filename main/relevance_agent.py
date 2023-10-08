import os
from dotenv import load_dotenv
import logging

import openai

from supabase_db import supabase

load_dotenv()

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class RelevanceAgent:
    def __init__(self):
        self.openai_api_key = os.environ.get("OPENAI_API_KEY")
        if not self.openai_api_key:
            raise ValueError("OpenAI API key not found in environment variables")
        openai.api_key = self.openai_api_key

    def batch_stimulus_into_topic(self, stimulus):
        topics = supabase.table("topic_batches").select("*").execute().data
        topics_str = ", ".join([topic["topic"] for topic in topics])
        logger.info(f"Existing Topics: {topics_str}")
        response = None
        try:
            response = (
                openai.ChatCompletion.create(
                    model="gpt-3.5-turbo-16k",
                    messages=[
                        {
                            "role": "system",
                            "content": f"""
                        You are a topic identification system. You receive messages that need to be categorized into topics.
                        If no existing topic clearly represents the message content, create a new topic.
                        Respond with only the string of the topic, no quotes, no fluff, nothing other than the topic itself.

                        Existing Topics: {topics_str}


                        EXAMPLES:
                            Existing Topics: board meeting prep, chiefs game on saturday, dinner with mom, coffee with alex at 4
                            USER: Alex: Who is joining for coffee at 4?
                            ASSISTANT: coffee with alex at 4

                            Existing Topics: brunch with grandma, updates to frontend, new hire onboarding
                            USER: Sara: I'm going to be out of the office for the next two weeks
                            ASSISTANT: Sara out of office
                        """,  # noqa: E501
                        },
                        {
                            "role": "user",
                            "content": f"{stimulus['sender']}: {stimulus['content']}",
                        },
                    ],
                )
                .choices[0]
                .message
            )
        except Exception as e:
            logger.error(f"Error with OpenAI API: {e}")

        # Update topic batches in db
        self.upsert_topic_batches(stimulus, topics, response["content"])

    def upsert_topic_batches(self, stimulus, topics, topic):
        existing = []
        old_relevance = None
        for entry in topics:
            if entry["topic"] == topic:
                existing = entry["stimuli"]
                old_relevance = entry["relevance"]
                break
        stimuli = existing + [stimulus]
        new_relevance = self.calculate_relevance(topic, stimuli, old_relevance)
        batch = {"topic": topic, "stimuli": stimuli, "relevance": new_relevance}
        try:
            response = supabase.table("topic_batches").upsert(batch).execute().data
        except Exception as e:
            logger.error(f"Error upserting topic batch: {e}")
        return response

    def calculate_relevance(self, topic, stimuli, old_relevance):
        stimuli_str = 
        response = None
        try:
            response = (
                openai.ChatCompletion.create(
                    model="gpt-3.5-turbo-16k",
                    messages=[
                        {
                            "role": "system",
                            "content": f"""
                        You are a topic identification system. You receive messages that need to be categorized into topics.
                        If no existing topic clearly represents the message content, create a new topic.
                        Respond with only the string of the topic, no quotes, no fluff, nothing other than the topic itself.

                        Topic: {topic}
                        Old Relevance: {old_relevance if old_relevance else "UNNASSIGNED"}
                        Stimuli: {stimuli_str}


                        EXAMPLES:
                            Existing Topics: board meeting prep, chiefs game on saturday, dinner with mom, coffee with alex at 4
                            USER: Alex: Who is joining for coffee at 4?
                            ASSISTANT: coffee with alex at 4

                            Existing Topics: brunch with grandma, updates to frontend, new hire onboarding
                            USER: Sara: I'm going to be out of the office for the next two weeks
                            ASSISTANT: Sara out of office
                        """,  # noqa: E501
                        },
                        {
                            "role": "user",
                            "content": f"{stimulus['sender']}: {stimulus['content']}",
                        },
                    ],
                )
                .choices[0]
                .message
            )
        except Exception as e:
            logger.error(f"Error with OpenAI API: {e}")

        logger.info(response)
        # Return the relevance score for the topic batch
        return response


# Example Usage
relevance = RelevanceAgent()
relevance.batch_stimulus_into_topic(
    {
        "priority": "Low",
        "author": "Alex",
        "content": "I want to sail across the atlantic",
        "channel": "general",
    }
)
