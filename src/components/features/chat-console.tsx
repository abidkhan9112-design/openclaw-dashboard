"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Wifi,
  WifiOff,
  ArrowDown,
} from "lucide-react";
import { GlassCard } from "../glass-card";
import { cn } from "@/lib/utils";
import { useGatewayStatus } from "@/lib/use-gateway-status";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

let msgId = 0;

export function ChatConsole() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const { online: gatewayOnline } = useGatewayStatus();
  const [showScrollDown, setShowScrollDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  // Track scroll position for "scroll to bottom" button
  function handleScroll() {
    const el = scrollRef.current;
    if (el) {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollDown(distFromBottom > 100);
    }
  }

  function scrollToBottom() {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }

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
          content: "Unable to reach the OpenClaw gateway. Make sure the bot service is running.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <GlassCard delay={0.2} glow="cyan" className="col-span-full">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600 shadow-lg shadow-cyan-500/25">
            <Bot size={22} className="text-white" />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900">
              <div className={cn(
                "h-full w-full rounded-full",
                gatewayOnline === true && "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]",
                gatewayOnline === false && "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]",
                gatewayOnline === null && "bg-zinc-400 animate-pulse",
              )} />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Chat with OpenClaw
            </h2>
            <div className="flex items-center gap-1.5">
              {gatewayOnline === true && (
                <>
                  <Wifi size={10} className="text-emerald-500" />
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Connected</span>
                </>
              )}
              {gatewayOnline === false && (
                <>
                  <WifiOff size={10} className="text-red-500" />
                  <span className="text-[10px] font-medium text-red-500">Gateway offline</span>
                </>
              )}
              {gatewayOnline === null && (
                <span className="text-[10px] text-zinc-400">Connecting...</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-zinc-200/60 bg-zinc-50 px-2.5 py-1 dark:border-white/[0.06] dark:bg-white/[0.03]">
          <Sparkles size={10} className="text-violet-500" />
          <span className="text-[10px] font-medium text-zinc-500">AI-powered</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-[400px] space-y-1 overflow-y-auto rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-4 dark:border-white/[0.04] dark:from-zinc-950/50 dark:to-zinc-900/30"
        >
          {/* Welcome state */}
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 dark:from-cyan-500/[0.06] dark:to-violet-500/[0.06]">
                <Bot size={32} className="text-cyan-500/60 dark:text-cyan-400/40" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Send a message to your bot
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Messages are routed through the OpenClaw gateway
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {["What can you do?", "Check my schedule", "Market update"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 transition-all hover:border-cyan-300 hover:text-cyan-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:border-cyan-500/20 dark:hover:text-cyan-400"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {sending && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 px-1"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/[0.08] dark:to-blue-500/[0.08]">
                <Bot size={14} className="text-cyan-500" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm dark:bg-white/[0.04]">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollDown && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-lg transition-all hover:scale-110 dark:border-white/[0.08] dark:bg-zinc-800"
            >
              <ArrowDown size={14} className="text-zinc-500" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={gatewayOnline === false ? "Gateway offline..." : "Type a message..."}
            disabled={sending}
            className={cn(
              "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-12 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400",
              "focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/10",
              "dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-zinc-200 dark:placeholder:text-zinc-600",
              "dark:focus:border-cyan-500/30 dark:focus:ring-cyan-500/10",
              "disabled:opacity-60"
            )}
          />
          {input.trim() && !sending && (
            <span className="absolute right-14 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 hidden sm:inline">
              Enter ↵
            </span>
          )}
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className={cn(
            "flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-lg transition-all",
            "hover:shadow-cyan-500/30 hover:scale-105 active:scale-95",
            "disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
          )}
        >
          {sending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} className="translate-x-px" />
          )}
        </button>
      </div>
    </GlassCard>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex items-end gap-2.5 px-1",
        isUser ? "flex-row-reverse" : ""
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
          isUser
            ? "bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 dark:from-violet-500/[0.08] dark:to-fuchsia-500/[0.08]"
            : "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/[0.08] dark:to-blue-500/[0.08]"
        )}
      >
        {isUser ? (
          <User size={14} className="text-violet-600 dark:text-violet-400" />
        ) : (
          <Bot size={14} className="text-cyan-600 dark:text-cyan-400" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5",
          isUser
            ? "rounded-br-md bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/15"
            : "rounded-bl-md bg-white text-zinc-800 shadow-sm dark:bg-white/[0.05] dark:text-zinc-200"
        )}
      >
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{message.content}</p>
        <p className={cn(
          "mt-1 text-[9px]",
          isUser ? "text-white/50" : "text-zinc-400"
        )}>
          {message.timestamp.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
}
