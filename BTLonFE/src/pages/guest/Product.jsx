import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { SlidersHorizontal, X } from "lucide-react";
import productService from "@/services/productService";
import categoryService from "@/services/categoryService";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import ProductSkeleton from "@/components/guest/ProductSkeleton";
import ProductCard from "@/components/guest/ProductCard";

// ─── FilterSidebar ──

function FilterSidebar({ categories, filters, onChange, onReset }) {
  const [minPrice, setMinPrice] = useState(filters.min_price ?? "");
  const [maxPrice, setMaxPrice] = useState(filters.max_price ?? "");

  const handleCategoryToggle = (id) => {
    onChange({ category_id: filters.category_id === id ? undefined : id });
  };

  const handlePriceApply = () => {
    onChange({
      min_price: minPrice !== "" ? Number(minPrice) : undefined,
      max_price: maxPrice !== "" ? Number(maxPrice) : undefined,
    });
  };

  const handlePriceReset = () => {
    setMinPrice("");
    setMaxPrice("");
    onChange({ min_price: undefined, max_price: undefined });
  };

  return (
    <div className="space-y-6">
      {/* Reset all */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        <button
          onClick={onReset}
          className="text-xs text-blue-600 hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Categories
        </h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  checked={filters.category_id === cat.id}
                  onChange={() => handleCategoryToggle(cat.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Price range
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400 shrink-0">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            variant="primary"
            fullWidth
            onClick={handlePriceApply}
          >
            Apply
          </Button>
          <Button size="sm" variant="ghost" onClick={handlePriceReset}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Sort bar ──

const SORT_OPTIONS = [
  { value: "latest", label: "Newest" },
  { value: "best_selling", label: "Best selling" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

function SortBar({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500 shrink-0">Sort by:</span>
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={[
            "text-sm px-3 py-1.5 rounded-full border transition-colors",
            value === opt.value
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Product ──

export default function Product() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── State ──
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Filters from URL params ──
  const [filters, setFilters] = useState({
    sort_by: searchParams.get("sort_by") ?? "latest",
    category_id: searchParams.get("category_id")
      ? Number(searchParams.get("category_id"))
      : undefined,
    min_price: searchParams.get("min_price")
      ? Number(searchParams.get("min_price"))
      : undefined,
    max_price: searchParams.get("max_price")
      ? Number(searchParams.get("max_price"))
      : undefined,
    filter: searchParams.get("filter") ?? "",
  });
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [search, setSearch] = useState(filters.filter);
  const debouncedSearch = useDebounce(search, 500);

  // ── Sync debounced search → filters ──
  useEffect(() => {
    setFilters((prev) => ({ ...prev, filter: debouncedSearch }));
    setPage(1);
  }, [debouncedSearch]);

  // ── Fetch categories once ──
  useEffect(() => {
    categoryService
      .getCategories({ per_page: 50 })
      .then((res) => setCategories(res.data?.items ?? []));
  }, []);

  // ── Fetch products when filters / page change ──
  useEffect(() => {
    setLoading(true);

    // Sync URL params
    const params = {};
    if (filters.sort_by) params.sort_by = filters.sort_by;
    if (filters.category_id) params.category_id = filters.category_id;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    if (filters.filter) params.filter = filters.filter;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });

    productService
      .getProducts({ ...filters, page, per_page: 12 })
      .then((res) => {
        setProducts(res.data?.items ?? []);
        setPagination(res.data?.pagination ?? null);
      })
      .finally(() => setLoading(false));
  }, [filters, page]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ──
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setFilters({ sort_by: "latest", filter: "" });
    setPage(1);
  };

  const activeFilterCount = [
    filters.category_id,
    filters.min_price,
    filters.max_price,
    filters.filter,
  ].filter(Boolean).length;

  return (
    <div className="flex gap-8">
      {/* ── Sidebar desktop ── */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-24">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-md border border-gray-300 py-2 pl-4 pr-10 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile filter button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-md border
              border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Sort */}
        <div className="mb-6">
          <SortBar
            value={filters.sort_by}
            onChange={(val) => handleFilterChange({ sort_by: val })}
          />
        </div>

        {/* Result count */}
        {pagination && (
          <p className="text-sm text-gray-500 mb-4">
            {pagination.total} products
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            preset="search"
            title="No products found"
            description="Try adjusting your filters or search term."
            action={
              <Button variant="outline" onClick={handleReset}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="mt-8">
            <Pagination
              current={pagination.current_page}
              total={pagination.last_page}
              totalItems={pagination.total}
              perPage={pagination.per_page}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </div>

      {/* ── Mobile Drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterSidebar
              categories={categories}
              filters={filters}
              onChange={(f) => {
                handleFilterChange(f);
                setDrawerOpen(false);
              }}
              onReset={() => {
                handleReset();
                setDrawerOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
