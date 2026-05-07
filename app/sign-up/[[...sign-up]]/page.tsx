import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-40" />
        <div className="orb-1 absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="orb-2 absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-foreground">
            Price<span className="text-primary">Lens</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Create an account to start tracking prices</p>
        </div>
        
        <SignUp appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-2xl border-border/50 bg-card/80 backdrop-blur-xl",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton: "bg-secondary hover:bg-secondary/80 border-border",
            formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
            footerActionLink: "text-primary hover:text-primary/80",
          }
        }} />
      </div>
    </div>
  );
}
