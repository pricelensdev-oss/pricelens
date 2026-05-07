import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { ComparisonBar } from '@/components/comparison-bar'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { PreferencesProvider } from '@/hooks/use-preferences'
import { PurchasesProvider } from '@/hooks/use-purchases'
import { NotificationsProvider } from '@/hooks/use-notifications'
import { OnboardingTour } from '@/components/onboarding-tour'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'PriceLens — AI-Powered Purchase Decision System',
    template: '%s | PriceLens',
  },
  description:
    'Transform ecommerce price data into actionable buy verdicts. Know when to buy, not just where to buy. Compare prices across Amazon, Flipkart, Croma and Reliance Digital.',
  keywords: [
    'price comparison India',
    'best price',
    'buy now or wait',
    'price tracker',
    'AI shopping assistant',
    'Amazon Flipkart price compare',
  ],
  authors: [{ name: 'PriceLens' }],
  creator: 'PriceLens',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://pricelens.app',
    siteName: 'PriceLens',
    title: 'PriceLens — AI-Powered Purchase Decision System',
    description:
      'Know when to buy, not just where. AI-powered price intelligence for Indian e-commerce.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PriceLens — AI-Powered Purchase Decision System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PriceLens — AI-Powered Purchase Decision System',
    description: 'Know when to buy, not just where. AI-powered price intelligence.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#C8F31D', // Accent Green
          colorBackground: '#17191C', // Surface
          colorInputBackground: '#0E0F11', // Background
          colorInputText: 'white',
          colorText: 'white',
          colorTextSecondary: '#A3A6AB',
        },
        elements: {
          card: 'bg-card border-border shadow-2xl rounded-2xl',
          navbar: 'hidden md:flex', 
          footer: 'hidden',
          headerTitle: 'text-white font-display font-black tracking-tight',
          headerSubtitle: 'text-secondary-foreground text-xs',
          formFieldLabel: 'text-white/90 font-bold uppercase tracking-widest text-[10px]',
          formFieldInput: 'bg-background border-white/5 text-white rounded-xl focus:border-primary/50 transition-all',
          userButtonPopoverCard: 'bg-card border-border shadow-2xl rounded-2xl',
          socialButtonsBlockButton: 'bg-white/5 border-white/5 hover:bg-white/10 transition-all rounded-xl',
          socialButtonsBlockButtonText: 'text-white font-bold',
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <PreferencesProvider>
              <PurchasesProvider>
                <NotificationsProvider>
                  {children}
                  <ComparisonBar />
                  <OnboardingTour />
                  <Toaster theme="dark" position="bottom-right" richColors />
                  {process.env.NODE_ENV === 'production' && <Analytics />}
                </NotificationsProvider>
              </PurchasesProvider>
            </PreferencesProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
