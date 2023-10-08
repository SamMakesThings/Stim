import os

import openai
import tiktoken
from dotenv import load_dotenv

from supabase_db import supabase

load_dotenv()

openai.api_key = os.environ.get("OPENAI_API_KEY")
encoding = tiktoken.get_encoding("cl100k_base")
max_tokens = 300


def flag_query_topics(query):
    batches = supabase.table("topic_batches").select("*").execute().data
    topics = "\n".join(
        f"{batch['topic']} - Relevance: {batch['relevance']}" for batch in batches
    )
    response = None
    try:
        response = (
            openai.ChatCompletion.create(
                model="gpt-3.5-turbo-16k",
                messages=[
                    {
                        "role": "system",
                        "content": f"""
                    You are an expert algorithm that identifies when it is appropriate to flag a topic based on a user query.
                    You know the existing topics in the system and their current relevance to the conversation.
                    You receive the specific query your user requested.
                    Your job is to determine what topic the user query is most likely refering to, if any.
                    If the user query does not seem to request information about any existing topic, respond with NULL.
                    Otherwise respond with only the name of the topic the user requested information about, nothing else.

                    Topics:
                    {topics}
                    """,  # noqa: E501
                    },
                    {
                        "role": "user",
                        "content": f"{query}",
                    },
                ],
            )
            .choices[0]
            .message
        )
    except Exception as e:
        print(f"Error with OpenAI API: {e}")

    flagged_topic = response.strip()

    response = None
    try:
        supabase.table("topic_batches").update({"relevance": "crucial"}).eq(
            "topic", flagged_topic
        ).execute().data
    except Exception as e:
        print(f"Error updating topic batch: {e}")

    return response


def add_topic_to_chat_history(topic):
    chat_history_str = read_chat_history()
    topic_obj = (
        supabase.table("topic_batches").select("*").eq("topic", topic).execute().data[0]
    )
    stimuli = topic_obj["stimuli"]
    response = None
    try:
        response = (
            openai.ChatCompletion.create(
                model="gpt-3.5-turbo-16k",
                messages=[
                    {
                        "role": "system",
                        "content": f"""
                    You are a notification contextualization system. You know the recent chat history with your user.
                    You receive a Topic and a list of associated notification json objects that need to be summarized for a user.
                    Respond with a message for the user that includes the summary of all notifications associated with the topic.

                    Chat History: 
                    {chat_history_str}
                    """,  # noqa: E501
                    },
                    {
                        "role": "user",
                        "content": f"Topic: {topic}\nNotifications: {stimuli}",
                    },
                ],
            )
            .choices[0]
            .message
        )
    except Exception as e:
        print(f"Error with OpenAI API: {e}")

    # Update topic batches in db
    try:
        supabase.table("chat_history").insert(
            {"sender": "system", "content": response}
        ).execute().data
    except Exception as e:
        print(f"Error inserting chat history: {e}")

    remove_topic_from_db(topic)

    return None


def remove_topic_from_db(topic):
    response = None
    try:
        response = supabase.table("topic_batches").delete().eq("topic", topic).execute()
    except Exception as e:
        print(f"Error deleting topic batch: {e}")
    return response


def discard_topic(topic):
    stimuli = (
        supabase.table("topic_batches")
        .select("*")
        .eq("topic", topic)
        .execute()
        .data[0]["stimuli"]
    )
    for stimulus in stimuli:
        supabase.table("inbox").insert({"stimulus": stimulus}).execute()
    response = None
    try:
        response = (
            supabase.table("topic_batches").delete().eq("topic", topic).execute().data
        )
    except Exception as e:
        print(f"Error deleting topic batch: {e}")
    return response


def read_topic_batches():
    topics = supabase.table("topic_batches").select("*").execute().data
    return ", ".join([f"{topic['topic']} : {topic['relevance']}" for topic in topics])


def read_chat_history():
    chat_history = (
        supabase.table("chat_history")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    ).data
    total_tokens = 0
    messages = []
    for message in chat_history:
        tokens = encoding.encode(message["sender"] + message["content"])
        if total_tokens + len(tokens) > max_tokens:
            break
        total_tokens += len(tokens)
        messages.append(message)

    messages.reverse()
    return "\n".join(
        [f"{message['sender']}: {message['content']}" for message in messages]
    )
