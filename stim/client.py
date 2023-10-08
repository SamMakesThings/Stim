import asyncio
import os
from traceback import print_exception

import discord
from discord import Message
from dotenv import load_dotenv

from processing import process_message

load_dotenv()


class StimClient(discord.Client):
    async def on_ready(self):
        print(f"Logged on as {self.user}!")

    async def on_message(self, message: Message):
        print(f"Message from {message.author}: {message.content}")
        try:
            await process_message(message)
        except (SystemExit, KeyboardInterrupt) as e:
            raise e
        except BaseException as e:
            print_exception(e)


async def run_discord():
    intents = discord.Intents.default()
    intents.message_content = True

    client = StimClient(intents=intents)
    await client.start(os.environ.get("DISCORD_TOKEN"))


if __name__ == "__main__":
    asyncio.run(run_discord())
    