import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Minus, Plus, ShoppingCart, Home } from "lucide-react";
import productService from "@/services/productService";
import { useApiCall } from "@/hooks/useApiCall";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import formatPrice from "@/utils/helpers/formatPrice";
import Button from "@/components/ui/Button";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import EmptyState from "@/components/ui/EmptyState";
import DOMPurify from "dompurify";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { execute, loading } = useApiCall();
  const { addToCart } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await execute(() => productService.getProductBySlug(slug));
      if (res && res.data) {
        setProduct(res.data);

        // Thiết lập ảnh chính (ưu tiên ảnh có is_main = true, nếu không lấy ảnh đầu tiên)
        const images = res.data.images || [];
        const defaultImage =
          images.find((img) => img.is_main)?.img_url ||
          images[0]?.img_url ||
          null;
        setMainImage(defaultImage);
      }
    };

    if (slug) fetchProduct();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (type) => {
    if (type === "dec" && quantity > 1) {
      setQuantity((q) => q - 1);
    }
    if (type === "inc" && quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) {
      setQuantity(1);
    } else if (val > product.stock) {
      setQuantity(product.stock);
    } else {
      setQuantity(val);
    }
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (product.stock < 1) return;
    addToCart(product, quantity);
    toast.success(`Added ${quantity} item(s) to your cart!`);
  };

  // Trạng thái Loading
  if (loading && !product) {
    return (
      <div className="relative min-h-[60vh] w-full">
        <LoadingOverlay show={true} />
      </div>
    );
  }

  // Trạng thái không tìm thấy sản phẩm
  if (!loading && !product) {
    return (
      <div className="py-20">
        <EmptyState
          title="Product Not Found"
          description="This product does not exist or has been deleted."
          action={
            <Button onClick={() => navigate("/products")}>
              Back to Products
            </Button>
          }
        />
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-8 space-x-2">
        <Link
          to="/"
          className="hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <Link to="/products" className="hover:text-blue-600 transition-colors">
          Products
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Cột trái: Gallery Ảnh */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-4">
            {product.images && mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200">
                <svg
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                  />
                </svg>
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setMainImage(img.img_url)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 bg-white p-1 overflow-hidden transition-all ${
                    mainImage === img.img_url
                      ? "border-blue-500"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img.thumbnail_url || img.img_url}
                    alt="Thumbnail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cột phải: Thông tin chi tiết */}
        <div className="flex flex-col">
          {product.category && (
            <Link
              to={`/products?category=${product.category.slug}`}
              className="text-sm text-blue-600 font-medium hover:underline mb-2 inline-block"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Cụm Giá */}
          <div className="flex items-end gap-4 mb-6">
            {product.sale_price && product.sale_price < product.price ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.sale_price)}
                </span>
                <span className="text-lg text-gray-400 line-through mb-1">
                  {formatPrice(product.price)}
                </span>
                <span className="px-2.5 py-1 mb-1 text-xs font-bold bg-red-100 text-red-700 rounded-md">
                  -{Math.round((1 - product.sale_price / product.price) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <hr className="border-gray-100 mb-6" />

          {/* Mô tả sản phẩm */}
          <div className="prose prose-sm sm:prose text-gray-600 mb-8">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            />
          </div>

          {/* Trạng thái kho & Chọn số lượng */}
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-900">Staus:</span>
              {isOutOfStock ? (
                <span className="text-sm font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                  Out of Stock
                </span>
              ) : (
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
                  In Stock ({product.stock} items)
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Bộ đếm số lượng */}
              <div className="flex items-center h-12 w-32 border border-gray-200 rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleQuantityChange("dec")}
                  disabled={isOutOfStock || quantity <= 1}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleInputChange}
                  disabled={isOutOfStock}
                  className="flex-1 w-full h-full text-center text-gray-900 font-medium bg-transparent border-none focus:ring-0 p-0 sm:text-sm appearance-none outline-none disabled:opacity-50"
                  min="1"
                  max={product.stock}
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange("inc")}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Nút Thêm vào giỏ */}
              <Button
                size="lg"
                className="flex-1"
                leftIcon={<ShoppingCart className="h-5 w-5" />}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
