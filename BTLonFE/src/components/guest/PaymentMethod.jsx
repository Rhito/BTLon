import { Banknote, Truck } from "lucide-react";

const METHODS = [
  {
    value: "COD",
    label: "Cash on Delivery",
    description: "Pay when your order arrives.",
    icon: Truck,
  },
  {
    value: "BANKING",
    label: "Bank Transfer",
    description: "Transfer before shipping.",
    icon: Banknote,
  },
];

const BANK_INFO = {
  bank: "Vietcombank",
  account: "1234567890",
  name: "SHOP MINI CO LTD",
  branch: "Ho Chi Minh City Branch",
};

export default function PaymentMethod({ value, onChange }) {
  return (
    <div className="space-y-3">
      {METHODS.map((m) => {
        const Icon = m.icon;
        const isActive = value === m.value;
        return (
          <label
            key={m.value}
            className={[
              "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
              isActive
                ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                : "border-gray-200 hover:border-gray-300",
            ].join(" ")}
          >
            <input
              type="radio"
              name="payment_method"
              value={m.value}
              checked={isActive}
              onChange={() => onChange(m.value)}
              className="mt-0.5 accent-blue-600"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">
                  {m.label}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{m.description}</p>
            </div>
          </label>
        );
      })}

      {/* Bank info — shown only for bank_transfer */}
      {value === "BANKING" && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm space-y-1.5">
          <p className="font-semibold text-blue-800 mb-2">
            Bank Transfer Details
          </p>
          {Object.entries(BANK_INFO).map(([key, val]) => (
            <div key={key} className="flex gap-2">
              <span className="text-blue-500 capitalize w-20 shrink-0">
                {key}:
              </span>
              <span className="font-medium text-blue-900">{val}</span>
            </div>
          ))}
          <p className="text-xs text-blue-400 pt-1">
            Use your order code as the transfer reference.
          </p>
        </div>
      )}
    </div>
  );
}
