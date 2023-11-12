"use client";
import { useState, FormEvent } from "react";

export default function ChatInputSection({
  sendServerMessage,
  isLoading = false,
}: {
  sendServerMessage: (
    event: FormEvent<HTMLFormElement>,
    messageContent: string
  ) => void;
  isLoading: boolean;
}) {
  const [inputField, setInputField] = useState<string>("");

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    setInputField("");
    sendServerMessage(e, inputField);
  }

  return (
    <form className="flex flex-row justify-between" onSubmit={sendMessage}>
      <input
        value={inputField}
        onChange={(e) => setInputField(e.target.value)}
        disabled={isLoading}
        autoFocus
        placeholder="Hello Stim!"
        className="input w-full bg-base-300"
      ></input>
      <button disabled={isLoading} className="btn btn-primary ml-5">
        Send
      </button>
    </form>
  );
}
