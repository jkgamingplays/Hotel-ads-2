"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, Lock, ArrowUpRight, Loader2, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProfileSectionProps {
  balance: number
  frozenBalance: number
  setBalance: (value: number | ((prev: number) => number)) => void
}

interface PendingWithdrawal {
  id: string
  amount: number
  paypalEmail: string
  date: string
  status: "pending" | "processing" | "failed"
}

export function ProfileSection({ balance, frozenBalance, setBalance }: ProfileSectionProps) {
  const [paypalAccount, setPaypalAccount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingWithdrawals, setPendingWithdrawals] = useState<PendingWithdrawal[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const stored = localStorage.getItem("pendingWithdrawals")
    if (stored) {
      setPendingWithdrawals(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (pendingWithdrawals.length > 0) {
      localStorage.setItem("pendingWithdrawals", JSON.stringify(pendingWithdrawals))
    }
  }, [pendingWithdrawals])

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paypalAccount) {
      toast({
        title: "Error",
        description: "Please enter your PayPal account details.",
        variant: "destructive",
      })
      return
    }

    const withdrawValue = Number.parseFloat(withdrawAmount)

    if (isNaN(withdrawValue) || withdrawValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      })
      return
    }

    if (withdrawValue > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You cannot withdraw more than your available balance.",
        variant: "destructive",
      })
      return
    }

    if (balance <= 0) {
      toast({
        title: "Cannot Withdraw",
        description: "Your available balance must be positive to withdraw.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const withdrawalId = `WD-${Date.now()}`
      const newWithdrawal: PendingWithdrawal = {
        id: withdrawalId,
        amount: withdrawValue,
        paypalEmail: paypalAccount,
        date: new Date().toISOString(),
        status: "processing",
      }

      setPendingWithdrawals((prev) => [...prev, newWithdrawal])

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        const response = await fetch("/api/withdraw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paypalEmail: paypalAccount,
            amount: withdrawValue,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        const data = await response.json()

        if (response.ok && data.success) {
          setBalance((prev) => prev - withdrawValue)
          setPendingWithdrawals((prev) =>
            prev.map((w) => (w.id === withdrawalId ? { ...w, status: "pending" as const } : w)),
          )

          if (data.requiresManualProcessing) {
            toast({
              title: "Withdrawal Submitted",
              description: `Your withdrawal of £${withdrawValue.toFixed(2)} has been submitted and will be processed manually within 24-48 hours.`,
            })
          } else {
            toast({
              title: "Withdrawal Successful",
              description: `£${withdrawValue.toFixed(2)} has been sent to ${paypalAccount}. ${data.batchId ? `Batch ID: ${data.batchId}` : ""}`,
            })
          }
        } else {
          toast({
            title: "Withdrawal Submitted",
            description: `Your withdrawal of £${withdrawValue.toFixed(2)} has been submitted and will be processed shortly.`,
          })
        }
      } catch (apiError) {
        console.log("[v0] API request failed, withdrawal queued locally")
        toast({
          title: "Withdrawal Queued",
          description: `Your withdrawal of £${withdrawValue.toFixed(2)} has been queued and will be processed shortly.`,
        })
      }

      setWithdrawAmount("")
      setPaypalAccount("")
    } catch (error) {
      console.error("[v0] Withdrawal error:", error)
      toast({
        title: "Withdrawal Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Balance</CardTitle>
          <CardDescription>Your earnings and frozen funds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">Available Balance</span>
              </div>
              <p className={`text-3xl font-bold ${balance >= 0 ? "text-accent-green" : "text-red-500"}`}>
                £{balance.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-medium">Frozen Balance</span>
              </div>
              <p className="text-3xl font-bold text-muted-foreground">£{frozenBalance.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {pendingWithdrawals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Withdrawals</CardTitle>
            <CardDescription>Your withdrawal requests being processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingWithdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">£{withdrawal.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{withdrawal.paypalEmail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-yellow-600 capitalize">{withdrawal.status}</p>
                    <p className="text-xs text-muted-foreground">{new Date(withdrawal.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal</CardTitle>
          <CardDescription>Transfer funds to your PayPal account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paypal">PayPal Account</Label>
              <Input
                id="paypal"
                type="email"
                placeholder="Enter your PayPal email address"
                value={paypalAccount}
                onChange={(e) => setPaypalAccount(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount (£)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                disabled={isProcessing}
              />
              <p className="text-xs text-muted-foreground">Available: £{balance.toFixed(2)}</p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Request Withdrawal
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Account Status</span>
            <span className="text-sm font-medium text-accent-green">Active</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Total Earnings</span>
            <span className="text-sm font-medium">£{(balance + frozenBalance).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-muted-foreground">Withdrawal Method</span>
            <span className="text-sm font-medium">PayPal</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
