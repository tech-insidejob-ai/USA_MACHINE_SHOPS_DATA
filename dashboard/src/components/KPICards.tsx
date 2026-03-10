"use client"

interface Props {
  stats: {
    totalShops: number
    totalStates: number
    totalCities: number
    avgEmployees: number
    websiteCount: number
  }
}

export default function KPICards({ stats }: Props) {
  const cards = [
    {
      label: "Total Machine Shops",
      value: stats.totalShops.toLocaleString(),
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "States & Territories",
      value: stats.totalStates.toString(),
      color: "from-violet-500 to-violet-600",
    },
    {
      label: "Cities",
      value: stats.totalCities.toLocaleString(),
      color: "from-cyan-500 to-cyan-600",
    },
    {
      label: "Avg Employees",
      value: stats.avgEmployees.toFixed(1),
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Have Website",
      value: `${((stats.websiteCount / stats.totalShops) * 100).toFixed(1)}%`,
      color: "from-amber-500 to-amber-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 transition-colors"
        >
          <div
            className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${card.color} mb-3`}
          />
          <p className="text-2xl font-bold text-zinc-100">{card.value}</p>
          <p className="text-xs text-zinc-500 mt-1.5 uppercase tracking-wider">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  )
}
