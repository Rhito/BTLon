import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import productService from "@/services/productService";
import categoryService from "@/services/categoryService";
import { useApiCall } from "@/hooks/useApiCall";
import { useToast } from "@/hooks/useToast";
import { Input, TextEditor, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageManager from "@/components/admin/ImageManager";

const INITIAL = {
  name: "",
  description: "",
  category_ids: [],
  price: "",
  sale_price: "",
  stock: "",
  is_active: true,
};

export default function ProductForm() {
  const { id } = useParams(); // undefined = create
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null); // for edit

  // Image state
  const [existingImages, setExistingImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]); // [{file, url}]
  const [mainNewIndex, setMainNewIndex] = useState(0);

  const { execute: saveExec, loading: saving, error: saveError } = useApiCall();
  const { execute: imgExec, loading: imgLoading } = useApiCall();

  // Load categories
  useEffect(() => {
    categoryService
      .getCategories({ per_page: 100 })
      .then((res) => setCategories(res.data?.items ?? []));
  }, []);

  // Load product if edit
  useEffect(() => {
    if (!isEdit) return;
    productService
      .getProductBySlug(id) // note: route uses :id but we pass slug if needed
      // fallback: try by slug
      .then((res) => {
        const p = res.data;
        setProduct(p);
        setForm({
          name: p.name,
          description: p.description ?? "",
          category_ids: p.categories?.map((c) => c.id) ?? [],
          price: p.price,
          sale_price: p.sale_price ?? "",
          stock: p.stock,
          is_active: p.is_active,
        });
        setExistingImages(p.images ?? []);
      })
      .catch(() => toast.error("Failed to load product."));
  }, [id, isEdit]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto slug
  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
    }));
    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
  };

  const set = (field) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) =>
      Number(o.value),
    );
    setForm((prev) => ({ ...prev, category_ids: selected }));
  };

  // Validate
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.price || form.price <= 0) errs.price = "Valid price is required";
    if (form.sale_price && Number(form.sale_price) >= Number(form.price))
      errs.sale_price = "Sale price must be less than original price";
    if (form.stock === "" || form.stock < 0) errs.stock = "Stock must be ≥ 0";
    return errs;
  };

  // Sync backend errors
  useEffect(() => {
    if (saveError?.status === 422 && saveError?.data?.errors) {
      const backendErrs = {};
      Object.entries(saveError.data.errors).forEach(([key, msgs]) => {
        backendErrs[key] = msgs[0];
      });
      setErrors((prev) => ({ ...prev, ...backendErrs }));
      toast.error("Please check the form for errors.");
      // Cuộn lên field đầu tiên bị lỗi
      const firstErrorField = Object.keys(backendErrs)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (saveError) {
      toast.error(saveError.message || "Failed to save product.");
    }
  }, [saveError, toast]);

  // ── Image handlers ─────────────────────────────────────────────────────────

  const handleFilesAdded = (files) => {
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setNewPreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveNew = (index) => {
    setNewPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDeleteExisting = async (imageId) => {
    await imgExec(() => productService.deleteImage(imageId, product?.slug));
    setExistingImages((prev) => prev.filter((i) => i.id !== imageId));
  };

  const handleSetMainExisting = async (imageId) => {
    const formData = new FormData();
    formData.append("set_as_main", "true");
    await imgExec(() =>
      productService.updateImage(imageId, product?.slug, formData),
    );
    setExistingImages((prev) =>
      prev.map((i) => ({ ...i, is_main: i.id === imageId })),
    );
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      document
        .getElementById("name")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      category_ids: form.category_ids,
      price: Number(form.price),
      sale_price: form.sale_price !== "" ? Number(form.sale_price) : null,
      stock: Number(form.stock),
      is_active: form.is_active,
    };

    const res = await saveExec(() =>
      isEdit
        ? productService.updateProduct(id, payload)
        : productService.createProduct(payload),
    );

    if (!res) {
      return; // Error is handled by the useEffect above
    }

    // Upload new images if any
    if (newPreviews.length > 0) {
      const slug = res.data?.slug ?? null;
      const formData = new FormData();
      newPreviews.forEach(({ file }) => formData.append("images[]", file));
      formData.append("main_image_index", mainNewIndex);
      await imgExec(() => productService.uploadImages(slug, formData));
    }

    toast.success(isEdit ? "Product updated." : "Product created.");
    navigate("/admin/products");
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/admin/products")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </button>

      <h1 className="text-lg font-semibold text-gray-900">
        {isEdit ? "Edit Product" : "New Product"}
      </h1>

      {/* Basic info */}
      <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Basic Information
        </h2>

        <Input
          id="name"
          label="Product Name"
          required
          value={form.name}
          error={errors.name}
          onChange={handleNameChange}
        />

        {/* <Textarea
          id="description"
          label="Description"
          rows={4}
          value={form.description}
          onChange={set("description")}
        /> */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <TextEditor
            id="description"
            label="Description"
            value={form.description}
            onChange={(html) => {
              setForm((prev) => ({
                ...prev,
                description: html,
              }));
            }}
          />
        </div>

        {/* Category multi-select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories
          </label>
          <select
            multiple
            value={form.category_ids.map(String)}
            onChange={handleCategoryChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Hold Ctrl/Cmd to select multiple
          </p>
        </div>
      </section>

      {/* Pricing & stock */}
      <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Pricing & Inventory
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="price"
            label="Original Price"
            required
            type="number"
            min={0}
            value={form.price}
            error={errors.price}
            onChange={set("price")}
          />
          <Input
            id="sale_price"
            label="Sale Price"
            type="number"
            min={0}
            value={form.sale_price}
            error={errors.sale_price}
            onChange={set("sale_price")}
            hint="Leave empty for no discount"
          />
        </div>

        <Input
          id="stock"
          label="Stock"
          required
          type="number"
          min={0}
          value={form.stock}
          error={errors.stock}
          onChange={set("stock")}
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
      </section>

      {/* Images */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <ImageManager
          existingImages={existingImages}
          onDeleteExisting={handleDeleteExisting}
          onSetMainExisting={handleSetMainExisting}
          newPreviews={newPreviews}
          mainNewIndex={mainNewIndex}
          onFilesAdded={handleFilesAdded}
          onRemoveNew={handleRemoveNew}
          onSetMainNew={setMainNewIndex}
        />
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <Button variant="secondary" onClick={() => navigate("/admin/products")}>
          Cancel
        </Button>
        <Button loading={saving || imgLoading} onClick={handleSubmit}>
          {isEdit ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </div>
  );
}
