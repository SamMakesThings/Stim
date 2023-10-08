import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";
import { RealtimePostgresChangesPayload, createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kjywviviybvdhyzhvyry.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeXd2aXZpeWJ2ZGh5emh2eXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY3MzQ3ODgsImV4cCI6MjAxMjMxMDc4OH0.M9spxT3126JgZ_ujoFnwxfPv6u9v9wRdJ5Y_VTt4mkQ"
const supabase = createClient(supabaseUrl, supabaseKey)






export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};



// I want to send the message to the database and then take the 
// latest message after current time and pass it to the open ai call
/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */

export async function POST(req: NextRequest) {
  interface NewMessagePayload {
    new: {
      content: string;
    };
  }
  
  let resolveNewMessage: (value: RealtimePostgresChangesPayload<{ [key: string]: any; }> | PromiseLike<RealtimePostgresChangesPayload<{ [key: string]: any; }>>) => void;
  const newMessagePromise = new Promise<RealtimePostgresChangesPayload<{ [key: string]: any; }>>((resolve) => {
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
      const news = newMessage?.new;
      //check if "content" is in newMEssage keys
      if ('content' in newMessage.new) {
        const content = newMessage.new.content;
        console.log('content', content);
        return new StreamingTextResponse(content)

      } else {
        console.log('content key is not present');
      }
      
      // if(news != '{}'){
      //   if (news && Object.keys(news).length > 0) {
      //     const content = news.content;
      //     if (content.includes('hello')) {
      //       console.log('The content contains the string "hello"');
      //     }
      //   }
      //   if (content.includes('hello')) {
      //     console.log('The content contains the string "hello"');
      //   }
        

      // }
      // return new StreamingTextResponse(content)

    interface NewMessage {
  content: string;
  // ... other properties
}


      }
  } catch (e: any) {
    console.log('error', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
