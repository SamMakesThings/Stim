import { ChatWindow } from "@/components/ChatWindow";

export default function AgentsPage() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        ▲ Next.js + LangChain.js Agents 🦜🔗
      </h1>
      <ul>
        <li className="text-l">
          🐙
          <span className="ml-2">
            This template is open source - you can see the source code and
            deploy your own version{" "}
            <a
              href="https://github.com/langchain-ai/langchain-nextjs-template"
              target="_blank"
            >
              from the GitHub repo
            </a>
            !
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            Try asking e.g. <code>What is the weather in Honolulu?</code> below!
          </span>
        </li>
      </ul>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/chat/agents"
      emptyStateComponent={InfoCard}
      placeholder="Squawk! I'm a conversational agent! Ask me about the current weather in Honolulu!"
      titleText="Polly the Agentic Parrot"
      emoji="🦜"
      showIntermediateStepsToggle={true}
    ></ChatWindow>
  );
}
