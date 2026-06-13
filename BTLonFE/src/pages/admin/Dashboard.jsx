import { useEffect, useState } from "react";
import {
  ShoppingBag,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import dashboardService from "@/services/dashboardService";
import { useApiCall } from "@/hooks/useApiCall";
import { InlineLoader } from "@/components/common/LoadingOverlay";
import formatPrice from "@/utils/helpers/formatPrice";

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  pending: "#eab308",
  confirmed: "#3b82f6",
  shipping: "#a855f7",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipping: "Shipping",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-medium text-gray-400 block">{title}</span>
        <span className="text-xl font-bold text-gray-900 block tracking-tight">
          {value}
        </span>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { execute, loading } = useApiCall();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setError(false);
    const res = await execute(() => dashboardService.getDashboard());
    if (res?.data) {
      setStats(res.data);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300_000); // auto-refresh 5 min
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading && !stats) {
    return <InlineLoader message="Loading dashboard..." />;
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !stats) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
        <p className="text-gray-500 text-sm">Unable to load dashboard data.</p>
        <button
          onClick={fetchData}
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      </div>
    );
  }

  // ── Derived data ───────────────────────────────────────────────────────────

  // revenue_summary: { today, week, month }
  const revenue = stats.revenue_summary ?? {};

  // orders_by_status: { pending: N, confirmed: N, ... }
  const ordersByStatus = stats.orders_by_status ?? {};
  const totalOrders = Object.values(ordersByStatus).reduce((a, b) => a + b, 0);

  // Pie chart data
  const pieData = Object.entries(ordersByStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status] ?? status,
      value: count,
      color: STATUS_COLORS[status] ?? "#9ca3af",
    }));

  // revenue_chart: [{ date, revenue, total_orders }]
  const revenueChart = stats.revenue_chart ?? [];

  // top_selling: [{ name, quantity_sold, revenue }]
  const topSelling = stats.top_selling ?? [];

  // low_stock_products: [{ name, stock }]
  const lowStock = stats.low_stock_products ?? [];

  const cards = [
    {
      title: "Total orders",
      value: totalOrders,
      icon: ShoppingBag,
      colorClass: "bg-blue-50 text-blue-600",
    },
    {
      title: "Revenue today",
      value: formatPrice(revenue.today?.revenue ?? 0),
      icon: DollarSign,
      colorClass: "bg-green-50 text-green-600",
    },
    {
      title: "Revenue this week",
      value: formatPrice(revenue.week?.revenue ?? 0),
      icon: Calendar,
      colorClass: "bg-purple-50 text-purple-600",
    },
    {
      title: "Revenue this month",
      value: formatPrice(revenue.month?.revenue ?? 0),
      icon: TrendingUp,
      colorClass: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">System Overview</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Auto-refreshes every 5 minutes.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200
            rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <StatCard key={i} {...c} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area chart — revenue 7 days */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Revenue — last 7 days
          </h2>
          {revenueChart.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-gray-400">
              No data available.
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueChart}
                  margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                  />
                  <Tooltip
                    formatter={(v) => [formatPrice(v), "Revenue"]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #f3f4f6",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pie chart — order status */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Orders by status
          </h2>
          {pieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-gray-400">
              No orders yet.
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #f3f4f6",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top selling products */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-800">
              Top 5 best-selling products
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-50">
                <th className="py-3 px-5 text-left">Product</th>
                <th className="py-3 px-5 text-center">Sold</th>
                <th className="py-3 px-5 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topSelling.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-10 text-gray-400 text-xs"
                  >
                    No sales data yet.
                  </td>
                </tr>
              ) : (
                topSelling.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-5 font-medium text-gray-900 line-clamp-1">
                      {p.name}
                    </td>
                    <td className="py-3 px-5 text-center text-gray-600 font-mono">
                      {p.total_sold ?? p.quantity_sold ?? "—"}
                    </td>
                    <td className="py-3 px-5 text-right font-medium text-gray-900">
                      {formatPrice(p.total_revenue ?? p.revenue ?? 0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-800">
              Low stock alert
            </h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600 rounded-full">
              Stock ≤ 5
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-50">
                <th className="py-3 px-5 text-left">Product</th>
                <th className="py-3 px-5 text-right">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lowStock.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="text-center py-10 text-gray-400 text-xs"
                  >
                    All products are well-stocked.
                  </td>
                </tr>
              ) : (
                lowStock.map((p, i) => {
                  const critical = p.stock <= 2;
                  return (
                    <tr
                      key={i}
                      className={`transition-colors ${critical ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-gray-50/50"}`}
                    >
                      <td className="py-3 px-5 font-medium text-gray-900 flex items-center gap-2">
                        {critical && (
                          <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        )}
                        {p.name}
                      </td>
                      <td className="py-3 px-5 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-bold text-xs ${
                            critical
                              ? "bg-red-100 text-red-700 animate-pulse"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
