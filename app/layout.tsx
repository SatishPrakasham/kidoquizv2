import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/app/components/theme-provider'
import { type ThemeProviderProps } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KidoQuiz',
  description: 'Dynamic QR-Based Quiz Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
