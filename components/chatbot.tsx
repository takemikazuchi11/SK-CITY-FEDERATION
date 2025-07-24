"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X, Sparkles, Users, BarChart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import ai from "@/public/sk-ai.png"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      content:
        "Hi there! How can I help you today? I can suggest events, analyze participation data, or recommend activities based on member interests.",
      role: "assistant",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const [suggestedQueries, setSuggestedQueries] = useState([
    "What are the most popular events right now?",
    "Can you suggest events?",
    "Suggest new events for our members this summer",
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        // If the response is not JSON, treat it as text
        const text = await response.text()
        throw new Error(`Unexpected response: ${text.substring(0, 100)}...`)
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        role: "assistant",
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Update suggested queries based on the conversation context
      const lowerInput = input.toLowerCase()
      if (lowerInput.includes("event") || lowerInput.includes("activity")) {
        setSuggestedQueries([
          "What are the most popular events right now?",
          "How many participants are in each event category?",
          "Which event has the highest registration count?",
        ])
      } else if (
        lowerInput.includes("popular") ||
        lowerInput.includes("participation") ||
        lowerInput.includes("count")
      ) {
        setSuggestedQueries([
          "What trends do you see in our event participation?",
          "How many users are registered for sports events?",
          "Which event categories should we focus on?",
        ])
      } else if (lowerInput.includes("suggest") || lowerInput.includes("idea")) {
        setSuggestedQueries([
          "Suggest events similar to our Basketball Tournament",
          "What environmental activities could we organize?",
          "Give me ideas for youth leadership programs",
        ])
      }
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content:
          error instanceof Error ? `Error: ${error.message}` : "An unexpected error occurred. Please try again later.",
        role: "assistant",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuery = (query: string) => {
    setInput(query)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 shadow-lg"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 md:w-96 shadow-xl z-50 flex flex-col max-h-[500px]">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={ai.src} alt="Chatbot Avatar" />
                <AvatarFallback>SK</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">SK Federation Assistant</h3>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto flex-1 max-h-[350px]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  {message.role === "user" ? (
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 max-w-[80%] text-sm whitespace-pre-wrap",
                        "bg-primary text-primary-foreground",
                      )}
                    >
                      {message.content}
                    </div>
                  ) : (
                    <div className="flex gap-2 max-w-[80%]">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={ai.src} alt="Chatbot Avatar" />
                        <AvatarFallback>SK</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-3 py-2 text-sm whitespace-pre-wrap bg-muted">{message.content}</div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={ai.src} alt="Chatbot Avatar" />
                    <AvatarFallback>SK</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-3 py-2 ml-2 max-w-[80%] text-sm bg-muted">
                    <div className="flex gap-1 items-center">
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Suggested queries */}
          {messages.length < 3 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs py-1 h-auto"
                    onClick={() => handleSuggestedQuery(query)}
                  >
                    {index === 0 ? (
                      <Users className="h-3 w-3 mr-1" />
                    ) : index === 1 ? (
                      <BarChart className="h-3 w-3 mr-1" />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    {query}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <CardFooter className="p-4 pt-2 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

