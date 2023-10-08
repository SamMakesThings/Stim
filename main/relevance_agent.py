import openai
import os
from supabase_db import supabase  # ensure you have imported your Supabase wrapper
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class RelevanceAgent:
    def __init__(self):
        self.openai_api_key = os.environ.get("OPENAI_API_KEY")
        if not self.openai_api_key:
            raise ValueError("OpenAI API key not found in environment variables")
        openai.api_key = self.openai_api_key
        self.topic_cache = set()

    def batch_stimulus_into_topic(self, stimulus):
        topics = supabase.table("topic_batches").select("*").execute().data
        topics_str = "\n".join([topic["topic"] for topic in topics])
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": f"""
                    You are a topic identification system. You receive messages that need to
                    be categorized into topics. If no existing topic clearly represents the message
                    content, create a new topic.
                    Respond with only the string of the topic, no quotes, no fluff, nothing other than
                    the topic itself.
                    
                    Existing Topics:
                    {topics_str}
                    """,
                    },
                    {
                        "role": "user",
                        "content": f"{stimulus['sender']}: {stimulus['content']}",
                    },
                ],
            )
            print(f"topic: {response}")

        except Exception as e:
            logger.error(e)

        # Split and extraction process might be more complex based on the actual OpenAI response
        topic = response
        logger.info(f"topic: {topic}")

        # self.upsert_topic_batches(topic.strip(), stimulus)

    def upsert_topic_batches(self, topic, message_id, relevance):
        if topic not in self.topic_cache:
            data, count = (
                supabase.table("topics")
                .upsert(
                    {
                        "topic": topic,
                        "message_ids": [message_id],
                        "relevance": relevance,
                    }
                )
                .execute()
            )
            self.topic_cache.add(topic)
        else:
            data, count = (
                supabase.table("topics")
                .select("message_ids")
                .eq("topic", topic)
                .execute()
            )
            if data and "message_ids" in data[0]:
                message_ids = data[0]["message_ids"]
                message_ids.append(message_id)
                data, count = (
                    supabase.table("topics")
                    .upsert({"topic": topic, "message_ids": message_ids})
                    .execute()
                )


# Example Usage
relevance = RelevanceAgent()
relevance.batch_stimulus_into_topic(
    {
        "sender": "Alex",
        "content": "Who is joining for coffee at 4?",
        "message_id": 1,
        "relevance": 0.5,
    }
)
