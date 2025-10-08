import { ChatPanel } from "@/components/chat-panel";

export default function ChatPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  return <ChatPanel role={searchParams.role} />;
}
