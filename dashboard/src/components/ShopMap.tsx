"use client"

import { useEffect, useRef, useCallback } from "react"

declare global {
  interface Window {
    L: any
  }
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

export default function ShopMap({ geoData }: { geoData: GeoPoint[] }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstance.current || !window.L) return

    const L = window.L
    const map = L.map(mapRef.current, {
      center: [39.5, -98.35],
      zoom: 4,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map)

    const markers = L.markerClusterGroup({
      chunkedLoading: true,
      chunkInterval: 100,
      chunkDelay: 10,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 14,
    })

    geoData.forEach((shop) => {
      const marker = L.circleMarker([shop.la, shop.lo], {
        radius: 4,
        fillColor: "#3b82f6",
        color: "#1e40af",
        weight: 1,
        fillOpacity: 0.8,
      })
      marker.bindPopup(
        `<div style="min-width:160px">` +
          `<div style="font-weight:600;font-size:14px;margin-bottom:4px">${shop.n}</div>` +
          `<div style="color:#a1a1aa">${shop.c}, ${shop.s}</div>` +
          `<div style="color:#a1a1aa;margin-top:2px">Employees: <span style="color:#fafafa;font-weight:500">${shop.e}</span></div>` +
          `</div>`
      )
      markers.addLayer(marker)
    })

    map.addLayer(markers)
    mapInstance.current = map
    setTimeout(() => map.invalidateSize(), 200)
  }, [geoData])

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 50

    const checkAndInit = () => {
      if (window.L && window.L.markerClusterGroup) {
        initMap()
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(checkAndInit, 100)
      }
    }
    checkAndInit()

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [initMap])

  return (
    <div
      ref={mapRef}
      className="w-full rounded-xl overflow-hidden"
      style={{ height: "500px" }}
    />
  )
}
