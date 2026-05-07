"use client"

import { useState, useEffect } from "react"
import { Sparkles, ArrowRight, X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    title: "AI Market Verdicts",
    description: "Look for the BUY, WAIT, or HOLD badges. Our agentic engine analyzes 90-day history to tell you exactly when to act.",
    icon: Sparkles,
  },
  {
    title: "Personalized Pricing",
    description: "Set your preferred cards in the top header. We'll automatically calculate the real effective price for every product.",
    icon: Info,
  },
  {
    title: "Interactive Alerts",
    description: "Click any point on the price history chart to set a target. We'll email you the moment the market hits your price.",
    icon: ArrowRight,
  },
]

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem("pricelens-tour-seen")
    if (!seen) {
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    localStorage.setItem("pricelens-tour-seen", "true")
  }

  if (!isVisible) return null

  const StepIcon = STEPS[currentStep].icon

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      <Card className="relative w-full max-w-sm overflow-hidden border-white/10 bg-[#0a0a0c] p-0 shadow-2xl">
        <div className="absolute right-2 top-2">
          <Button variant="ghost" size="icon" onClick={handleComplete} className="h-8 w-8 text-muted-foreground hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <StepIcon className="h-7 w-7 text-primary" />
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            {STEPS[currentStep].title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {STEPS[currentStep].description}
          </p>

          <div className="mt-10 flex items-center justify-between">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === currentStep ? "w-6 bg-primary" : "w-1.5 bg-white/10"
                  )}
                />
              ))}
            </div>
            <Button onClick={handleNext} className="gap-2">
              {currentStep === STEPS.length - 1 ? "Start Exploring" : "Next Step"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-300" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} />
      </Card>
    </div>
  )
}
