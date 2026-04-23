"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { analyticsStats, performanceData } from "@/data/portfolio-data"
import { Activity, Cpu, ShieldCheck, TestTube2 } from "lucide-react"

const iconByLabel: Record<string, typeof Activity> = {
  "Précision Modèle": Cpu,
  "Temps Inférence": Activity,
  Uptime: ShieldCheck,
  "Code Coverage": TestTube2,
}

export function AnalyticsWidget() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {analyticsStats.map((stat, idx) => {
          const Icon = iconByLabel[stat.label] ?? Activity
          return (
            <div
              key={stat.label}
              className="animate-fade-in rounded-md border border-border bg-card p-4"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </span>
                <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="mt-3 text-2xl font-medium text-foreground">
                {stat.value}
              </p>
            </div>
          )
        })}
      </div>

      <div className="animate-fade-in rounded-md border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-foreground">
              Performance des modèles & systèmes
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Évolution sur les 7 derniers mois
            </p>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <LegendDot color="var(--chart-1)" label="Modèle" />
            <LegendDot color="var(--chart-2)" label="Système" />
          </div>
        </div>
        <div className="mt-6 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="colorModel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSystem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[70, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "var(--foreground)",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
              />
              <Area
                type="monotone"
                dataKey="modèle"
                stroke="var(--chart-1)"
                strokeWidth={1.5}
                fill="url(#colorModel)"
              />
              <Area
                type="monotone"
                dataKey="système"
                stroke="var(--chart-2)"
                strokeWidth={1.5}
                fill="url(#colorSystem)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </div>
  )
}
