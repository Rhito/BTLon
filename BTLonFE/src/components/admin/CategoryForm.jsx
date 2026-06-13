import { useEffect, useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const INITIAL = { name: "", description: "", is_active: true };

export default function CategoryForm({
  initial = null,
  loading,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initial ?? INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initial ?? INITIAL);
    setErrors({});
  }, [initial]);

  const set = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <Input
          id="name"
          label="Category Name"
          required
          placeholder="e.g. Gaming Laptop"
          value={form.name}
          error={errors.name}
          onChange={set("name")}
        />
      </div>

      {/* Description */}
      <Textarea
        id="description"
        label="Description"
        placeholder="Short description (optional)"
        rows={3}
        value={form.description ?? ""}
        onChange={set("description")}
      />

      {/* is_active toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          onClick={() => setForm((p) => ({ ...p, is_active: !p.is_active }))}
          className={[
            "relative w-10 h-5 rounded-full transition-colors",
            form.is_active ? "bg-blue-600" : "bg-gray-200",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
              form.is_active ? "translate-x-5" : "translate-x-0.5",
            ].join(" ")}
          />
        </div>
        <span className="text-sm text-gray-700">Active</span>
      </label>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button loading={loading} onClick={handleSubmit}>
          {initial ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </div>
  );
}
