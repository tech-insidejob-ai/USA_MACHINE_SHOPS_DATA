"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface Props {
  data: Array<{ city: string; state: string; count: number }>
}

export default function TopCitiesChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    label: `${d.city}, ${d.state.slice(0, 2).toUpperCase()}`,
  }))

  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 110, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#27272a"
          horizontal={false}
        />
        <XAxis type="number" stroke="#71717a" fontSize={12} />
        <YAxis
          type="category"
          dataKey="label"
          stroke="#a1a1aa"
          fontSize={12}
          width={105}
          tick={{ fill: "#a1a1aa" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            color: "#fafafa",
          }}
          cursor={{ fill: "rgba(139, 92, 246, 0.08)" }}
          formatter={(value: any) => [Number(value).toLocaleString(), "Shops"]}
          labelFormatter={(label: any) => {
            const item = chartData.find((d) => d.label === label)
            return item ? `${item.city}, ${item.state}` : String(label)
          }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {chartData.map((_, index) => (
            <Cell
              key={index}
              fill={`hsl(${270 + index * 5}, 55%, ${58 - index * 1.2}%)`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
