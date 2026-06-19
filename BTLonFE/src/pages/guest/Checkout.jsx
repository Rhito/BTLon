import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/ui/Button";
import OrderSummary from "@/components/guest/OrderSummary";
import PaymentMethod from "@/components/guest/PaymentMethod";
import CheckoutForm, {
  validateCheckout,
} from "@/components/guest/CheckoutForm";
import orderService from "@/services/orderService";

const INITIAL_FORM = {
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  customer_address: "",
  note: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const toast = useToast();
  const { items } = useCart();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState("COD");
  const [loading, setLoading] = useState(false);

  // Redirect if cart empty
  useEffect(() => {
    if (items.length === 0) navigate("/cart", { replace: true });
  }, [items, navigate]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateCheckout(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstKey = Object.keys(validationErrors)[0];
      document
        .getElementById(firstKey)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);

    const payload = {
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      customer_address: form.customer_address,
      note: form.note,
      payment_method: payment,
      cart: items.map(({ product, quantity }) => ({
        product_id: product.id,
        quantity,
      })),
    };

    try {
      const res = await orderService.checkout(payload);

      navigate("/order-success", {
        state: {
          order_code: res.data?.order_code || res?.order_code,
          customer_email: res.data?.customer_email || res?.customer_email,
        },
        replace: true,
      });
    } catch (err) {
      // Handle Laravel validation errors
      const serverErrors = err?.errors;
      if (serverErrors) {
        const mapped = {};
        Object.entries(serverErrors).forEach(([key, msgs]) => {
          mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setErrors(mapped);
      } else {
        toast.error(err?.message ?? "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* ── Left: Form ──*/}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer info */}
          <section className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Delivery Information
            </h2>
            <CheckoutForm data={form} errors={errors} onChange={handleChange} />
          </section>

          {/* Payment method */}
          <section className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Payment Method
            </h2>
            <PaymentMethod value={payment} onChange={setPayment} />
          </section>

          {/* Submit */}
          <Button fullWidth size="lg" loading={loading} onClick={handleSubmit}>
            Place Order
          </Button>

          <p className="text-xs text-center text-gray-400">
            By placing your order, you agree to our terms and conditions.
          </p>
        </div>

        {/* ── Right: Summary ── */}
        <div className="mt-6 lg:mt-0">
          <div className="sticky top-24">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
