import React from 'react'

export default function StatCard({ title, value, sub, accent = 'blue' }) {
  const color = {
    blue: 'from-blue-500 to-indigo-500',
    green: 'from-emerald-500 to-green-600',
    purple: 'from-purple-500 to-fuchsia-500',
    orange: 'from-orange-500 to-amber-500',
  }[accent] || 'from-blue-500 to-indigo-500'

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white w-10 h-10 mb-3`}>$</div>
      <div className="text-gray-600 text-sm">{title}</div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  )
}
