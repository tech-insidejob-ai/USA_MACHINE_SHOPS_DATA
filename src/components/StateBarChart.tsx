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
  data: Array<{ state: string; count: number }>
}

export default function StateBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={520}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#27272a"
          horizontal={false}
        />
        <XAxis type="number" stroke="#71717a" fontSize={12} />
        <YAxis
          type="category"
          dataKey="state"
          stroke="#a1a1aa"
          fontSize={12}
          width={85}
          tick={{ fill: "#a1a1aa" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            color: "#fafafa",
          }}
          cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
          formatter={(value: any) => [Number(value).toLocaleString(), "Shops"]}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={`hsl(${220 + index * 3}, 70%, ${60 - index * 0.8}%)`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
