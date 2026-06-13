import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Pencil, Trash2, RotateCcw, Search, X } from "lucide-react";
import productService from "@/services/productService";
import categoryService from "@/services/categoryService";
import { usePagination } from "@/hooks/usePagination";
import { useApiCall } from "@/hooks/useApiCall";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import formatPrice from "@/utils/helpers/formatPrice";

export default function ProductList() {
  const navigate = useNavigate();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  // Fetch categories for filter dropdown
  useEffect(() => {
    categoryService
      .getCategories({ per_page: 100 })
      .then((res) => setCategories(res.data?.items ?? []));
  }, []);

  const { data, pagination, loading, page, setPage, setParams, refetch } =
    usePagination(productService.getProducts, {
      initialParams: { trashed: "with" },
    });

  useEffect(() => {
    setParams({
      filter: debouncedSearch,
      category_id: categoryId || undefined,
      trashed: "with",
    });
  }, [debouncedSearch, categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  const { execute: deleteExec, loading: deleting } = useApiCall();
  const { execute: restoreExec, loading: restoring } = useApiCall();

  const handleDelete = async () => {
    const res = await deleteExec(() =>
      productService.deleteProduct(deleteTarget.id),
    );
    if (res !== null) {
      toast.success("Product deleted.");
      setDeleteTarget(null);
      refetch();
    }
  };

  const handleRestore = async () => {
    const res = await restoreExec(() =>
      productService.restoreProduct(restoreTarget.id),
    );
    if (res !== null) {
      toast.success("Product restored.");
      setRestoreTarget(null);
      refetch();
    }
  };

  const stockClass = (stock, deleted) => {
    if (deleted) return "";
    if (stock === 0) return "bg-red-50";
    if (stock <= 5) return "bg-yellow-50";
    return "";
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Products</h1>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate("/admin/products/create")}
        >
          Add Product
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-8 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="relative bg-white rounded-xl border border-gray-100 overflow-hidden">
        <LoadingOverlay show={loading} className="rounded-xl" />

        {!loading && data.length === 0 ? (
          <EmptyState
            preset="product"
            title="No products found"
            description={
              search ? "Try a different search." : "Add your first product."
            }
            action={
              !search && (
                <Button onClick={() => navigate("/admin/products/create")}>
                  Add Product
                </Button>
              )
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    <th className="py-3 px-4 text-left w-14">Image</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-right">Sale</th>
                    <th className="py-3 px-4 text-center">Stock</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((p) => {
                    const isDeleted = !!p.deleted_at;
                    const imgSrc =
                      p.images?.find((img) => img.is_main)?.thumbnail_url ??
                      null;

                    return (
                      <tr
                        key={p.id}
                        className={[
                          "border-b border-gray-50 last:border-0 transition-colors",
                          isDeleted
                            ? "opacity-50"
                            : stockClass(p.stock, isDeleted),
                        ].join(" ")}
                      >
                        {/* Image */}
                        <td className="py-2 px-4">
                          <div className="h-10 w-10 rounded-lg bg-gray-50 overflow-hidden">
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-100" />
                            )}
                          </div>
                        </td>

                        {/* Name */}
                        <td className="py-2 px-4">
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {p.slug}
                          </p>
                        </td>

                        {/* Category */}
                        <td className="py-2 px-4 text-gray-600">
                          {p.categories?.map((c) => c.name).join(", ") ?? "—"}
                        </td>

                        {/* Price */}
                        <td className="py-2 px-4 text-right text-gray-700">
                          {formatPrice(p.price)}
                        </td>

                        {/* Sale */}
                        <td className="py-2 px-4 text-right text-blue-600">
                          {p.sale_price ? (
                            formatPrice(p.sale_price)
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-2 px-4 text-center">
                          {p.stock === 0 ? (
                            <Badge variant="red">Out of stock</Badge>
                          ) : p.stock <= 5 ? (
                            <span className="text-yellow-600 font-semibold">
                              {p.stock} ⚠
                            </span>
                          ) : (
                            <span className="text-gray-700">{p.stock}</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-2 px-4 text-center">
                          {isDeleted ? (
                            <Badge variant="red">Deleted</Badge>
                          ) : p.is_active ? (
                            <Badge variant="green">Active</Badge>
                          ) : (
                            <Badge variant="gray">Inactive</Badge>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-2 px-4">
                          <div className="flex items-center justify-end gap-1">
                            {isDeleted ? (
                              <button
                                onClick={() => setRestoreTarget(p)}
                                className="p-1.5 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                                title="Restore"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    navigate(`/admin/products/${p.slug}/edit`)
                                  }
                                  className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(p)}
                                  className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination?.last_page > 1 && (
              <div className="px-4 py-3 border-t border-gray-100">
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

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        intent="danger"
        title={`Delete "${deleteTarget?.name}"?`}
        description="This product will be soft-deleted and can be restored later."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
      />

      <Modal
        open={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleRestore}
        intent="info"
        title={`Restore "${restoreTarget?.name}"?`}
        description="This product will be active again."
        confirmLabel="Restore"
        cancelLabel="Cancel"
        loading={restoring}
      />
    </div>
  );
}
