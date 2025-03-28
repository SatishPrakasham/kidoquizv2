'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface CustomThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  disableTransitionOnChange = false,
}: CustomThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      {children}
    </NextThemesProvider>
  )
}
