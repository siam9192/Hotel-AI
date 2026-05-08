"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Toast from "@/components/Toast";
import { sendChatMessage } from "@/services/chat.service";
import { ChatMessagePayload } from "@/types/service.type";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const defaultMessages: ChatMessage[] = [
  {
    role: "assistant",
    text: "Welcome to Hotel AI. Ask me anything about guest check-in, room service, local recommendations, or property operations.",
  },
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const chatHistoryKey = "hotel-ai-chat-history";
  const chatConversationKey = "hotel-ai-chat-conversation";

  useEffect(() => {
    const stored = window.sessionStorage.getItem(chatHistoryKey);
    const storedConversationId =
      window.sessionStorage.getItem(chatConversationKey);

    if (storedConversationId) {
      setConversationId(storedConversationId);
    }

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch {
        setMessages(defaultMessages);
      }
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(chatHistoryKey, JSON.stringify(messages));
    if (conversationId) {
      window.sessionStorage.setItem(chatConversationKey, conversationId);
    } else {
      window.sessionStorage.removeItem(chatConversationKey);
    }

    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, conversationId]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setToastType("error");
      setToastMessage("Please type a message before sending.");
      return;
    }

    const userMessage: ChatMessage = { role: "user", text: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsTyping(true);

    try {
      const payload: ChatMessagePayload = {
        message: trimmed,
        conversationId,
        history: nextMessages,
      };
      const response = await sendChatMessage(payload);

      setMessages([
        ...nextMessages,
        { role: "assistant", text: response.response },
      ]);
      setConversationId(response.conversationId);
    } catch (error) {
      setToastType("error");
      setToastMessage(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      );
      setMessages(messages);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const summary = useMemo(
    () =>
      messages.length > 1
        ? `${messages.length - 1} messages in this session`
        : "Start your first conversation with AI Concierge",
    [messages.length],
  );

  return (
    <main className="relative overflow-hidden px-6 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-[34px] border border-white/10 bg-slate-950/90 px-6 py-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
                AI Concierge
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Hotel AI assistant
                </h1>
                <p className="mt-3 max-w-2xl text-slate-300 leading-7">
                  Chat with your intelligent hospitality platform for guest
                  support, booking insights, property updates, and curated local
                  recommendations.
                </p>
              </div>
            </div>
            <div className="rounded-[30px] border border-slate-800/70 bg-slate-950/80 p-5 text-slate-300 shadow-xl shadow-slate-950/10">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                Session summary
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {summary}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-6 rounded-[34px] border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-3xl bg-slate-900/80 p-4 shadow-inner shadow-slate-950/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-lg font-semibold text-white">
                  A
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">
                    Assistant
                  </p>
                  <p className="text-lg font-semibold text-white">
                    Hotel Smart AI
                  </p>
                </div>
              </div>
              <div className="space-y-3 rounded-3xl bg-slate-900/80 p-5 text-slate-300">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                  Capabilities
                </p>
                <ul className="space-y-3 text-sm leading-7">
                  <li>• Guest check-in guidance</li>
                  <li>• Room service recommendations</li>
                  <li>• Local attraction suggestions</li>
                  <li>• Staff workflow support</li>
                </ul>
              </div>
            </div>
          </aside>

          <section className="rounded-[34px] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-4 rounded-[30px] border border-slate-800/70 bg-slate-900/90 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                  Conversation
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  AI chat dashboard
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${isTyping ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`}
                />
                {isTyping ? "Assistant is typing..." : "Ready to assist"}
              </div>
            </div>
            <div
              ref={messageListRef}
              className="mb-6 max-h-[520px] space-y-4 overflow-y-auto pr-2 sm:pr-0"
            >
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`group flex w-full gap-4 rounded-3xl border px-5 py-4 ${
                    message.role === "assistant"
                      ? "border-slate-800/80 bg-slate-900/85"
                      : "ml-auto max-w-[90%] border-sky-500/20 bg-sky-500/10"
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-3xl text-xl font-semibold text-white">
                    {message.role === "assistant" ? "AI" : "You"}
                  </div>
                  <div className="space-y-2 text-sm leading-7">
                    <p className="font-semibold text-slate-100 capitalize">
                      {message.role === "assistant" ? "Hotel AI" : "Guest"}
                    </p>
                    <p
                      className={
                        message.role === "assistant"
                          ? "text-slate-300"
                          : "text-slate-900"
                      }
                    >
                      {message.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-[30px] border border-slate-800/70 bg-slate-900/90 p-5 shadow-inner shadow-slate-950/20">
              <label className="sr-only" htmlFor="chat-input">
                Message
              </label>
              <textarea
                id="chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                placeholder="Ask the AI assistant about concierge support, reservations, or property management."
                className="textarea-field w-full resize-none"
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">
                  Press Enter to send, Shift + Enter for newline.
                </p>
                <button
                  type="button"
                  onClick={handleSend}
                  className="primary-btn inline-flex items-center gap-2 justify-center px-5 py-3"
                >
                  <span>Send message</span>
                  <span className="text-lg">➜</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      {toastMessage ? (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      ) : null}
    </main>
  );
}
