import { useEffect, useState } from 'react'
import StatCard from './components/StatCard'
import AreaChart from './components/AreaChart'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [error, setError] = useState('')

  const fetchAnalytics = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BACKEND}/api/analytics/overview`)
      if (!res.ok) throw new Error('Failed to load analytics')
      const data = await res.json()
      setAnalytics(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const seed = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/seed`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to seed data')
      await fetchAnalytics()
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500" />
            <span className="font-semibold text-slate-800">Store SaaS Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/test" className="text-sm text-slate-500 hover:text-slate-700">Health</a>
            <button onClick={seed} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded-lg">Seed Demo</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center text-slate-500">Loading...</div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded mb-4">{error}</div>
        )}
        {analytics && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard title="Revenue Today" value={`$${analytics.today_revenue.toFixed(2)}`} sub={`${analytics.today_orders} orders`} accent="green" />
              <StatCard title="MTD Revenue" value={`$${analytics.mtd_revenue.toFixed(2)}`} sub={`${analytics.mtd_orders} orders`} accent="blue" />
              <StatCard title="Avg Order Value" value={`$${analytics.avg_order_value.toFixed(2)}`} sub="Month-to-date" accent="purple" />
              <StatCard title="Top Products" value={`${analytics.top_products.length}`} sub="Last 30 days" accent="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">Revenue (last 14 days)</h3>
                  <button onClick={fetchAnalytics} className="text-xs text-slate-500 hover:text-slate-700">Refresh</button>
                </div>
                <AreaChart data={analytics.timeseries} />
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-slate-800 mb-3">Top Products</h3>
                <div className="space-y-3">
                  {analytics.top_products.map((p, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100" />
                        <div>
                          <div className="text-sm font-medium text-slate-800">{p.title}</div>
                          <div className="text-xs text-slate-500">{p.quantity} sold</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-slate-800">${p.revenue.toFixed(2)}</div>
                    </div>
                  ))}
                  {analytics.top_products.length === 0 && (
                    <div className="text-sm text-slate-500">No data yet</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 lg:col-span-1">
                <h3 className="font-semibold text-slate-800 mb-3">Customer Segments</h3>
                <div className="space-y-2">
                  {analytics.segments.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{s.segment}</span>
                      <span className="font-medium text-slate-900">{s.count}</span>
                    </div>
                  ))}
                  {analytics.segments.length === 0 && (
                    <div className="text-sm text-slate-500">No segments yet</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="font-semibold text-slate-800 mb-3">How to use</h3>
                <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1">
                  <li>Click Seed Demo to populate products, customers and 30 days of orders</li>
                  <li>Refresh the dashboard to see analytics update</li>
                  <li>Use the Health page to verify backend and database</li>
                </ol>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
