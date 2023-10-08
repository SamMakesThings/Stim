import openai
import os

class Relevance:

    def __init__(self, db_wrapper):
        self.openai_api_key = os.environ.get('OPENAI_API_KEY')
        if not self.openai_api_key:
            raise ValueError("OpenAI API key not found in environment variables")
        openai.api_key = self.openai_api_key
        self.db_wrapper = db_wrapper
        self.concept_cache = set()

    def processRelevance(self, message, message_id):
        # Hypothetical OpenAI API call
        response = openai.Completion.create(prompt=f"Extract concepts and priority from: {message}", max_tokens=50)
        concept, relevance = response.choices[0].text.split(":")

        self.store_in_db(concept.strip(), message_id, relevance.strip())

    def store_in_db(self, concept, message_id, relevance):
        if concept not in self.concept_cache:
            self.db_wrapper.set(concept, message_id, relevance)
            self.concept_cache.add(concept)

# Example Usage
db_wrapper = PostgresWrapper(db_connection_string="YOUR_DB_CONNECTION_STRING")
relevance = Relevance(db_wrapper)
relevance.processRelevance("Your message here", "message_id_123")
db_wrapper.close()
