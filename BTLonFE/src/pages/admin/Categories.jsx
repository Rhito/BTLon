import { useState } from "react";
import { Plus, Pencil, Trash2, RotateCcw, Search, X } from "lucide-react";
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
import CategoryForm from "@/components/admin/CategoryForm";
import RequirePermission from "@/components/common/RequirePermission";
import { useEffect } from "react";

export default function Category() {
  const toast = useToast();

  // ── Search ──────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  // ── Pagination + fetch ──────────────────────────────────────────────────
  const { data, pagination, loading, page, setPage, setParams, refetch } =
    usePagination(categoryService.getCategories, {
      initialParams: { with_trashed: true },
    });

  useEffect(() => {
    setParams({ filter: debouncedSearch, with_trashed: true });
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Modal state ─────────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = create
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);

  // ── API calls ────────────────────────────────────────────────────────────
  const { execute: saveExec, loading: saving } = useApiCall();
  const { execute: deleteExec, loading: deleting } = useApiCall();
  const { execute: restoreExec, loading: restoring } = useApiCall();

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const handleOpenEdit = (cat) => {
    setEditTarget(cat);
    setFormOpen(true);
  };

  const handleSubmit = async (formData) => {
    const isEdit = !!editTarget;
    const res = await saveExec(() =>
      isEdit
        ? categoryService.updateCategory(editTarget.id, formData)
        : categoryService.createCategory(formData),
    );
    if (res) {
      toast.success(isEdit ? "Category updated." : "Category created.");
      setFormOpen(false);
      refetch();
    } else {
      toast.error("Failed to save category.");
    }
  };

  const handleDelete = async () => {
    const res = await deleteExec(() =>
      categoryService.deleteCategory(deleteTarget.id),
    );
    if (res !== null) {
      toast.success("Category deleted.");
      setDeleteTarget(null);
      refetch();
    }
  };

  const handleRestore = async () => {
    const res = await restoreExec(() =>
      categoryService.restoreCategory(restoreTarget.id),
    );
    if (res !== null) {
      toast.success("Category restored.");
      setRestoreTarget(null);
      refetch();
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Categories</h1>
        <RequirePermission permission="manage_categories">
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            Add Category
          </Button>
        </RequirePermission>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
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

      {/* Table */}
      <div className="relative bg-white rounded-xl border border-gray-100 overflow-hidden">
        <LoadingOverlay show={loading} />

        {data.length === 0 && !loading ? (
          <EmptyState
            preset="category"
            title="No categories found"
            description={
              search
                ? "Try a different search term."
                : "Create your first category."
            }
            action={
              !search && (
                <Button onClick={handleOpenCreate}>Add Category</Button>
              )
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Slug</th>
                    <th className="py-3 px-4 text-center">Products</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-left">Created</th>
                    <RequirePermission permission="manage_categories">
                      <th className="py-3 px-4 text-right">Actions</th>
                    </RequirePermission>
                  </tr>
                </thead>
                <tbody>
                  {data.map((cat) => {
                    const isDeleted = !!cat.deleted_at;
                    return (
                      <tr
                        key={cat.id}
                        className={[
                          "border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50/50",
                          isDeleted ? "opacity-60" : "",
                        ].join(" ")}
                      >
                        <td className="py-3 px-4 text-gray-400 font-mono text-xs">
                          {cat.id}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {cat.name}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-gray-500">
                          {cat.slug}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {cat.products_count ?? "—"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isDeleted ? (
                            <Badge variant="red">Deleted</Badge>
                          ) : cat.is_active ? (
                            <Badge variant="green">Active</Badge>
                          ) : (
                            <Badge variant="gray">Inactive</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-xs">
                          {cat.created_at}
                        </td>
                        <RequirePermission permission="manage_categories">
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-1">
                              {isDeleted ? (
                                <button
                                  onClick={() => setRestoreTarget(cat)}
                                  className="p-1.5 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                                  title="Restore"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleOpenEdit(cat)}
                                    className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    title="Edit"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget(cat)}
                                    className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </RequirePermission>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination && pagination.last_page > 1 && (
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

      {/* Create / Edit modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !saving && setFormOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">
              {editTarget ? "Edit Category" : "New Category"}
            </h2>
            <CategoryForm
              initial={editTarget}
              loading={saving}
              onSubmit={handleSubmit}
              onCancel={() => setFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        intent="danger"
        title={`Delete "${deleteTarget?.name}"?`}
        description="This category will be soft-deleted and can be restored later."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
      />

      {/* Restore confirm */}
      <Modal
        open={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleRestore}
        intent="info"
        title={`Restore "${restoreTarget?.name}"?`}
        description="This category will be made active again."
        confirmLabel="Restore"
        cancelLabel="Cancel"
        loading={restoring}
      />
    </div>
  );
}
