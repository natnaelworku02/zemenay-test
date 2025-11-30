"use client"

import { cn } from "@/lib/utils"

type SkeletonProps = {
  className?: string
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-800",
        className
      )}
    />
  )
}

export default Skeleton
