"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Search, Star, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const hotelAds = [
  { id: 1, name: "Grand Plaza Hotel", location: "London", cost: 25.0, commission: 2.5 },
  { id: 2, name: "Seaside Resort & Spa", location: "Brighton", cost: 30.0, commission: 3.0 },
  { id: 3, name: "Mountain View Lodge", location: "Scotland", cost: 20.0, commission: 2.0 },
  { id: 4, name: "City Center Inn", location: "Manchester", cost: 22.0, commission: 2.2 },
  { id: 5, name: "Luxury Suites Hotel", location: "Edinburgh", cost: 35.0, commission: 3.5 },
  { id: 6, name: "Boutique Hotel", location: "London", cost: 45.0, commission: 4.5 },
  { id: 7, name: "Coastal Inn", location: "Brighton", cost: 28.0, commission: 2.8 },
  { id: 8, name: "Business Hotel", location: "Manchester", cost: 32.0, commission: 3.2 },
  { id: 9, name: "Spa Resort", location: "Bath", cost: 40.0, commission: 4.0 },
  { id: 10, name: "Garden Suites", location: "Edinburgh", cost: 38.0, commission: 3.8 },
]

interface MainSectionProps {
  onBalanceUpdate: (hotelCost: number, commission: number) => void
  onSwitchToSupport: () => void
}

export function MainSection({ onBalanceUpdate, onSwitchToSupport }: MainSectionProps) {
  const [currentHotel, setCurrentHotel] = useState<(typeof hotelAds)[0] | null>(null)
  const [tasksCompleted, setTasksCompleted] = useState(0)
  const [rating, setRating] = useState(0)
  const { toast } = useToast()

  const handleSearch = () => {
    const randomHotel = hotelAds[Math.floor(Math.random() * hotelAds.length)]
    setCurrentHotel(randomHotel)
    setRating(0)
  }

  const handleSubmitRating = () => {
    if (rating === 5 && currentHotel) {
      onBalanceUpdate(currentHotel.cost, currentHotel.commission)

      setTasksCompleted((prev) => Math.min(prev + 1, 30))

      toast({
        title: "Rating Submitted!",
        description: `You earned £${currentHotel.commission.toFixed(2)} commission.`,
      })

      setCurrentHotel(null)
      setRating(0)
    } else {
      toast({
        title: "Please rate 5 stars",
        description: "You must give a 5-star rating to earn commission.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
          <CardDescription>Complete 30 tasks to unlock account reset</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tasks Completed</span>
            <span className="text-2xl font-bold text-primary">{tasksCompleted}/30</span>
          </div>
          <Progress value={(tasksCompleted / 30) * 100} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Find Hotel to Review</CardTitle>
          <CardDescription>Click search to get a random hotel ad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleSearch} className="w-full" size="lg">
            <Search className="mr-2 h-5 w-5" />
            Search for Hotel Ad
          </Button>

          {currentHotel && (
            <div className="mt-6 space-y-4 rounded-lg border border-border bg-muted/50 p-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{currentHotel.name}</h3>
                <p className="text-sm text-muted-foreground">{currentHotel.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="text-lg font-semibold text-foreground">£{currentHotel.cost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Commission</p>
                  <p className="text-lg font-semibold text-accent-green">£{currentHotel.commission.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rate this hotel (must be 5 stars)</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating ? "fill-accent-yellow text-accent-yellow" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleSubmitRating} className="w-full" disabled={rating !== 5}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Submit Rating
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-foreground">{children}</label>
}
