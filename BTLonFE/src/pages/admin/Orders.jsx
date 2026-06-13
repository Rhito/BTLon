import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Download,
  Eye,
  Calendar as CalendarIcon,
  Filter,
} from "lucide-react";
import orderService from "@/services/orderService";
import { usePagination } from "@/hooks/usePagination";
import { useApiCall } from "@/hooks/useApiCall";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/useToast";
import formatPrice from "@/utils/helpers/formatPrice";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "yellow" },
  confirmed: { label: "Confirmed", color: "blue" },
  shipping: { label: "Shipping in progress", color: "purple" },
  delivered: { label: "Delivered successfully", color: "green" },
  cancelled: { label: "Cancelled", color: "red" },
};

export default function Orders() {
  const toast = useToast();
  const { execute: exportExec, loading: exporting } = useApiCall();

  // ── Filters State ────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ── Pagination + Fetch ───────────────────────────────────────────────────
  const { data, pagination, loading, setPage, setParams } = usePagination(
    orderService.getOrders,
    { initialParams: {} },
  );

  useEffect(() => {
    setParams({
      filter: debouncedSearch || undefined,
      status: statusFilter || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    });
  }, [debouncedSearch, statusFilter, dateFrom, dateTo]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Export CSV ───────────────────────────────────────────────────────────
  const handleExportCSV = async () => {
    try {
      const res = await exportExec(() => orderService.exportOrders());
      if (res) {
        const url = window.URL.createObjectURL(res);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `orders_export_${new Date().getTime()}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("CSV file exported successfully!");
      }
    } catch (error) {
      toast.error("Error when trying CSV file export!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-900">Order Management</h1>
        <Button
          leftIcon={<Download className="h-4 w-4" />}
          variant="outline"
          onClick={handleExportCSV}
          loading={exporting}
        >
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        {/* Search */}
        <div className="flex-1 w-full">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order code, Name, Customer phone number..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Status */}
        <div className="w-full md:w-48">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="">All</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="w-full md:w-36">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              From date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="w-full md:w-36">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              To date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
        <LoadingOverlay show={loading} />

        {data.length === 0 && !loading ? (
          <EmptyState
            title="No order found."
            description="Try changing your search filters or keywords."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Order Code</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-center">Pay</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Order Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.map((order) => {
                    const statusCfg = STATUS_CONFIG[order.status] || {
                      label: order.status,
                      color: "gray",
                    };
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-medium text-blue-600">
                          {order.order_code}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {order.customer_name}
                        </td>
                        <td className="py-3 px-4 text-gray-600 font-mono">
                          {order.customer_phone}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          {formatPrice(order.total_amount)}
                        </td>
                        <td className="py-3 px-4 text-center text-xs text-gray-500 uppercase tracking-wider">
                          {order.payment_method === "cod" ? "COD" : "BANKING"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={statusCfg.color}>
                            {statusCfg.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-xs">
                          {new Date(order.created_at).toLocaleString("vi-VN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="inline-flex items-center justify-center p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination && pagination.last_page > 1 && (
              <div className="p-4 border-t border-gray-100">
                <Pagination
                  current={pagination.current_page}
                  total={pagination.last_page}
                  totalItems={pagination.total}
                  perPage={pagination.per_page}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
