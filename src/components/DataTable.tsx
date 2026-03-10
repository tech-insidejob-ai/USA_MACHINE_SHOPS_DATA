"use client"

import { useState, useEffect, useMemo } from "react"

interface Shop {
  id: string
  name: string
  city: string
  state: string
  employees: number
  website: string
  address: string
}

type SortField = "name" | "city" | "state" | "employees"
type SortOrder = "asc" | "desc"

export default function DataTable({ allStates }: { allStates: string[] }) {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [stateFilter, setStateFilter] = useState("")
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const pageSize = 25

  useEffect(() => {
    fetch("/data/shops.json")
      .then((r) => r.json())
      .then((data) => {
        setShops(data)
        setLoading(false)
      })
  }, [])

  const filteredAndSorted = useMemo(() => {
    let result = shops

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q)
      )
    }

    if (stateFilter) {
      result = result.filter((s) => s.state === stateFilter)
    }

    result = [...result].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      let cmp: number
      if (typeof aVal === "number" && typeof bVal === "number") {
        cmp = aVal - bVal
      } else {
        cmp = String(aVal).localeCompare(String(bVal))
      }
      return sortOrder === "asc" ? cmp : -cmp
    })

    return result
  }, [shops, search, stateFilter, sortField, sortOrder])

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize)
  const pageData = filteredAndSorted.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  useEffect(() => {
    setPage(1)
  }, [search, stateFilter])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <span className="text-zinc-600 ml-1">&#8597;</span>
    return (
      <span className="text-blue-400 ml-1">
        {sortOrder === "asc" ? "\u2191" : "\u2193"}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        <span className="text-zinc-400 ml-3">Loading shop data...</span>
      </div>
    )
  }

  const startIdx = (page - 1) * pageSize + 1
  const endIdx = Math.min(page * pageSize, filteredAndSorted.length)

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, city, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 transition-colors min-w-[180px]"
        >
          <option value="">All States</option>
          {allStates.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="text-zinc-500 text-sm mb-3">
        Showing {startIdx.toLocaleString()}&ndash;{endIdx.toLocaleString()} of{" "}
        {filteredAndSorted.length.toLocaleString()} shops
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th
                className="text-left py-3 px-3 text-zinc-400 font-medium cursor-pointer hover:text-zinc-200 select-none"
                onClick={() => handleSort("name")}
              >
                Company <SortIcon field="name" />
              </th>
              <th
                className="text-left py-3 px-3 text-zinc-400 font-medium cursor-pointer hover:text-zinc-200 select-none"
                onClick={() => handleSort("city")}
              >
                City <SortIcon field="city" />
              </th>
              <th
                className="text-left py-3 px-3 text-zinc-400 font-medium cursor-pointer hover:text-zinc-200 select-none"
                onClick={() => handleSort("state")}
              >
                State <SortIcon field="state" />
              </th>
              <th
                className="text-right py-3 px-3 text-zinc-400 font-medium cursor-pointer hover:text-zinc-200 select-none"
                onClick={() => handleSort("employees")}
              >
                Employees <SortIcon field="employees" />
              </th>
              <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                Website
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((shop) => (
              <tr
                key={shop.id}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
              >
                <td className="py-2.5 px-3 text-zinc-200 font-medium max-w-[300px] truncate">
                  {shop.name}
                </td>
                <td className="py-2.5 px-3 text-zinc-400">{shop.city}</td>
                <td className="py-2.5 px-3 text-zinc-400">{shop.state}</td>
                <td className="py-2.5 px-3 text-zinc-400 text-right">
                  {shop.employees}
                </td>
                <td className="py-2.5 px-3">
                  {shop.website ? (
                    <a
                      href={
                        shop.website.startsWith("http")
                          ? shop.website
                          : `https://${shop.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 truncate block max-w-[200px]"
                    >
                      {shop.website}
                    </a>
                  ) : (
                    <span className="text-zinc-700">&mdash;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 7) {
                pageNum = i + 1
              } else if (page <= 4) {
                pageNum = i + 1
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i
              } else {
                pageNum = page - 3 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
