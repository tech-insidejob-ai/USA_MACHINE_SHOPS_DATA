"use client"

import { useState, useEffect } from "react"
import KPICards from "@/components/KPICards"
import StateBarChart from "@/components/StateBarChart"
import EmployeePieChart from "@/components/EmployeePieChart"
import TopCitiesChart from "@/components/TopCitiesChart"
import StateCompositionChart from "@/components/StateCompositionChart"
import ShopMap from "@/components/ShopMap"
import DataTable from "@/components/DataTable"

interface Stats {
  totalShops: number
  totalStates: number
  totalCities: number
  avgEmployees: number
  medianEmployees: number
  websiteCount: number
  descriptionCount: number
  shopsByState: Array<{ state: string; count: number }>
  shopsByCity: Array<{ city: string; state: string; count: number }>
  employeeDistribution: Array<{ range: string; count: number }>
  stateComposition: Array<Record<string, unknown>>
  allStates: string[]
}

interface GeoPoint {
  id: string
  n: string
  la: number
  lo: number
  c: string
  s: string
  e: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [geoData, setGeoData] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/data/stats.json").then((r) => r.json()),
      fetch("/data/geo.json").then((r) => r.json()),
    ]).then(([statsData, geo]) => {
      setStats(statsData)
      setGeoData(geo)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            USA Machine Shops Dashboard
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Analyzing{" "}
            <span className="text-zinc-300 font-medium">
              {stats.totalShops.toLocaleString()}
            </span>{" "}
            machine shops across the United States
          </p>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        <KPICards stats={stats} />

        <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
          <h2 className="text-lg font-semibold mb-4 text-zinc-200">
            Geographic Distribution
          </h2>
          <ShopMap geoData={geoData} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
            <h2 className="text-lg font-semibold mb-4 text-zinc-200">
              Shops by State
              <span className="text-zinc-500 font-normal text-sm ml-2">
                Top 20
              </span>
            </h2>
            <StateBarChart data={stats.shopsByState.slice(0, 20)} />
          </section>

          <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
            <h2 className="text-lg font-semibold mb-4 text-zinc-200">
              Employee Size Distribution
            </h2>
            <EmployeePieChart data={stats.employeeDistribution} />
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
            <h2 className="text-lg font-semibold mb-4 text-zinc-200">
              Top Cities
              <span className="text-zinc-500 font-normal text-sm ml-2">
                Top 15
              </span>
            </h2>
            <TopCitiesChart data={stats.shopsByCity.slice(0, 15)} />
          </section>

          <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
            <h2 className="text-lg font-semibold mb-4 text-zinc-200">
              Workforce Composition
              <span className="text-zinc-500 font-normal text-sm ml-2">
                Top 10 States
              </span>
            </h2>
            <StateCompositionChart data={stats.stateComposition} />
          </section>
        </div>

        <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
          <h2 className="text-lg font-semibold mb-4 text-zinc-200">
            Shop Directory
          </h2>
          <DataTable allStates={stats.allStates} />
        </section>
      </main>

      <footer className="border-t border-zinc-800 mt-8">
        <div className="max-w-[1600px] mx-auto px-6 py-4 text-center text-zinc-600 text-sm">
          USA Machine Shops Data Analysis Dashboard &middot; {stats.totalShops.toLocaleString()} shops
        </div>
      </footer>
    </div>
  )
}
