import openai
import os
from supabase_db import supabase  # ensure you have imported your Supabase wrapper

class Relevance:

    def __init__(self, db_wrapper):
        self.openai_api_key = os.environ.get('OPENAI_API_KEY')
        if not self.openai_api_key:
            raise ValueError("OpenAI API key not found in environment variables")
        openai.api_key = self.openai_api_key
        self.topic_cache = set()

    def processRelevance(self, message, message_id):
        response = openai.Completion.create(prompt=f"Extract topic and relevance score (0 be lowest, 1 be highest) from below article. Output in the json format. Only pick the topic with highest relevance: {message}", max_tokens=50)
        
        # Split and extraction process might be more complex based on the actual OpenAI response
        topic, relevance = response.choices[0].text.split(":")
        print(f"message_id: {message_id} topic: {topic} relevance: {relevance}")

        self.store_in_db(topic.strip(), message_id, relevance.strip())

    def store_in_db(self, topic, message_id, relevance):
        if topic not in self.topic_cache:
            data, count = supabase.table('topics').upsert({'topic': topic, 'message_ids': [message_id], 'relevance': relevance}).execute()
            self.topic_cache.add(topic)
        else:
            data, count = supabase.table('topics').select('message_ids').eq('topic', topic).execute()
            if data and 'message_ids' in data[0]:
                message_ids = data[0]['message_ids']
                message_ids.append(message_id)
                data, count = supabase.table('topics').upsert({'topic': topic, 'message_ids': message_ids}).execute()

# Example Usage
# db_wrapper is defined for the purpose of example, but not used in the code. You might want to integrate it properly.
db_wrapper = PostgresWrapper(db_connection_string="YOUR_DB_CONNECTION_STRING")
relevance = Relevance(db_wrapper)
relevance.processRelevance("Your message here", "message_id_123")
db_wrapper.close()  # Ensure your wrapper has a close method
