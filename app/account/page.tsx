"use client"

import { UserProfile, useAuth } from "@clerk/nextjs"
import { AppShell } from "@/components/app-shell"
import { ArrowLeft, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AccountPage() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to System
          </Link>
        </div>

        {isSignedIn ? (
          <div className="flex justify-center">
            <UserProfile 
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full max-w-5xl luxury-card border-white/5",
                  card: "bg-card border-none shadow-none",
                  navbar: "border-r border-white/5 md:flex",
                  headerTitle: "text-white font-display",
                  headerSubtitle: "text-muted-foreground",
                  formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                  breadcrumbsItem: "text-muted-foreground",
                  breadcrumbsSeparator: "text-muted-foreground/30",
                  formFieldLabel: "text-white",
                  formFieldInput: "bg-white/5 border-white/10 text-white",
                  header: "text-white",
                  profileSectionTitleText: "text-white",
                  profileSectionContent: "text-muted-foreground",
                  accordionTriggerButton: "text-white",
                  badge: "bg-primary/20 text-primary border-primary/20",
                }
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 glow-primary">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white">Access Restricted</h2>
            <p className="mt-3 max-w-sm text-muted-foreground">
              Please sign in to access your neural market profile and intelligence preferences.
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild className="rounded-xl px-8">
                <Link href="/">Back Home</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl px-8 border-white/10 bg-white/5">
                <Link href="/sign-in">Sign In Now</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  )
}
