import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";
import { RealtimePostgresChangesPayload, createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kjywviviybvdhyzhvyry.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)




// const channel = supabase
// .channel('schema-db-changes')
// .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_history', filter: 'sender=eq.system' }, 
// payload => {
//   // console.log('Change received!', payload)
//   // handle change by adding it to messages array
//   resolveNewMessage(payload);  // resolve the promise with the new message payload


// })
// .subscribe()


// print details on a chat


export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = 
`
Current conversation:
{chat_history}

User: {input}
AI:`;
// I want to send the message to the database and then take the 
// latest message after current time and pass it to the open ai call
/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  let resolveNewMessage;
  const newMessagePromise = new Promise(resolve => {
    resolveNewMessage = resolve;
  });

  const channel = supabase
  .channel('schema-db-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_history', filter: 'sender=eq.system' }, 
  payload => {
    // console.log('Change received!', payload)
    // handle change by adding it to messages array
    resolveNewMessage(payload);  // resolve the promise with the new message payload
  })
  .subscribe();
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const sender  = 'user'
    const created_at = new Date().toISOString()
    const content  = currentMessageContent;

    const { data, error } = await supabase
      .from('chat_history')
      .insert([{content, sender, created_at  }]);
    if (error) {
      console.log('error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      const newMessage = await newMessagePromise;  // wait for a new message
      // console.log('newMessage', newMessage);
      //Get the content from the new message
      const content = newMessage?.new.content;
      if (content.includes('hello')) {
        console.log('The content contains the string "hello"');
      }
      
      // return new StreamingTextResponse(content)

    

      }
  } catch (e: any) {
    console.log('error', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
