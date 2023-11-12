import { Message } from "@/models";

export default function ChatHistorySection({
  chatHistory,
}: {
  chatHistory: Message[];
}) {
  return (
    <div className="flex h-full flex-col bg-base-300 rounded-lg py-20 px-5 mb-5 overflow-y-auto">
      {chatHistory.map((msg) => {
        if (msg.sender === "system") {
          return (
            <div className="flex w-full max-w-xl ph-5 bg-neutral p-5 rounded-full rounded-bl-none my-2 self-start">
              <p>{msg.content}</p>
            </div>
          );
        } else if (msg.sender === "user") {
          return (
            <div className="flex w-full max-w-xl ph-5 bg-base-200 p-5 rounded-full rounded-br-none my-2 self-end">
              <p>{msg.content}</p>
            </div>
          );
        }
      })}
    </div>
  );
}
