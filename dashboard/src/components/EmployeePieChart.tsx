"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface Props {
  data: Array<{ range: string; count: number }>
}

const COLORS = [
  "#71717a",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
]

export default function EmployeePieChart({ data }: Props) {
  const filtered = data.filter((d) => d.count > 0)
  const total = filtered.reduce((sum, d) => sum + d.count, 0)

  return (
    <ResponsiveContainer width="100%" height={420}>
      <PieChart>
        <Pie
          data={filtered}
          cx="50%"
          cy="45%"
          innerRadius={75}
          outerRadius={140}
          dataKey="count"
          nameKey="range"
          paddingAngle={2}
          label={({ range, count }) =>
            `${range} (${((count / total) * 100).toFixed(1)}%)`
          }
          labelLine={{ stroke: "#52525b" }}
        >
          {filtered.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            color: "#fafafa",
          }}
          formatter={(value: number, name: string) => [
            value.toLocaleString(),
            `${name} employees`,
          ]}
        />
        <Legend
          wrapperStyle={{ color: "#a1a1aa", fontSize: "12px", paddingTop: 16 }}
          formatter={(value: string) => (
            <span style={{ color: "#a1a1aa" }}>{value} employees</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
