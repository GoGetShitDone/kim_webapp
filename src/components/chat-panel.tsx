"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { resolveDataset } from "@/lib/datasets";
import Link from "next/link";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
  source?: string;
};

interface ChatPanelProps {
  role?: string;
}

export function ChatPanel({ role }: ChatPanelProps) {
  const { displayName, role: resolvedRole } = resolveDataset(role);
  const initialMessage = useMemo<ChatMessage>(
    () => ({
      role: "assistant",
      content: `${displayName} 데이터를 기반으로 도와드릴게요. 매출, 세무, HR 모두 물어보세요.`,
    }),
    [displayName],
  );
  const placeholder =
    resolvedRole === "it-founder"
      ? '김비서에게 "이번 분기 투자 집행 현황 정리해줘"라고 물어보세요'
      : '김비서에게 "이번 달 부가세 얼마야?"라고 물어보세요';

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [pendingInput, setPendingInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([initialMessage]);
  }, [initialMessage]);

  async function sendMessage(userContent: string) {
    if (!userContent.trim()) {
      return;
    }
    setError(null);

    const nextMessages = [
      ...messages,
      { role: "user" as const, content: userContent },
    ];
    setMessages(nextMessages);
    setPendingInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: resolvedRole,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = (await response.json()) as {
        message: string;
        source?: string;
      };

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          source: data.source,
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "죄송해요. 서버와 통신 중 문제가 발생했어요. 잠시 후 다시 요청해 주세요.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(pendingInput);
  }

  return (
    <div className="flex min-h-dvh w-full flex-col backdrop-blur-sm">
      <header className="flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/70 px-4 backdrop-blur">
        <Link
          href={`/dashboard?role=${resolvedRole}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-200 transition hover:border-brand/50 hover:text-brand"
          aria-label="대시보드로 돌아가기"
        >
          <span className="sr-only">뒤로</span>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
          >
            <path
              d="M11.25 5L6.25 10L11.25 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <div className="flex flex-col items-center text-center text-slate-300">
          <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
            김비서
          </span>
          <span className="mt-1 text-sm font-medium text-white">{displayName}</span>
        </div>
        <div className="w-10" />
      </header>
      <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-6 pt-6">
        {messages.map((message, idx) => (
          <div
            key={`${message.role}-${idx}`}
            className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[90%] rounded-3xl border px-4 py-3 text-sm leading-relaxed shadow-lg backdrop-blur ${
                message.role === "assistant"
                  ? "border-white/10 bg-white/15 text-slate-100"
                  : "border-brand/40 bg-brand/20 text-brand-foreground"
              }`}
            >
              <p className="whitespace-pre-line">{message.content}</p>
              {message.source ? (
                <p className="mt-2 text-[10px] uppercase tracking-[0.4em] text-slate-300">
                  {message.source === "openai" ? "AI" : "로컬 데이터"}
                </p>
              ) : null}
            </div>
          </div>
        ))}
        {isLoading ? (
          <div className="flex justify-start">
            <div className="rounded-3xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-200">
              김비서가 생각 중이에요...
            </div>
          </div>
        ) : null}
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-t border-white/10 bg-slate-950/60 px-6 py-5 backdrop-blur"
      >
        <div className="flex items-center gap-3">
          <input
            value={pendingInput}
            onChange={(event) => setPendingInput(event.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-glow transition hover:brightness-110 disabled:opacity-60"
            disabled={isLoading || !pendingInput.trim()}
          >
            →
          </button>
        </div>
        {error ? (
          <p className="mt-2 text-[11px] text-red-300">
            {error} · 잠시 후 다시 시도해주세요.
          </p>
        ) : null}
      </form>
    </div>
  );
}
