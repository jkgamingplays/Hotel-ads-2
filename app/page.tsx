"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainSection } from "@/components/main-section"
import { SupportSection } from "@/components/support-section"
import { ProfileSection } from "@/components/profile-section"
import { Star, MessageCircle, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [activeTab, setActiveTab] = useState("main")
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [balance, setBalance] = useState(0)
  const [frozenBalance, setFrozenBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const savedPhone = localStorage.getItem("hotelrate_phone")
    const savedSignupStatus = localStorage.getItem("hotelrate_signed_up")
    const savedBalance = localStorage.getItem("hotelrate_balance")
    const savedFrozenBalance = localStorage.getItem("hotelrate_frozen_balance")

    if (savedPhone && savedSignupStatus === "true") {
      setPhoneNumber(savedPhone)
      setIsSignedUp(true)
    }

    if (savedBalance) {
      setBalance(Number.parseFloat(savedBalance))
    }

    if (savedFrozenBalance) {
      setFrozenBalance(Number.parseFloat(savedFrozenBalance))
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("hotelrate_balance", balance.toString())
    }
  }, [balance, isLoading])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("hotelrate_frozen_balance", frozenBalance.toString())
    }
  }, [frozenBalance, isLoading])

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber.length >= 10) {
      localStorage.setItem("hotelrate_phone", phoneNumber)
      localStorage.setItem("hotelrate_signed_up", "true")

      setIsSignedUp(true)
      toast({
        title: "Account Created",
        description: "Welcome to HotelRate Pro! Start earning commissions.",
      })
    }
  }

  const updateBalances = (hotelCost: number, commission: number) => {
    // All orders: add commission to available balance
    setBalance((prev) => prev + commission)
  }

  const switchToSupport = () => {
    setActiveTab("support")
    toast({
      title: "Switched to Support",
      description: "Contact customer service for assistance.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isSignedUp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Star className="h-7 w-7 fill-primary-foreground text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to HotelRate Pro</CardTitle>
            <CardDescription>Sign up with your phone number to start earning commissions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+44 7XXX XXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Star className="h-6 w-6 fill-primary-foreground text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">HotelRate Pro</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="main" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Support</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <MainSection onBalanceUpdate={updateBalances} onSwitchToSupport={switchToSupport} />
          </TabsContent>

          <TabsContent value="support">
            <SupportSection />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSection balance={balance} frozenBalance={frozenBalance} setBalance={setBalance} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
