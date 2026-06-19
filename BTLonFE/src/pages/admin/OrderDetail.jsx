import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import orderService from "@/services/orderService";
import { useApiCall } from "@/hooks/useApiCall";
import { useToast } from "@/hooks/useToast";
import formatPrice from "@/utils/helpers/formatPrice";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/common/Modal";
import { Textarea } from "@/components/ui/Input";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";

// Định nghĩa luồng trạng thái
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "yellow",
    next: "confirmed",
    nextLabel: "Confirm Order",
  },
  confirmed: {
    label: "Confirmed",
    color: "blue",
    next: "shipping",
    nextLabel: "Handed Over to Shipping Carrier",
  },
  shipping: {
    label: "Delivering",
    color: "purple",
    next: "delivered",
    nextLabel: "Delivered",
  },
  delivered: { label: "Delivered", color: "green", next: null },
  cancelled: { label: "Cancelled", color: "red", next: null },
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [order, setOrder] = useState(null);

  // Trạng thái cho Modals xác nhận
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { execute: fetchOrder, loading: fetching } = useApiCall();
  const { execute: updateOrder, loading: updating } = useApiCall();

  // Gọi API lấy dữ liệu chi tiết
  const loadOrder = async () => {
    const res = await fetchOrder(() => orderService.getOrderById(id));
    if (res && res.data) setOrder(res.data);
  };

  useEffect(() => {
    loadOrder();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Xử lý cập nhật trạng thái (Tiến lên trạng thái tiếp theo hoặc Hủy)
  const handleUpdateStatus = async (newStatus, reason = null) => {
    const payload = { status: newStatus };
    if (reason) payload.cancel_reason = reason;

    const res = await updateOrder(() => orderService.updateOrder(id, payload));
    if (res) {
      toast.success("Order status has been successfully updated.");
      setStatusModalOpen(false);
      setCancelModalOpen(false);
      setCancelReason("");
      loadOrder(); // Tải lại dữ liệu mới nhất
    } else {
      toast.error("Update the failure status.");
    }
  };

  if (fetching && !order) {
    return (
      <div className="relative h-96">
        <LoadingOverlay show={true} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">The order does not exist.</p>
        <Button onClick={() => navigate("/admin/orders")}>
          Return to list
        </Button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[order.status];
  // Cho phép hủy nếu đơn chưa giao thành công và chưa bị hủy
  const canCancel =
    order.status !== "delivered" && order.status !== "cancelled";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. Thanh Tiêu đề & Nút Hành động */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/orders")}
            className="p-2 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              Order Code:{" "}
              <span className="font-mono text-blue-600">
                #{order.order_code}
              </span>
              <Badge variant={statusCfg.color}>{statusCfg.label}</Badge>
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Order Date: {order.created_at}
            </p>
          </div>
        </div>

        {/* Nút Cập nhật luồng & Nút Hủy */}
        <div className="flex gap-3">
          {canCancel && (
            <Button
              variant="danger"
              outline
              onClick={() => setCancelModalOpen(true)}
            >
              Cancel Order
            </Button>
          )}
          {statusCfg.next && (
            <Button onClick={() => setStatusModalOpen(true)}>
              {statusCfg.nextLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Cột trái: Thông tin Khách Hàng & Thanh Toán */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" /> Customer Information
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="text-gray-400 w-20 inline-block">
                  Full name:
                </span>
                <span className="font-medium text-gray-900">
                  {order.customer_name}
                </span>
              </p>
              <p>
                <span className="text-gray-400 w-20 inline-block">Phone:</span>{" "}
                <span className="font-mono">{order.customer_phone}</span>
              </p>
              <p>
                <span className="text-gray-400 w-20 inline-block">Email:</span>{" "}
                {order.customer_email}
              </p>
            </div>

            <hr className="my-4 border-gray-100" />

            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" /> Shipping address
            </h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
              {order.shipping_address}
            </p>

            {order.note && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" /> note
                </h3>
                <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100 italic">
                  "{order.note}"
                </p>
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" /> Pay
            </h3>
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-gray-500">Method:</span>
              <span className="font-medium uppercase tracking-wider text-gray-900 bg-gray-100 px-2.5 py-1 rounded">
                {order.payment_method === "COD" ? "COD" : "BANKING"}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-900">
                  Total
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Cột phải: Bảng Sản Phẩm & Lịch sử trạng thái */}
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">
                Product List ({order.items?.length || 0})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-50">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4 text-center">Unit Price</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items?.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {item && item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt={item?.product_name}
                              className="w-10 h-10 rounded border border-gray-100 object-cover"
                            />
                          ) : (
                            <div className=" h-full flex items-center justify-center text-gray-400">
                              <svg
                                className="h-16 w-16"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                                />
                              </svg>
                            </div>
                          )}
                          <span className="font-medium text-gray-900">
                            {item?.product_name || "Product has been deleted."}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {order.history && order.history.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-5">
                Status History
              </h3>
              <div className="relative pl-6 border-l-2 border-gray-100 space-y-6">
                {order.history.map((hist, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[33px] top-1 h-4 w-4 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Switched to:{" "}
                        <Badge
                          variant={
                            STATUS_CONFIG[hist.new_status]?.color || "gray"
                          }
                        >
                          {STATUS_CONFIG[hist.new_status]?.label ||
                            hist.new_status}
                        </Badge>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(hist.created_at).toLocaleString("vi-VN")}
                      </p>
                      {hist.note && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded border border-gray-100">
                          {hist.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Xác nhận tiến lên trạng thái tiếp theo */}
      <Modal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={() => handleUpdateStatus(statusCfg.next)}
        loading={updating}
        title="Confirm Status Change"
        description={`Are you sure you want to update this order's status to "${statusCfg.nextLabel}"? This action will be recorded in the status history.`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        icon={<CheckCircle2 className="h-6 w-6 text-blue-600" />}
      />

      {/* Modal 2: Xác nhận Hủy Đơn Hàng (Yêu cầu nhập lý do) */}
      <Modal
        open={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setCancelReason("");
        }}
        onConfirm={() => handleUpdateStatus("cancelled", cancelReason)}
        loading={updating}
        intent="danger"
        title="Cancel Order"
        description="This action cannot be undone. Please provide a reason for canceling the order so it can be recorded in the system."
        confirmLabel="Confirm Cancellation"
        cancelLabel="Go Back"
        icon={<AlertCircle className="h-6 w-6 text-red-600" />}
        disableConfirm={!cancelReason.trim()}
      >
        <div className="mt-4">
          <Textarea
            label="Cancellation Reason (Required)"
            placeholder="e.g. Customer requested cancellation, Out of stock, Unable to contact customer..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            required
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
}
