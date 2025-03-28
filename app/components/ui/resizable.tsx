'use client'

import * as React from 'react'
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResizableProps {
  children: React.ReactNode
  direction: 'vertical' | 'horizontal'
  initialSize: number
  minSize?: number
  maxSize?: number
}

export function Resizable({
  children,
  direction = 'vertical',
  initialSize,
  minSize = 100,
  maxSize = 1000,
}: ResizableProps) {
  const [size, setSize] = React.useState(initialSize)
  const [isResizing, setIsResizing] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    let newSize = direction === 'vertical'
      ? e.clientX - rect.left
      : e.clientY - rect.top

    newSize = Math.max(minSize, Math.min(maxSize, newSize))
    setSize(newSize)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={cn(
          "h-full",
          direction === 'vertical' ? `w-[${size}px]` : `h-[${size}px]`
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "absolute",
          direction === 'vertical' ? "w-px h-full left-full" : "h-px w-full bottom-full",
          "bg-border cursor-col-resize"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute -translate-x-1/2 -translate-y-1/2 bg-foreground/10 rounded-full w-3 h-3 border border-background" />
      </div>
    </div>
  )
}

interface ResizablePanelGroupProps {
  children: React.ReactNode
  className?: string
}

export function ResizablePanelGroup({
  children,
  className,
}: ResizablePanelGroupProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
    >
      {children}
    </div>
  )
}

interface ResizablePanelProps {
  children: React.ReactNode
}

export function ResizablePanel({
  children,
}: ResizablePanelProps) {
  return <div>{children}</div>
}

interface ResizableHandleProps {
  withHandle?: boolean
  className?: string
}

export function ResizableHandle({
  withHandle,
  className,
}: ResizableHandleProps) {
  return (
    <div
      className={cn(
        "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className
      )}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </div>
  )
}
