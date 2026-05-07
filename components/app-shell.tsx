import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"

interface AppShellProps {
  children: React.ReactNode
  hideHeader?: boolean
  hideBottomNav?: boolean
}

export function AppShell({ children, hideHeader = false, hideBottomNav = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pb-20 md:pb-0">
      {!hideHeader && <Header />}
      <main className="pb-safe">
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}
