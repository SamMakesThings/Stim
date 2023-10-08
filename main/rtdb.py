import os
from dotenv import load_dotenv

# DB Subscription Stuff
from realtime.connection import Socket  # noqa: E402

load_dotenv()


def callback1(payload):
    print("Callback 1: ", payload)


URL = f"wss://{os.environ.get('DATABASE_ID')}.supabase.co/realtime/v1/websocket?apikey={os.environ.get('DATABASE_KEY')}&vsn=1.0.0"  # noqa: E501
s = Socket(URL)
s.connect()

channel_1 = s.set_channel("realtime:public:topic_batches")
channel_1.join().on("*", callback1)
s.listen()
