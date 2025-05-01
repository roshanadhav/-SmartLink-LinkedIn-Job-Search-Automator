"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Bot,
  Loader2,
  Plus,
  MessageSquare,
  Sparkles,
  Lightbulb,
  BookOpen,
  ChevronDown,
  Settings,
  HelpCircle,
  Activity,
  Gem,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ChatHistory } from "@/components/chat-history"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [inputRows, setInputRows] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatHistory, setChatHistory] = useState([
    { id: "1", title: "Project brainstorming", date: "2 hours ago" },
    { id: "2", title: "Code review assistance", date: "Yesterday" },
    { id: "3", title: "Marketing strategy ideas", date: "3 days ago" },
    { id: "4", title: "UI design feedback", date: "Last week" },
  ])
  const [userName, setUserName] = useState("User")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Get user name from localStorage or set default on client
  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "User"
    setUserName(storedName)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Adjust textarea height based on content
  useEffect(() => {
    const rows = input.split("\n").length
    setInputRows(Math.min(5, Math.max(1, rows)))
  }, [input])

  // Handle form submission with API request
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() === "" || isLoading) return

    // Add user's message to chat
    const newMessage = { id: Date.now().toString(), role: "user", content: input }
    setMessages([...messages, newMessage])

    // Set loading state to true
    setIsLoading(true)

    try {
      // Make the API request
      const response = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })
      
      const data = await response.json()

      // Add bot's response to the chat
      const botMessage = { id: Date.now().toString(), role: "assistant", content: data.reply }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    } catch (error) {
      console.error("Error fetching from backend:", error)
    } finally {
      setIsLoading(false)
    }

    // Clear input field
    setInput("")
  }

  // Handle Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      const form = e.currentTarget.form
      if (form) {
        e.preventDefault()
        const submitEvent = new Event("submit", { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)
      }
    }
  }

  // Create a new chat
  const handleNewChat = () => {
    window.location.reload()
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-72" : "w-0"} transition-all duration-300 overflow-hidden flex flex-col border-r border-gray-800 bg-gray-900`}
      >
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700"
            onClick={handleNewChat}
          >
            <Plus size={18} />
            New chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            <h2 className="text-sm font-medium text-gray-400">Recent</h2>
          </div>
          <ChatHistory chats={chatHistory} />

          <div className="px-4 py-2 mt-4">
            <h2 className="text-sm font-medium text-gray-400">Gems</h2>
          </div>
          <div className="space-y-1 px-3">
            {[{ icon: <Sparkles size={16} className="text-yellow-500" />, name: "Creative assistant" },
              { icon: <Lightbulb size={16} className="text-purple-500" />, name: "Brainstormer" },
              { icon: <BookOpen size={16} className="text-blue-500" />, name: "Learning guide" },
            ].map((item, i) => (
              <Button key={i} variant="ghost" className="w-full justify-start gap-2 text-sm font-normal">
                {item.icon}
                {item.name}
              </Button>
            ))}
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal">
              <ChevronDown size={16} />
              More
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-800 p-3 space-y-2">
          {[{ icon: <Gem size={18} />, name: "Gem manager" },
            { icon: <HelpCircle size={18} />, name: "Help" },
            { icon: <Activity size={18} />, name: "Activity" },
            { icon: <Settings size={18} />, name: "Settings" },
          ].map((item, i) => (
            <Button key={i} variant="ghost" className="w-full justify-start gap-2 text-sm font-normal">
              {item.icon}
              {item.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-800 py-3 px-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              <MessageSquare size={20} />
            </Button>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-500" />
              AI Assistant
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full bg-purple-700 flex items-center justify-center">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Chat container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
                <div className="mb-8">
                  <div className="text-5xl font-bold mb-2">
                    <span className="text-blue-500">Hello, </span>
                    <span className="text-purple-500">{userName}</span>
                  </div>
                  <p className="text-gray-400 text-lg">How can I assist you today?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {[{ icon: <Sparkles size={20} />, title: "Creative ideas", desc: "Generate content or brainstorm ideas" },
                    { icon: <BookOpen size={20} />, title: "Learn something", desc: "Explain concepts or answer questions" },
                    { icon: <Lightbulb size={20} />, title: "Problem solving", desc: "Debug code or solve challenges" },
                    { icon: <MessageSquare size={20} />, title: "Conversation", desc: "Chat about any topic" },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-800/50 hover:bg-gray-800 transition-colors p-4 rounded-xl cursor-pointer border border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gray-700">{item.icon}</div>
                        <h3 className="font-medium">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-4 rounded-xl p-4",
                    message.role === "user" ? "bg-gray-800/70" : "bg-gray-900 border border-gray-800",
                  )}
                >
                  <div className="flex-shrink-0 mt-1">
                    {message.role === "user" ? (
                      <div className="h-8 w-8 rounded-full bg-purple-700 flex items-center justify-center">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="font-medium">{message.role === "user" ? userName : "AI Assistant"}</div>
                    <div className="prose prose-invert max-w-none">{message.content}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input area */}
        <footer className="border-t border-gray-800 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={onSubmit} className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                rows={inputRows}
                className="bg-gray-800/50 hover:bg-gray-800 transition-colors p-4 rounded-xl w-full"
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-500 text-white"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </Button>
            </form>
          </div>
        </footer>
      </div>
    </div>
  )
}
