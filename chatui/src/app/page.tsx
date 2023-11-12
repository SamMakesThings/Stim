"use client";

import { useEffect, useState, FormEvent } from "react";

import { createClient } from "@/utils/supabase/client";
import ChatHistorySection from "@/components/ChatHistorySection";
import ChatInputSection from "@/components/ChatInputSection";
import { Message } from "@/models";

export default function Home() {
  const supabase = createClient();

  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isBtnLoading, setBtnLoading] = useState<boolean>(false);

  // Fetch chat history on first load
  useEffect(() => {
    const fetchChatHistory = async () => {
      let { data: chatHistory, error } = await supabase
        .from("chat_history")
        .select("*")
        .order("id", { ascending: true });

      if (error) console.log("Error: ", error);
      else setChatHistory(chatHistory as Message[]);
    };

    fetchChatHistory();
  }, []);

  // Listen for changes in chat history table
  const channel = supabase
    .channel("any")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "chat_history" },
      (payload) => {
        console.log(payload.new);
        setChatHistory([...chatHistory, payload.new as Message]);
      }
    )
    .subscribe();

  async function sendMessage(
    e: FormEvent<HTMLFormElement>,
    messageContent: string
  ) {
    e.preventDefault();
    setBtnLoading(true);

    supabase
      .from("chat_history")
      .insert({
        sender: "user",
        content: messageContent,
      })
      .then(() => setBtnLoading(false));
  }

  return (
    <main className="flex h-screen flex-col items-center justify-between p-24">
      <div className="flex h-full w-full max-w-3xl flex-col">
        <ChatHistorySection chatHistory={chatHistory} />
        <ChatInputSection
          sendServerMessage={sendMessage}
          isLoading={isBtnLoading}
        />
      </div>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"></div>
    </main>
  );
}
