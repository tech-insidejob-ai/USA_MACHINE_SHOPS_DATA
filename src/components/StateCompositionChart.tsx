"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface Props {
  data: Array<Record<string, unknown>>
}

const BUCKETS = [
  "1-5",
  "6-10",
  "11-25",
  "26-50",
  "51-100",
  "101-250",
  "251-500",
]
const COLORS = [
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
]

export default function StateCompositionChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="state"
          stroke="#a1a1aa"
          fontSize={11}
          angle={-40}
          textAnchor="end"
          height={70}
          tick={{ fill: "#a1a1aa" }}
        />
        <YAxis stroke="#71717a" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            color: "#fafafa",
          }}
          formatter={(value: any, name: any) => [
            Number(value).toLocaleString(),
            `${name} emp`,
          ]}
        />
        <Legend
          wrapperStyle={{ color: "#a1a1aa", fontSize: "11px", paddingTop: 8 }}
          formatter={(value: string) => (
            <span style={{ color: "#a1a1aa" }}>{value}</span>
          )}
        />
        {BUCKETS.map((bucket, i) => (
          <Bar
            key={bucket}
            dataKey={bucket}
            stackId="a"
            fill={COLORS[i]}
            name={`${bucket} emp`}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
