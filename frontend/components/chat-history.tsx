import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Chat {
  id: string
  title: string
  date: string
}

interface ChatHistoryProps {
  chats: Chat[]
}

export function ChatHistory({ chats }: ChatHistoryProps) {
  return (
    <div className="space-y-1 px-3">
      {chats.map((chat) => (
        <Button key={chat.id} variant="ghost" className="w-full justify-start text-left h-auto py-2 px-3">
          <div className="flex gap-3 items-start">
            <MessageSquare size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
            <div className="overflow-hidden">
              <div className="truncate text-sm font-medium">{chat.title}</div>
              <div className="text-xs text-gray-500">{chat.date}</div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  )
}
