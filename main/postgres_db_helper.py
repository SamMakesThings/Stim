import psycopg2

class PostgresWrapper:
    def __init__(self, db_connection_string):
        self.db_connection_string = db_connection_string
        self.connection = psycopg2.connect(self.db_connection_string)
        self.cursor = self.connection.cursor()

    def get(self, concept):
        self.cursor.execute("SELECT message_ids FROM topics WHERE concept = %s", (concept,))
        result = self.cursor.fetchone()
        return result

    def set(self, concept, message_id, relevance):
        updated_message_ids = message_id
        existing_ids = self.get(concept)
        if existing_ids:
            updated_message_ids = existing_ids[0] + "," + message_id
            self.cursor.execute("UPDATE topics SET message_ids = %s WHERE concept = %s", (updated_message_ids, concept))
        else:
            self.cursor.execute("INSERT INTO topics (concept, message_ids, relevance) VALUES (%s, %s, %s)",
                                (concept, message_id, relevance))
        self.connection.commit()

    def close(self
        self.cursor.close()
        self.connection.close()
