import { createClient } from "@supabase/supabase-js";
import { got } from "got";
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_PASS = process.env.DATABASE_KEY;

// Create a single supabase client for interacting with your database
const supabase = createClient(DATABASE_URL, DATABASE_PASS);

const task_id = "394bb2c4-f85b-49da-a1f8-d0f715991faf"
// Should trigger Report Step
supabase
  .channel("any")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "topic_batches" },
    (payload) => {
      got.post(`http://localhost:8001/ap/v1/agent/tasks/${task_id}/steps`);
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
      got.post(`http://localhost:8001/ap/v1/agent/tasks/${task_id}/steps`);
    }
  )
  .subscribe();
