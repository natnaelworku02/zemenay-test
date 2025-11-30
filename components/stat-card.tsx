"use client"

import type { ReactNode } from "react"

type StatCardProps = {
  icon: ReactNode
  label: string
  value: string
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-secondary/60 px-4 py-3 text-sm shadow-inner">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-foreground shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="text-base font-semibold">{value}</p>
      </div>
    </div>
  )
}

export default StatCard
