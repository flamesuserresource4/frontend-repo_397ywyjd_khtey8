import React from 'react'

export default function AreaChart({ data }) {
  // simple SVG area chart
  const width = 600
  const height = 180
  const padding = 24

  const values = data?.map(d => d.revenue) || [0]
  const max = Math.max(...values, 1)
  const points = data?.map((d, i) => [
    padding + (i * ((width - padding * 2) / (data.length - 1 || 1))),
    height - padding - (d.revenue / max) * (height - padding * 2)
  ]) || []

  const path = points.reduce((acc, [x, y], i) => (
    acc + (i === 0 ? `M ${x},${y}` : ` L ${x},${y}`)
  ), '')

  const areaPath = `${path} L ${padding + (data.length - 1) * ((width - padding * 2) / (data.length - 1 || 1))},${height - padding} L ${padding},${height - padding} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#grad)" stroke="none" />
      <path d={path} fill="none" stroke="#6366f1" strokeWidth="2" />
    </svg>
  )
}
