import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Package,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Clock,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import orderService from "@/services/orderService";
import formatPrice from "@/utils/helpers/formatPrice";
import { useLocation } from "react-router-dom";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_MAP = {
  pending: { badge: "yellow", label: "Pending" },
  confirmed: { badge: "blue", label: "Confirmed" },
  shipping: { badge: "purple", label: "Shipping" },
  delivered: { badge: "green", label: "Delivered" },
  cancelled: { badge: "red", label: "Cancelled" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] ?? { badge: "gray", label: status };
  return <Badge variant={cfg.badge}>{cfg.label}</Badge>;
}

// ─── Order timeline ───────────────────────────────────────────────────────────

// function OrderTimeline({ history }) {
//   if (!history?.length) return null;

//   return (
//     <div className="space-y-0">
//       {history.map((entry, i) => (
//         <div key={i} className="flex gap-3">
//           {/* Line */}
//           <div className="flex flex-col items-center">
//             <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0 mt-1" />
//             {i < history.length - 1 && (
//               <div className="w-px flex-1 bg-gray-200 my-1" />
//             )}
//           </div>
//           {/* Content */}
//           <div className="pb-4 min-w-0">
//             <div className="flex items-center gap-2 flex-wrap">
//               <StatusBadge status={entry.new_status} />
//               {entry.old_status && (
//                 <span className="text-xs text-gray-400">
//                   from{" "}
//                   <span className="font-medium">
//                     {STATUS_MAP[entry.old_status]?.label ?? entry.old_status}
//                   </span>
//                 </span>
//               )}
//             </div>
//             <p className="text-xs text-gray-400 mt-0.5">
//               {new Date(entry.time_stamp ?? entry.created_at).toLocaleString()}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// ─── Cancel flow ──────────────────────────────────────────────────────────────

function CancelSection({ order, onCancelled }) {
  const toast = useToast();
  const [step, setStep] = useState("idle"); // idle | sent | confirming
  const [token, setToken] = useState("");
  const [loadingReq, setLoadingReq] = useState(false);
  const [loadingConf, setLoadingConf] = useState(false);

  const handleRequestCancel = async () => {
    setLoadingReq(true);
    try {
      await orderService.requestCancel({
        order_code: order.order_code,
        customer_email: order.customer_email,
      });
      toast.info("Cancellation code sent to your email.");
      setStep("confirming");
    } catch (err) {
      toast.error(err?.message ?? "Failed to send cancellation code.");
    } finally {
      setLoadingReq(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!token.trim()) return;
    setLoadingConf(true);
    try {
      await orderService.confirmCancel({
        order_code: order.order_code,
        customer_email: order.customer_email,
        cancel_token: token.trim(),
      });
      toast.success("Order cancelled successfully.");
      onCancelled();
    } catch (err) {
      toast.error(err?.message ?? "Invalid or expired token.");
    } finally {
      setLoadingConf(false);
    }
  };

  if (step === "idle") {
    return (
      <Button
        variant="danger"
        onClick={handleRequestCancel}
        loading={loadingReq}
      >
        Cancel Order
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
      <p className="text-sm text-red-700 font-medium">
        Enter the cancellation code sent to your email:
      </p>
      <div className="flex gap-2">
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Cancellation code"
          className="flex-1 rounded-md border border-red-200 px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <Button
          variant="danger"
          loading={loadingConf}
          onClick={handleConfirmCancel}
        >
          Confirm
        </Button>
        <button
          onClick={() => {
            setStep("idle");
            setToken("");
          }}
          className="p-2 rounded-md text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Order detail ─────────────────────────────────────────────────────────────

function OrderDetail({ order, onCancelled }) {
  const isPending = order.status === "pending";

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Order Code</p>
            <p className="text-lg font-bold font-mono text-gray-900">
              {order.order_code}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Placed on {order.created_at}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid md:grid-cols-1 gap-4">
        {/* Customer info */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Customer Info</h3>
          {[
            { icon: Package, label: order.customer_name },
            { icon: Phone, label: order.customer_phone },
            { icon: Mail, label: order.customer_email },
            {
              icon: MapPin,
              label: order.shipping_address ?? order.customer_address,
            },
            {
              icon: CreditCard,
              label:
                order.payment_method === "cod"
                  ? "Cash on Delivery"
                  : "Bank Transfer",
            },
          ].map(
            ({ icon: Icon, label }, i) =>
              label && (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <Icon className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>{label}</span>
                </div>
              ),
          )}
          {order.note && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Note</p>
              <p className="text-sm text-gray-700">{order.note}</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        {/* <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">
              Status History
            </h3>
          </div>
          <OrderTimeline history={order.order_histories ?? order.histories} />
        </div> */}
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Unit Price</th>
              <th className="py-3 px-4 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 last:border-0"
              >
                <td className="py-3 px-4 text-gray-800">
                  {item?.product_name ?? `Product #${item.product_id}`}
                </td>
                <td className="py-3 px-4 text-center text-gray-600">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {formatPrice(item.price)}
                </td>
                <td className="py-3 px-4 text-right font-medium text-gray-800">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-100 bg-gray-50/50">
              <td
                colSpan={3}
                className="py-3 px-4 text-sm font-semibold text-gray-700 text-right"
              >
                Total
              </td>
              <td className="py-3 px-4 text-right font-bold text-blue-600">
                {formatPrice(order.total_amount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Cancel */}
      {isPending && (
        <div>
          <p className="text-xs text-gray-400 mb-2">
            You can cancel this order while it's still pending.
          </p>
          <CancelSection order={order} onCancelled={onCancelled} />
        </div>
      )}
    </div>
  );
}

// ─── TrackOrder page ──────────────────────────────────────────────────────────

export default function TrackOrder() {
  const location = useLocation();

  const toast = useToast();

  const [form, setForm] = useState({
    order_code: location.state?.order_code ?? "",
    email: location.state?.customer_email ?? "",
  });

  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    setNotFound(false);
  };

  const handleSearch = useCallback(async () => {
    const errs = {};

    if (!form.order_code.trim()) {
      errs.order_code = "Order code is required";
    }

    if (!form.email.trim()) {
      errs.email = "Email is required";
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setOrder(null);
    setNotFound(false);

    try {
      const res = await orderService.trackOrder({
        order_code: form.order_code.trim(),
        customer_email: form.email.trim(),
      });

      setOrder(res.data);
    } catch (err) {
      if (err?.status === 404) {
        setNotFound(true);
      } else {
        toast.error(err?.message ?? "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }, [form.order_code, form.email]);
  const handleCancelled = () => {
    // Re-fetch to show updated status
    handleSearch();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your order code and email to check the status.
        </p>
      </div>

      {/* Search form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="space-y-4">
          <Input
            id="order_code"
            label="Order Code"
            required
            placeholder="DH-XXXXXXXXXX"
            value={form.order_code}
            error={errors.order_code}
            onChange={handleChange("order_code")}
          />
          <Input
            id="email"
            label="Email Address"
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            error={errors.email}
            onChange={handleChange("email")}
          />
        </div>

        <Button
          fullWidth
          loading={loading}
          onClick={handleSearch}
          className="mt-5"
          leftIcon={<Search className="h-4 w-4" />}
        >
          Track Order
        </Button>

        {/* Not found */}
        {notFound && (
          <p className="mt-4 text-sm text-center text-red-500">
            No order found with that code and email. Please check and try again.
          </p>
        )}
      </div>

      {/* Result */}
      {order && <OrderDetail order={order} onCancelled={handleCancelled} />}
    </div>
  );
}
