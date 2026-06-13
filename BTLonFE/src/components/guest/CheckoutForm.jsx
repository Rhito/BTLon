import { Input, Textarea } from "@/components/ui/Input";

const PHONE_RE = /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCheckout(data) {
  const errors = {};
  if (!data.customer_name?.trim()) errors.customer_name = "Name is required";
  if (!data.customer_phone?.trim()) errors.customer_phone = "Phone is required";
  else if (!PHONE_RE.test(data.customer_phone.replace(/\s/g, "")))
    errors.customer_phone = "Invalid Vietnamese phone number";
  if (!data.customer_email?.trim()) errors.customer_email = "Email is required";
  else if (!EMAIL_RE.test(data.customer_email))
    errors.customer_email = "Invalid email address";
  if (!data.customer_address?.trim())
    errors.customer_address = "Shipping address is required";
  return errors;
}

export default function CheckoutForm({ data, errors, onChange }) {
  const field = (name) => ({
    id: name,
    value: data[name],
    error: errors[name],
    onChange: (e) => onChange(name, e.target.value),
  });

  return (
    <div className="space-y-4">
      <Input
        label="Full Name"
        required
        placeholder="Nguyen Van A"
        {...field("customer_name")}
      />
      <Input
        label="Phone Number"
        required
        placeholder="0912 345 678"
        {...field("customer_phone")}
        type="tel"
      />
      <Input
        label="Email"
        required
        placeholder="you@example.com"
        {...field("customer_email")}
        type="email"
      />
      <Input
        label="Shipping Address"
        required
        placeholder="123 Street, District, City"
        {...field("customer_address")}
      />
      <Textarea
        label="Note"
        placeholder="Special instructions (optional)"
        rows={3}
        {...field("note")}
      />
    </div>
  );
}
