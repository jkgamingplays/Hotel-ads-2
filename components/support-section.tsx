"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Message = {
  id: number
  text: string
  sender: "user" | "support"
  timestamp: Date
}

export function SupportSection() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("supportMessages")
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      }
    }
    return [
      {
        id: 1,
        text: "Hello! How can I help you today? You can ask about deposit reviews, account resets, withdrawals, or any other questions.",
        sender: "support",
        timestamp: new Date(),
      },
    ]
  })
  const [inputMessage, setInputMessage] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("supportMessages", JSON.stringify(messages))
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate support response
    setTimeout(() => {
      let responseText = ""
      const lowerInput = inputMessage.toLowerCase()

      if (lowerInput.includes("deposit") || lowerInput.includes("review")) {
        responseText =
          "I can help you review your deposit. Our finance team will verify your transaction within 24 hours. Please provide your transaction reference number."
      } else if (lowerInput.includes("reset") || lowerInput.includes("account")) {
        responseText =
          "To reset your work account, you must complete all 30 tasks first. Once completed, I can process your account reset request immediately."
      } else if (lowerInput.includes("withdraw")) {
        responseText =
          "Withdrawals are processed to your PayPal account within 1-3 business days. Please ensure your PayPal details are correct in your profile."
      } else {
        responseText =
          "Thank you for your message. Our finance team will review your request and respond shortly. Is there anything else I can help you with?"
      }

      const supportMessage: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: "support",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, supportMessage])
      toast({
        title: "Response Received",
        description: "Finance team has been notified.",
      })
    }, 1000)

    setInputMessage("")
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Customer Service & Finance</CardTitle>
        <CardDescription>Ask about deposit reviews, account resets, or withdrawals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ScrollArea className="h-[400px] rounded-lg border border-border bg-muted/30 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.sender === "user" ? "bg-primary" : "bg-accent"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-accent-foreground" />
                    )}
                  </div>
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground border border-border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p
                      className={`mt-1 text-xs ${
                        message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="min-h-[60px] resize-none"
            />
            <Button onClick={handleSendMessage} size="icon" className="h-[60px] w-[60px]">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
