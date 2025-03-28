import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/toaster'
import { cn } from './lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KidoQuiz',
  description: 'Dynamic QR-Based Quiz Platform',
} as const

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
