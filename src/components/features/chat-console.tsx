"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Terminal, Loader2 } from "lucide-react";
import { GlassCard } from "../glass-card";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

let msgId = 0;

export function ChatConsole() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: msgId++,
      role: "assistant",
      content: "Mission Control console ready. Type a message to chat with your bot.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: Message = { id: msgId++, role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/gateway/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: msgId++,
          role: "assistant",
          content: data.reply || data.error || "No response received.",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: msgId++,
          role: "assistant",
          content: "Gateway unreachable. Make sure the OpenClaw bot is running and the gateway is accessible.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <GlassCard delay={0.3} glow="cyan" className="col-span-full">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-600 shadow-lg shadow-cyan-500/20">
          <Terminal size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Bot Console
          </h2>
          <p className="text-xs text-zinc-500">Chat directly with your OpenClaw bot</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="mb-4 h-[320px] space-y-3 overflow-y-auto rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-white/[0.04] dark:bg-black/20"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex gap-2.5",
                msg.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                  msg.role === "user"
                    ? "bg-violet-100 dark:bg-violet-500/10"
                    : "bg-cyan-100 dark:bg-cyan-500/10"
                )}
              >
                {msg.role === "user" ? (
                  <User size={14} className="text-violet-600 dark:text-violet-400" />
                ) : (
                  <Bot size={14} className="text-cyan-600 dark:text-cyan-400" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed",
                  msg.role === "user"
                    ? "bg-violet-100 text-violet-900 dark:bg-violet-500/10 dark:text-violet-200"
                    : "bg-white text-zinc-700 shadow-sm dark:bg-white/[0.04] dark:text-zinc-300"
                )}
              >
                <p className="whitespace-pre-wrap font-data">{msg.content}</p>
                <p className="mt-1 text-[9px] opacity-50">
                  {msg.timestamp.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {sending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-zinc-400"
          >
            <Loader2 size={14} className="animate-spin text-cyan-500" />
            <span>Bot is thinking...</span>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          disabled={sending}
          className={cn(
            "flex-1 rounded-xl border border-zinc-200/60 bg-white/80 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400",
            "focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-500/10",
            "dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-zinc-200 dark:placeholder:text-zinc-600",
            "dark:focus:border-cyan-500/30 dark:focus:ring-cyan-500/10"
          )}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-lg transition-all",
            "hover:shadow-cyan-500/25 hover:scale-105 active:scale-95",
            "disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
          )}
        >
          <Send size={16} />
        </button>
      </div>
    </GlassCard>
  );
}
