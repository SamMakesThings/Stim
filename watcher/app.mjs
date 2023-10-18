import { createClient } from "@supabase/supabase-js";
import { got } from "got";
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_PASS = process.env.DATABASE_KEY;

// Create a single supabase client for interacting with your database
const supabase = createClient(DATABASE_URL, DATABASE_PASS);
const ENDPOINT = "http://main-agent:8001/";

// Should trigger Report Step
supabase
  .channel("any")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "topic_batches" },
    (payload) => {
      console.log(payload);
      got.post(ENDPOINT + `inject_context`, {
        json: {
          content: payload,
        },
      });
    }
  )
  .subscribe();

// Should trigger Query Step
supabase
  .channel("any")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "chat_history" },
    (payload) => {
      got.post(ENDPOINT + `inject_context`, {
        json: {
          content: payload.new.content,
        },
      });
      
    }
  )
  .subscribe();
