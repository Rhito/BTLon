import { useEffect, useState } from "react";
import { Link } from "react-router";
import categoryService from "@/services/categoryService";
import productService from "@/services/productService";
import ProductSkeleton from "@/components/guest/ProductSkeleton";
import ProductCard from "@/components/guest/ProductCard";
import CategoryCard from "@/components/guest/CategoryCard";
import SectionHeader from "@/components/guest/SectionHeader";
import FadeSection from "@/components/guest/FadeSection";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newest, setNewest] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingBest, setLoadingBest] = useState(true);
  const [loadingNewest, setLoadingNewest] = useState(true);

  useEffect(() => {
    categoryService
      .getCategories({ per_page: 8 })
      .then((res) => setCategories(res.data?.items ?? []))
      .finally(() => setLoadingCats(false));

    productService
      .getProducts({ sort: "best_selling", per_page: 8 })
      .then((res) => setBestSellers(res.data?.items ?? []))
      .finally(() => setLoadingBest(false));

    productService
      .getProducts({ sort: "newest", per_page: 8 })
      .then((res) => setNewest(res.data?.items ?? []))
      .finally(() => setLoadingNewest(false));
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* ── Hero ──*/}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center gap-6">
          <span className="inline-block bg-blue-500/40 text-blue-100 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
            Genuine technology
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-2xl">
            Quality product,
            <br />
            <span className="text-blue-200">Best prices, every day</span>
          </h1>
          <p className="text-blue-100 text-base max-w-md">
            Greate product service here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold
              px-6 py-3 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-colors shadow-md"
          >
            View Products
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-blue-500/20 pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 h-80 w-80 rounded-full bg-blue-900/30 pointer-events-none" />
      </section>

      {/* ── Featured Categories ── */}
      <FadeSection>
        <SectionHeader title="Featured Categories" />
        {loadingCats ? (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </FadeSection>

      {/* ── Best selling ── */}
      <FadeSection className="b-mx-4 px-4 lg:-mx-8 lg:px-8 bg-gray-50/70">
        <SectionHeader
          title="Best selling"
          subtitle="Most buying things this week"
          linkTo="/products?sort=best_selling"
          linkLabel="View all"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {loadingBest
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : bestSellers.map((p) => (
                <ProductCard showAddToCart={false} key={p.id} product={p} />
              ))}
        </div>
      </FadeSection>

      {/* ── Latest ── */}
      <FadeSection>
        <SectionHeader
          title="Lastest product"
          subtitle="Lastest product are on the shop"
          linkTo="/products?sort=newest"
          linkLabel="View all"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {loadingNewest
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : newest.map((p) => (
                <ProductCard showAddToCart={false} key={p.id} product={p} />
              ))}
        </div>
      </FadeSection>
    </div>
  );
}
