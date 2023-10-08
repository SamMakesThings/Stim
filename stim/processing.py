import json
from urllib.parse import urljoin

import aiohttp
from discord import Message
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema import SystemMessage

TEMPLATE = """
You are a message prioritization expert. You excel at analyzing the content of messages and determining how urgent and important they are.

# Levels

There are the following levels of priority. Each message bust be given a priority most closely associated with one of the following:
Critical - requires immediate attention and interruption
High - requires attention in the near future
Medium - requires attention, but is not urgent
Low - does not require any attention

# Context

I will provide you with a message from a Discord server. The priority will be used for managing alert preferences.

# Examples

Message: the house is on fire!
Priority: Critical

Message: review this PR asap https://github.com/SamMakesThings/Stim/pull/1
Priority: High

Message: pick up the dry cleaning
Priority: Medium

Message: Here is a photo of a cat
Priority: Low

# Response format

Respond with only the priority level with no other text.

# Message

{message}
"""

AGENTS = ["http://localhost:8001/"]


async def prioritize_message(message: Message):
    llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")

    prompt_template = PromptTemplate.from_template(TEMPLATE)
    prompt = prompt_template.format(message=message.content)

    response = await llm.agenerate([[SystemMessage(content=prompt)]])
    priority = response.generations[0][0].text
    return priority


async def process_message(message: Message):
    priority = await prioritize_message(message)
    message_data = {
        "priority": priority,
        "content": message.content,
        "author": message.author.name,
        "channel": message.channel.name,
    }

    # TODO Fetch task ID(s)
    task_id = 1

    async with aiohttp.ClientSession() as session:
        for agent in AGENTS:
            url = urljoin(agent, f"ap/v1/agent/tasks/{task_id}/steps")
            print(f"Sending input {json.dumps(message_data)} to {url}")

            async with session.post(
                url,
                json={"input": json.dumps(message_data)},
            ) as response:
                print(f"Status: {response.status}\n{response.content}")
